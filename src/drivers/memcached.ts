/**
 * @packageDocumentation
 * @module @verdigris/nitrous/drivers
 */

import { promisify } from "util";

import { default as _Memcached } from "memcached";

import Driver from "../driver";
import { flatten } from "../util";

type CacheDumpData = _Memcached.CacheDumpData | _Memcached.CacheDumpData[];

export class Memcached extends Driver {
  private _client: _Memcached;
  private _location: _Memcached.Location;
  private _options: _Memcached.options;

  public constructor(
    location: _Memcached.Location,
    options?: _Memcached.options
  ) {
    super();
    this._location = location;
    this._options = options;
  }

  /**
   * Lazy loads underlying Memcached client. This ensures users don't get a
   * module not found error when importing this library without installing the
   * memcached package.
   */
  protected get client(): _Memcached {
    if (!this._client) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const __Memcached: typeof _Memcached = require("memcached");
      this._client = new __Memcached(this._location, this._options);
    }

    return this._client;
  }

  private async _items(): Promise<_Memcached.StatusData[]> {
    return await promisify(this.client.items).bind(this.client)();
  }

  private async _get(key: string): Promise<string> {
    return await promisify(this.client.get).bind(this.client)(key);
  }

  private async _add(
    key: string,
    value: any,
    lifetime: number
  ): Promise<boolean> {
    return await promisify(this.client.add).bind(this.client)(
      key,
      value,
      lifetime
    );
  }

  private async _set(
    key: string,
    value: any,
    lifetime: number
  ): Promise<boolean> {
    return await promisify(this.client.set).bind(this.client)(
      key,
      value,
      lifetime
    );
  }

  private async _touch(key: string, lifetime: number): Promise<void> {
    return await promisify(this.client.touch).bind(this.client)(key, lifetime);
  }

  private async _delete(key: string): Promise<boolean> {
    return await promisify(this.client.del).bind(this.client)(key);
  }

  private async cachedumpAll(): Promise<_Memcached.CacheDumpData[]> {
    const items = await this._items();
    const cachedumpQueryArgs = flatten(
      items.map(item => {
        const keys = Object.keys(item);

        // Eject server from item keys.
        keys.pop();

        return keys.map(stats => {
          return {
            server: item.server,
            slabid: +stats,
            number: +item[stats]["number"]
          };
        });
      })
    );
    const cachedumps = await Promise.all(
      cachedumpQueryArgs.map(
        ({ server, slabid, number }) =>
          // Can't use async/await here due to weirdness with underlying
          // memcached module. We need the callback and shallow copy the
          // results or we'll just end up with undefined objects.
          new Promise((resolve: (value: CacheDumpData) => void, reject) => {
            this.client.cachedump(server, slabid, number, (err, cachedump) => {
              if (err) {
                return reject(err);
              }

              if (Array.isArray(cachedump)) {
                return resolve(cachedump.map(dump => Object.assign({}, dump)));
              }

              resolve(Object.assign({}, cachedump));
            });
          })
      )
    );
    return flatten(cachedumps);
  }

  public async keys(): Promise<string[]> {
    const responses = await this.cachedumpAll();
    return responses.map((response: _Memcached.CacheDumpData) => response.key);
  }

  public async has(key: string): Promise<boolean> {
    // Add command in Memcached throws "Item is not stored" error if the key
    // already exists. The lifetime is set to Unix epoch of 2678400 (Jan 31,
    // 1970) so that the key will immediately be invalidated if it is added.
    try {
      const response = await this._add(key, "INVALID", 2678400);
      return !response;
    } catch (err) {
      if (err.message === "Item is not stored") {
        return true;
      }

      // Rethrow any other error.
      throw err;
    }
  }

  public async get(key: string): Promise<string> {
    return await this._get(key);
  }

  public async set(key: string, value: any, ttl = 0): Promise<boolean> {
    return await this._set(key, value, ttl);
  }

  public async ttl(key: string): Promise<number> {
    const responses = await this.cachedumpAll();
    const response = responses.find(
      (response: _Memcached.CacheDumpData) => response?.key === key
    ) as _Memcached.CacheDumpData;

    if (response == null) {
      return -1;
    }

    return response.s > 0 ? response.s - ((Date.now() / 1000) | 0) : -1;
  }

  public async expire(key: string, ttl: number): Promise<boolean> {
    try {
      if ((await this.has(key)) === false) {
        return false;
      }

      await this._touch(key, ttl);
      return true;
    } catch {
      return false;
    }
  }

  public async delete(keys: string | string[]): Promise<number> {
    if (Array.isArray(keys)) {
      const results = await Promise.all(keys.map(key => this._delete(key)));
      return results.reduce((count, result) => (result ? ++count : 0), 0);
    }

    return (await this._delete(keys)) ? 1 : 0;
  }

  public async close(): Promise<boolean> {
    try {
      this.client.end();
      return true;
    } catch {
      return false;
    }
  }
}
