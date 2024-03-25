<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="mx-auto col-lg-9 col-12">
        <div class="mt-4 card card-body">
          <h6 class="mb-0">New IP</h6>
          <p class="mb-0 text-sm">Create New IP</p>
          <hr class="my-3 horizontal dark" />
          
          <el-form
            ref="form"
            :model="ip_info"
            :rules="rules"
            label-width="auto"
            label-position="top"
          >
          <el-form-item label="IP Name" prop="ip_name">
            <el-input v-model="ip_info.ip_name"/>
          </el-form-item>
          <div class="mt-4 row">
            <label> SoC </label>
            <p class="text-xs form-text text-muted ms-1">
              If checked, this IP  belongs to Soc.
            </p>
            <div class="form-check form-switch ms-3">
              <input
                id="flexSwitchCheckDefault"
                v-model="ip_info.private_project"
                class="form-check-input"
                type="checkbox"
                data-type="warning"
                data-content="Once a project is made private, you cannot revert it to a public project."
                data-title="Warning"
                data-icon="ni ni-bell-55"
                @click="ckeckVal"
              />
            </div>
          </div>
          <div class="row">
            <div v-if="ip_info.private_project" class="col-6">
              <el-form-item label="Category" prop="category">
                <el-input v-model="ip_info.category" readonly/>
              </el-form-item>
            </div>
            <div v-else class="col-6">
              <el-form-item label="Category" prop="category">
                <el-select v-model="ip_info.category" placeholder="please select Category" style="width: 100%">
                  <!-- <el-option label="Interface" value="Interface" /> -->
                  <el-option v-for="(item,index) in category_list" :key="index" :label=item.category :value=item.category></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-6">
              <el-form-item label="Status" prop="status">
                <el-select v-model="ip_info.status" placeholder="please select Status" style="width: 100%">
                  <el-option label="Progress" value="Progress" />
                  <el-option label="Canceled" value="Canceled" />
                  <el-option label="Completed" value="Completed" />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <el-form-item v-if="ip_info.private_project" label="Version" prop="version">
                <el-input v-model="ip_info.version" placeholder="e.g.v0.1 v0.2"/>
              </el-form-item>
              <el-form-item v-else label="RTL Version" prop="version">
                <el-input v-model="ip_info.version" placeholder="e.g.v0.1 v0.2"/>
              </el-form-item>
            </div>
            <div class="col-6">
              <el-form-item v-if="ip_info.private_project" label="Chip Version" prop="child_version">
                <el-input v-model="ip_info.child_version" placeholder="e.g.A B"/>
              </el-form-item>
            </div>
          </div>
          <!--项目名-->
          <div class="row">
            <div class="col-6">
              <el-form-item v-if="ip_info.private_project" label="Porject" prop="project" >
              <el-select v-model="ip_info.project" placeholder="please select Project" style="width: 100%">
                  <!-- <el-option label="Interface" value="Interface" /> -->
                  <el-option v-for="(item,index) in project_list" :key="index" :label=item.project+item.version :value=item.project_uuid></el-option>
                </el-select>
              <!-- <el-input v-model="ip_info.projec"/> -->
              </el-form-item>
              <el-form-item v-else label="Porject" prop="project" >
                <MultipleSelect v-model="value" :options="options"></MultipleSelect>
              </el-form-item>
            </div>
            <div class="col-6">
              <el-form-item label="Reg Version" prop="reg_version">
                <el-input v-model="ip_info.reg_version"/>
              </el-form-item>
            </div>
          </div>


          <el-form-item label="IP Description" prop="description">
            <el-input v-model="ip_info.description" type="textarea" />
          </el-form-item>
          <el-form-item label="IP Tags">
            <div class="form-control">
            <el-tag
              v-for="tag in dynamicTags"
              :key="tag"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="saveTagInput"
              v-model="inputValue"
              class="ml-1 w-20 input-new-tag"
              size="small"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">+ New Tag</el-button>
          </div>
          </el-form-item>
          <el-form-item label="Permission" prop="see_permission">
            <div v-for="seePer in see_permission" :key="seePer">
              <el-tag v-if="seePer!='admin'">{{seePer}}</el-tag>
              <el-button class="button-new-tag ml-1" size="small" @click="dialogPermissionVisible = true">add</el-button>
            </div>
          </el-form-item>
          </el-form>
          <el-dialog
            v-model="dialogPermissionVisible"
            title="Tips"
            width="40%"
          >
            <el-transfer 
              v-model="see_permission" 
              :titles="['Source', 'Target']" 
              :data="userData" />
          </el-dialog>
          
          
          
          <!-- <label for="projectName" class="form-label" >IP Name</label>
          <input id="projectName" v-model="ip_info.ip_name" type="text" class="form-control" required/>
          <div class="mt-4 row">
            <label> SoC </label>
            <p class="text-xs form-text text-muted ms-1">
              If checked, this IP  belongs to Soc.
            </p>
            <div class="form-check form-switch ms-3">
              <input
                id="flexSwitchCheckDefault"
                v-model="ip_info.private_project"
                class="form-check-input"
                type="checkbox"
                data-type="warning"
                data-content="Once a project is made private, you cannot revert it to a public project."
                data-title="Warning"
                data-icon="ni ni-bell-55"
                @click="ckeckVal"
              />
            </div>
          </div>
          <div class="row">
            <div v-if="ip_info.private_project" class="col-6">
              <label class="mt-4 form-label">Category</label>
              <input id="child_version" v-model="ip_info.category" type="text" class="form-control" readonly/>
            </div>
            <div v-else class="col-6">
              <label class="mt-4 form-label">Category</label>
              <select
                id="category"
                v-model="ip_info.category"
                class="form-control"
                data-trigger
                name="choices-single-default"
                placeholder="This is a search placeholder"
              >
                <option value="" >This is a placeholder</option>
                <option value="Interface">Interface</option>
              </select>
            </div>
            <div class="col-6">
              <label class="mt-4 form-label">Status</label>
              <select
                id="choices-status-edit"
                v-model="ip_info.status"
                class="form-control"
                data-trigger
                name="choices-single-default"
                placeholder="This is a search placeholder"
              >
                <option value="" >This is a placeholder</option>
                <option value="Progress">Progress</option>
                <option value="Canceled">Canceled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <label v-if="ip_info.private_project" class="mt-4 form-label" >Chip</label>
              <label v-else class="mt-4 form-label" >Version</label>
              <input id="version" v-model="ip_info.version" type="text" class="form-control" required/>
            </div>
            <div v-if="ip_info.private_project" class="col-6">
              <label class="mt-4 form-label">Child Version</label>
              <input id="child_version" v-model="ip_info.child_version" type="text" class="form-control"/>
            </div>
          </div>
          <label class="mt-4">IP Description</label>
          <div id="editor">
          </div>
          <label class="mt-4 form-label" >IP Tags</label>
          <div class="form-control">
            <el-tag
              v-for="tag in dynamicTags"
              :key="tag"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="saveTagInput"
              v-model="inputValue"
              class="ml-1 w-20 input-new-tag"
              size="small"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">+ New Tag</el-button>
          </div> -->
          
          <!-- <label class="mt-4 form-label" >IP标签</label>
          <select
            id="choices-multiple-remove-button"
            class="form-control"
            name="choices-multiple-remove-button"
            multiple
          >
          </select> -->
          <!-- <div class="row">
            <div class="col-6">
              <label class="mt-4 form-label">Start Date</label>
              <flat-pickr
                v-model="ip_info.start_date"
                class="form-control datetimepicker"
                placeholder="Please select start date"
                :config="config"
              ></flat-pickr>
            </div>
            <div class="col-6">
              <label class="mt-4 form-label">Estimated End Time</label>
              <flat-pickr
                v-model="ip_info.end_date"
                class="form-control datetimepicker"
                placeholder="Please select end date"
                :config="config"
              ></flat-pickr>
            </div>
          </div> -->
          <!-- <label class="mt-4 form-label">相关文档</label> -->
          <!-- <form
            id="dropzone"
            action="/file-upload"
            class="form-control dropzone"
          >
            <div class="fallback">
              <input name="file" type="file" multiple />
            </div>
          </form> -->
          <div class="mt-4 d-flex justify-content-end">
            <button type="button" name="button" class="m-0 btn btn-light" @click="backHome">
              Cancel
            </button>
            <button
              type="button"
              name="button"
              class="m-0 btn bg-gradient-success ms-2"
              @click="submitNewIp"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Dropzone from "dropzone";
import Choices from "choices.js";
import Quill from "quill";
import { v4 as uuidv4 } from 'uuid';
import { mapMutations,mapState } from 'vuex';
import { getCategoryApi } from "@/http/api/category"
import { getProjectApi ,editProjectApi} from "@/http/api/project"
import { getCategoryListApi,getProjectListApi } from "@/http/api/ip"
import MultipleSelect from "./components/MultipleSelect"
// import {userGet} from "@/http/api/user"


export default {
  name: "NewProject",
  components: {
    MultipleSelect
  },
  data() {
    return {
      ipDes:{},
      userData:[],
      dynamicTags: [],
      see_permission:['admin'],
      inputVisible: false,
      dialogPermissionVisible: false,
      inputValue: '',
      ip_info:{
        ip_name:"",
        private_project:false,
        description:null,
        // ip_tags:[],
        status:"Progress",
        start_date:"",
        end_date:"",
        starting_files:"",
        create_user:"",
        category:"",
        tags:"",
        version:"",
        child_version:"",
        see_permission:"",
        project:"",
        reg_version:""
      },
      config: {
        allowInput: true,
      },
      rules:{
        ip_name:{required: true, message: 'Please input IP name', trigger: 'blur' },
        category:{required: true, message: 'Please Select Category', trigger: 'blur' },
        version:{required: true, message: 'Please input RTL version,e.g v0.1 v1.0', trigger: 'blur',pattern:/^[vV]\d+(\.\d+)?/},
        reg_version:{required: true, message: 'Please input reg version,e.g v0.1 v1.0', trigger: 'blur',pattern:/^[vV]\d+(\.\d+)?/},
        child_version:{required: true, message: 'Please input child_versione,.g A B', trigger: 'blur',pattern:/^[A-Z]/},
      },
      Option:{
        key: Number,
        label: String,
        disabled: Boolean,
      },
      value: [],
      options: []
    };
  },
  // watch:{
  //   'ip_info.private_project'(newVal,oldVal){
  //     console.log(oldVal,newVal)
  //     console.log(typeof(newVal))
  //     if(newVal==true){
  //       console.log("change category")
  //       this.ip_info.category="Soc module"
  //     }
  //   }
  // },
  computed:{
    ...mapState('category',['category_list']),
    ...mapState('project',['project_list']),
    ...mapState('user',['userlist']),
  },
  created(){
    this.project_list.forEach(element => {
      let temp={};
      temp.value=element.project_uuid
      temp.label=element.project+element.version
      this.options.push(temp)
    });
    getCategoryApi().then((res)=>{
      this.$store.commit('category/getCategoryList',res)
    }),
    getProjectApi().then((res)=>{
      this.$store.commit('project/getProjectList',res)
    })
    // userGet().then((res) => {
    //     let userList=[]
    //     for(var i in res){
    //       let userInfo={}
    //       for(var j in res[i]){
    //         if(typeof(res[i][j])!="object"){
    //           userInfo[j]=res[i][j]
    //         }
    //       }
    //       userList.push(userInfo)
    //     }
    //     this.$store.commit('user/setUserList', userList)
    //   })
  },
  mounted() {
    if (document.getElementById("editor")) {
      this.ipDes = new Quill("#editor", {
        theme: "snow", // Specify theme in configuration
        style:"width: 100%"
      });
    }
    
    if (document.getElementById("choices-multiple-remove-button")) {
      var element = document.getElementById("choices-multiple-remove-button");
      const example = new Choices(element, {
        removeItemButton: true,
        allowHTML: true,
      });

      example.setChoices(this.options,'value','label',true);
    }

    this.getChoices("choices-status-edit");
    this.getChoices("category");
    this.generateData()
    // Dropzone.autoDiscover = false;
    // var drop = document.getElementById("dropzone");
    // new Dropzone(drop, {
    //   url: "/file/post",
    //   addRemoveLinks: true,
    // });
  },
  methods:{
    ckeckVal(){
      if(this.ip_info.private_project){
        this.ip_info.category=""
      }else{
        this.ip_info.category="SoC系统组件"
      }
    },
    getChoices(id) {
      if (document.getElementById(id)) {
        var element = document.getElementById(id);
        return new Choices(element, {
          searchEnabled: false,
          allowHTML: true,
        })
      }
    },
    submitNewIp(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 表单验证通过，执行提交操作
          this.ip_info.ip_uuid = uuidv4();
          this.ip_info.create_user = localStorage.getItem('user')
          this.ip_info.tags = this.dynamicTags.join()
          if(localStorage.getItem('user')!="admin"){
            this.see_permission.push(localStorage.getItem('user'))
          }
          this.ip_info.see_permission = this.see_permission.join()
          if(this.ip_info.private_project){
            this.project_list.filter(it=>{
                if(it.project_uuid == this.ip_info.project){
                  if(it.has_ip){
                    it.has_ip =it.has_ip+","+this.ip_info.ip_uuid
                  }else{
                    it.has_ip = this.ip_info.ip_uuid
                  }
                }
                editProjectApi(it.project_uuid,it)
              })
          }else{
            this.ip_info.project = this.value.join(',')
            //value 是 project_uuid
            this.value.forEach(item=>{
              this.project_list.filter(it=>{
                if(it.project_uuid == item){
                  if(it.has_ip){
                    it.has_ip =it.has_ip+","+this.ip_info.ip_uuid
                  }else{
                    it.has_ip = this.ip_info.ip_uuid
                  }
                }
                editProjectApi(it.project_uuid,it)
              })
            })
          }
          if(!this.ip_info.private_project){
            this.ip_info.child_version = "NA"
          }
          this.addNewIP(this.ip_info);
          getCategoryListApi(this.ip_info.category).then(async (res)=>{        
            await this.$store.commit('IP/getCategoryIpList',res)
          })
          getProjectListApi(this.ip_info.category).then(async (res)=>{
            await this.$store.commit('IP/getProjectIpList',res)
          })
          this.$router.push({
            path: "/ecommerce/Orders/order-list",
            name: "Order List",
            params:{source:"newProject"}
          })
          this.$message.success('添加成功')
        } else {
          // 表单验证不通过，进行相应的处理
          // ...
          console.log("no pass")
        }
      });
  
      
    },
    ...mapMutations('IP',['addNewIP']),
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(()=> {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    backHome(){
      this.$router.push({
          path:"/pages/profile/projects",
          name: "All Projects"
        })
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },

    generateData(){
      const data = []
      for (let i = 0; i < this.userlist.length; i++) {
        data.push({
          key: this.userlist[i].username,
          label: this.userlist[i].username,
          disabled: i === 0,
        })
      }
      this.userData=data
    }


  }
};
</script>  
 
<style>
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    margin-left: 10px;
  }

</style>