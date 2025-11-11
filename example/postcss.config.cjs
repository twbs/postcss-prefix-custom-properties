const prefixCustomProperties = require('..');

module.exports = {
  plugins: [
    prefixCustomProperties({
      prefix: 'bs-',
      ignore: ['--ignored', /squircle/]
    })
  ]
};
