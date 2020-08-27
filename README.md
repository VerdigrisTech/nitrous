# [![nitrous.js][nitrousjs]][nitrous-url]

[![Version][version-badge]][npm-url]
[![Node Version][node-badge]][node-url]
[![Build Status][build-status-badge]][github-workflows-url]
[![Code Coverage][codecov-badge]][codecov-url]
[![License][license-badge]](LICENSE.md)

Modern caching library for node.

## Usage

To get started, run:

```bash
npm install --save @verdigris/nitrous
```

Then in your code, import the package:

```javascript
const { Cache } = require("@verdigris/nitrous");
const cache = new Cache();
```

By default, **nitrous** will use in-memory driver that uses [node-cache][node-cache-url]
as an underlying cache store and does not ship with third-party caching client libraries
such as [redis][redis-url] or [memcached][memcached-url] modules to reduce the distribution
size of the library.

## External Cache Drivers

### Redis

To use Redis driver, you must first install the [redis][redis-url] driver:

```bash
npm install --save @verdigris/nitrous-driver-redis
```

Then import the Redis driver and pass it to Cache constructor:

#### JavaScript

```javascript
const { Cache } = require("@verdigris/nitrous");
const Redis = require("@verdigris/nitrous-driver-redis");
const redisOptions = {
  host: "127.0.0.1",
};
const cache = new Cache(new Redis(redisOptions));
```

#### TypeScript

```typescript
import { Cache } from "@verdigris/nitrous";
import Redis from "@verdigris/nitrous-driver-redis";
const redisOptions = {
  host: "127.0.0.1",
};
const cache = new Cache(new Redis(redisOptions));
```

### Memcached

Using the Memcached driver is similar to Redis example. First install the
[memcached][memcached-url] driver:

```bash
npm install --save @verdigris/nitrous-driver-memcached
```

Then import the Memcached driver:

#### JavaScript

```javascript
const { Cache } = require("@verdigris/nitrous");
const Memcached = require("@verdigris/nitrous-driver-memcached");
const memcachedOptions = {
  poolSize: 10,
};
const cache = new Cache(new Memcached("127.0.0.1", memcachedOptions));
```

#### TypeScript

```typescript
import { Cache } from "@verdigris/nitrous";
import Memcached from "@verdigris/nitrous-driver-memcached";
const memcachedOptions = {
  poolSize: 10,
};
const cache = new Cache(new Memcached("127.0.0.1", memcachedOptions));
```

> **NOTE:** Anything other than Memcached version 1.5.0 seems to cause intermittent issues that
> relies on calls to `stats cachedump`. If this is an issue, please report this
> [issue][memcached-issue-url] to the upstream library for [memcached][memcached-url].

## API Documentation

Detailed API documentation can be found [here][nitrous-url].

---

Copyright © 2020 [Verdigris Technologies, Inc.][verdigris-url] All rights reserved.

<sub>Verdigris Technologies Inc. assumes NO RESPONSIBILITY OR LIABILITY UNDER ANY CIRCUMSTANCES
for usage of this software. See the [LICENSE.md](LICENSE.md) file for detailed legal
information.</sub>

[nitrous-url]: https://verdigristech.github.io/nitrous/
[nitrousjs]: https://verdigris.s3-us-west-2.amazonaws.com/nitrousjs.svg
[npm-url]: https://www.npmjs.com/package/@verdigris/nitrous?activeTab=versions
[version-badge]: https://img.shields.io/npm/v/@verdigris/nitrous?style=for-the-badge
[node-badge]: https://img.shields.io/node/v/@verdigris/nitrous?style=for-the-badge
[node-url]: https://nodejs.org/en/about/releases/
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
