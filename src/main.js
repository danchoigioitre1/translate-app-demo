import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import Vant from 'vant';
import store from "./vueX/store";
import i18n from './js/lang/i18n';
import 'vant/lib/index.css';

export const app = createApp(App);
app.config.globalProperties.$router = router;
app.use(store);
app.use(router);
app.use(Vant);
app.use(i18n)
app.mount("#app");