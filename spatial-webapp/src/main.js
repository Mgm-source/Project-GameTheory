import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import apexcharts from 'vue3-apexcharts';
import "./assets/styles/tailwind.css";
createApp(App).use(store).use(router).use(apexcharts).mount('#app')