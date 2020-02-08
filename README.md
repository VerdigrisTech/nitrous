# ![nitrous.js][nitrousjs]

![Version][version-badge]
[![Build Status][build-status-badge]][github-workflows-url]
[![Code Coverage][codecov-badge]][codecov-url]
[![License][license-badge]](LICENSE.md)

Modern caching library for node.

## Usage

To get started, run:

```bash
npm install --save @verdigristech/nitrous
```

Then in your code, import the package:

```javascript
const { Cache } = require("@verdigristech/nitrous");
const cache = new Cache();
```

By default, **nitrous** will use in-memory driver that uses [node-cache][node-cache-url]
as an underlying cache store and does not ship with third-party caching client libraries
such as [redis][redis-url] or [memcached][memcached-url] modules to reduce the distribution
size of the library.

## External Cache Drivers

### Redis

To use Redis driver, you must first install the [redis][redis-url] module:

```bash
npm install --save redis
```

Then import the Redis driver and pass it to Cache constructor:

```javascript
const {
  Cache,
  drivers: { Redis }
} = require("@verdigristech/nitrous");
const redisOptions = {
  host: "127.0.0.1"
};
const cache = new Cache(new Redis(redisOptions));
```

### Memcached

Using the Memcached driver is similar to Redis example. First install the
[memcached][memcached-url] module:

```bash
npm install --save memcached
```

Then import the Memcached driver:

```javascript
const {
  Cache,
  drivers: { Memcached }
} = require("@verdigristech/nitrous");
const memcachedOptions = {
  poolSize: 10
};
const cache = new Cache(new Memcached("127.0.0.1", memcachedOptions));
```

> **NOTE:** Anything other than Memcached version 1.5.0 seems to cause intermittent issues that
> relies on calls to `stats cachedump`. If this is an issue, please report this
> [issue][memcached-issue-url] to the upstream library for [memcached][memcached-url].

## TypeScript

This library was written entirely in TypeScript and you will be able to import this library without
having to install typings (e.g. `@types/<package>`).

**Example:**

```typescript
import { Cache, drivers } from "@verdigristech/nitrous";
const driver = new drivers.Redis({ host: "127.0.0.1" });
const cache = new Cache(driver);
```

---

Copyright © 2020 [Verdigris Technologies, Inc.][verdigris-url] All rights reserved.

<sub>Verdigris Technologies Inc. assumes NO RESPONSIBILITY OR LIABILITY UNDER ANY CIRCUMSTANCES
for usage of this software. See the [LICENSE.md](LICENSE.md) file for detailed legal
information.</sub>

[nitrousjs]: https://verdigris.s3-us-west-2.amazonaws.com/nitrousjs.svg
[version-badge]: https://img.shields.io/github/package-json/v/verdigristech/nitrous?style=for-the-badge
[build-status-badge]: https://img.shields.io/github/workflow/status/verdigristech/nitrous/Continuous%20Integration?logo=github&style=for-the-badge
[github-workflows-url]: https://github.com/VerdigrisTech/nitrous/actions
[codecov-badge]: https://img.shields.io/codecov/c/github/verdigristech/nitrous?logo=codecov&style=for-the-badge
[codecov-url]: https://codecov.io/gh/VerdigrisTech/nitrous
[license-badge]: https://img.shields.io/github/license/verdigristech/nitrous?style=for-the-badge
[verdigris-url]: https://verdigris.co
[node-cache-url]: https://www.npmjs.com/package/node-cache
[redis-url]: https://www.npmjs.com/package/redis
[memcached-url]: https://www.npmjs.com/package/memcached
[memcached-issue-url]: https://github.com/3rd-Eden/memcached/issues
