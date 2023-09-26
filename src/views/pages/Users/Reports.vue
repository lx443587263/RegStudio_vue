<template>
  <div class="container-fluid">
    <!-- <div  style="margin-top: 20px;">
        <router-link :to="{ name: 'New User' }">
          <argon-button v-permission="['admin',]" color="white" variant="outline">New User</argon-button>
        </router-link>
    </div> -->
    <div class="card" style="margin-top: 30px;">
      <div class="container-fluid py-4">
        <el-table :data="users" style="width: 100%">
          <el-table-column prop="username" label="Name"></el-table-column>
          <el-table-column prop="position" label="Position">
            <template #default="scope">
              <el-tag v-for="item in scope.row.position.split(',')" :key="item" class="mx-1">
                {{ item }}
              </el-tag>
            </template>

          </el-table-column>
          <el-table-column prop="is_active" label="Status"></el-table-column>
          <el-table-column label="Actions">
            <template #default="scope">
              <el-button v-permission="['admin',]" type="primary" text @click="editRow(scope.row,scope.$index)">Edit</el-button>
              <!-- <el-button v-permission="['admin',]" type="primary" text @click="resetPassword(scope.row)">Reset</el-button> -->
              <el-button v-permission="['admin',]" type="primary" text @click="handleDelete(scope.row,scope.$index)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog v-model="dialogFormVisible" title="User Info" draggable>
          <el-form :model="editData">
            <el-form-item label="User Name" :label-width="formLabelWidth">
              <el-input v-model="editData.username" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Position" :label-width="formLabelWidth">
              <el-tag
                v-for="tag in positionList"
                :key="tag"
                class="mx-1"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag }}
              </el-tag>
            </el-form-item>

            <el-form-item label="Position Select" :label-width="formLabelWidth">
              <el-select v-model="positionTemp" multiple placeholder="Please select a zone">
                <el-option value="admin">管理员</el-option>
                <el-option value="create">新增</el-option>
                <el-option value="edit">编辑</el-option>
                <el-option value="delete">删除</el-option>
                <el-option value="read">查看</el-option>
                <!-- <el-option value="DigitalFront">数字前端工程师</el-option>
                <el-option value="DigitalEnd">数字后端工程师</el-option>
                <el-option value="DigitalVerification">数字验证工程师</el-option>
                <el-option value="Embedded">嵌入式工程师</el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item label="Status" prop="is_active" :label-width="formLabelWidth">
              <el-radio-group v-model="editData.is_active" class="ml-4">
                <el-radio :label=true size="large">True</el-radio>
                <el-radio :label=false size="large">False</el-radio>
              </el-radio-group>
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
      </div>
    </div>
  </div>
  
</template>

<script>
import { reactive,computed,ref} from 'vue';
import { ElTable, ElTableColumn, ElButton } from 'element-plus';
import {userDelete,userEdit} from "@/http/api/user"
// import { useStore } from 'vuex';
import { useState } from '@/store/hook/useState'
// import ArgonButton from "@/components/ArgonButton.vue";
import { passwordEdit } from "@/http/api/user";
import { ElMessage } from 'element-plus'




export default {
  components: {
    ElTable,
    ElTableColumn,
    ElButton,
    // ArgonButton
  },
  setup() {
    // const store = useStore()

    const dialogFormVisible = ref(false)
    const formLabelWidth = '140px'
    const editData = ref({})
    const currentRowIndex = ref({})
    const positionList = ref([])
    const positionTemp = ref([])


    const editRow = (row,index) => {
      editData.value = { ...row }
      splitPosition()
      currentRowIndex.value = index
      dialogFormVisible.value = true
    }
    
    // function getData(){
    //   userGet().then((res) => {
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
    //     store.commit('user/setUserList', userList)
    //   })
    // }

    // getData()
    const storeState = useState('user',['userlist'])

    const users = reactive(computed(() => storeState.userlist.value,));
    
    function splitPosition(){
      positionList.value = editData.value.position.split(',')
    }
    //修改用户
    function handleEdit() {
      if(positionTemp.value.length > 0){
        positionList.value.push(positionTemp.value)
      }
      editData.value.position = positionList.value.join()
      userEdit(editData.value.user_uuid,editData.value)
      users.value.splice(currentRowIndex.value,1,editData.value)
      dialogFormVisible.value = false
      positionTemp.value = []
    }

    function handleDelete(row,index) {
      // console.log('Delete user:', row);
      // console.log('index', index)
      users.value.splice(index, 1)
      userDelete(row.user_uuid)
    }

    const handleClose = (tag) => {
      positionList.value.splice(positionList.value.indexOf(tag), 1)
    }

    function resetPassword(row){
      let data = {new_password:"123456"}
      passwordEdit(row.user_uuid, data).then((res) => {
        ElMessage({
          showClose: true,
          message: res,
          type: 'success', 
        })
      }
      )
    }
    return {
      users,
      dialogFormVisible,
      formLabelWidth,
      editData,
      handleEdit,
      handleDelete,
      // getData,
      editRow,
      resetPassword,
      splitPosition,
      positionList,
      positionTemp,
      handleClose

    };
  },
};
</script>
<style scoped>
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>


<!-- <template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-lg-6 col-12">
        <div class="row">
          <div class="col-lg-6 col-md-6 col-12">
            <complex-statistics-card
              :img="img1"
              icon="text-dark ni ni-circle-08"
              percentage="+55%"
              :count="{ number: 1600, label: 'Active Users' }"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-12">
            <complex-statistics-card
              :img="img2"
              icon="text-dark ni ni-active-40"
              percentage="+124%"
              :count="{ number: 357, label: 'Click Events' }"
            />
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-6 col-md-6 col-12">
            <complex-statistics-card
              :img="img3"
              icon="text-dark ni ni-cart"
              percentage="+15%"
              :count="{ number: 2300, label: 'Purchases' }"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-12">
            <complex-statistics-card
              :img="img4"
              icon="text-dark ni ni-like-2"
              percentage="+90%"
              :count="{ number: 940, label: 'Likes' }"
            />
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-12">
        <review-card
          title="Reviews"
          description="More than
          <b>1,500,000</b> developers used Creative Tim's products and over
          <b>700,000</b> projects were created."
          :reviews="[
            {
              title: 'Positive Reviews',
              value: 80,
              color: 'info',
            },
            {
              title: 'Neutral Reviews',
              value: 17,
              color: 'dark',
            },
            {
              title: 'Negative Reviews',
              value: 3,
              color: 'danger',
            },
          ]"
        />
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-12">
        <reports-table />
      </div>
    </div>
  </div>
</template>

<script>
import ComplexStatisticsCard from "@/examples/Cards/ComplexStatisticsCard.vue";
import ReviewCard from "./components/ReviewCard.vue";
import ReportsTable from "./components/ReportsTable.vue";
import img1 from "@/assets/img/reports1.jpg";
import img2 from "@/assets/img/reports2.jpg";
import img3 from "@/assets/img/reports3.jpg";
import img4 from "@/assets/img/reports4.jpg";

export default {
  name: "Reports",
  components: {
    ComplexStatisticsCard,
    ReviewCard,
    ReportsTable,
  },
  data() {
    return {
      img1,
      img2,
      img3,
      img4,
    };
  },
};
</script> -->
