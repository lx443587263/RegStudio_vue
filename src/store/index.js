import { createStore } from "vuex";
import IP from './IP';
import user from './user';
import reg_gather_list from './reg/reg_gather_list';
import reg_gather from './reg/reg_gather';
import single_reg from './reg/single_reg';
import value from "./reg/value";
import bootstrap from "bootstrap/dist/js/bootstrap.min.js";
import template_file from "./templateFile"
import category from "./category"
import patterninfo from "./pattern"
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    hideConfigButton: false,
    isPinned: true,
    showConfig: false,
    isRTL: false,
    color: "", 
    sidebarType: "bg-white",
    darkMode: false,
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    layout: "default",
    bootstrap,
  },
  mutations: {
    toggleConfigurator(state) {
      state.showConfig = !state.showConfig;
    },
    navbarMinimize(state) {
      const sidenav_show = document.querySelector("#app");

      if (sidenav_show.classList.contains("g-sidenav-show") && sidenav_show.classList.contains("g-sidenav-hidden")) {
        sidenav_show.classList.add("g-sidenav-pinned");
        sidenav_show.classList.remove("g-sidenav-hidden");
        state.isPinned = true;
      } else if (sidenav_show.classList.contains("g-sidenav-show") && sidenav_show.classList.contains("g-sidenav-pinned")) {
        sidenav_show.classList.add("g-sidenav-hidden");
        sidenav_show.classList.remove("g-sidenav-pinned");
        state.isPinned = false;
      } else if (sidenav_show.classList.contains("g-sidenav-show") && window.innerWidth < 1200 ) {
        sidenav_show.classList.add("g-sidenav-pinned");
        state.isPinned = true;
      } else {
        sidenav_show.classList.add("g-sidenav-hidden");
        state.isPinned = true;
      }
    },
    setSidebarType(state, payload) {
      state.sidebarType = payload;
    },
    navbarFixed(state) {
      if (state.isNavFixed === false) {
        state.isNavFixed = true;
      } else {
        state.isNavFixed = false;
      }
    },
    toggleDefaultLayout(state) {
      state.showNavbar = !state.showNavbar;
      state.showSidenav = !state.showSidenav;
      state.showFooter = !state.showFooter;
    },
  },
  actions: {
    toggleSidebarColor({ commit }, payload) {
      commit("setSidebarType", payload);
    },
  },
  getters: {}, 
  modules:{
    IP,
    reg_gather_list,
    reg_gather,
    single_reg,
    value,
    user,
    template_file,
    category,
    patterninfo,
  },
  plugins: [
    createPersistedState({
      getState: (key) => {
        // 从本地存储中获取指定模块的数据
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : {};
      },
      setState: (key, state) => {
        // 保存指定模块的数据到本地存储
        const data = JSON.stringify(state);
        sessionStorage.setItem(key, data);
      },
      paths: ['IP', 'reg_gather_list', 'reg_gather', 'single_reg', 'value', 'user', 'template_file', 'category', 'patterninfo'] // 指定要保存的模块路径
    })
    
  //   createPersistedState({    
  //   storage: window.sessionStorage,
  //   reducer(val) {
  //     return { // 只储存state中的user 
  //       user: val.base,
  //       IP: val.base,
  //       reg_gather_list: val.base,
  //       reg_gather: val.base,
  //       single_reg: val.base,
  //       value: val.base,
  //       template_file: val.base,
  //       category: val.base,
  //     }
  //   }
  //  })
  ]
});

