import { promisify } from "util";

import redis from "redis";
import Driver from "../driver";

export class Redis extends Driver {
  protected client: redis.RedisClient;
  protected _keys: (pattern: string) => Promise<string[]>;
  protected _exists: (...args: string[]) => Promise<number>;
  protected _get: (key: string) => Promise<string>;
  protected _set: (key: string, value: string) => Promise<"OK">;
  protected _setex: (
    key: string,
    seconds: number,
    value: string
  ) => Promise<string>;
  protected _ttl: (key: string) => Promise<number>;
  protected _expire: (key: string, seconds: number) => Promise<number>;
  protected _delete: (keys: string | string[]) => Promise<number>;

  public constructor(options?: redis.ClientOpts) {
    super();
    this.client = redis.createClient(options);
    this._keys = promisify(this.client.keys);
    this._exists = promisify(this.client.exists);
    this._get = promisify(this.client.get);
    this._set = promisify(this.client.set);
    this._setex = promisify(this.client.setex);
    this._ttl = promisify(this.client.ttl);
    this._expire = promisify(this.client.expire);
    this._delete = promisify(this.client.del);
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
}
