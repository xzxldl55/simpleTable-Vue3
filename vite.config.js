import {defineConfig} from 'vite';
import path from 'path';
import {createVuePlugin} from 'vite-plugin-vue2';
import ScriptSetup from 'unplugin-vue2-script-setup/vite'
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    legacy({
      targets: ['chrome >= 49', 'safari >= 11.1', 'edge >= 17', 'firefox >= 60', 'ie >= 11', 'not dead'],
    }),
    createVuePlugin({
      jsx: true,
      jsxOptions: {
        compositionAPI: true,
        injectH: true,
      },
    }),
    ScriptSetup(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3007,
    // 开启https，会启用http2，但测试后效果一般，没有明显的速度更快
    https: false,
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    minify: false,
  },
  define: {
    'process.env': {
      NODE_ENV: `"${process.env.NODE_ENV}"`,
      localMode: false,
    },
  },
  resolve: {
    alias: [
      // { find: 'vue', replacement: path.resolve(__dirname, '../node_modules/vue/dist/vue.js') },
    ],
  },
  // css: {
  //     preprocessorOptions: {
  //         less: {
  //             modifyVars: {
  //                 hack: `true;
  //                     @import '${path.resolve(__dirname, '../node_modules/@sxf/sf-theme/dist/brand40.less')}';
  //                 `,
  //             },
  //             javascriptEnabled: true,
  //         },
  //     },
  // },
  logLevel: 'info',
});
