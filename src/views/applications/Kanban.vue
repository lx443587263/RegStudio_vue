<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <!-- Card header -->
          <div class="pb-0 card-header">
            <div class="d-lg-flex">
              <div>
                <h5 class="mb-0">类别</h5>
                <!-- <p class="mb-0 text-sm">
                  A lightweight, extendable, dependency-free javascript HTML
                  table plugin.
                </p> -->
              </div>
              <div class="my-auto mt-4 ms-auto mt-lg-0">
                <div class="my-auto ms-auto">
                  <argon-button 
                    v-permission="['admin','edit','create']"  variant="gradient"
                    @click="dialogVisible = true">Add Category</argon-button>
                  <el-dialog v-model="dialogVisible" title="添加IP类别">
                    <el-form ref="form" :model="cataegoryData" >
                      <el-form-item label="IP 类别" prop="category">
                        <el-input v-model="cataegoryData.category"></el-input>
                      </el-form-item>
                    </el-form>
                    <div>
                      <el-button type="primary" @click="AddCategory">确定</el-button>
                      <el-button @click="dialogVisible = false">取消</el-button>
                    </div>
                    <!-- <span>IP 类别</span>
                    <el-input v-model="cataegoryData.category" clearable style="width: 100%"></el-input>
                    <el-button type="primary"  style="margin-top: 10px;" @click="AddCategory">添加</el-button> -->
                  </el-dialog>
                  <el-dialog v-model="dialogEditVisible" title="编辑IP类别">
                    <el-form ref="form" :model="editData" >
                      <el-form-item label="IP 类别" prop="category">
                        <el-input v-model="editData.category"></el-input>
                      </el-form-item>
                    </el-form>
                    <div>
                      <el-button type="primary" @click="editCategoryData">确定</el-button>
                      <el-button @click="dialogEditVisible = false">取消</el-button>
                    </div>
                    <!-- <span>IP 类别</span>
                    <el-input v-model="cataegoryData.category" clearable style="width: 100%"></el-input>
                    <el-button type="primary"  style="margin-top: 10px;" @click="AddCategory">添加</el-button> -->
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
                <el-table ref="table" :data="category_list" >
                  <el-table-column prop="category" label="Category"></el-table-column>
                  <el-table-column label="操作">
                    <template #default="scope">
                      <!-- <el-button type="text" @click="handleDownload(scope.row)">下载</el-button> -->
                      <el-button v-permission="['admin','edit']" size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                      <el-button v-permission="['admin','delete']" size="small" type="danger" @click="deleteCategory(scope.row)">删除</el-button>
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
import { getCategoryApi,deleteCategoryApi,addCategoryApi,editCategoryApi } from "@/http/api/category"
import { mapState } from 'vuex';


export default {
  name: "Kanban",
  components: {
    ArgonButton,
  },
  data(){
    return{
      dialogVisible: false,
      dialogEditVisible: false,
      cataegoryData:{
        category:"",
      },
      editData:{}
    }
  },
  computed:{
    ...mapState('category',['category_list']),
  },
  created(){
    getCategoryApi().then((res)=>{
      this.$store.commit('category/getCategoryList',res)
    })
  },
  methods:{
    deleteCategory(row){
      deleteCategoryApi(row.category)
      const findCategoryIndex = this.category_list.findIndex(i=>i.category === row.category)
      if(findCategoryIndex != -1){
        this.category_list.splice(findCategoryIndex,1)
      }
    },
    AddCategory(){
      console.log(this.cataegoryData)
      this.$refs.form.validate(valid => {
        if (valid) {
          const newRow = { category: this.cataegoryData.category }
          
          addCategoryApi(this.cataegoryData).then((res)=>{
            if("error" in res)
            {
              console.log(res)
              this.$message.error(res["error"]);
            }else{
              this.category_list.push(newRow)
              this.$nextTick(() => {
              this.$refs.table.setCurrentRow(newRow)
              })
              this.dialogVisible = false
              this.$message.success('添加成功')
              this.$refs.form.resetFields()
              }
          })
        }
      })
      // addCategoryApi(this.cataegoryData)
      // this.category_list.push(this.cataegoryData)
      // this.dialogVisible=false
    },
    handleEdit(row){
      this.editData = row
      this.dialogEditVisible = true
    },
    editCategoryData(){
      console.log(this.editData)
      editCategoryApi(this.editData.category,this.editData)
      this.$message.success('修改成功')
      this.dialogEditVisible = false
    }
  },
};
</script>
