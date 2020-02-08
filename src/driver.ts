/**
 * @packageDocumentation
 * @module @verdigristech/nitrous
 */

/**
 * Abstract base class required for implementing a cache driver.
 */
export default abstract class Driver {
  /**
   * Lists all keys.
   */
  public abstract async keys(): Promise<string[]>;

  /**
   * Gets whether the key exists in cache.
   * @param key {string}
   */
  public abstract async has(key: string): Promise<boolean>;

  /**
   * Gets the cached value at key.
   * @param key {string}
   */
  public abstract async get(key: string): Promise<any>;

  /**
   * Sets a value to be cached at key.
   * @param key {string}
   * @param value {any}
   * @param ttl {number} time-to-live in seconds
   */
  public abstract async set(
    key: string,
    value: any,
    ttl?: number
  ): Promise<boolean>;

  /**
   * Gets the time-to-live of the key in seconds.
   * @param key {string}
   */
  public abstract async ttl(key: string): Promise<number>;

  /**
   * Sets the expiry duration (in seconds) for a given key.
   * @param key {string}
   * @param ttl {number} time-to-live in seconds
   */
  public abstract async expire(key: string, ttl: number): Promise<boolean>;

  /**
   * Delete a key.
   * @param key {string}
   */
  public abstract async delete(keys: string | string[]): Promise<number>;

  /**
   * Closes connection or ends cache timeouts depending on underlying driver.
   */
  public abstract async close(): Promise<boolean>;
}
