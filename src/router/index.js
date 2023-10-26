import { createRouter, createWebHistory } from "vue-router";
// import Landing from "../views/dashboards/Landing.vue";
// import Default from "../views/dashboards/Default.vue";
// import Automotive from "../views/dashboards/Automotive.vue";
// import SmartHome from "../views/dashboards/SmartHome.vue";
// import CRM from "../views/dashboards/CRM.vue";
// import Overview from "../views/pages/profile/Overview.vue";
// import Teams from "../views/pages/profile/Teams.vue";
// import Projects from "../views/pages/profile/Projects.vue";
// import General from "../views/pages/projects/General.vue";
// import Timeline from "../views/pages/projects/Timeline.vue";
// import NewProject from "../views/pages/projects/NewProject.vue";
// import Charts from "../views/pages/Charts.vue";
// import SweetAlerts from "../views/pages/SweetAlerts.vue";
// import Notifications from "../views/pages/Notifications.vue";
// import Kanban from "../views/applications/Kanban.vue";
// import Wizard from "../views/applications/wizard/Wizard.vue";
// import DataTables from "../views/applications/DataTables.vue";
// import Calendar from "../views/applications/Calendar.vue";
// import Analytics from "../views/applications/analytics/Analytics.vue";
// import EcommerceOverview from "../views/ecommerce/overview/Overview.vue";
// import EditProduct from "../views/ecommerce/EditProduct.vue";
// import ProductPage from "../views/ecommerce/ProductPage.vue";
// import ProductsList from "../views/ecommerce/ProductsList.vue";
// import OrderDetails from "../views/ecommerce/Orders/OrderDetails";
// import OrderList from "../views/ecommerce/Orders/OrderList";
import Referral from "../views/ecommerce/Referral";
// import Reports from "../views/pages/Users/Reports.vue";
// import NewUser from "../views/pages/Users/NewUser.vue";
// import Settings from "../views/pages/Account/Settings.vue";
// import Billing from "../views/pages/Account/Billing.vue";
// import Invoice from "../views/pages/Account/Invoice.vue";
// import Security from "../views/pages/Account/Security.vue";
// import Widgets from "../views/pages/Widgets.vue";
// import Basic from "../views/auth/signin/Basic.vue";
// import Cover from "../views/auth/signin/Cover.vue";
// import Illustration from "../views/auth/signin/Illustration.vue";
// import ResetBasic from "../views/auth/reset/Basic.vue";
// import ResetCover from "../views/auth/reset/Cover.vue";
// import ResetIllustration from "../views/auth/reset/Illustration.vue";
// import VerificationBasic from "../views/auth/verification/Basic.vue";
// import VerificationCover from "../views/auth/verification/Cover.vue";
// import VerificationIllustration from "../views/auth/verification/Illustration.vue";
// import SignupBasic from "../views/auth/signup/Basic.vue";
// import SignupCover from "../views/auth/signup/Cover.vue";
// import SignupIllustration from "../views/auth/signup/Illustration.vue";
// import Error404 from "../views/auth/error/Error404.vue";
// import Error500 from "../views/auth/error/Error500.vue";
// import lockBasic from "../views/auth/lock/Basic.vue";
// import lockCover from "../views/auth/lock/Cover.vue";
// import lockIllustration from "../views/auth/lock/Illustration.vue";
// import DynamicModifyTable from "../views/pages/projects/ModifyLog.vue";
// 路由懒加载，进来的时候才加载页面
const NewProduct = ()=>import('../views/ecommerce/products/NewProduct.vue')
const Illustration = ()=>import('../views/auth/signin/Illustration.vue');
const Reports = ()=>import('../views/pages/Users/Reports.vue');
const NewUser = ()=>import('../views/pages/Users/NewUser.vue');
const ResetIllustration = ()=>import('../views/auth/reset/Illustration.vue');
const SignupIllustration = ()=>import('../views/auth/signup/Illustration.vue');
const DynamicModifyTable = ()=>import('../views/pages/projects/ModifyLog.vue');
const OrderList = ()=>import('../views/ecommerce/Orders/OrderList');
const Kanban = ()=>import('../views/applications/Kanban.vue');
const ProductsList = ()=>import('../views/ecommerce/ProductsList.vue');
const NewProject = ()=>import('../views/pages/projects/NewProject.vue');
const Timeline = ()=>import('../views/pages/projects/Timeline.vue');
const Projects = ()=>import('../views/pages/profile/Projects.vue');


import store from "@/store"
const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/authentication/signin/illustration"
  },
  // {
  //   path: "/dashboards/dashboard-default",
  //   name: "Default",
  //   component: Default
  // },
  // {
  //   path: "/dashboards/landing",
  //   name: "Landing",
  //   component: Landing
  // },
  // {
  //   path: "/dashboards/automotive",
  //   name: "Automotive",
  //   component: Automotive
  // },
  // {
  //   path: "/dashboards/smart-home",
  //   name: "Smart Home",
  //   component: SmartHome
  // },
  // {
  //   path: "/dashboards/crm",
  //   name: "CRM",
  //   component: CRM
  // },
  // {
  //   path: "/pages/profile/overview",
  //   name: "Profile Overview",
  //   component: Overview
  // },
  // {
  //   path: "/pages/profile/teams",
  //   name: "Teams",
  //   component: Teams
  // },
  {
    path: "/pages/profile/projects",
    name: "All Projects",
    component: Projects,
  },
  {
    path: "/pages/projects/general",
    name: "General",
    component:()=>import('../views/pages/projects/General.vue'),
    meta:{
      requireAuth: true,
      role:['admin','edit','create','delete','read']}
  },
  {
    path: "/pages/projects/timeline",
    name: "Timeline",
    component: Timeline
  },
  {
    path: "/pages/projects/new-project",
    name: "New Project",
    component: NewProject,
    meta:{
      requireAuth: true,
      role:['admin','edit','create','delete','read']}
  },

  {
    path: "/pages/charts",
    name: "Charts",
    component: ()=>import('../views/pages/Charts.vue'),
  },
  // {
  //   path: "/pages/widgets",
  //   name: "Widgets",
  //   component: Widgets
  // },
  // {
  //   path: "/pages/sweet-alerts",
  //   name: "Sweet Alerts",
  //   component: SweetAlerts
  // },
  // {
  //   path: "/pages/notifications",
  //   name: "Notifications",
  //   component: Notifications
  // },
  {
    path: "/applications/kanban",
    name: "Kanban",
    component: Kanban
  },
  // {
  //   path: "/applications/wizard",
  //   name: "Wizard",
  //   component: Wizard
  // },
  // {
  //   path: "/applications/data-tables",
  //   name: "Data Tables",
  //   component: DataTables
  // },
  // {
  //   path: "/applications/calendar",
  //   name: "Calendar",
  //   component: Calendar
  // },
  // {
  //   path: "/applications/analytics",
  //   name: "Analytics",
  //   component: Analytics
  // },
  // {
  //   path: "/ecommerce/overview",
  //   name: "Overview",
  //   component: EcommerceOverview
  // },
  {
    path: "/ecommerce/products/new-project",
    name: "New Product",
    component: NewProduct,
    meta:{role:['admin','edit','create','delete','read']}
  },
  // {
  //   path: "/ecommerce/products/edit-product",
  //   name: "Edit Product",
  //   component: EditProduct
  // },
  // {
  //   path: "/ecommerce/products/product-page",
  //   name: "Product Page",
  //   component: ProductPage
  // },
  {
    path: "/ecommerce/products/products-list",
    name: "Products List",
    component: ProductsList
  },
  // {
  //   path: "/ecommerce/Orders/order-details",
  //   name: "Order Details",
  //   component: OrderDetails
  // },
  {
    path: "/ecommerce/Orders/order-list",
    name: "Order List",
    component: OrderList,
    meta:{
      requireAuth: true,
      role:['admin','edit','create','delete','read']}
  },
  {
    path: "/ecommerce/referral",
    name: "Pattern Info",
    component: Referral
  },
  {
    path: "/pages/users/reports",
    name: "Reports",
    component: Reports,
    meta:{role:["admin"]}
  },
  {
    path: "/pages/users/new-user",
    name: "New User",
    component: NewUser
  },
  // {
  //   path: "/pages/account/settings",
  //   name: "Settings",
  //   component: Settings
  // },
  // {
  //   path: "/pages/account/billing",
  //   name: "Billing",
  //   component: Billing
  // },
  // {
  //   path: "/pages/account/invoice",
  //   name: "Invoice",
  //   component: Invoice
  // },
  // {
  //   path: "/pages/account/Security",
  //   name: "Security",
  //   component: Security
  // },
  // {
  //   path: "/authentication/signin/basic",
  //   name: "Signin Basic",
  //   component: Basic
  // },
  // {
  //   path: "/authentication/signin/cover",
  //   name: "Signin Cover",
  //   component: Cover
  // },
  {
    path: "/authentication/signin/illustration",
    name: "Signin Illustration",
    component: Illustration,
  },
  // {
  //   path: "/authentication/reset/basic",
  //   name: "Reset Basic",
  //   component: ResetBasic
  // },
  // {
  //   path: "/authentication/reset/cover",
  //   name: "Reset Cover",
  //   component: ResetCover
  // },
  {
    path: "/authentication/reset/illustration",
    name: "Reset Illustration",
    component: ResetIllustration
  },
  {
    path: "/test",
    name: "test",
    component: ()=>import('../views/pages/projects/test.vue')
  },


  // {
  //   path: "/authentication/lock/basic",
  //   name: "Lock Basic",
  //   component: lockBasic
  // },
  // {
  //   path: "/authentication/lock/cover",
  //   name: "Lock Cover",
  //   component: lockCover
  // },
  // {
  //   path: "/authentication/lock/illustration",
  //   name: "Lock Illustration",
  //   component: lockIllustration
  // },
  // {
  //   path: "/authentication/verification/basic",
  //   name: "Verification Basic",
  //   component: VerificationBasic
  // },
  // {
  //   path: "/authentication/verification/cover",
  //   name: "Verification Cover",
  //   component: VerificationCover
  // },
  // {
  //   path: "/authentication/verification/illustration",
  //   name: "Verification Illustration",
  //   component: VerificationIllustration
  // },
  // {
  //   path: "/authentication/signup/basic",
  //   name: "Signup Basic",
  //   component: SignupBasic
  // },
  // {
  //   path: "/authentication/signup/cover",
  //   name: "Signup Cover",
  //   component: SignupCover
  // },
  {
    path: "/authentication/signup/illustration",
    name: "Signup Illustration",
    component: SignupIllustration,
    meta:{role:['admin','edit','create','delete','read']}
  },
  // {
  //   path: "/authentication/error/error404",
  //   name: "Error Error404",
  //   component: Error404
  // },
  // {
  //   path: "/authentication/error/error500",
  //   name: "Error Error500",
  //   component: Error500
  // },
  {
    path: "/projects/ModifyLog",
    name: "ModifyLog",
    component: DynamicModifyTable
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active"
});


router.beforeEach((to,from,next)=>{
  //1.当前访问的路由
  if(to.meta.requireAuth){
    const token = localStorage.getItem('token');
    if (token) {
      if(to.meta.role){
        // 获取当前vuex中的角色
        // to.meta.role就是允许的角色列表["admin","user"]
        let userRole = store.state.user
        let allowRoleList = to.meta.role;
        const newArr = allowRoleList.filter(item => userRole.position.includes(item))
        if(newArr.length === 0){
          next({name:"/"});
        }else{
          next();
        }
      }else{
        next();
      }
    } else {
      next({name:"/"});
    }
    
  }else{
    next()
  }
  //判断能否访问
  
})

export default router;
