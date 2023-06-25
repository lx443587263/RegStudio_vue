<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <!-- Card header -->
          <div class="pb-0 card-header">
            <div class="d-lg-flex">
              <div>
                <h5 class="mb-0">All Template</h5>
                <!-- <p class="mb-0 text-sm">
                  A lightweight, extendable, dependency-free javascript HTML
                  table plugin.
                </p> -->
              </div>
              <div class="my-auto mt-4 ms-auto mt-lg-0">
                <div class="my-auto ms-auto">
                  <argon-button 
                    v-permission="['admin',]"  variant="gradient"
                    @click="dialogVisible = true">import Template</argon-button>
                  <el-dialog v-model="dialogVisible" title="上传文件">
                    <!-- <span>Template File Name</span>
                    <el-input v-model="uploadData.name"/> -->
                    <el-upload 
                      ref="upload" 
                      :action=activeIp 
                      :data="uploadData"
                      :before-upload="beforeUpload" 
                      :on-success="handleUploadSuccess" 
                      :on-error="handleUploadError">
                      <template #trigger>
                        <div>
                          <el-button size="small" type="primary" style="margin-top: 10px;">选择文件</el-button>
                        </div>
                      </template>
                      <template #tip>
                        <div class="el-upload__tip">只能上传docx文件</div>
                      </template>
                    </el-upload>
                  </el-dialog>

                  <!-- <button type="button" class="mx-1 mb-0 btn btn-outline-success btn-sm" data-bs-toggle="modal"
                    data-bs-target="#import">
                    Import
                  </button>
                  <div id="import" class="modal fade" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog mt-lg-10">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 id="ModalLabel" class="modal-title">
                            Import CSV
                          </h5>
                          <i class="fas fa-upload ms-3"></i>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <p>You can browse your computer for a file.</p>
                          <input type="text" placeholder="Browse file..." class="mb-3 form-control" />
                          <div class="form-check">
                            <input id="importCheck" class="form-check-input" type="checkbox" value="" checked="" />
                            <label class="custom-control-label" for="importCheck">I accept the terms and
                              conditions</label>
                          </div>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn bg-gradient-secondary btn-sm" data-bs-dismiss="modal">
                            Close
                          </button>
                          <button type="button" class="btn bg-gradient-success btn-sm">
                            Upload
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button class="mt-1 mb-0 btn btn-outline-success btn-sm export mt-sm-0" data-type="csv" type="button"
                    name="button">
                    Export
                  </button> -->
                </div>
              </div>
            </div>
          </div>
          <div class="px-0 pb-0 card-body">
            <div class="container-fluid">
              <div>
                <el-table :data="template_file_list">
                  <el-table-column prop="name" label="File Name"></el-table-column>
                  <el-table-column prop="size" label="Size"></el-table-column>
                  <el-table-column label="操作">
                    <template #default="scope">
                      <!-- <el-button type="text" @click="handleDownload(scope.row)">下载</el-button> -->
                      <el-button v-permission="['admin',]" size="small" type="primary" @click="Download(scope.row)">下载</el-button>
                      <el-button v-permission="['admin',]" size="small" type="danger" @click="handleRemove(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ArgonButton from "@/components/ArgonButton.vue";
import { deleteTemplateFileApi} from "@/http/api/template_file"
import { mapState } from "vuex";
import { v4 as uuidv4 } from 'uuid';
import {getTemplateFileApi} from "@/http/api/template_file";
import { saveAs } from "file-saver";

// import { DataTable } from "simple-datatables";
// import setTooltip from "@/assets/js/tooltip.js";

export default {
  name: "ProductsList",
  components: {
    ArgonButton,
  },
  data() {
    return {
      activeIp:localStorage.getItem("backendIp")+"ip/upload_template/",
      dialogVisible: false,
      fileList: [], // 已上传文件列表
      tableData: [], // 表格数据
      uploadData: {
        name: "",
        size: "",
        file_uuid:"",
      },
      condition:true
    };
  },
  computed:{
    ...mapState('template_file',['template_file_list']),
    isDisabled() {
      return this.condition; // 根据条件动态返回禁用状态
    },
  },
  watch:{
    'uploadData.name'(newValue){
      if(newValue){
        this.condition=false
      }
    }
  },
  created(){
      // getTemplateFileListApi().then((res)=>{
      //   // this.tableData = res
      //   this.$store.commit('template_file/getTemplateFileList',res)
      //   console.log(res)
      // })
  },
  methods: {
    //上传文件
    beforeUpload(file) {
      // console.log("hello")
      // console.log("file",file)
      this.uploadData.name=file.name
      this.uploadData.size=file.size
      this.uploadData.file_uuid=uuidv4(),
      this.fileList.push(file)
      // console.log(this.fileList[0])
      // 返回 false 可取消上传
      return true;
    },

    handleUploadError(error) {
      console.error(error);
    },
    // beforeUpload() {
    //   // 在上传前的处理逻辑，例如文件类型和大小的检查
    //   return true; // 返回true允许上传，返回false取消上传
    // },
    handleUploadSuccess(response, file) {
      this.$message.success('上传成功')
      // console.log("file",this.template_file_list)
      // 上传成功后的处理逻辑
      const fileData = {
        name: file.name,
        size: file.size,
        file_uuid: this.uploadData.file_uuid,
        url: response.url // 根据接口返回的数据设置文件的URL
      };
      this.fileList.push(fileData); // 将文件数据添加到已上传文件列表中
      this.template_file_list.push(fileData); // 将文件数据添加到表格数据中
    },
    // handleDownload(file) {
    //   console.log("file.url",file.url)
    //   // 处理文件下载逻辑
    //   // window.location.href = file.url; // 使用文件URL下载文件
    // },
    handleRemove(file) {
      // 处理文件删除逻辑
      const index = this.template_file_list.indexOf(file);
      if (index !== -1) {
        this.fileList.splice(index, 1);
        this.template_file_list.splice(index, 1);
        deleteTemplateFileApi(file.file_uuid)
      }
    },
    Download(row){
      getTemplateFileApi(row.file_uuid).then((res)=>{
        saveAs(res, row.name);
      })
    }
    // }
  },

  // mounted() {
  //   if (document.getElementById("products-list")) {
  //     const dataTableSearch = new DataTable("#products-list", {
  //       searchable: true,
  //       fixedHeight: false,
  //       perPage: 7,
  //     });

  //     document.querySelectorAll(".export").forEach(function (el) {
  //       el.addEventListener("click", function () {
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
  //   setTooltip(this.$store.state.bootstrap);
  // },
};
</script>

<style scoped>
.upload-demo {
  margin-bottom: 20px;
}
</style>