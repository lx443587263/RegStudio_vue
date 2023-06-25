<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <!-- <navbar
          is-blur="blur border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          btn-background="bg-gradient-success"
          :dark-mode="true"
        /> -->
      </div>
    </div>
  </div>
  <main class="mt-0 main-content">
    <div class="page-header min-vh-100">
      <div class="container">
        <div class="row">
          <div
            class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
          >
            <div class="card card-plain">
              <div class="pb-0 card-header text-start">
                <h4 class="font-weight-bolder">Reset password</h4>
              </div>
              <div class="card-body">
                  <div class="mb-3">
                    <el-input
                      id="new_password"
                      v-model="new_password"
                      type="password"
                      placeholder="new password"
                      name="new_password"
                    />
                  </div>
                  <div class="mb-3">
                    <el-input
                      id="repeat_password"
                      v-model="repeat_password"
                      type="password"
                      placeholder="repeat password"
                      name="repeat_password"
                    />
                  </div>
                  <div class="text-center">
                    <argon-button
                      class="my-4"
                      variant="gradient"
                      color="success"
                      full-width
                      size="lg"
                      @click="changePassword">Send</argon-button
                    >
                  </div>
              </div>
            </div>
          </div>
          <div
            class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 end-0 text-center justify-content-center flex-column"
          >
            <div
              class="position-relative bg-gradient-success h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
              :style="{'background-image': 'url(' + imageUrl + ')',
              'background-size': 'cover'}"
            >
              <span class="mask bg-dark opacity-6"></span>
              <h4 class="mt-5 text-white font-weight-bolder position-relative">
                Reset Password
              </h4>
              <!-- <p class="text-white position-relative">
                Just as it takes a company to sustain a product, it takes a
                community to sustain a protocol.
              </p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
// import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import { mapMutations } from "vuex";
import { passwordEdit } from "@/http/api/user";
const body = document.getElementsByTagName("body")[0];
export default {
  name: "ResetIllustration",

  components: {
    // Navbar,
    ArgonButton,
  },
  data(){
    return {
      new_password:"",
      repeat_password:"",
      user_uuid:localStorage.getItem('user_uuid'),
      imageUrl: require('@/assets/img/reset-ill.jpg'),
    }
  },
  created() {
    this.$store.state.hideConfigButton = true;
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
    changePassword(){
      if(this.user_uuid){
        if(this.new_password === this.repeat_password){
          let data ={}
          data.new_password=this.new_password
          try{
            passwordEdit(this.user_uuid,data).then((res)=>{
              this.$message({
                message: res,
                type: 'success'
              });
            })
            localStorage.clear()
            this.$router.push({
              path:"/authentication/signin/illustrationt",
              name: "Signin Illustration"
            })
          }catch(error){
            error
          }
        }else{
          this.$message.error("The passwords are inconsistent")
        }
      }
    }
  },
};
</script>
