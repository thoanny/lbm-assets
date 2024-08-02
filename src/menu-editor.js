import '@/assets/main.scss';

import { createApp } from 'vue';
import App from '@/MenuEditor.vue';

const app = createApp(App);

if (document.getElementById('lbm-menu-editor')) {
  app.mount('#lbm-menu-editor');
}
