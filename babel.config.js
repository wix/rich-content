const presetEnvESM = [
  '@babel/preset-env',
  {
    modules: false,
    loose: true,
  },
];

const presetEnvCommonJS = [
  '@babel/preset-env',
  {
    loose: true,
  },
];

const commonPresets = ['@babel/preset-react'];

const commonPlugins = [
  '@loadable/babel-plugin',
  ['@babel/plugin-proposal-class-properties', { loose: true }],
  '@babel/plugin-transform-runtime',
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-proposal-optional-chaining',
  ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: true }],
];

if (process.env.NODE_ENV !== 'development') {
  commonPlugins.push([
    'babel-plugin-transform-react-remove-prop-types',
    {
      mode: 'remove',
      removeImport: true,
    },
  ]);
}

const testPlugins = [
  '@loadable/babel-plugin',
  '@babel/plugin-transform-modules-commonjs',
  '@babel/plugin-syntax-dynamic-import',
  'dynamic-import-node',
];

module.exports = {
  babelrcRoots: ['.', 'packages/**/*', 'examples/*'],
  presets: [presetEnvESM, ...commonPresets],
  plugins: [...commonPlugins],
  env: {
    commonjs: {
      presets: [presetEnvCommonJS, ...commonPresets],
      plugins: [...commonPlugins],
    },
    test: {
      presets: [presetEnvCommonJS, ...commonPresets],
      plugins: [...testPlugins],
    },
  },
};
