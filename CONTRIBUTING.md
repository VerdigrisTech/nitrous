# Contributing to nitrous

Thank you for taking the time to contribute to nitrous.js! Before making pull
requests, please read the contribution guideline below.

## Getting started

Follow the steps below to get started on development:

1. [Fork] this repository into your own.

2. Clone your repository:

   ```console
   git clone https://github.com/<YOUR_USERNAME>/nitrous
   ```

3. Add this repository as an upstream repository:

   ```console
   git remote add upstream https://github.com/VerdigrisTech/nitrous
   ```

4. Install dependencies:

   ```console
   npm install
   ```

5. (Optional) Link your project so that you can import it into other projects
   for testing:

   ```console
   npm link
   ```

## Bug reports

This section details how to submit a bug report in a way that helps others
understand the problem and resolve the issue more quickly.

Before submitting bug report, please search through the [Issues][bugs] list to
ensure there aren't any duplicate or similar bug reports. If the issue has been
closed, please [create a new issue][new-issue] and [link][link-issue] to the
closed issue.

When you create the issue, use clear and descriptive title that identifies the
problem. Then fill the blanks in the issue template so that it will help the
maintainers diagnose the problem.

## Testing

Please ensure that all of the existing tests pass by running `npm test`. When
you add features, please ensure that you have test coverage for the new
feature.

We will **_not_** accept pull requests that **_decreases_** test coverage.

## Linting and formatting

In order to ensure consistent code quality from contributors, this project
utilizes [ESLint][eslint] and [prettier][prettier] to lint and format code
respectively.

### Linting

We highly recommend installing ESLint plugin for your text editor. You can also
lint in command line by running `npm run lint`.

Our CI/CD pipeline will mark lint failures when a pull request is made.

### Formatting

This project makes use of [prettier][prettier] to format the source code. When
setting up this project for the first time, it will utilize [husky][husky] to
install pre-commit hooks that automatically runs [prettier][prettier] on staged
files before commit.

You can also run `npm run format` to run format the entire project.

## License

The source code in this library is released under the
[New BSD License][bsd-3-clause]. This means you are free to keep any
modifications private or even release it under a different license from your
own repository. However, when you contribute to this repository, you hereby
agree to release your changes under the [New BSD License][bsd-3-clause].

---

Copyright © 2020 Verdigris Technologies, Inc. All rights reserved.

[fork]: https://github.com/VerdigrisTech/nitrous/fork
[bugs]: https://github.com/VerdigrisTech/nitrous/labels/bug
[new-issue]: https://github.com/VerdigrisTech/nitrous/issues/new
[link-issue]: https://help.github.com/en/github/writing-on-github/autolinked-references-and-urls#issues-and-pull-requests
[eslint]: https://eslint.org
[prettier]: https://prettier.io
[husky]: https://github.com/typicode/husky
[bsd-3-clause]: https://opensource.org/licenses/BSD-3-Clause
