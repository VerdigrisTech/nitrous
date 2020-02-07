import { promisify } from "util";

import _Memcached from "memcached";
import Driver from "../driver";

type CacheDumpData = _Memcached.CacheDumpData | _Memcached.CacheDumpData[];

export class Memcached extends Driver {
  protected client: _Memcached;
  protected _items: () => Promise<_Memcached.StatusData[]>;
  protected _cachedump: (
    server: string,
    slabid: number,
    number: number
  ) => Promise<_Memcached.CacheDumpData | _Memcached.CacheDumpData[]>;
  protected _add: (
    key: string,
    value: any,
    lifetime: number
  ) => Promise<boolean>;
  protected _get: (key: string) => Promise<string>;
  protected _set: (
    key: string,
    value: any,
    lifetime: number
  ) => Promise<boolean>;
  protected _touch: (key: string, lifetime: number) => Promise<void>;
  protected _delete: (key: string) => Promise<boolean>;

  public constructor(
    location: _Memcached.Location,
    options?: _Memcached.options
  ) {
    super();
    this.client = new _Memcached(location, options);
    this._items = promisify(this.client.items).bind(this.client);
    this._cachedump = promisify(this.client.cachedump).bind(this.client);
    this._add = promisify(this.client.add).bind(this.client);
    this._get = promisify(this.client.get).bind(this.client);
    this._set = promisify(this.client.set).bind(this.client);
    this._touch = promisify(this.client.touch).bind(this.client);
    this._delete = promisify(this.client.del).bind(this.client);
  }

  protected async cachedumpAll(): Promise<CacheDumpData[]> {
    const items = await this._items();
    return await Promise.all(
      items.flatMap(item => {
        const keys = Object.keys(item).filter(key => key !== "server");
        return keys.map(stats =>
          this._cachedump(item.server, +stats, item[stats]["number"])
        );
      })
    );
  }

  public async keys(): Promise<string[]> {
    const responses = await this.cachedumpAll();
    return responses.map((response: _Memcached.CacheDumpData) => response.key);
  }

  public async has(key: string): Promise<boolean> {
    // Add command in Memcached returns false if the key already exists. The
    // lifetime is set to Unix epoch of 2678400 (Jan 31, 1970) so that the key
    // will immediately be invalidated if it is added.
    return !(await this._add(key, 0, 2678400));
  }

  public async get(key: string): Promise<string> {
    return await this._get(key);
  }

  public async set(key: string, value: any, ttl?: number): Promise<boolean> {
    return ttl == null
      ? await this._set(key, value, 0)
      : await this._set(key, value, ttl);
  }

  public async ttl(key: string): Promise<number> {
    const responses = await this.cachedumpAll();
    const response = responses.find(
      (response: _Memcached.CacheDumpData) => response.key === key
    ) as _Memcached.CacheDumpData;
    return response != null ? response.s : -1;
  }

  public async expire(key: string, ttl: number): Promise<boolean> {
    try {
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
