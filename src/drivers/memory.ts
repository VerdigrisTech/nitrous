/**
 * @packageDocumentation
 * @module @verdigris/nitrous/drivers
 */

import NodeCache from "node-cache";
import Driver from "../driver";

export default class Memory extends Driver {
  protected cache: NodeCache;
  protected closed: boolean;

  public constructor() {
    super();
    this.cache = new NodeCache();
    this.closed = false;
  }

  public get isClosed(): boolean {
    return this.closed;
  }

  public async isConnected(): Promise<boolean> {
    return !this.isClosed;
  }

  public async keys(): Promise<string[]> {
    return this.cache.keys();
  }

  public async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  public async get(key: string): Promise<any> {
    return this.cache.get(key);
  }

  public async set(key: string, value: any, ttl?: number): Promise<boolean> {
    return this.cache.set(key, value, ttl);
  }

  public async ttl(key: string): Promise<number> {
    const ttl = this.cache.getTtl(key);
    return ttl === 0 ? -1 : (this.cache.getTtl(key) - Date.now()) / 1000;
  }

  public async expire(key: string, ttl: number): Promise<boolean> {
    return this.cache.ttl(key, ttl);
  }

  public async delete(keys: string | string[]): Promise<number> {
    return this.cache.del(keys);
  }

  public async close(): Promise<boolean> {
    try {
      this.cache.flushAll();
      this.cache.close();
      this.closed = true;
      return true;
    } catch {
      return false;
    }
  }
}
