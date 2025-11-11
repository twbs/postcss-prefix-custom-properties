const valueParser = require('postcss-value-parser');

const pluginName = 'postcss-prefix-custom-properties';

const normalizeOptions = (options = {}) => {
  const prefix = typeof options.prefix === 'string' ? options.prefix : '';
  const ignore = Array.isArray(options.ignore) ? options.ignore : [];

  return { prefix, ignore };
};

const normalizeCustomPropertyName = (name) => {
  if (!name.startsWith('--')) {
    return `--${name}`;
  }

  return name;
};

const matchesIgnore = (name, ignorePatterns) => {
  const normalized = normalizeCustomPropertyName(name);

  return ignorePatterns.some((pattern) => {
    if (pattern instanceof RegExp) {
      return pattern.test(normalized) || pattern.test(normalized.slice(2));
    }

    if (typeof pattern === 'string') {
      const normalizedPattern = normalizeCustomPropertyName(pattern);
      return normalizedPattern === normalized;
    }

    return false;
  });
};

const prefixCustomPropertyName = (name, prefix) => {
  const normalized = normalizeCustomPropertyName(name);

  if (!prefix) {
    return normalized;
  }

  return `--${prefix}${normalized.slice(2)}`;
};

module.exports = (options = {}) => {
  const { prefix, ignore } = normalizeOptions(options);

  return {
    postcssPlugin: pluginName,
    Once(root) {
      root.walkDecls((decl) => {
        if (decl.prop && decl.prop.startsWith('--') && !matchesIgnore(decl.prop, ignore)) {
          decl.prop = prefixCustomPropertyName(decl.prop, prefix);
        }

        if (decl.value && decl.value.includes('var(')) {
          const parsed = valueParser(decl.value);
          let updated = false;

          parsed.walk((child) => {
            if (child.type === 'function' && child.value === 'var' && child.nodes.length > 0) {
              const firstNode = child.nodes.find((n) => n.type !== 'comment' && n.type !== 'space');

              if (firstNode && firstNode.type === 'word') {
                const customPropName = normalizeCustomPropertyName(firstNode.value);

                if (!matchesIgnore(customPropName, ignore)) {
                  firstNode.value = prefixCustomPropertyName(customPropName, prefix);
                  updated = true;
                }
              }
            }
          });

          if (updated) {
            decl.value = parsed.toString();
          }
        }
      });

      root.walkAtRules('property', (atRule) => {
        const params = atRule.params && atRule.params.trim();

        if (params && params.startsWith('--') && !matchesIgnore(params, ignore)) {
          atRule.params = prefixCustomPropertyName(params, prefix);
        }
      });
    }
  };
};

module.exports.postcss = true;
