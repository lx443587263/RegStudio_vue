/**
=========================================================
* Vue Argon Dashboard 2 PRO - v3.0.1
=========================================================

* Product Page: https://creative-tim.com/product/vue-argon-dashboard-pro
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import VueTilt from "vue-tilt.js";
import VueSweetalert2 from "vue-sweetalert2";
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import ArgonDashboard from "./argon-dashboard";
import '../src/assets/fontawesome-free-6.3.0-web/css/all.css';
import ElementUI from "element-plus";
import 'element-plus/theme-chalk/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import echarts from "echarts";
import directives from "@/directives"
// import Astrict from './assets/js/astrict.js'



const appInstance = createApp(App);
appInstance.use(store);
appInstance.use(router);
appInstance.use(VueTilt);
appInstance.use(VueSweetalert2);
appInstance.use(ArgonDashboard);
appInstance.use(VXETable);
appInstance.use(ElementUI);
appInstance.use(directives);
// appInstance.use(Astrict);
appInstance.echarts = echarts;

for (let i in ElementPlusIconsVue) {
    appInstance.component(i, ElementPlusIconsVue[i])
  }
appInstance.mount("#app");


