/**
 * @packageDocumentation
 * @module @verdigris/nitrous
 */

import Driver from "./driver";
import Memory from "./drivers/memory";

export default class Cache {
  protected _driver: Driver;

  /**
   * Instantiate a new Cache with given driver. The `driver` is optional; if unspecified, defaults
   * to [[Memory]] driver.
   * @param {Driver} [driver] - an instance of cache driver
   */
  public constructor(driver?: Driver) {
    this._driver = driver ?? new Memory();
  }

  /**
   * Gets the underlying driver for the cache.
   */
  public get driver(): Driver {
    return this._driver;
  }

  /**
   * Retrieve all keys.
   */
  public async keys(): Promise<string[]> {
    return await this.driver.keys();
  }

  /**
   * Get whether the key exists in cache.
   * @param {string} key - key name
   */
  public async has(key: string): Promise<boolean> {
    return await this.driver.has(key);
  }

  /**
   * Get cached value at given key.
   * @param {string} key - key name
   */
  public async get(key: string): Promise<any> {
    return await this.driver.get(key);
  }

  /**
   * Set value to cache at given key.
   * @param {string} key - key name
   * @param {any} value - value to cache
   * @param {number} [ttl] - key lifetime in seconds
   */
  public async set(key: string, value: any, ttl?: number): Promise<boolean> {
    return await this.driver.set(key, value, ttl);
  }

  /**
   * Get remaining expiry time in seconds.
   * @param {string} key - key name
   */
  public async ttl(key: string): Promise<number> {
    return await this.driver.ttl(key);
  }

  /**
   * Update key with new expiry time in seconds.
   * @param {string} key - key name
   * @param {number} ttl - key lifetime in seconds
   */
  public async expire(key: string, ttl: number): Promise<boolean> {
    return await this.driver.expire(key, ttl);
  }

  /**
   * Delete one or more keys.
   * @param {(string|string[])} keys - key name
   */
  public async delete(keys: string | string[]): Promise<number> {
    return await this.driver.delete(keys);
  }

  /**
   * Closes underlying driver. If external cache drivers (e.g. [[Redis]]) are used, this will close
   * the connection. Use this method to clean up and teardown.
   */
  public async close(): Promise<boolean> {
    return await this.driver.close();
  }
}
