<template>
  <div class="container-fluid py-4">
    <div class="d-sm-flex justify-content-between">
      <div class="button-container">
        <router-link :to="{ name: 'New Project' }" >
          <argon-button v-permission="['admin','edit','create','delete','read']" color="white" variant="outline"><el-icon><Plus /></el-icon> 新建IP</argon-button>
        </router-link>
        <argon-button v-permission="['admin','edit','create','delete','read']" color="white" variant="outline" @click="deleteIpAll"><el-icon><Delete /></el-icon> 删除IP</argon-button>
        <argon-button v-permission="['admin','edit','create','delete','read']" color="white" variant="outline" @click="createNewVersion">新建新版本</argon-button>
        <argon-button v-permission="['admin','edit','create','delete','read']" color="white" variant="outline" @click="dialogVisible = true">导入IP</argon-button>
        <!-- <argon-button v-permission="['admin',]" color="white" variant="outline" @click="importIP">test</argon-button> -->
        <!-- <input id="doc" class="file" type="file"/> -->
          <!-- <div class="docx-preview-wrap">
              <h1>kaimo test docx-preview</h1>
              <h4>
                  <input id="file" type="file"  accept=".docx"/>
                  <button @click="handlePreview">预览</button>
              </h4>
              <div id="bodyContainer"></div>
          </div> -->
          
        <el-dialog v-model="dialogVisible" title="上传文件" >
          <!-- <div style="margin-top: -20px;margin-bottom: 20px;">
            <span>test</span>
          </div> -->
          <el-upload
          ref="upload"
          :action=bankendServeIP
          :data="uploadData"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          >
            <template #trigger>
              <div>
                <el-select v-model="uploadData.ip_uuid" filterable placeholder="请选择IP">
                  <el-option v-for="(item,index) in ip_lists" :key="index" :label="item.ip_name+'('+item.version+(item.child_version?'-'+item.child_version:'')+')'" :value="item.ip_uuid">
                    {{ item.ip_name+"("+item.version+(item.child_version?"-"+item.child_version:"")+")" }}
                  </el-option>
                </el-select>
                <el-button :disabled="isDisabled" size="small" type="primary" style="margin-left: 10px;">选择文件</el-button>
              </div>
            </template>
            <template #tip>
              <div class="el-upload__tip">只能上传word或者excel</div>
            </template >
          </el-upload>
        </el-dialog>
      </div>
      <div class="d-flex">
        <!-- <div class="dropdown d-inline">
          <argon-button
            id="navbarDropdownMenuLink2"
            color="white"
            variant="outline"
            class="dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            >Filters</argon-button
          >
          <ul
            class="dropdown-menu dropdown-menu-lg-start px-2 py-3"
            aria-labelledby="navbarDropdownMenuLink2"
            style
          >
            <li>
              <a class="dropdown-item border-radius-md" href="javascript:;"
                >Status: 完成</a
              >
            </li>
            <li>
              <a class="dropdown-item border-radius-md" href="javascript:;"
                >Status: 进行中</a
              >
            </li>
            <li>
              <a class="dropdown-item border-radius-md" href="javascript:;"
                >Status: 中止</a
              >
            </li>
            <li>
              <hr class="horizontal dark my-2" />
            </li>
            <li>
              <a
                class="dropdown-item border-radius-md text-danger"
                href="javascript:;"
                >Remove Filter</a
              >
            </li>
          </ul>
        </div> -->
        <argon-button
          class="btn-icon ms-2 export"
          size
          color="white"
          variant="outline"
        >
        <span class="btn-inner--icon">
            <i class="ni ni-archive-2"></i>
          </span>
          <span class="btn-inner--text" @click="exportCDefine">导出CDefine</span>
        </argon-button>

        <argon-button
          class="btn-icon ms-2 export"
          size
          color="white"
          variant="outline"
          @click="exportDialogExcelVisible=true"
        >
          <span class="btn-inner--icon">
            <i class="ni ni-archive-2"></i>
          </span>
          <span class="btn-inner--text">导出Excel</span>
        </argon-button>
        <el-dialog v-model="exportDialogExcelVisible" class="dialogLarge" title="导出" append-to-body :destroy-on-close="true">
          <el-input v-model="start_addr" filterable placeholder="请输入起始地址" style="width: 200px;">
          </el-input>
          <el-button type="primary" style="margin-left: 10px;padding: 10px;" @click="downloadReg" >导出</el-button>
          <!-- <div id="bodyContainer"></div> -->
        </el-dialog>


        <argon-button
          class="btn-icon ms-2 export"
          size
          color="white"
          variant="outline"
          @click="exportDialogVisible=true"
        >
          <span class="btn-inner--icon">
            <i class="ni ni-archive-2"></i>
          </span>
          <span class="btn-inner--text">导出/预览</span>
        </argon-button>
        <el-dialog v-model="exportDialogVisible" class="dialogLarge" title="导出/预览" append-to-body :destroy-on-close="true">
          <p>IP描述</p>
          <div style="padding-bottom: 10px;">
            <el-select v-model="ip_page_file_uuid" filterable placeholder="请选择ip描述">
            <el-option v-for="(item,index) in ip_page_list" :key="index" :label="item.name" :value="item.file_uuid">
              {{ item.name+"("+item.version+")" }}
            </el-option>
            </el-select>
            <el-button :disabled="isIpPageExportDisabled" type="primary" style="margin-left: 10px;" @click="generate(true,true)" >预览</el-button>
            <el-button :disabled="isIpPageExportDisabled" type="primary" style="margin-left: 10px;" @click="generate(false,true)" >导出</el-button>
          </div>
          <p>寄存器列表</p>
          <div>
            <el-select v-model="file_uuid" filterable placeholder="请选择spec模版">
            <el-option v-for="(item,index) in template_file_list" :key="index" :label="item.name" :value="item.file_uuid">
              {{ item.name }}
            </el-option>
            </el-select>
            <el-button :disabled="isExportDisabled" type="primary" style="margin-left: 10px;" @click="generate(true,false)" >预览</el-button>
            <el-button :disabled="isExportDisabled" type="primary" style="margin-left: 10px;" @click="generate(false,false)" >导出</el-button>
          </div>

          <!-- <div id="bodyContainer"></div> -->
        </el-dialog>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="card mt-4">
          <div class="container-fluid">
            <el-table
              ref="multipleTableRef"
              :key="category_ip"
              class="table table-flush "
              :data="category_ip"
              max-height="658px"
              style="width: 100%"
              empty-text = ""
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection"/>
              <el-table-column v-for="(col, idx) in columnList" :key="col.prop" :index="idx" :width="col.width" show-overflow-tooltip>
                <!-- 行的内容-->
                <template #header>
                  {{ col.label }}
                </template>
                <!-- 列的内容-->
                <template #default="scope">
                  <div v-if="col.prop==='create_user'" class="d-flex align-items-center">
                    <div class="avatar avatar-xs me-2 bg-gradient-dark " >
                        <span>{{scope.row[col.prop][0]}}</span>
                      </div>
                      {{ scope.row[col.prop] }}
                  </div>
                  <div v-else-if="col.prop==='tags'">
                    <div v-if="typeof(scope.row[col.prop])==='string'">
                      <el-tag v-for="item in scope.row[col.prop].split(',')" :key="item" class="mx-1">
                        {{ item }}
                      </el-tag>
                    </div>
                  </div>
                  <div v-else-if="col.prop==='status'" class="d-flex align-items-center">
                    <!-- <argon-button 
                      variant="outline"
                      class="btn-icon-only btn-rounded mb-0 me-2 btn-sm d-flex align-items-center justify-content-center"
                      :color="addclassStatus(scope.row[col.prop])"
                      >
                      <i class="fas" :class="addclassButton(scope.row[col.prop])" aria-hidden="true"></i>
                    </argon-button> -->
                    <span>{{ scope.row[col.prop] }}</span>
                  </div>
                  <div v-else>
                    {{ scope.row[col.prop] }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Actions" >
                <template #default="scope">
                  <el-button 
                    v-if="current_user==='admin'||scope.row.create_user===current_user" 
                    v-permission="['admin','edit','create','delete']" 
                    type="primary" 
                    text 
                    @click="editRow(scope.row,scope.$index)">Edit</el-button>
                  <el-button type="primary" text @click="entryRegGather(scope.row)">Enter</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-dialog v-model="dialogFormVisible" title="IP Info">
              <el-form :model="editData" >
                <el-form-item label="IP Name" :label-width="formLabelWidth">
                  <el-input v-model="editData.ip_name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Status" :label-width="formLabelWidth">
                  <el-select v-model="editData.status" placeholder="Please select a zone">
                    <el-option value="Progress">进行中</el-option>
                    <el-option value="Completed">完成</el-option>
                    <el-option value="Canceled">中止</el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Version" :label-width="formLabelWidth">
                  <el-input v-model="editData.version" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Child Version" :label-width="formLabelWidth">
                  <el-input v-model="editData.child_version" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Child Category" :label-width="formLabelWidth">
                  <el-select v-model="editData.category" style="width: 100%">
                  <!-- <el-option label="Interface" value="Interface" /> -->
                  <el-option v-for="(item,index) in category_list" :key="index" :label=item.category :value=item.category></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="Description" :label-width="formLabelWidth">
                  <el-input v-model="editData.description" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Tags" :label-width="formLabelWidth">
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
                </el-form-item>
                <el-form-item label="Permission" :label-width="formLabelWidth">
                  <el-tag v-for="seePer in see_permission" :key="seePer">{{seePer}}</el-tag>
                  <el-button class="button-new-tag ml-1" size="small" @click="dialogPermissionVisible = true">add</el-button>
                </el-form-item>
              </el-form>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">Cancel</el-button>
                  <el-button type="primary" @click="handleEdit()">
                    Confirm
                  </el-button>
                </span>
              </template>
            </el-dialog>
            <el-dialog
              v-model="dialogPermissionVisible"
              title="Tips"
              width="40%"
            >
              <el-transfer v-model="see_permission" :data="userData" />
            </el-dialog>
            <el-dialog v-model="PerviewDisable" titile="预览" class="dialogLarge"  :lock-scroll="true" width="60%" append-to-body :destroy-on-close="true">
                <div id="bodyContainer">
                </div>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { DataTable } from "simple-datatables";
import ArgonButton from "@/components/ArgonButton.vue";
import { mapState } from 'vuex';
import { getIpListApi,deleteIp,getIpPageFileApi,perviewIpPageFileApi} from "@/http/api/ip"
import { getCategoryApi } from "@/http/api/category"
import { getRegGatherList } from "@/http/api/reggather"
import { editIpVersion } from '@/http/api/ip';
import { v4 as uuidv4 } from 'uuid';
import { mapMutations } from 'vuex';
import { getSingleList } from "@/http/api/singlereg";
import { getValueList} from "@/http/api/value";
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs} from "file-saver";
import {getTemplateFileApi} from "@/http/api/template_file";
import { ElMessage } from 'element-plus';
import { renderAsync } from "docx-preview";
import ExcelJS from "exceljs";
import { getCategoryListApi } from "../../../http/api/ip";


export default {
  name: "OrderList",
  components: {
    ArgonButton,
    // ArgonCheckbox,
  },

  data() {
    return {
      current_user:localStorage.getItem('user'),
      bankendServeIP:localStorage.getItem("backendIp")+"ip/upload_file/",
      reg_gather_list:[],
      ip_page_list:[],
      selList:[],
      userData:[],
      columnList: [
        { prop: "ip_name", label: 'IpName' },
        { prop: "version", label: 'Version/Chip',width:'130px' },
        // { prop: "start_date",label:'StartDate' },
        { prop: "status", label: 'Status' },
        { prop: "description", label: 'Description' },
        { prop: "create_user", label: 'CreateUser' },
        { prop: "category", label: 'Category',width:'100px' },
        { prop: "child_version", label: 'Child Version',width:'120px' },
        { prop: "tags", label: 'Tags' },
      ],
      dynamicTags: [],
      see_permission: [],
      inputVisible: false,
      inputValue: '',
      dialogVisible: false,
      dialogFormVisible:false,
      dialogPermissionVisible: false,
      exportDialogVisible:false,
      exportDialogExcelVisible:false,
      fileList: [],
      formLabelWidth :'140px',
      editData:{},
      currentRowIndex:"",
      oldCategory:"",
      oldVersion:"",
      oldChildVersion:"",
      uploadData: {
        ip_uuid: "",
      },
      file_uuid:"",
      ip_page_file_uuid:"",
      start_addr:"",
      condition:true,
      exportCondition:true,
      exportConditionIpPage:true,
      isExport:false,
      docxOptions: {
        className: "kaimo-docx-666", // string：默认和文档样式类的类名/前缀
        inWrapper:  true, // boolean：启用围绕文档内容的包装器渲染
        ignoreWidth: false, // boolean：禁用页面的渲染宽度
        ignoreHeight: false, // boolean：禁止渲染页面高度
        ignoreFonts: false, // boolean：禁用字体渲染
        breakPages: true, // boolean：在分页符上启用分页
        ignoreLastRenderedPageBreak: true, // boolean：在 lastRenderedPageBreak 元素上禁用分页
        experimental: false, // boolean：启用实验功能（制表符停止计算）
        trimXmlDeclaration: true, 
        useBase64URL: false, // boolean：如果为true，图片、字体等会转为base 64 URL，否则使用URL.createObjectURL
        useMathMLPolyfill: false, // boolean：包括用于 chrome、edge 等的 MathML polyfill。
        showChanges: false, // boolean：启用文档更改的实验性渲染（插入/删除）
        debug: false, // boolean：启用额外的日志记录
      },
      PerviewDisable:false,
      reg_hex: {
        1: "0x01",
        2: "0x03",
        3: "0x07",
        4: "0x0F",
        5: "0x1F",
        6: "0x3F",
        7: "0x7F",
        8: "0xFF",
        9: "0X1FF",
        10: "0x3FF",
        11: "0x7FF",
        12: "0xFF",
        13: "0X1FFF",
        14: "0X3FFF",
        15: "0X7FFF",
        16: "0xFFF",
        17: "0x1FFFF",
        18: "0x3FFFF",
        19: "0X7FFFF",
        20: "0XFFFF",
        21: "0X1FFFFF",
        22: "0x3FFFFF",
        23: "0X7FFFFF",
        24: "0xFFFFF",
        25: "0X1FFFFFF",
        26: "0X3FFFFFF",
        27: "0X7FFFFFF",
        28: "0XFFFFFF",
        29: "0x1FFFFFFF",
        30: "0x3FFFFFFF",
        31: "0x7FFFFFFF",
        32: "0XFFFFFFF",
      }
    }
  },

  //关联vuex获取数据
  computed:{
    ...mapState('IP',['category_ip']),
    ...mapState('IP',['ip_lists']),
    ...mapState('template_file',['template_file_list']),
    ...mapState('user',['userlist']),
    ...mapState('category',['category_list']),
    isDisabled() {
      return this.condition; // 根据条件动态返回禁用状态
    },
    isExportDisabled(){
      return this.exportCondition;
    },
    isIpPageExportDisabled(){
      return this.exportConditionIpPage
    }
  },

  watch:{
    'uploadData.ip_uuid'(newValue){
      if(newValue){
        this.condition=false
      }
    },
    'file_uuid'(newValue){
      if(newValue){
        this.exportCondition=false
      }
    },
    'ip_page_file_uuid'(newValue){
      if(newValue){
        this.exportConditionIpPage=false
      }
    }
  },

  created(){
    this.generateData()
    getCategoryApi().then((res)=>{
      this.$store.commit('category/getCategoryList',res)
    })
  //   window.addEventListener('beforeunload', () => {
  //     sessionStorage.setItem('list', JSON.stringify(this.$store.state))
  //   })
  //   try {
  //     sessionStorage.getItem('list') && this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('list'))))
  //   } catch (err) {
  //     console.log(err)
  //   }
  //   sessionStorage.removeItem('list')
  // },

    // getCategoryIPApi(this.$route.params.category,this.$route.params.ip_name).then((res)=>{ 
    //   this.$store.commit('IP/getCategoryIpList',res)
    // })
    // getIpList().then((res)=>{
    //     this.$store.commit('IP/getIpList',res)
    //   })
  },

  // mounted() {
  //   if (document.getElementById("order-list")) {
  //     const dataTableSearch = new DataTable("#order-list", {
  //       searchable: true,
  //       fixedHeight: false,
  //       perPageSelect: false,
  //     });

  //     document.querySelectorAll(".export").forEach(function (el) {
  //       el.addEventListener("click", function (el) {
  //         var type = el.dataset.type;

  //         var data = {
  //           type: type,
  //           filename: "soft-ui-" + type,
  //         };

  //         if (type === "csv") {
  //           data.columnDelimiter = "|";
  //         }

  //         dataTableSearch.export(data);
  //       });
  //     });
  //   }
  // },
  methods:{

    // addclassStatus(i){
    //   switch(i){
    //     case "Canceled" :return 'danger';
    //     case "Progress" :return 'dark';
    //     case "Completed" :return 'success';
    //   }
    // },

    // addclassButton(i){
    //   switch(i){
    //     case "Canceled" :return 'fa-times';
    //     case "Progress" :return 'fa-undo';
    //     case "Completed" :return 'fa-check';
    //   }
    // },

    //跳转进入寄存器集合
    entryRegGather(row){
      this.$store.commit('IP/setCurrentIpUuid',row.ip_uuid)
      this.$router.push({
        path:'/pages/projects/general',
        name: "General",
        params:{
          ip_uuid:row.ip_uuid
        },
      })
    },

    handleSelectionChange(selVal){
      // 获取选中的数据,数组
      this.selList = selVal
      this.getExportData()
      // console.log(this.selList)

    },

    // 删除选中的数据
    async deleteIpAll(){
      for(var i in this.selList){
        deleteIp(this.selList[i].ip_uuid)
        if(this.category_ip.length==1){
          // console.log("this.selList[i]",this.selList[i].ip_name)
          let tempObj = {}
          tempObj.category = this.selList[i].category
          tempObj.ip_name = this.selList[i].ip_name
          tempObj.version = this.selList[i].version
          this.$store.commit('IP/deleteAllCategoryList',tempObj)
          this.$router.push({
            path:"/pages/profile/projects",
            name: "All Projects"
          })
        }
        const index = this.category_ip.findIndex((item) => item.ip_uuid === this.selList[i].ip_uuid);
        if (index !== -1) {
          this.category_ip.splice(index, 1);
        }
      }
      await getIpListApi().then((res)=>{
        this.$store.commit('IP/getIpList',res)
      })
      // await getCategoryIP().then((res)=>{
      //   this.$store.commit('IP/getCategoryIpList',res)
      // })
    },


    compareDesc(p){ //这是比较函数
      return function(m,n){
          var a = m[p];
          var b = n[p];
          return  b - a; //降序
      }
    },

    compareAsc(p){ //这是比较函数
      return function(m,n){
          var a = parseInt(m[p],16);
          var b = parseInt(n[p],16);
          return  a - b; //降序
      }
    },

    getExportData(){
      this.reg_gather_list = []
      for (var idx in this.selList) {
        getRegGatherList(this.selList[idx].ip_uuid).then((res) => {
          for (var i = 0; i < res.length; ++i) {
            let regGatherTemp = {}
            let single_reg_list = []
            for (var key in res[i]) {
              regGatherTemp[key] = res[i][key]
            }
            getSingleList(res[i].reg_gather_uuid).then((res) => {
              for (var j = 0; j < res.length; ++j) {
                let singelRegTemp = {}
                for (var key in res[j]) {
                  singelRegTemp[key] = res[j][key]
                }
                let value_list = []
                getValueList(res[j].single_reg_uuid).then((res) => {
                  for (var k = 0; k < res.length; ++k) {
                    let valueTemp = {}
                    for (var key in res[k]) {
                      valueTemp[key] = res[k][key]
                    }
                    value_list.push(valueTemp)
                  }
                })
                singelRegTemp.values = value_list
                single_reg_list.push(singelRegTemp)
                single_reg_list.sort(this.compareDesc("start_bit"))
              }
            })
            regGatherTemp.singleReg = single_reg_list
            this.reg_gather_list.push(regGatherTemp)
            this.reg_gather_list.sort(this.compareAsc("offset"))
          }
        })
        getIpPageFileApi(this.selList[idx].ip_uuid).then((res)=>{
          this.ip_page_list = res
        })
      }
    },

    //上传文件
    beforeUpload(file) {
      // console.log("hello")
      // console.log("file",file)
      this.fileList.push(file)
      // console.log(this.fileList[0])
      // 返回 false 可取消上传
      return true;
    },
    

    handleUploadSuccess() {
      this.$message.success('上传成功')
      this.dialogVisible=false
    },

    handleUploadError(error) {
      console.error(error);
    },
    
    
    editRow(row,index){
      this.oldCategory = row.category
      this.oldVersion  = row.version
      this.oldChildVersion = row.child_version
      this.editData = {...row}
      if(this.editData.tags){
        this.dynamicTags=this.editData.tags.split(',')
      }
      if(this.editData.see_permission){
        this.see_permission=this.editData.see_permission.split(',')
      }
      this.dialogFormVisible=true
      this.currentRowIndex = index
    },

    //创建新的版本
    createNewVersion(){
      for(var i in this.selList){
        let ipInfoTemp = {}
        let ip_uuid_temp = uuidv4()
        let old_ip_uuid = this.selList[i]["ip_uuid"]
        for(var k in this.selList[i]){
          if(k!="id"){
            if(k=="ip_uuid"){
              ipInfoTemp[k] = ip_uuid_temp
            }else if(k=="child_version"){
              if(this.selList[i]["private_project"]===true){
                if(this.selList[i][k]){
                  let pattern = /^[a-zA-Z]+$/i;
                  if(pattern.test(this.selList[i][k])){
                    ipInfoTemp[k] = String.fromCharCode(this.selList[i][k].charCodeAt(0)+1)
                  }
                }
              }else{
                ipInfoTemp[k] = this.selList[i][k]
              }
            }else if(k=="version"){
              if(this.selList[i]["private_project"]===false){
                if(this.selList[i][k].indexOf('v')!==-1||this.selList[i][k].indexOf('V')!==-1){
                  ipInfoTemp[k] = "v"+(parseFloat((this.selList[i][k].match(/\d+(\.\d+)?/)[0])*10+1)/10).toString();
                }
              }else{
                ipInfoTemp[k] = this.selList[i][k]
              }
            }else{
              ipInfoTemp[k] = this.selList[i][k]
            }
          }
        }
        
        getRegGatherList(old_ip_uuid).then((res)=>{
          for(var i in res){
            let reg_gather_uuid_temp = uuidv4()
            let gatherObjTemp = {}
            let old_reg_gather_uuid = res[i]["reg_gather_uuid"]
            for(var j in res[i]){
              if(j!="id"){
                if(j=="ip_uuid"){
                  gatherObjTemp[j] = ip_uuid_temp
                }else if(j=="reg_gather_uuid"){
                  gatherObjTemp[j] = reg_gather_uuid_temp
                }else{
                  gatherObjTemp[j] = res[i][j]
                }
              }
            }
            this.addReg(gatherObjTemp)

            getSingleList(old_reg_gather_uuid).then((res)=>{
              for(var b in res){
                let single_reg_uuid_temp = uuidv4()
                let singleObjTemp = {}
                let old_single_reg_uuid = res[b]["single_reg_uuid"]
                for(var y in res[b]){
                  if(y!="id"){
                    if(y=="reg_gather_uuid"){
                      singleObjTemp[y] = reg_gather_uuid_temp
                    }else if(y=="single_reg_uuid"){
                      singleObjTemp[y] = single_reg_uuid_temp
                    }else{
                      singleObjTemp[y] = res[b][y]
                    }
                  }
                }
                this.addSingle(singleObjTemp)

                getValueList(old_single_reg_uuid).then((res)=>{
                  for(var f in res){
                    let value_uuid_temp = uuidv4()
                    let valueObjTemp = {}
                    for(var q in res[f]){
                      if(q!="id"){
                        if(q=="single_reg_uuid"){
                          valueObjTemp[q] = single_reg_uuid_temp
                        }else if(q == "value_uuid"){
                          valueObjTemp[q] = value_uuid_temp
                        }else{
                          valueObjTemp[q] = res[f][q]
                        }
                      }
                    }
                    this.addVal(valueObjTemp)
                  }
                })
              }
            })
          }
        })
        this.addNewIP(ipInfoTemp);
        this.$refs.multipleTableRef.clearSelection()
        this.selList = []
      }
    },


        //获取种类列表
    getCategoryList(list){
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
        // allCategoryList_temp = JSON.parse(JSON.stringify(tempAllCategoryList.filter((item, index) => tempAllCategoryList.findIndex(i => i.category === item.category) === index)))
        // localStorage.setItem('allCategoryListVuex',JSON.stringify(allCategoryList_temp))
        this.$store.commit('IP/allCategoryList',allCategoryList_temp)
      }
    },
    
    //修改ip
    handleEdit(){
      // console.log(this.editData)
      if(this.dynamicTags.length>0){
        this.editData.tags = this.dynamicTags.join()
      }else{
        this.editData.tags = null
      }
      if(this.see_permission.length>0){
        this.editData.see_permission = this.see_permission.join()
      }else{
        this.editData.see_permission = null
      }
      if(this.editData.private_project===false){
        if(this.editData.version!=this.oldVersion){
          var res =this.category_ip.some((item)=>{
            if(item.version===this.editData.version && item.ip_name === this.editData.ip_name){
                return true
              }
          })
          if(res){
            alert("相同版本已存在");
          }else{
            editIpVersion(this.editData.ip_uuid,this.editData)
            this.category_ip.splice(this.currentRowIndex,1,this.editData)
            this.dialogFormVisible=false
            this.ip_lists.splice(this.currentRowIndex,1,this.editData)
            this.$message.success('修改成功')
          }
        }else{
          editIpVersion(this.editData.ip_uuid,this.editData)
          this.category_ip.splice(this.currentRowIndex,1,this.editData)
          this.dialogFormVisible=false
          this.ip_lists.splice(this.currentRowIndex,1,this.editData)
          this.$message.success('修改成功')
        }
      }else{
        if(this.editData.child_version!=this.oldChildVersion){
          var result = this.category_ip.some((item)=>{
            if(item.child_version===this.editData.child_version && item.ip_name === this.editData.ip_name && item.version===this.editData.version){
              return true
            }
          })
          if(result){
            alert("相同子版本已存在");
          }else{
            editIpVersion(this.editData.ip_uuid,this.editData)
            this.category_ip.splice(this.currentRowIndex,1,this.editData)
            this.dialogFormVisible=false
            this.ip_lists.splice(this.currentRowIndex,1,this.editData)
            this.$message.success('修改成功')
          }
        }else{
          editIpVersion(this.editData.ip_uuid,this.editData)
          this.category_ip.splice(this.currentRowIndex,1,this.editData)
          this.dialogFormVisible=false
          this.ip_lists.splice(this.currentRowIndex,1,this.editData)
          this.$message.success('修改成功')
        }
      }

      if(this.editData.category!=this.oldCategory){
        this.getCategoryList(this.ip_lists)
      }
      // const index = this.allCategoryListVuex.findIndex((item)=>item.category===this.editData.category)
      // if(index===-1){
      //   const tempObj = {category:this.editData.category,versionList:[{ipName:this.editData.ip_name,seePemission:this.editData.see_permission}]}
      //   this.allCategoryListVuex.push(tempObj)
      // }else{
      //   this.allCategoryListVuex[index].versionList.push({ipName:this.editData.ip_name,seePemission:this.editData.see_permission})
      // }
      // console.log(this.allCategoryListVuex)
    },

    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(()=> {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },


    replaceErrors(key, value) {
      if (value instanceof Error) {
        return Object.getOwnPropertyNames(value).reduce(function (
          error,
          key
        ) {
          error[key] = value[key];
          return error;
        },
        {});
      }
      return value;
    },

    //加载word文档数据
    loadDocxFun(response,data_list,isPeriview,docName,isHeader){
      var reader = new FileReader();
      const templateContent = response;
      reader.readAsBinaryString(templateContent);

      reader.onerror = function (evt) {
        console.log("error reading file", evt);
        alert("error reading file" + evt);
      };
      reader.onload = function (evt) {
        const content = evt.target.result;
        var zip = new PizZip(content);
        var doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        if(!isHeader){
          doc.setData({
                // ...this.reg_gather_list,
                list: data_list
              });
        }
   
        try {
          // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
          doc.render();
        } catch (error) {
          // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).

          console.log(JSON.stringify({ error: error }, this.replaceErrors));

          if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors
              .map(function (error) {
                return error.properties.explanation;
              })
              .join('\n');
            console.log('errorMessages', errorMessages);
            // errorMessages is a humanly readable message looking like this :
            // 'The tag beginning with "foobar" is unopened'
          }
          throw error;
        }
        // 进行渲染和预览
        var blob = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          compression: "DEFLATE",
        });
        if(isPeriview){
          // Output the document using Data-URI
          // 将file转为buffer
          let fr = new FileReader();
          fr.readAsBinaryString(blob)
          // fr.readAsArrayBuffer(file);
          fr.addEventListener("loadend",(e) => {
              console.log("loadend---->", e)
              let buffer = e.target.result;
              // let bodyContainer = document.getElementById("Container");
              let bodyContainer = document.getElementById("bodyContainer");
              renderAsync(
                  buffer, // Blob | ArrayBuffer | Uint8Array, 可以是 JSZip.loadAsync 支持的任何类型
                  bodyContainer, // HTMLElement 渲染文档内容的元素,
                  null, // HTMLElement, 用于呈现文档样式、数字、字体的元素。如果为 null，则将使用 bodyContainer。
                  this.docxOptions // 配置
              ).then(res => {
                  console.log("res---->", res)
              })
          },false);
        }else{
          saveAs(blob, `${docName}.docx`);
        }
      }
    },

    //读取word模版并插入数据
    generate(isPeriview,isHeader) {
      if (this.selList.length != 0) {
        for (var i in this.selList) {
          let docName = `${this.selList[i].ip_name}(${this.selList[i].version})`
          if(isHeader){
            docName=docName+"_HEADER"
          }
          const temp_list = this.reg_gather_list.filter(item => item.ip_uuid === this.selList[i].ip_uuid)
          if (temp_list.length>0) {
            if(isPeriview){
              this.PerviewDisable = true
            }
            if(!isHeader){
              getTemplateFileApi(this.file_uuid).then(response => {
                this.loadDocxFun(response,temp_list,isPeriview,docName,isHeader)
              })
            }else{
              perviewIpPageFileApi(this.ip_page_file_uuid).then(response => {
                this.loadDocxFun(response,temp_list,isPeriview,docName,isHeader)
              })
            }

          }else{
            ElMessage({
              showClose: true,
              message: '无寄存器',
              type: 'error',
            })
          }
        }
      }else{
        ElMessage({
          showClose: true,
          message: '请选择IP',
          type: 'error',
        })
      }

        // var test_list = this.reg_gather_list
        // var docs = document.getElementById("doc");
        

        // if (docs.files.length === 0) {
        //     alert("No files selected");
        // }
        // var reader = new FileReader();
        
        // reader.readAsBinaryString(docs.files.item(0));
        // // if (this.fileList[0].length === 0) {
        // //     alert("No files selected");
        // // }
        // // reader.readAsBinaryString(this.fileList[0]);

        // reader.onerror = function (evt) {
        //     console.log("error reading file", evt);
        //     alert("error reading file" + evt);
        // };
        // reader.onload = function (evt) {
        //     const content = evt.target.result;
        //     var zip = new PizZip(content);
        //     var doc = new Docxtemplater(zip, {
        //         paragraphLoop: true,
        //         linebreaks: true,
        //     });
        //     console.log(content)
        //     doc.setData({
        //       // ...this.reg_gather_list,
        //       list:test_list
        //    });
        //   try {
        //     // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        //     doc.render();
        //   } catch (error) {
        //     // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).

        //     console.log(JSON.stringify({ error: error }, this.replaceErrors));

        //     if (error.properties && error.properties.errors instanceof Array) {
        //       const errorMessages = error.properties.errors
        //         .map(function (error) {
        //           return error.properties.explanation;
        //         })
        //         .join('\n');
        //       console.log('errorMessages', errorMessages);
        //       // errorMessages is a humanly readable message looking like this :
        //       // 'The tag beginning with "foobar" is unopened'
        //     }
        //     throw error;
        //   }

        //     // // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
        //     // doc.render({
        //     //   //数据重新替换
        //     //     first_name: "John",
        //     //     last_name: "Doe",
        //     //     phone: "0652455478",
        //     //     description: "New Website",
        //     // });
        //     // 进行渲染和预览
        //     var blob = doc.getZip().generate({
        //         type: "blob",
        //         mimeType:
        //             "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        //         // compression: DEFLATE adds a compression step.
        //         // For a 50MB output document, expect 500ms additional CPU time
        //         compression: "DEFLATE",
        //     });
        //     // console.log(doc.getFullText())
        //     // Output the document using Data-URI
        //     saveAs(blob, "output.docx");
        // };
    },


    // exportDocx() {
    //   if (this.selList.length != 0) {
    //     for (var i in this.selList) {
    //       const temp_list = this.reg_gather_list.filter(item => item.ip_uuid === this.selList[i].ip_uuid)
    //       if (temp_list.length > 0) {
    //         getTemplateFileApi(this.file_uuid).then(response => {
    //           var reader = new FileReader();
    //           const templateContent = response;
    //           reader.readAsBinaryString(templateContent);
    //           reader.onerror = function (evt) {
    //             console.log("error reading file", evt);
    //             alert("error reading file" + evt);
    //           };
    //           reader.onload = function (evt) {
    //             const content = evt.target.result;
    //             var zip = new PizZip(content);
    //             var doc = new Docxtemplater(zip, {
    //               paragraphLoop: true,
    //               linebreaks: true,
    //             });
    //             doc.setData({
    //               // ...this.reg_gather_list,
    //               list: temp_list
    //             });
    //             try {
    //               // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
    //               doc.render();
    //             } catch (error) {
    //               // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).

    //               console.log(JSON.stringify({ error: error }, this.replaceErrors));
    //               if (error.properties && error.properties.errors instanceof Array) {
    //                 const errorMessages = error.properties.errors
    //                   .map(function (error) {
    //                     return error.properties.explanation;
    //                   })
    //                   .join('\n');
    //                 console.log('errorMessages', errorMessages);
    //                 // errorMessages is a humanly readable message looking like this :
    //                 // 'The tag beginning with "foobar" is unopened'
    //               }
    //               throw error;
    //             }
    //             // 进行渲染和预览
    //             var blob = doc.getZip().generate({
    //               type: "blob",
    //               mimeType:
    //                 "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    //               compression: "DEFLATE",
    //             });
    //             // console.log(doc.getFullText())
    //             // Output the document using Data-URI
    //             // 将file转为buffer
    //             const docName = `${this.selList[i].ip_name}(${this.selList[i].version})`
    //             saveAs(blob, `${docName}.docx`);
    //           }
    //         })

    //       } else {
    //         ElMessage({
    //           showClose: true,
    //           message: 'There is no Reg.',
    //           type: 'error',
    //         })
    //       }
    //     }
    //   } else {
    //     ElMessage({
    //       showClose: true,
    //       message: 'There is no tick IP.',
    //       type: 'error',
    //     })
    //   }
    // },

    ...mapMutations('IP',['addNewIP']),
    ...mapMutations('reg_gather',['addReg']),
    ...mapMutations('single_reg',['addSingle']),
    ...mapMutations('value',['addVal']),

    handlePreview() {
      let file = document.getElementById("file").files[0];
      // 将file转为buffer
      let fr = new FileReader();
      fr.readAsArrayBuffer(file);
      fr.addEventListener("loadend", (e) => {
        console.log("loadend---->", e)
        let buffer = e.target.result;
        this.docxRender(buffer);
      }, false);
    },
    // 渲染docx
    docxRender(buffer) {
      let bodyContainer = document.getElementById("bodyContainer");
      renderAsync(
        buffer, // Blob | ArrayBuffer | Uint8Array, 可以是 JSZip.loadAsync 支持的任何类型
        bodyContainer, // HTMLElement 渲染文档内容的元素,
        null, // HTMLElement, 用于呈现文档样式、数字、字体的元素。如果为 null，则将使用 bodyContainer。
        this.docxOptions // 配置
      ).then(res => {
        console.log("res---->", res)
      })
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
    },

    letterAddition(letter, number) {
      const charCode = letter.charCodeAt(0); // 获取字母的编码值
      const sum = charCode + number; // 字母的编码值加上数字
      const result = String.fromCharCode(sum); // 将结果转换为对应的字符
      return result;
    },

    // exportExcel() {
    //   // 创建工作簿
    //   const _workbook = new ExcelJS.Workbook();
    //   // 递归函数，用于展平嵌套对象
    //   function flattenObject(obj, prefix = '') {
    //     const flattened = {};
    //     for (const key in obj) {
    //       if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
    //         const nestedObj = flattenObject(obj[key], prefix + key + '_');
    //         Object.assign(flattened, nestedObj);
    //       } else {
    //         flattened[prefix + key] = obj[key];
    //       }
    //     }
    //     return flattened;
    //   }

    //   for (var i in this.selList) {
    //     // 添加工作表
    //     const worksheet = _workbook.addWorksheet(this.selList[i].ip_name+"("+this.selList[i].version+")");

    //     const temp_list = this.reg_gather_list.filter(item=>item.ip_uuid===this.selList[i].ip_uuid)
    //     // //过滤条件
    //     // const regGatherFields = ["reg_gather_name","address","reg_ram","retention","field"]
    //     // const singleFields = ["field","start_bit","end_bit"]

    //     // // 过滤出符合条件的数据
    //     // const filteredData = this.reg_gather_list.map(row => {
    //     //   const filteredRow = {};
    //     //   const singleReg = []
    //     //   regGatherFields.forEach(field => {
    //     //     filteredRow[field] = row[field];
    //     //   });
    //     //   if (row.singleReg.length > 0) {
    //     //     row["singleReg"].map(row => {
    //     //       const tempFilteredRow = {}
    //     //       singleFields.forEach(field2 => {
    //     //         tempFilteredRow[field2] = row[field2];
    //     //       });
    //     //       singleReg.push(tempFilteredRow)
    //     //     })
    //     //   }
    //     //   filteredRow.singleReg=singleReg
    //     //   console.log(filteredRow)
    //     //   return filteredRow;
    //     // });
    //     //   // 设置表头
    //     // const headers = ["reg_gather_name","field","start_bit","end_bit","address","reg_ram","retention","field"]
    //     // _sheet1.addRow(headers);

    //     // //填充数据
    //     // filteredData.forEach(row => {
    //     //   const rowData = Object.values(row);
    //     //   _sheet1.addRow(rowData);
    //     //   if(row.singleReg.length>0){
    //     //     row.singleReg.forEach(row2 => {
    //     //       const rowData2 = Object.values(row2)
    //     //       _sheet1.addRow(rowData2);
    //     //     })
    //     //   }
    //     // });

    //     //++++++++++++++++++++++++++++++

    //     // 获取所有字段
    //     // const fields = Array.from(new Set(this.reg_gather_list.flatMap(obj => Object.keys(flattenObject(obj)))));
    //     const fields = ["reg_gather_name", "field", "start_bit", "end_bit", "description", "address", "reg_ram", "retention"]

    //     worksheet.columns = [
    //       { header: 'RegName', key: fields[0], width: 10 },
    //       { header: 'Sub Reg Name', key: fields[1], width: 10 },
    //       { header: 'StartBit', key: 'start_bit', width: 10 },
    //       { header: 'reg/ram', key: 'reg_ram', width: 10 },
    //       { header: 'Retention', key: 'retention', width: 10 },
    //     ];

    //     // 设置表头
    //     const headerTitle = worksheet.addRow([this.selList[i].ip_name+" List"]);
    //     // const headerRow = worksheet.addRow(fields);
    //     // 设置表头行样式
    //     headerTitle.font = { bold: true, color: { argb: '00000000' } }; // 加粗并设置为黑色
    //     // headerRow.font = { bold: true, color: { argb: '00000000' } }; // 加粗并设置为黑色
    //     headerTitle.alignment = { vertical: 'middle', horizontal: 'center' };
    //      // 合并单元格
    //     worksheet.mergeCells('A1:'+this.letterAddition('A',fields.length)+'1'); // 合并第一行的所有列

    //     const singleFields = ["field", "start_bit", "end_bit","description"]

    //     // 填充数据
    //     temp_list.forEach(obj => {
    //       const flattenedObj = flattenObject(obj);
    //       const rowData = fields.map(field => flattenedObj[field]);
    //       worksheet.addRow(rowData);
    //       if (flattenedObj.singleReg.length > 0) {
    //         flattenedObj.singleReg.forEach(obj => {
    //           const flattenedObj = flattenObject(obj);
    //           const rowData = singleFields.map(field => flattenedObj[field]);
    //           rowData.unshift(" ")
    //           worksheet.addRow(rowData);
    //         })
    //       }
    //     });
    //   }   

    //   // 导出表格
    //   _workbook.xlsx.writeBuffer().then((buffer) => {
    //     let _file = new Blob([buffer], {
    //       type: "application/octet-stream",
    //     });
    //     saveAs(_file, "ExcelJS.xlsx");
    //   });

    // }


    exportFile(workbook,header, columns, dataList, expertName, sheetName) {
      workbook.created = new Date()
      workbook.modified = new Date()
      let worksheet = workbook.addWorksheet(sheetName)
      worksheet.properties.defaultColWidth = 14
      worksheet.columns = columns
      // 设置表头
      worksheet.getRow(1).values = [expertName+" List"]
      worksheet.mergeCells(1, 1, 1, columns.length) //第1行  第1列  合并到第1行的第n列
      const title = worksheet.getRow(1).getCell(1)//第一行第一个单元格
      title.font = { size: 24 }
      worksheet.getRow(1).height = 40
 
      worksheet.getRow(2).values = header
      // 表头样式
      worksheet.getRow(2).eachCell({ includeEmpty: true }, (cell, colNumber) => {
        // worksheet.getRow(2).getCell(colNumber).fill = {
        //   type: 'pattern',
        //   pattern: 'solid',
        // }
        worksheet.getRow(2).getCell(colNumber).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
        worksheet.getRow(2).getCell(colNumber).font = {
          bold: true, 
          color: { argb: '00000000' },
          size:10
        }
      })
 
      worksheet.addRows(dataList)
      // 自定义样式
      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber > 1) {
          worksheet.getRow(rowNumber).height = 28.6
        }
        worksheet.getRow(rowNumber).eachCell({ includeEmpty: true }, (cell, colNumber) => {
          // 文字居中
          worksheet.getRow(rowNumber).getCell(colNumber).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          }
          //边框样式
          worksheet.getRow(rowNumber).getCell(colNumber).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          }
        })
      })

    },

    downloadReg() {
      if (this.selList.length != 0) {
        let workbook = new ExcelJS.Workbook()
        for (var i in this.selList) {
          const temp_list = this.reg_gather_list.filter(item => item.ip_uuid === this.selList[i].ip_uuid)
          const header = ["RegName", "Sub Reg Name", "Bit Width", "Description", "Addr", "reg/ram", "Retention"]
          const value = { RegName: "reg_gather_name", 'Sub Reg Name': "field", 'Bit Width': "bit_width", Description: "description", Addr: "address", 'reg/ram': "reg_ram", Retention: "retention" }
          const columns = header.map((item) => {
            return {
              header: item,
              key: value[item],
              width: 30
            }
          })
          const dataList = []
          temp_list.map((item) => {
            let gather_res = {}
            gather_res.reg_gather_name = item.reg_gather_name
            gather_res.description = item.description
            gather_res.address = this.start_addr+item.offset.split("x")[1]
            gather_res.reg_ram = item.reg_ram
            gather_res.retention = item.reg_ram
            gather_res.field = " "
            gather_res.bit_width = " "
            dataList.push(gather_res)
            if (item.singleReg.length > 0) {
              item.singleReg.map((value) => {
                let single_reg = {}
                single_reg.reg_gather_name = " "
                single_reg.description = value.description
                single_reg.address = " "
                single_reg.reg_ram = " "
                single_reg.retention = " "
                single_reg.field = value.field
                single_reg.bit_width = `${value.start_bit}:${value.end_bit}`
                dataList.push(single_reg)
              })
            }
          })
          this.exportFile(workbook, header, columns, dataList, this.selList[i].ip_name, this.selList[i].ip_name + "(" + this.selList[i].version + ")")
        }
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer],
            { type: "application/octet-stream", }
            // { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' }
          )
          saveAs(blob, `${(new Date()).toLocaleString()}.xlsx`)
          // saveAs(blob, `${expertName}.xlsx`)
        })
      } else {
        ElMessage({
          showClose: true,
          message: "请选择IP",
          type: 'error',
        })
      }
    },

    exportCDefine(){
      // 要写入的数据
      if(this.selList.length>0){
        for(var i in this.selList){
          // let count = 0
          const temp_list = this.reg_gather_list.filter(item => item.ip_uuid === this.selList[i].ip_uuid)
          let content = `/****************************************************************
* @file  ${this.selList[i].ip_name}.h
* @brief ${this.selList[i].ip_name} hadware define
* @attention
*          Copyright (c) ${(new Date()).getFullYear()} Possumic Technology. all rights reserved.
****************************************************************
*/
#ifndef _HW_${this.selList[i].ip_name.toUpperCase()}_H_
#define _HW_${this.selList[i].ip_name.toUpperCase()}_H_


#ifdef __cplusplus
  extern "C" {
#endif


/** @addtopgroup ${this.selList[i].ip_name}
 * @{
 * */

/*** 
 * @brief General Purpose I/O
 */



typedef struct {\r`
          let temp_content = ""
          let count = 0
          for(var j in temp_list){
            if(temp_list[j].offset.indexOf("~")!=-1){
              let tempOff =parseInt(temp_list[j].offset.split("~")[1],16)-parseInt(temp_list[j].offset.split("~")[0],16)
              let contentTemp = " ".repeat(4)+"uint32_t RSVD"+(count.toString()!='0'?count:"")+"["+((tempOff/4)+1).toString()+"];"
              content = content+contentTemp+" ".repeat(60-contentTemp.length) +`/*${temp_list[j].offset},${temp_list[j].description+" ".repeat(44-(temp_list[j].description?(temp_list[j].description.length):'null'.length))}*/\r`
              count = count+1
            }else{
              // (temp_list[j].singelReg).map(item => item.RW);
              const RWList = temp_list[j].singleReg.map(item => item.RW)
              let tempPer
              if(["R/W","R","W","r","w","r/w"].some(str => RWList.includes(str))){
                tempPer = "__IOM"
              }
              if(["R","r"].some(str => RWList.includes(str))){
                tempPer = "__IM"
              }
              if(["W","w"].some(str => RWList.includes(str))){
                tempPer = "__OM"
              }
              let contentTemp
              if(tempPer){
                contentTemp = `    ${tempPer} uint32_t ${temp_list[j].reg_gather_name.toUpperCase()};`
              }else{
                contentTemp = `    uint32_t ${temp_list[j].reg_gather_name.toUpperCase()};`
              }
              content = content+contentTemp+" ".repeat(60-contentTemp.length) +`/*${temp_list[j].offset},${temp_list[j].description+" ".repeat(51-(temp_list[j].description?(temp_list[j].description.length):'null'.length))}*/\r`
            }
            if(temp_list[j].singleReg.length>0){
              for(var k in temp_list[j].singleReg){
                let num = parseInt(temp_list[j].singleReg[k].start_bit)-parseInt(temp_list[j].singleReg[k].end_bit)+1
                let temp_conten_temp_mask
                let temp_conten_temp_pos
                if(temp_list[j].singleReg[k].field.indexOf("[")!=-1){
                  temp_conten_temp_mask = "#define "+(temp_list[j].singleReg[k].field.split('[')[0]).toUpperCase()+"_MASK"
                  // temp_content= temp_content+"#define "+(temp_list[j].singleReg[k].field.split('[')[0]).toUpperCase()+"_MASK"+" ".repeat(60-temp_conten_temp_mask.length)+this.reg_hex[num]+"\r\r"
                  temp_conten_temp_pos = "#define "+(temp_list[j].singleReg[k].field.split('[')[0]).toUpperCase()+"_POS"
                  // temp_content = temp_content+"/*!< "+temp_list[j].offset+" "+temp_list[j].reg_gather_name+" \r*"+temp_list[j].singleReg[k].description+"\r*/\r#define "+(temp_list[j].singleReg[k].field.split('[')[0]).toUpperCase()+"_POS"+" ".repeat(60-temp_conten_temp_pos.length)+num.toString()+"\r"
                }else if(temp_list[j].singleReg[k].field.indexOf("0~")!=-1){
                  temp_conten_temp_mask = "#define "+(temp_list[j].singleReg[k].field.split('0~')[0]).toUpperCase()+"_MASK"
                  temp_conten_temp_pos = "#define "+(temp_list[j].singleReg[k].field.split('0~')[0]).toUpperCase()+"_POS"
                }else{
                  temp_conten_temp_mask = "#define "+temp_list[j].singleReg[k].field.toUpperCase()+"_MASK"
                  temp_conten_temp_pos = "#define "+temp_list[j].singleReg[k].field.toUpperCase()+"_POS"
                }
                // temp_content= temp_content+"#define "+temp_list[j].singleReg[k].field.toUpperCase()+"_MASK"+" ".repeat(60-temp_conten_temp_mask.length)+this.reg_hex[num]+"\r\r"
                temp_content= temp_content+"/*!< "+temp_list[j].offset+" "+temp_list[j].reg_gather_name+" \r*"+temp_list[j].singleReg[k].description+"\r*/\r"+temp_conten_temp_mask+" ".repeat(60-temp_conten_temp_mask.length)+this.reg_hex[num]+"\r"
                temp_content = temp_content+temp_conten_temp_pos+" ".repeat(60-temp_conten_temp_pos.length)+num.toString()+"\r\r"
                

              }
            }
            temp_content = temp_content+"\r"
          }
          content = content+"} "
          if(this.selList[i].ip_name.indexOf("_")!=-1){
            content = content+ this.selList[i].ip_name.split('_')[0]+";\r\r"
          }else{
            content = content+ this.selList[i].ip_name+";\r\r"
          }
          content = content+temp_content +`/**
* @}
* End of group HW_${this.selList[i].ip_name.toUpperCase()}
*/

#ifdef __cplusplus
}
#endif

#endif /* _HW_${this.selList[i].ip_name.toUpperCase()}_H_ */`


          let strData = new Blob([content],);
          // const url = URL.createObjectURL(strData);

          // const link = document.createElement('a');
          // link.href = url;
          // link.download = 'myHeaderFile.h';
          // link.click();
          saveAs(strData, `${this.selList[i].ip_name}(${this.selList[i].version}).h`);
        }
      }else{
        ElMessage({
          showClose: true,
          message: "请选择IP",
          type: 'error',
        })
      }
    }



  },
  

}

</script>

<style scoped>
.button-container button {
  margin-right: 6px; /* set the right margin of each button to 10px */
}



/* :deep(.docx-wrapper) {
  background-color: #fff;
  padding: 0;
}

:deep(.docx-wrapper > section.docx) {
  width: 100% !important;
  padding: 0rem !important;
  min-height: auto !important;
  box-shadow: none;
  margin-bottom: 0;
} */
</style>