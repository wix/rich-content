/* eslint-disable */

import { readdirSync, existsSync } from 'fs';
import { cloneDeep } from 'lodash';
import { plugins as createPlugins, lastEntryPlugins } from './rollup.plugins';
import { isExternal as external } from './rollup.externals';
import { RollupOptions, OutputOptions, WatcherOptions } from 'rollup';

if (!process.env.MODULE_NAME) {
  console.error('Environment variable "MODULE_NAME" is missing!');
  process.exit(1);
}

const commonConfig = (output: OutputOptions[], shouldExtractCss: boolean): RollupOptions[] => {
  const plugins = createPlugins(shouldExtractCss);
  const watch: WatcherOptions = {
    exclude: ['node_modules/**'],
    clearScreen: false,
  };
  const commonOptions = {
    plugins,
    external,
    watch,
  };

  output = output.map(o => ({ ...o, sourcemap: true }));
  if (process.env.MODULE_WATCH && !process.env.BUILD_CJS) {
    output = output.filter(o => o.format === 'es');
  }

  let addPartToFilename = (fileName: string, fileNamePart: string) => {
    const anchor = fileName.indexOf('.');
    fileName = `${fileName.slice(0, anchor)}.${fileNamePart}${fileName.slice(anchor)}`;
    return fileName;
  };

  const editorEntry: RollupOptions = {
    input: 'src/index.ts',
    output: cloneDeep(output),
    ...commonOptions,
  };

  const libEntries: RollupOptions[] = [];
  try {
    let libEntriesPath = 'lib/';

    readdirSync(`./${libEntriesPath}`).forEach(file => {
      const fileName = file.split('.')[0];
      libEntries.push({
        input: libEntriesPath + file,
        output: output.map(({ format }) => ({
          format,
          file: `dist/lib/${fileName}${format === 'cjs' ? '.cjs.js' : '.js'}`,
        })),
        ...commonOptions,
      });
    });
  } catch (_) {}

  let viewerEntry: RollupOptions[] = [];
  const viewerPath = 'src/viewer.ts';
  if (existsSync(`./${viewerPath}`)) {
    viewerEntry.push({
      input: viewerPath,
      output: cloneDeep(output).map(o => {
        if (o.file) {
          o.file = addPartToFilename(o.file, 'viewer');
        }
        return o;
      }),
      ...commonOptions,
    });
  }

  const viewerLoadableOutput: OutputOptions[] = [
    {
      dir: 'dist/loadable/viewer/es/',
      format: 'es',
      chunkFileNames: '[name].js',
    },
    {
      dir: 'dist/loadable/viewer/cjs/',
      format: 'cjs',
      chunkFileNames: '[name].cjs.js',
    },
  ];

  const viewerLoadablePath = 'src/viewer-loadable.ts';
  if (existsSync(`./${viewerLoadablePath}`)) {
    viewerEntry.push({
      input: viewerLoadablePath,
      output: viewerLoadableOutput,
      ...commonOptions,
    });
  }

  let entries;
  if (process.env.MODULE_ANALYZE_EDITOR) {
    entries = [editorEntry, ...libEntries];
  } else if (process.env.MODULE_ANALYZE_VIEWER) {
    entries = [...viewerEntry, ...libEntries];
  } else {
    entries = [editorEntry, ...viewerEntry, ...libEntries];
  }

  const mobileNativeLoaderPath = 'src/mobileNativeLoader.js';
  if (existsSync(`./${mobileNativeLoaderPath}`)) {
    entries.push({
      input: mobileNativeLoaderPath,
      output: {
        file: 'dist/mobileNativeLoader.js',
        format: 'iife',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          lodash: '_',
        },
      },
      ...commonOptions,
      external: source => ['lodash', 'react', 'react-dom'].includes(source),
    });
  }
  const lastEntry = entries[entries.length - 1];
  lastEntry.plugins = [...lastEntry.plugins, ...lastEntryPlugins];
  return entries.filter(x => x);
};

const output: OutputOptions[] = process.env.DYNAMIC_IMPORT
  ? [
      {
        dir: 'dist/es',
        format: 'es',
      },
      {
        dir: 'dist/cjs/',
        format: 'cjs',
      },
    ]
  : [
      {
        file: 'dist/module.js',
        format: 'es',
      },
      {
        file: 'dist/module.cjs.js',
        format: 'cjs',
      },
    ];

export default commonConfig(output, process.env.EXTRACT_CSS !== 'false');
