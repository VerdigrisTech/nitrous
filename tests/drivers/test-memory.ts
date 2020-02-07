import "mocha";
import { expect } from "chai";

import Cache from "@nitrous/cache";
import Driver from "@nitrous/driver";
import { Memory } from "@nitrous/drivers/memory";

import { sleep } from "@tests/util";

describe("Memory Driver", function () {
  let cache: Cache;
  let driver: Driver;

  beforeEach(function () {
    driver = new Memory();
    cache = new Cache(driver);
  });

  afterEach(async function () {
    await cache.close();
  });

  describe("#keys", function () {
    it("should return all keys in cache", async function () {
      await Promise.all([
        cache.set("foo", 0),
        cache.set("bar", 1),
        cache.set("baz", "foxhound"),
      ]);

      const actual = await cache.keys();
      const expected = ["foo", "bar", "baz"];

      expect(actual).to.eql(expected);
    });
  });

  describe("#has", function () {
    it("should return true if key exists in cache", async function () {
      await cache.set("foo", Infinity);

      const actual = await cache.has("foo");
      expect(actual).to.be.true;
    });

    it("should return false if key does not exist in cache", async function () {
      const actual = await cache.has("foo");
      expect(actual).to.be.false;
    })
  });

  describe("#get", function () {
    it("should return the value from given key", async function () {
      await cache.set("foo", "hello");

      const actual = await cache.get("foo");
      expect(actual).to.equal("hello");
    });

    it("should return undefined if key does not exist", async function () {
      const actual = await cache.get("foo");
      expect(actual).to.be.undefined;
    });
  });

  describe("#set", function () {
    it("should set the value at the given key", async function () {
      await cache.set("foo", "hello");

      const actual = await cache.get("foo");
      expect(actual).to.equal("hello");
    });

    it("should overwrite existing value when called multiple times", async function () {
      await cache.set("foo", "foo");
      await cache.set("foo", "bar");

      const actual = await cache.get("foo");
      expect(actual).to.equal("bar");
    });

    it("should expire key after given TTL in seconds", async function () {
      await cache.set("foo", "foo", 1);
      await sleep(1001);
      const actual = await cache.has("foo");
      expect(actual).to.be.false;
    });

    it("should not expire key if time has not passed TTL value", async function () {
      await cache.set("foo", "foo", 1);
      await sleep(500);
      const actual = await cache.has("foo");
      expect(actual).to.be.true;
    });
  });

  describe("#ttl", function () {
    it("should return the TTL value of the given key if set", async function () {
      await cache.set("foo", "foo", 2);
      const actual = await cache.ttl("foo");
      expect(actual).to.be.closeTo(2, 0.001);
    });

    it("should return -1 if TTL for the key is not set", async function () {
      await cache.set("foo", "foo");
      const actual = await cache.ttl("foo");
      expect(actual).to.equal(-1);
    });
  });

  describe("#expire", function () {
    it("should update the TTL with new value in seconds", async function () {
      await cache.set("foo", "foo", 1);
      await cache.expire("foo", 2);
      expect(await cache.ttl("foo")).to.be.closeTo(2, 0.001);
    });

    it("should return false when the key does not exist", async function () {
      const success = await cache.expire("foo", 1);
      expect(success).to.be.false;
    });
  });

  describe("#delete", function () {
    it("should delete the value at given key", async function () {
      await cache.set("foo", "bar");
      expect(await cache.delete("foo")).to.equal(1);
      expect(await cache.has("foo")).to.be.false;
      expect(await cache.get("foo")).to.be.undefined;
    });

    it("should delete all values specified by multiple keys", async function () {
      await Promise.all([
        cache.set("foo", "foo"),
        cache.set("bar", "bar"),
      ]);
      expect(await cache.delete(["foo", "bar"])).to.equal(2);
      expect(await cache.has("foo")).to.be.false;
      expect(await cache.get("foo")).to.be.undefined;
      expect(await cache.has("bar")).to.be.false;
      expect(await cache.get("bar")).to.be.undefined;
    });
  });

  describe("#close", function () {
    it("should clear cache TTL timers", async function () {
      await cache.set("foo", "foo");
      const actual = await cache.close();
      expect(actual).to.be.true;
      expect(await cache.keys()).to.have.length(0);
    });
  });
});
