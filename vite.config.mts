import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }),
    createHtmlPlugin({
      inject: {
        data: {
          title: 'tgDrive',
        },
      },
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      // 自动导入 Vue、Vue Router 的 API
      imports: ['vue', 'vue-router'],
      dts: 'auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        secure: false,
      },
    },
    port: 3000,
  },
  build: {
    // 超过 1500kb 才警告，给 element-plus 留空间
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // 手动分包，避免单个 chunk 过大，加速首屏
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router'],
          'vendor-element': ['element-plus'],
          'vendor-icons': ['@element-plus/icons-vue'],
          'vendor-axios': ['axios'],
        },
        // 静态资源分类输出
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
});
