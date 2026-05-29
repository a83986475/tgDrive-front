import { createApp } from 'vue';
import type { App as AppType } from 'vue';
import App from './App.vue';
import router from './routers';
// 不再全量导入 ElementPlus 和图标
// unplugin-vue-components + AutoImport 会自动按需引入组件
// 只需手动引入暗黑主题变量和基础样式
import 'element-plus/theme-chalk/dark/css-vars.css';
import './assets/theme.css';

const app: AppType = createApp(App);

// 不再全量注册 290+ 个图标（各页面已按需 import）
// 全量注册会阻止 tree-shaking，显著增加包体积

app.use(router);
app.mount('#app');

export default app;
