<template>
  <div class="container-fluid">
    <div class="card">
      <!-- Card header -->
      <div class="card-header">
        <div class="header">
          <h5 class="mb-0">操作日志</h5>
        </div>
      <div>
          <el-table :data="modify_list" style="width: 100%" max-height="680">
            <el-table-column v-for="(item, index) in tableHeader" :key="index" :prop="item.prop" :label="item.label" >
              <template #default="scope">
                {{ scope.row[item.prop] }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getModifyDataApi } from "@/http/api/modify"

export default {
  name: "DynamicModifyTable",
  data() {
    return {
      tableHeader: [
        {
          prop: "user",
          label: "Operator",
        },
        {
          prop: "data",
          label: "data",
        },
        {
          prop: "des",
          label: "active",
        },
      ],
      modify_list:[],
    }
  },
  created(){
    getModifyDataApi().then((res)=>{
      for(var i in res){
        this.compareObjects(res[i].user,res[i].data,JSON.parse(res[i].former_content),JSON.parse(res[i].modify_content))
      }
    })
  },
  methods: {
    timeFormatSeconds (time) {
      var d = time ? new Date(time) : new Date();
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var hours = d.getHours();
      var min = d.getMinutes();
      var seconds = d.getSeconds();

      if (month < 10) month = '0' + month;
      if (day < 10) day = '0' + day;
      if (hours < 0) hours = '0' + hours;
      if (min < 10) min = '0' + min;
      if (seconds < 10) seconds = '0' + seconds;

      return (year + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + seconds);
    },
    compareObjects(user,data,obj1,obj2) {
      let tempObj = {}
      tempObj.user = user
      tempObj.data = this.timeFormatSeconds(data)
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      keys1.forEach(key => {
        if (keys2.includes(key) && obj1[key] !== obj2[key]) {
          if("reg_gather_name" in obj1){
            tempObj.des=`${user} 将 ${obj1["reg_gather_name"]} 的 ${key} 字段从 ${obj1[key]} 修改成 ${obj2[key]}`
          }else{
            tempObj.des=`${user} 将 ${key} 字段从 ${obj1[key]} 修改成 ${obj2[key]}`

          }
          this.modify_list.push(tempObj)
        }
      });
    }
  }
}
</script>

<style scoped>
.edit-icon {
  cursor: pointer;
}

.editable-row {
  display: flex;
  align-items: center;
}

.editable-row-span {
  display: inline-block;
  margin-right: 6px;
}

.menu-item {
  height: 32px;
  line-height: 32px;
  padding-left: 12px;
}

.menu-item:hover {
  color: #fff;
  background: #409eff;
  cursor: pointer;
}
</style>