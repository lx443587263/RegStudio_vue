<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <!-- <navbar
          is-blur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          btn-background="bg-gradient-success"
          :dark-mode="true"
        /> -->
      </div>
    </div>
  </div>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div
              class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
            >
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Sign In</h4>
                  <p class="mb-0">Enter your username and password to sign in</p>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                      <input                         
                        id="user"
                        v-model="state.username"
                        class="user"
                        type="user"
                        placeholder="UserName"
                        name="user">
                      <!-- <argon-input
                        id="user"
                        v-model="state.user"
                        type="user"
                        placeholder="UserName"
                        name="user"
                        size="lg"
                      /> -->
                    </div>
                    <div class="mb-3">
                      <input
                        id="password"
                        v-model="state.password"
                        class="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        @keydown="handleKeyDown"
                        >
                      <!-- <argon-input
                        id="password"
                        v-model="state.password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        size="lg"
                      /> -->
                    </div>
                    <div v-if="state.errorMessage" class="error-message">{{ state.errorMessage }}</div>
                    <!-- <argon-switch  id="rememberMe" v-model="rememberMe" name="rememberMe" >
                      {{ rememberMe }}
                      Remember me
                    </argon-switch> -->
                    <el-switch v-model="rememberMe" active-text="Remember me"/>
                    <div class="text-center">
                      <argon-button
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        full-width
                        @click="doLogin"
                        >Sign in</argon-button
                      >
                    </div>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Don't have an account?
                    <router-link
                      :to="{ name: 'Signup Illustration' }"
                      class="text-success text-gradient font-weight-bold"
                      >Sign up</router-link
                    >
                  </p>
                </div>
              </div>
            </div>
            <div
              class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 end-0 text-center justify-content-center flex-column"
            >
              <div
                class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                :style="{
                  'background-image': 'url(' + imageUrl + ')',
                    backgroundSize: 'cover'
                }"
              >
                <span class="mask bg-gradient-success opacity-6"></span>

                <h4
                  class="mt-5 text-white font-weight-bolder position-relative"
                >
                  "Attention is the new currency"
                </h4>
                <p class="text-white position-relative">
                  The more effortless the writing looks, the more effort the
                  writer actually put into the process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
// import Navbar from "@/examples/PageLayout/Navbar.vue";
// import ArgonInput from "@/components/ArgonInput.vue";
// import ArgonSwitch from "@/components/ArgonSwitch.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];
import { mapMutations,useStore } from "vuex";
import {reactive,ref} from "vue";
import {useRouter} from "vue-router";
import {userLogin} from "@/http/api/login";
import { getIpListApi } from "@/http/api/ip"
import { getCategoryListApi } from "@/http/api/ip";
import { getProjectApi ,getProjecNameApi} from "@/http/api/project";
import { getTemplateFileListApi} from "@/http/api/template_file"
import serverConfig from "../../../http/config/index";
import {userGet} from "@/http/api/user"

export default {
  name: "SigninIllustration",
  components: {
    // Navbar,
    // ArgonInput,
    // ArgonSwitch,
    ArgonButton,
  },
  setup(){
    // sessionStorage.removeItem('list')
    // localStorage.clear()

    const store = useStore();
    const router = useRouter();
    const rememberMe = ref(false);
    const imageUrl=require('@/assets/img/signin-ill.jpeg');
    
    var state = reactive({
        username: "",
        password: "",
        errorMessage:"",
        
    })

    //获取种类列表
    const getCategoryList=async (list)=>{
      if(list){
        let tempAllCategoryList = []
        let allCategoryList_temp = []
        for(var item in list){
          if(list[item].category){
            let ipCategory = {}
            ipCategory.category=list[item].category
            ipCategory.versionList = []
            let tempVersionList = []
            getCategoryListApi(list[item].category).then((res)=>{
              for(var i in res){
                let temp = {}
                temp.ipName = res[i].ip_name
                temp.seePermission = res[i].see_permission
                const findIpName = tempVersionList.findIndex(i=>i.ipName === temp.ipName)
                if(findIpName == -1){
                  tempVersionList.push(temp)
                }
              }
              ipCategory.versionList = tempVersionList;
            })

            tempAllCategoryList.push(ipCategory)
          }
        }
        allCategoryList_temp = tempAllCategoryList.filter((item, index) => tempAllCategoryList.findIndex(i => i.category === item.category) === index);
        await store.commit('IP/allCategoryList',allCategoryList_temp)
      }
    }


    //获取项目列表
    let allProjectList_temp = []
    let projectKV = new Map()
    const getProjectList= ()=>{
       getProjectApi().then( (res)=>{
        for(var i=0;i<res.length;++i){
          allProjectList_temp.push(res[i].project)
          projectKV.set(res[i].project_uuid,res[i].project+res[i].version)
        }
        store.commit('project/getProjectKV',projectKV)
        getProjecVersionList()
      })
    }
    const getProjecVersionList =()=>{
      let test = []
      allProjectList_temp = [...new Set(allProjectList_temp)];
      allProjectList_temp.forEach(element=>{
        let temp = {}
        temp.project = element
        temp.versionList = []
        getProjecNameApi(element).then((re)=>{
          re.forEach(el=>{
            let tempObj = {projectName:el.project+el.version,project_uuid:el.project_uuid}
            temp.versionList.push(tempObj)
          })
        })
        test.push(temp)
      })
      store.commit('IP/allProjectList',test)
    }


    getIpListApi().then(async (res)=>{
      await store.commit('IP/getIpList',res)
      getCategoryList(res)
      getProjectList()
    })

    async function doLogin() {
      // 1.向后台发送请求且登录成功
      // 2.返回信息
      try{
        await userLogin(state).then(async (res)=>{
        //3.保存vuex
        store.commit('user/login', res);
        await getTemplateFileListApi().then(async (res)=>{
          // this.tableData = res
          await store.commit('template_file/getTemplateFileList',res)
        })
        await userGet().then(async (res) => {
          let userList=[]
          for(var i in res){
            let userInfo={}
            for(var j in res[i]){
              if(typeof(res[i][j])!="object"){
                userInfo[j]=res[i][j]
              }
            }
            userList.push(userInfo)
          }
          await store.commit('user/setUserList', userList)
        })
        //4.跳转后台
        router.push({
          path:"/pages/profile/projects",
          name: "All Projects"
        })
      })
      }catch(error){
        state.errorMessage = error
      }

      //保存用户名密码到浏览器中
      if (rememberMe.value) {
        // 保存用户名和密码到 localStorage
        await localStorage.setItem('username', state.username);
        await localStorage.setItem('password', state.password);
      } else {
        // 清空 localStorage
        await localStorage.removeItem('username');
        await localStorage.removeItem('password');
      }
    }


    // 如果 localStorage 中有保存的用户名和密码，自动填充表单
    if (localStorage.getItem('username') && localStorage.getItem('password')) {
      state.username = localStorage.getItem('username');
      state.password = localStorage.getItem('password');
      rememberMe.value = true;
    }

    const keyPressed = ref('');

    const handleKeyDown = (event) => {
      keyPressed.value = event.key;
      if(event.key == "Enter"){
        doLogin()
      }
    };
    return {
      state,
      doLogin,
      keyPressed,
      handleKeyDown,
      rememberMe,
      getCategoryList,
      imageUrl,
      getProjectList,
      getProjecVersionList
    }
  },
  created() {
    this.$store.state.hideConfigButton = true;
    localStorage.setItem("backendIp",serverConfig.baseURL)
    this.toggleDefaultLayout();
    body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.toggleDefaultLayout();
    body.classList.add("bg-gray-100");
  },
  methods: {
    ...mapMutations(["toggleDefaultLayout"]),
  },
};
</script>

<style scoped>
.password,.user{
  min-height: unset;
  padding: 0.75rem 0.75rem;
  font-size: 0.875rem;
  width:100%;
  background-clip: padding-box;
  border: 1px solid #d2d6da;
  display: block;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4rem;
  color: #495057;
  background-color: #fff;
  border-radius: 0.5rem;
}
.error-message{
  color: red;
}
</style>