import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';

export default {
  input: {
    contentScripts: './contentScripts/index.js',
  },
  output: {
    dir: 'dist',
    entryFileNames: '[name].js',
  },
  plugins: [
    nodeResolve(),
    copy({
      targets: [
        {
          src: './manifest.json',
          dest: 'dist',
        },
        {
          src: './icons',
          dest: 'dist',
        },
      ],
    }),
  ],
};
