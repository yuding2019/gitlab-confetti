import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import typescript from '@rollup/plugin-typescript';
import tslib from 'tslib';

export default {
  input: {
    contentScripts: './src/contentScripts/index.js',
  },
  output: {
    dir: 'ext',
    entryFileNames: '[name].js',
  },
  plugins: [
    typescript({ tslib }),
    nodeResolve({
      extensions: ['.js', '.ts'],
    }),
    copy({
      targets: [
        {
          src: './src/manifest.json',
          dest: 'ext',
        },
        {
          src: './src/icons',
          dest: 'ext',
        },
      ],
    }),
  ],
};
