import "mocha";
import { expect } from "chai";

import Cache from "@nitrous/cache";
import Memory from "@nitrous/drivers/memory";

describe("Cache", function () {
  it("should default to Memory driver when driver is not specified in constructor", async function () {
    const cache = new Cache();
    expect(cache["driver"]).to.be.an.instanceof(Memory);
  });
});
