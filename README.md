# nitrous.js

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
const { Cache, drivers: { Memory } } = require('@verdigristech/nitrous');
const inMemoryDriver = new Memory();
const cache = new Cache(inMemoryDriver);
```

---

Copyright © 2020 [Verdigris Technologies, Inc.][verdigris-url] All rights reserved.

[version-badge]: https://img.shields.io/github/package-json/v/verdigristech/nitrous?style=for-the-badge
[build-status-badge]: https://img.shields.io/github/workflow/status/verdigristech/nitrous/Continuous%20Integration?logo=github&style=for-the-badge
[github-workflows-url]: https://github.com/VerdigrisTech/nitrous/actions
[codecov-badge]: https://img.shields.io/codecov/c/github/verdigristech/nitrous?logo=codecov&style=for-the-badge
[codecov-url]: https://codecov.io/gh/VerdigrisTech/nitrous
[license-badge]: https://img.shields.io/github/license/verdigristech/nitrous?style=for-the-badge
[verdigris-url]: https://verdigris.co
