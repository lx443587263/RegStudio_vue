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
                    <span>IP 类别</span>
                    <el-input  v-model="cataegoryData.category" style="width: 100%"></el-input>
                    <el-button type="primary"  style="margin-top: 10px;" @click="AddCategory">添加</el-button>
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
                <el-table :data="category_list">
                  <el-table-column prop="category" label="Category"></el-table-column>
                  <el-table-column label="操作">
                    <template #default="scope">
                      <!-- <el-button type="text" @click="handleDownload(scope.row)">下载</el-button> -->
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
import { getCategoryApi,deleteCategoryApi,addCategoryApi } from "@/http/api/category"
import { mapState } from 'vuex';


export default {
  name: "Kanban",
  components: {
    ArgonButton,
  },
  data(){
    return{
      dialogVisible: false,
      cataegoryData:{
        category:"",
      },
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
      addCategoryApi(this.cataegoryData)
      this.category_list.push(this.cataegoryData)
      this.dialogVisible=false
    }
  },
};
</script>
