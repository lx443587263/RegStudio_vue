

<!-- <template>
  <div
    class="card multisteps-form__panel p-3 border-radius-xl bg-white"
    data-animation="FadeIn"
  >
    <h5 class="font-weight-bolder mb-0">About me</h5>
    <p class="mb-0 text-sm">Mandatory informations</p>
    <div class="multisteps-form__content">
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
        <div class="col-12 col-sm-6 mt-3 mt-sm-0">
          <label>Last Name</label>
          <argon-input
            id="lastname"
            class="multisteps-form__input"
            type="text"
            placeholder="eg. Prior"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-sm-6">
          <label>Company</label>
          <argon-input
            id="company"
            class="multisteps-form__input"
            type="text"
            placeholder="eg. Creative Tim"
          />
        </div>
        <div class="col-12 col-sm-6 mt-3 mt-sm-0">
          <label>Email Address</label>
          <argon-input
            id="email"
            class="multisteps-form__input"
            type="email"
            placeholder="eg. argon@dashboard.com"
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
          <option value="DigitalFront">数字前端工程师</option>
          <option value="DigitalEnd">数字后端工程师</option>
          <option value="DigitalVerification">数字验证工程师</option>
          <option value="Embedded">嵌入式工程师</option>
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
      @click="$parent.nextStep"
    </div>
  </div>
</template>

<script>
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import Choices from "choices.js";



export default {
  name: "UserInfo",
  components: {
    ArgonInput,
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
        console.log("两次输入不一致")
        this.passwordMismatch = true
      } else {
        this.passwordMismatch = false
        
      }
      
    }
  }
};
</script> -->
