<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <!-- Card header -->
          <div class="pb-0 card-header">
            <div class="d-lg-flex">
              <div>
                <h5 class="mb-0">All Project</h5>
                <!-- <p class="mb-0 text-sm">
                  A lightweight, extendable, dependency-free javascript HTML
                  table plugin.
                </p> -->
              </div>
              <div class="my-auto mt-4 ms-auto mt-lg-0">
                <div class="my-auto ms-auto">
                  <argon-button v-permission="['admin']" variant="gradient" @click="dialogVisible = true">Add
                    Project</argon-button>
                  <el-dialog v-model="dialogVisible" title="添加项目">
                    <el-form ref="form" :model="SaveData">
                      <el-form-item label="项目名" prop="project">
                        <el-input v-model="SaveData.project"></el-input>
                      </el-form-item>
                      <el-form-item label="项目版本" prop="version">
                        <el-input v-model="SaveData.version"></el-input>
                      </el-form-item>
                      <el-form-item label="项目所包含非SOC" prop="has_ip">
                        <MultipleSelect v-model="value" :options="options"></MultipleSelect>
                      </el-form-item>
                    </el-form>
                    <div>
                      <el-button type="primary" @click="AddProject">确定</el-button>
                      <el-button @click="dialogVisible = false">取消</el-button>
                    </div>
                  </el-dialog>
                  <el-dialog v-model="dialogEditVisible" title="编辑项目名">
                    <el-form ref="form" :model="editData">
                      <el-form-item label="项目名" prop="project">
                        <el-input v-model="editData.project"></el-input>
                      </el-form-item>
                      <el-form-item label="项目版本" prop="version">
                        <el-input v-model="editData.version"></el-input>
                      </el-form-item>
                      <el-form-item label="项目所包含非SOC" prop="ip_list">
                        <MultipleSelect v-model="value" :options="options"></MultipleSelect>
                      </el-form-item>
                    </el-form>
                    <div>
                      <el-button type="primary" @click="editProjectData">确定</el-button>
                      <el-button @click="dialogEditVisible = false">取消</el-button>
                    </div>
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
                <el-table ref="table" :data="showData">
                  <el-table-column prop="project" label="Project"></el-table-column>
                  <el-table-column prop="version" label="Version"></el-table-column>
                  <el-table-column prop="has_ip" label="HasIP"></el-table-column>
                  <el-table-column prop="project_uuid" label="Project UUID"></el-table-column>
                  <el-table-column label="操作">
                    <template #default="scope">
                      <!-- <el-button type="text" @click="handleDownload(scope.row)">下载</el-button> -->
                      <el-button v-permission="['admin']" size="small" type="primary"
                        @click="handleEdit(scope.row)">编辑</el-button>
                      <el-button v-permission="['admin']" size="small" type="danger"
                        @click="deleteProject(scope.row)">删除</el-button>
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
import { getProjectApi, deleteProjectApi, addProjectApi, editProjectApi ,getProjecNameApi} from "@/http/api/project"
import { mapState } from 'vuex';
import { getIpUuidApi, editIpVersion, getIpListApi } from '@/http/api/ip';
import MultipleSelect from "../pages/projects/components/MultipleSelect.vue"
import { v4 as uuidv4 } from 'uuid';

export default {
  name: "Data Tables",
  components: {
    ArgonButton,
    MultipleSelect,
  },
  data() {
    return {
      dialogVisible: false,
      dialogEditVisible: false,
      SaveData: {
        project_uuid:"",
        project: "",
        has_ip: "",
        version:"",
      },
      projectData: {
        project: "",
        ip_list: [],
      },
      options: [],
      value: [],
      editData: {},
      oldProject: [],
      showData: [],
      allProjectList_temp:[],
      projectKV:new Map(),
      old_soc:[]
    }
  },
  computed: {
    ...mapState('project', ['project_list']),
    ...mapState('IP', ['ip_lists']),
  },
  created() {
    this.getProList()
    this.projectData.ip_list = this.ip_lists.filter((item) => {
      return item.private_project == false;
    })
      this.projectData.ip_list.forEach(element => {
      let temp = {};
      temp.value = element.ip_uuid
      temp.label = element.ip_name + "(" + element.version + ")"
      this.options.push(temp)
    });
    getProjectApi().then((res) => {
      this.$store.commit('project/getProjectList', res)
    })
  },
  methods: {
    getProList() {
      this.showData = []
      this.project_list.forEach(item => {
        let temp = {}
        let tempIpName = []
        temp.project = item.project
        temp.version = item.version
        temp.project_uuid = item.project_uuid
        if (item.has_ip) {
          item.has_ip.split(',').forEach(i => {
            this.ip_lists.forEach(it => {
              if (it.ip_uuid == i) {
                if(it.child_version){
                  tempIpName.push(it.ip_name + "(" + it.version + it.child_version+")")
                }else{
                  tempIpName.push(it.ip_name + "(" + it.version +")")
                }
              }
            })
          })
        }

        temp.has_ip = tempIpName.join(",")
        this.showData.push(temp)
      })
    },
    deleteProject(row) {
      deleteProjectApi(row.project_uuid)
      const findShowDataIndex = this.showData.findIndex(j => j.project_uuid == row.project_uuid)
      if (findShowDataIndex != -1) {
        this.showData.splice(findShowDataIndex, 1)
      }
      if(this.project_list.length!=1){
        const findProjectIndex = this.project_list.findIndex(i => i.project_uuid === row.project_uuid)
        if (findProjectIndex != -1) {
          if(this.project_list[findProjectIndex].has_ip){
            this.project_list[findProjectIndex].has_ip.split(",").forEach((it) => {
            getIpUuidApi(it).then(res => {
              console.log(res[0])
              if(res[0].project){
              if (res[0].project.split(",").length == 1) {
                res[0].project = null
              } else {
                res[0].project = res[0].project.split(",").splice(res[0].project.split(",").findIndex(k => k.project === row.project) - 1, 1).join(',')
              }
              }

              editIpVersion(res[0].ip_uuid, res[0])
            })
          })
          this.project_list.splice(findProjectIndex, 1)
          }
        }
      }else{
        if(this.project_list[0].has_ip){
            this.project_list[0].has_ip.split(",").forEach((it) => {
            getIpUuidApi(it).then(res => {
              if (res[0].project.split(",").length == 1) {
                res[0].project = null
              } else {
                res[0].project = res[0].project.split(",").splice(res[0].project.split(",").findIndex(k => k.project_uuid === row.project_uuid) - 1, 1).join(',')
              }
              editIpVersion(res[0].ip_uuid, res[0])
            })
          })
          this.project_list.splice(0, 1)
          }
      }

    },
    AddProject() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if(this.value){
            this.SaveData.has_ip = this.value.join(',')
          }else{
            this.SaveData.has_ip = null
          }
          this.SaveData.project_uuid = uuidv4()
          const newRow = {project_uuid:this.SaveData.project_uuid, project: this.SaveData.project, has_ip: this.SaveData.has_ip ,version:this.SaveData.version}
          //过滤重复
          if(this.value){
            this.value.forEach(item => {
            getIpUuidApi(item).then(res => {
              if (this.oldProject.indexOf(item) == -1 && this.value.indexOf(item) != -1) {
                if (res[0].project != null) {
                  res[0].project = res[0].project + "," + this.SaveData.project_uuid
                } else {
                  res[0].project = this.SaveData.project_uuid
                }
                editIpVersion(res[0].ip_uuid, res[0])
                this.$message.success('添加成功')
              } else if (this.oldProject.indexOf(item) != -1 && this.value.indexOf(item) == -1) {
                let temp = []
                const tl = res[0].project.split(',')
                if (tl.length == 1) {
                  res[0].project = null
                } else {
                  tl.filter(i => {
                    if (i != this.SaveData.project_uuid) {
                      temp.push(i)
                    }
                  })
                  res[0].project = temp.join(',')
                }

                editIpVersion(res[0].ip_uuid, res[0])
                this.$message.success('添加成功')
              } else {
                this.$message.success('添加成功')
              }
            })
          })
          }
          addProjectApi(this.SaveData).then((res) => {
            if ("error" in res) {
              this.$message.error(res["error"]);
            } else {
              this.project_list.push(newRow)
              this.$nextTick(() => {
                this.$refs.table.setCurrentRow(newRow)
              })
              this.dialogVisible = false
              this.getProList()
              this.$message.success('添加成功')
              this.$refs.form.resetFields()
            }
          })
          getProjectApi().then((res) => {
            this.$store.commit('project/getProjectList', res)
          })
          this.getProjectList()
        }
      })

    },
    handleEdit(row) {
      let tempRow = this.project_list.filter(item => {
        return item.project_uuid == row.project_uuid
      })[0]

      this.editData = tempRow
      if (tempRow.has_ip != undefined) {
        this.oldProject = tempRow.has_ip.split(',')
        this.value = []
        this.old_soc = []
        tempRow.has_ip.split(",").forEach(item=>{
          const idx = this.projectData.ip_list.findIndex(k=>k.ip_uuid==item)
          if(idx!=-1){
            this.value.push(item)
          }else{
            this.old_soc.push(item)
          }
        })
      }
      this.dialogEditVisible = true

    },
    getProjectList(){
       getProjectApi().then( (res)=>{
        for(var i=0;i<res.length;++i){
          this.allProjectList_temp.push(res[i].project)
          this.projectKV.set(res[i].project_uuid,res[i].project+res[i].version)
        }
        this.$store.commit('project/getProjectKV',this.projectKV)
        this.getProjecVersionList()
      })
    },
    getProjecVersionList(){
      let test = []
      this.allProjectList_temp = [...new Set(this.allProjectList_temp)];
      this.allProjectList_temp.forEach(element=>{
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
      this.$store.commit('IP/allProjectList',test)
    },
    editProjectData() {

      //原始soc的ip_uuid被清理
      if(this.old_soc){
        this.editData.has_ip = this.value.concat(this.old_soc).join(',');
      }else{
        this.editData.has_ip = this.value.join(',')
      }
      if (this.value.length == 0) {
        if(this.old_soc){
          this.editData.has_ip = this.old_soc.join(',')
        }else{
          this.editData.has_ip = null
        }
      }
      console.log(this.old_soc)
      console.log(this.editData)
      editProjectApi(this.editData.project_uuid, this.editData)
      let set1 = new Set(this.oldProject), set2 = new Set(this.value);
      this.dialogEditVisible = false
      let tempList = [...this.oldProject.filter(item => set2.has(item) == false), ...this.value.filter(item => set1.has(item) == false)];
      tempList.forEach(item => {
        getIpUuidApi(item).then(res => {
          if (this.oldProject.indexOf(item) == -1 && this.value.indexOf(item) != -1) {
            if (res[0].project != null) {
              res[0].project = res[0].project + "," + this.editData.project_uuid
            } else {
              res[0].project = this.editData.project_uuid
            }
            editIpVersion(res[0].ip_uuid, res[0])
            this.$message.success('修改成功')
          } else if (this.oldProject.indexOf(item) != -1 && this.value.indexOf(item) == -1) {
            let temp = []
            if(res[0].project){
              const tl = res[0].project.split(',')
              tl.filter(i => {
                if (i != this.editData.project_uuid) {
                  temp.push(i)
                }
              })
              res[0].project = temp.join(',')
            }else{
              res[0].project = null
            }

            editIpVersion(res[0].ip_uuid, res[0])
            this.$message.success('修改成功')
          } else {
            this.$message.success('修改成功')
          }
        })
      })

      getIpListApi().then(async (res) => {
        await this.$store.commit('IP/getIpList', res)
        this.getProjectList(res);
      })

      // this.showData = []
      // this.project_list.forEach(item => {
      //   let temp = {}
      //   let tempIpName = []
      //   temp.project = item.project
      //   temp.version = item.version
      //   if (item.has_ip) {
      //     item.has_ip.split(',').forEach(i => {
      //       tempIpName.push(this.ip_lists.filter(it => {
      //         return it.ip_uuid == i
      //       })[0].ip_name)
      //     })
      //     temp.has_ip = tempIpName.join(",")
      //   } else {
      //     temp.has_ip = null
      //   }
      //   this.showData.push(temp)
      // })

      this.getProjectList()
      this.getProList()

    },
  },
};
</script>
