# postcss-prefix-custom-properties

> Prefix CSS custom properties (CSS variables) with PostCSS.

## Installation

```bash
npm install postcss-prefix-custom-properties
```

## Usage

Add the plugin to your PostCSS configuration:

```js
// postcss.config.cjs
const prefixCustomProperties = require('postcss-prefix-custom-properties');

module.exports = {
  plugins: [
    prefixCustomProperties({
      prefix: 'bs-',
      ignore: ['--no-prefix', /^legacy-/]
    })
  ]
};
```

### Options

- `prefix` (string, default `''`): The prefix to prepend to every custom property name.
- `ignore` (array, default `[]`): List of custom properties to leave untouched. Items can be
  literal strings (with or without the leading `--`) or regular expressions. Regular expressions
  are tested against both the full custom property name (e.g. `--brand-color`) and the name
  without the leading dashes (e.g. `brand-color`).

Both declarations and usages (inside `var()` functions) are updated, as well as `@property` rules.

## Local development

A small playground is available in `example/`. Run the script below to generate prefixed CSS into
`example/dist/output.css` (the directory is gitignored).

```bash
npm install
npm run example
```

The generated CSS demonstrates the plugin's behaviour when applying a `bs-` prefix and ignoring
variables that match either the string `--ignored` or the regex `/squircle/`.
