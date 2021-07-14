import { resolve as pathResolve } from 'path';
import svgr from '@svgr/rollup';
import resolvePlugin from '@rollup/plugin-node-resolve';
import aliasPlugin from '@rollup/plugin-alias';
import copyPlugin from 'rollup-plugin-copy';
/* @ts-ignore typescript-plugin external types issue */
import babelPlugin from '@rollup/plugin-babel';
import typescriptPlugin from 'rollup-plugin-typescript2';
import commonjsPlugin from '@rollup/plugin-commonjs';
import jsonPlugin from '@rollup/plugin-json';
import postcssPlugin from 'rollup-plugin-postcss';
/* @ts-ignore typescript-plugin external types issue */
import postcssExclude from 'postcss-exclude-files';
import postcssURL from 'postcss-url';
/* @ts-ignore typescript-plugin external types issue */
import postcssRTL from 'postcss-rtl';
import replacePlugin from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import visualizerPlugin from 'rollup-plugin-visualizer';
import { Plugin } from 'rollup';
import libsPackageJsonGeneratorPlugin from './scripts/rollupPlugin-libsPackageJsonGenerator';
import { writeFileSync } from 'fs';

const IS_DEV_ENV = process.env.NODE_ENV === 'development';

const resolve = (): Plugin => {
  return resolvePlugin({
    preferBuiltins: true,
    extensions: ['.js', '.jsx', '.json'],
    rootDir: pathResolve(__dirname),
  });
};

const resolveAlias = (): Plugin => {
  return aliasPlugin({
    entries: {
      'draft-js': '@wix/draft-js',
    },
  });
};

const copy = (): Plugin => {
  // copyPlugin has a bug with copying folder in writeBundle stage. So it's split up from copyAfterBundleWritten()
  const targets = [{ src: 'statics', dest: 'dist' }];
  return copyPlugin({
    targets,
    copyOnce: true,
  });
};

const copyAfterBundleWritten = (): Plugin => {
  const targets = [
    // create viewer entry point declaration files
    {
      src: 'dist/src/viewer.d.ts',
      dest: 'dist',
      rename: () => 'module.viewer.d.ts',
      transform: () => "export * from './src/viewer';", // eslint-disable-line quotes
    },
    // create cjs version for viewer entry point declaration files
    {
      src: 'dist/module.viewer.d.ts',
      dest: 'dist',
      rename: () => 'module.viewer.cjs.d.ts',
    },
    {
      src: ['dist/es/*.css'],
      dest: 'dist',
    },
  ];

  return copyPlugin({
    targets,
    copyOnce: true,
    hook: 'writeBundle',
  });
};

const babel = (): Plugin => {
  return babelPlugin({
    configFile: pathResolve(__dirname, 'babel.config.js'),
    // include: ['**/packages/src/**', 'lib/**', '**/@tiptap/**'],
    babelHelpers: 'runtime',

    babelrc: false,
    filter: file => {
      const src = /.*\/packages\/.*\/src\/.*/;
      const lib = /.*\/packages\/.*\/lib\/.*/;
      const tiptap = /.*tiptap.*/;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore-next-line
      return src.test(file.toString()) || lib.test(file.toString()) || tiptap.test(file.toString());
    },
  });
};

const typescript = (): Plugin => {
  const absPath = (dir: string) => `${process.cwd()}/${dir}`;
  return typescriptPlugin({
    useTsconfigDeclarationDir: true,
    check: true,
    tsconfig: `${__dirname}/tsconfig.json`,
    tsconfigOverride: {
      compilerOptions: {
        declarationDir: absPath('dist'),
        rootDir: absPath(''),
        sourceMap: true,
      },
      include: [
        'src',
        'src/**/*.json',
        'src/**/*.scss',
        'statics/**/*.json',
        'statics/**/*.schema.json',
        'statics/**/*.scss',
        'package.json',
        'lib',
        'node_modules/@tiptap',
        'node_modules/@tiptap/**/*',
        '**/@tiptap/**/*',
      ].map(path => absPath(path)),
      exclude: ['node_modules', '**/*.spec.*'].map(path => absPath(path)),
    },
    // debugging options:
    // verbosity: 3,
    // clean: true,
  });
};

const json = (): Plugin => {
  return jsonPlugin({
    include: [
      'statics/**',
      'node_modules/**',
      '../../../node_modules/**',
      '../../../packages/**/package.json',
      '../../common/web/dist/statics/schemas/*.schema.json',
    ],
  });
};

const postcss = (shouldExtract: boolean): Plugin => {
  return postcssPlugin({
    minimize: {
      // reduceIdents: false,
      // safe: true,
      /*  @ts-ignore: cssnanoOptions typing is wrong */
      normalizeWhitespace: false,
    },
    modules: {
      generateScopedName: IS_DEV_ENV ? '[name]__[local]___[hash:base64:5]' : '[hash:base64:5]',
    },
    extract: shouldExtract && 'dist/styles.min.css',
    plugins: [
      postcssExclude({
        filter: '**/*.rtlignore.scss',
        plugins: [postcssRTL()],
      }),
      postcssURL({
        url: asset => asset.url.replace('../', '/statics/'),
      }),
    ],
  });
};

const replace = (): Plugin => {
  return replacePlugin({
    preventAssignment: true,
    values: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  });
};

const uglify = (): Plugin => {
  return terser({
    mangle: false,
  });
};

const visualizer = (): Plugin => {
  return visualizerPlugin({
    sourcemap: true,
  });
};

const createFakeStylesFile = (): Plugin => ({
  name: 'create-fake-styles-file',
  writeBundle() {
    writeFileSync('dist/styles.min.css', '');
  },
});

let _plugins: Plugin[] = [
  svgr(),
  resolveAlias(),
  resolve(),
  babel(),
  commonjsPlugin(),
  json(),
  typescript(),
];

if (!IS_DEV_ENV) {
  _plugins = [..._plugins, replace(), uglify()];
}

if (process.env.MODULE_ANALYZE_EDITOR || process.env.MODULE_ANALYZE_VIEWER) {
  _plugins = [..._plugins, visualizer()];
}

if (process.env.EXTRACT_CSS === 'false') {
  _plugins = [..._plugins, createFakeStylesFile()];
}

const plugins = (shouldExtractCss: boolean) => {
  _plugins.push(postcss(shouldExtractCss));
  return _plugins;
};
const lastEntryPlugins = [libsPackageJsonGeneratorPlugin(), copy(), copyAfterBundleWritten()];
export { plugins, lastEntryPlugins };
