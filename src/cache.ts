import Driver from "./driver";
import { Memory } from "./drivers/memory";

export default class Cache {
  protected driver: Driver;

  public constructor(driver?: Driver) {
    this.driver = driver ?? new Memory();
  }

  public async keys(): Promise<string[]> {
    return await this.driver.keys();
  }

  public async has(key: string): Promise<boolean> {
    return await this.driver.has(key);
  }

  public async get(key: string): Promise<any> {
    return await this.driver.get(key);
  }

  public async set(key: string, value: any, ttl?: number): Promise<boolean> {
    return await this.driver.set(key, value, ttl);
  }

  public async ttl(key: string): Promise<number> {
    return await this.driver.ttl(key);
  }

  public async expire(key: string, ttl: number): Promise<boolean> {
    return await this.driver.expire(key, ttl);
  }

  public async delete(keys: string | string[]): Promise<number> {
    return await this.driver.delete(keys);
  }
}
