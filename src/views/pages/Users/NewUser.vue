<template>
    <div class="container-fluid py-5">
      <div class="row">
          <div class="col-12 col-lg-8 m-auto ">
            <form class="multisteps-form__form">
              <div
                class="card multisteps-form__panel p-3 border-radius-xl bg-white js-active position-relative "
                data-animation="FadeIn"
              >
                <h5 class="font-weight-bolder mb-0">About me</h5>
                <p class="mb-0 text-sm">Mandatory informations</p>
                <div class="multisteps-form__content child">
                  <div class="row mt-3">
                    <div class="col-12 col-sm-6">
                      <label>User Name</label>
                      <input
                        id="username"
                        v-model="user_info.username"
                        class="form-control"
                        type="text"
                        placeholder="eg. admin"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 col-sm-6">
                      <label>Password</label>
                      <input
                        id="password"
                        v-model="user_info.password"
                        class="form-control"
                        type="password"
                        placeholder="******"
                      />
                    </div>
                  </div>
                  <div>
                    <div class="col-12 col-sm-6 mt-sm-0">
                      <label>Repeat Password</label>
                      <!-- <span v-if="">Passwords do not match</span> -->
                      <!-- multisteps-form__input -->
                      <input
                        id="repeat-password"
                        v-model="user_info.repeat_password"
                        class="form-control"
                        type="password"
                        placeholder="******"
                      />
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 mt-sm-0">
                    <label>Position</label>
                    <select
                      id="choices-status-edit"
                      v-model="user_info.position"
                      class="form-control"
                      data-trigger
                      name="choices-single-default"
                      placeholder="This is a search placeholder"
                    >
                      <option value="">This is a placeholder</option>
                      <option value="admin">管理员</option>
                      <option value="create">新增</option>
                      <option value="edit">编辑</option>
                      <option value="delete">删除</option>
                      <option value="read">查看</option>

                      <!-- <option value="DigitalEnd">数字后端工程师</option>
                      <option value="DigitalVerification">数字验证工程师</option> -->
                    </select>
                  </div>
                  <div class="button-row d-flex mt-2">
                    <argon-button
                      type="button"
                      color="dark"
                      variant="gradient"
                      class="ms-auto mb-0 js-btn-next"
                      @click="submit"
                      >SubMit</argon-button
                    >
                  </div>
                  <!--@click="$parent.nextStep"-->
                </div>
              </div>
            </form>
          </div>
      </div>
      </div>
  
</template>

<script>
// import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import Choices from "choices.js";
import { v4 as uuidv4 } from 'uuid';
import { userAdd } from "@/http/api/user"



export default {
  name: "UserInfo",
  components: {
    // ArgonInput,
    ArgonButton,
  },
  
  data(){
    return {
      passwordMismatch:false,
      user_info:{
        user_uuid:"",
        create_date:"",
        username:"",
        password:"",
        repeat_password:"",
        position:""
      },
    }
  },
  mounted(){
    this.getChoices("choices-status-edit")
  },

  methods:{
    getChoices(id) {
      if (document.getElementById(id)) {
        var element = document.getElementById(id);
        return new Choices(element, {
          searchEnabled: false,
          allowHTML: true,
        })
      }
    },
    submit(){
      if (this.user_info.password !== this.user_info.repeat_password) {
        this.passwordMismatch = true
      } else {
        this.passwordMismatch = false
        this.user_info.user_uuid = uuidv4()
        this.user_info.create_date = new Date().toISOString().slice(0, 10);
        userAdd(this.user_info)
        this.$router.push({
        path: "/pages/users/reports",
        name: "Reports",
      })
      }
      
    }
  }
};
</script>

<style>
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 可以设置一个高度，让整个页面铺满屏幕 */
}

.child {
  /* 可以设置一些宽度、高度等属性 */
  width: 100%;
}
</style>


<!-- <template>
  <div class="container-fluid py-5">
    <div class="row">
      <div class="col-12">
        <div class="multisteps-form"> -->
          <!-- <div class="row">
            <div class="col-12 col-lg-8 mx-auto mb-4">
              <div class="card">
                <div class="card-body">
                  <div class="multisteps-form__progress">
                    <button
                      class="multisteps-form__progress-btn js-active"
                      type="button"
                      title="User Info"
                      :class="activeStep >= 0 ? activeClass : ''"
                      @click="activeStep = 0"
                    >
                      <span>User Info</span>
                    </button>
                    <button
                      class="multisteps-form__progress-btn"
                      type="button"
                      title="Address"
                      :class="activeStep >= 1 ? activeClass : ''"
                      @click="activeStep = 1"
                    >
                      Address
                    </button>
                    <button
                      class="multisteps-form__progress-btn"
                      type="button"
                      title="Socials"
                      :class="activeStep >= 2 ? activeClass : ''"
                      @click="activeStep = 2"
                    >
                      Socials
                    </button>
                    <button
                      class="multisteps-form__progress-btn"
                      type="button"
                      title="Profile"
                      :class="activeStep >= 3 ? activeClass : ''"
                      @click="activeStep = 3"
                    >
                      Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div> -->
          <!--form panels-->
          <!-- <div class="row">
            <div class="col-12 col-lg-8 m-auto">
              <form class="multisteps-form__form">
                <user-info :class="activeClass"/> -->
                <!--single form panel-->
                <!-- <user-info :class="activeStep === 0 ? activeClass : ''" /> -->
                <!--single form panel-->
                <!-- <user-address :class="activeStep === 1 ? activeClass : ''" /> -->
                <!--single form panel-->
                <!-- <user-socials :class="activeStep === 2 ? activeClass : ''" /> -->
                <!--single form panel-->
                <!-- <user-profile :class="activeStep === 3 ? activeClass : ''" /> -->
              <!-- </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserInfo from "./components/UserInfo.vue";
import UserAddress from "./components/UserAddress.vue";
import UserSocials from "./components/UserSocials.vue";
import UserProfile from "./components/UserProfile.vue";

export default {
  name: "NewUser",
  components: {
    UserInfo,
    UserAddress,
    UserSocials,
    UserProfile,
  },
  data() {
    return {
      showMenu: false,
      activeClass: "js-active position-relative",
      activeStep: 0,
      formSteps: 3,
    };
  },
  methods: {
    nextStep() {
      if (this.activeStep < this.formSteps) {
        this.activeStep += 1;
      } else {
        this.activeStep -= 1;
      }
    },
    prevStep() {
      if (this.activeStep > 0) {
        this.activeStep -= 1;
      }
    },
  },
};
</script> -->
