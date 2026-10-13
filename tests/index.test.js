const { it } = require('node:test');
const fs = require('node:fs');
const { default: postcss } = require('postcss');
const prefixCustomProperties = require('..');

const testPostcss = postcss({
  plugins: [
    prefixCustomProperties({
      prefix: 'bs-',
      ignore: ['--ignored', /squircle/]
    })
  ]
});

it('example', (t) => {
  const input = fs.readFileSync('./tests/example.css', 'utf-8');
  const expected = fs.readFileSync('./tests/example.expected.css', 'utf-8');

  const { css: output } = testPostcss.process(input);
  t.assert.equal(output, expected);
});

it('exclude entire file', (t) => {
  const input = fs.readFileSync('./tests/ignore-file.css', 'utf-8');

  const { css: output } = testPostcss.process(input);
  t.assert.equal(output, input);
});