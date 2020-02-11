/**
 * @packageDocumentation
 * @module @verdigris/nitrous/drivers
 */

import { promisify } from "util";

import {
  RedisClient,
  ClientOpts,
  createClient as createClientFunc
} from "redis";

import Driver from "../driver";

export class Redis extends Driver {
  private _client: RedisClient;
  private _options: ClientOpts;

  public constructor(options?: ClientOpts) {
    super();
    this._options = options;
  }

  /**
   * Lazy loads underlying Redis client. This ensures users don't get a module
   * not found error when importing this library without installing the redis
   * package.
   */
  protected get client(): RedisClient {
    if (!this._client) {
      const {
        createClient
      }: // eslint-disable-next-line @typescript-eslint/no-var-requires
      { createClient: typeof createClientFunc } = require("redis");
      this._client = createClient(this._options);
    }

    return this._client;
  }

  private _keys(pattern: string): Promise<string[]> {
    return promisify(this.client.keys).bind(this.client)(pattern);
  }

  private _exists(...keys: string[]): Promise<number> {
    return promisify(this.client.exists).bind(this.client)(...keys);
  }

  private _get(key: string): Promise<string> {
    return promisify(this.client.get).bind(this.client)(key);
  }

  private _set(key: string, value: string): Promise<"OK"> {
    return promisify(this.client.set).bind(this.client)(key, value);
  }

  private _setex(key: string, seconds: number, value: string): Promise<string> {
    return promisify(this.client.setex).bind(this.client)(key, seconds, value);
  }

  private _ttl(key: string): Promise<number> {
    return promisify(this.client.ttl).bind(this.client)(key);
  }

  private _expire(key: string, seconds: number): Promise<number> {
    return promisify(this.client.expire).bind(this.client)(key, seconds);
  }

  private _delete(keys: string | string[]): Promise<number> {
    return promisify(this.client.del).bind(this.client)(keys);
  }

  public async keys(): Promise<string[]> {
    return await this._keys("*");
  }

  public async has(key: string): Promise<boolean> {
    return (await this._exists(key)) > 0;
  }

  public async get(key: string): Promise<string> {
    return await this._get(key);
  }

  public async set(key: string, value: any, ttl?: number): Promise<boolean> {
    return (
      (ttl == null
        ? await this._set(key, value)
        : await this._setex(key, ttl, value)) === "OK"
    );
  }

  public async ttl(key: string): Promise<number> {
    return await this._ttl(key);
  }

  public async expire(key: string, ttl: number): Promise<boolean> {
    return (await this._expire(key, ttl)) === 1;
  }

  public async delete(keys: string | string[]): Promise<number> {
    return await this._delete(keys);
  }

  public async close(): Promise<boolean> {
    const quit = promisify(this.client.quit).bind(this.client);
    return (await quit()) === "OK";
  }
}
