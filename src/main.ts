import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import * as Icons from '@ant-design/icons-vue'
createApp(App).use(store).use(router).use(Antd).mount('#app')
const app = createApp(App);
const icons: any = Icons;
for (const i in icons){
    app.component(i,icons[i]);
}