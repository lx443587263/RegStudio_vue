<template>
  <div class="container-fluid">
    <div class="card">
      <!-- Card header -->
      <div class="card-header" >
        <div class="header" style="padding:10px">
            <h5 class="mb-0">寄存器清单</h5>
        </div>
        <div style="float: left;">
          <argon-button v-permission="['admin','edit','create','delete']" variant="gradient" @click="saveData" >Save</argon-button>
        </div>
        <argon-button v-model="isLock" v-permission="['admin','edit','create','delete']" variant="gradient" style="margin-left:1%;" @click="lockDrop"><i :class="lockIcon"></i></argon-button>
        <!-- <argon-button v-show="!isLock" variant="gradient" style="margin-left:1%;" @click="lockDrop"><el-icon><Unlock /></el-icon> Drop </argon-button> -->
        <div v-show="tableData.length === 0" class="addbutton"><el-button
            v-permission="['admin','edit','create','delete']" @click="addRow()">Add</el-button>
        </div>
        <div v-show="tableData.length != 0" class="addbutton">
          <router-link :to="{ name: 'Charts' }" style="padding: 10px;">
            <argon-button variant="gradient">Reg Graph</argon-button>
          </router-link>
          <router-link :to="{ name: 'Timeline' }">
            <argon-button variant="gradient">Modify Timeline</argon-button>
          </router-link>
        </div>
        <!-- <p class="mb-0 text-sm">
          A lightweight, extendable, dependency-free javascript HTML table plugin.
        </p> -->
      </div>
      <div class="container-fluid">
        <el-table 
          id="regGatherTable" ref="gather" v-loadmore="handelLoadmore()" v-loading="loading"
          :data="filteredData" :stripe="true" max-height="650"
          :row-key="getRowKeys"
          :row-class-name="tableRowClassName"
          :expand-row-keys="expands"
          :data-size="tableData.length"
          @row-click="clickTableRow"
          @row-contextmenu="rightClick"
          ><!--      @expand-change="handleExpandChange"       -->
          <el-table-column type="selection" width="55" />
          <el-table-column type="expand">
            <template #default="props">
              <div v-show="props.row.singleReg.length === 0" class="addValueButton">
                <el-button @click="addRegRow(props.row, 0, null)">Add</el-button>
              </div>
              <el-table 
                id="singelReg" ref="multipleTable"  :data="props.row.singleReg" class="singleTable" :stripe="true" 
                table-layout="auto"  :resize="true" :row-key="getRowKeys" :row-class-name="tableRowClassName" :fit="true"
                @row-click="clickTableRow"
                >
                <!-- :expand-row-keys="expands"  -->
                <el-table-column type="expand">
                  <template #default="val">
                    <!--如果没有value值就增加一行-->
                    <div v-show="val.row.values.length === 0" class="addValueButton"><el-button
                        v-permission="['admin','edit','create','delete']"
                        @click="addValueRow(val.row, 0, null)">Add</el-button></div>
                    <el-table 
                      id="valTable" ref="valueTable" :data="val.row.values" :stripe="true" table-layout="auto"
                      :resize="true" :fit="false">
                      <el-table-column v-for="(col, idx) in regValue" :key="idx" :index="idx" :width="col.width">
                        <!-- 行的内容-->
                        <template #header>
                          {{ col.label }}
                        </template>
                        <!-- 列的内容-->
                        <template #default="scope">
                          <div 
                            v-show="scope.row[col.prop].show" class="input-div"
                            >
                            {{ scope.row[col.prop].content }}
                            <!-- <i class="el-icon-edit-outline" @click="scope.row[col.prop].show = false"></i> -->
                          </div>
                          <input 
                            v-show="!scope.row[col.prop].show" v-model.lazy="scope.row[col.prop].content"
                            class="generl_input__inner"
                            :autosize="{ minRows: 1, maxRows: 2 }" :placeholder="scope.row[col.prop].placeholder"
                            @input="throttledHandleInput">
                          <!-- </input> -->
                        </template>
                      </el-table-column>
                      <el-table-column :width="300" style="margin-right: 50px;">
                        <template #default="scope">
                          <el-button 
                            v-permission="['admin','edit','create','delete']"
                            type="success" :icon="Edit" text
                            @click="editRow(props.row, scope.$index, scope.row)"></el-button>
                          <el-button 
                            v-permission="['admin','edit','create','delete']"
                            type="primary" :icon="Plus" text
                            @click="addValueRow(val.row, scope.$index, scope.row)"></el-button>
                          <el-button 
                            v-permission="['admin','edit','create','delete']"
                            type="danger" :icon="Delete" text
                            @click="delValueRow(val.row, scope.$index, scope.row)"></el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column 
                  v-for="(col, idx) in regColumnList" :key="idx" :index="idx" 
                  :show-overflow-tooltip="col.overflow"
                  >
                  <!-- 行的内容-->
                  <template #header>
                    {{ col.label }}
                  </template>
                  <!-- 列的内容 style="white-space: pre;"-->
                  <template #default="scope">
                    <div v-show="scope.row[col.prop].show" class="input-div" >
                      {{ scope.row[col.prop].content }}
                      <!-- <i class="el-icon-edit-outline" @click="scope.row[col.prop].show = false"></i> -->
                    </div>
                    <input 
                      v-show="!scope.row[col.prop].show" v-model.lazy="scope.row[col.prop].content"
                      class="generl_input__inner" :autosize="{ minRows: 1, maxRows: 2 }"
                      :placeholder="scope.row[col.prop].placeholder" @input="singleRegCheck(col.prop, scope.row),throttledHandleInput"
                      >
                    <!-- </input> -->
                    <!--测试from验证-->
                    <!-- <el-form v-if="col.label=='Start_Bit'"  ref="form" v-model="scope.row[col.prop].content" :rules="regRules">
                      <el-form-item>
                        <el-input v-show="!scope.row[col.prop].show" v-model="scope.row[col.prop].content" :autosize="{ minRows: 1, maxRows: 2 }" :placeholder="scope.row[col.prop].placeholder" @blur="scope.row[col.prop].show = true">
                        </el-input>
                      </el-form-item>
                    </el-form> -->
                  </template>
                </el-table-column>
                <!-- label="Value&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ValueId&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Description" -->
                <el-table-column label="Operations">
                  <template #default="scope">
                    <!-- //handleEdit(scope.$index, scope.row) -->
                    <el-button 
                      v-permission="['admin','edit','create','delete']" type="success"
                      :icon="Edit" text @click="editRow(props.row, scope.$index, scope.row)" />
                    <el-button 
                      v-permission="['admin','edit','create','delete']" type="primary"
                      :icon="Plus" text @click="addRegRow(props.row, scope.$index, scope.row)" />
                    <el-button 
                      v-permission="['admin','edit','create','delete']" type="danger"
                      :icon="Delete" text @click="delRegRow(props.row, scope.$index, scope.row)" />
                    <el-button 
                      v-permission="['admin','edit','create','delete']" type="info"
                      :icon="MoreFilled" text
                      @click="drawer = true, changeRegGather(props.row, scope.$index, scope.row)" />
                    <!-- <el-drawer v-model="drawer" :append-to-body=true>
                      <template #header>
                        <h4>To Other RegGather</h4>
                      </template>
                      <template #default>
                        <el-select v-model="regionType" filterable placeholder="Select">
                          <el-option v-for="item in tableData" :key="item.offset.content" :label="item.offset.content" :value="item.reg_gather_uuid">
                            {{ item.offset.content }}
                          </el-option>
                        </el-select>
                      </template>
                      <template #footer>
                        <div style="flex: auto">
                          <el-button @click="cancelClick">退出 </el-button>
                          <el-button type="primary" @click="confirmClick(props.row, scope.$index, scope.row)">提交</el-button>
                        </div>
                      </template>
                    </el-drawer> -->
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column v-for="(col, idx) in columnList" :key="idx" :index="idx" >
            <!-- 行的内容-->
            <template #header>
              {{ col.label }}
            </template>
            <!-- 列的内容-->
            <template #default="scope">
              <!-- @dblclick="scope.row[col.prop].show = false" -->
              <div v-show="scope.row[col.prop].show" ref="containerRef" class="input-div">
                {{ scope.row[col.prop].content}}
                <!-- <i class="el-icon-edit-outline" @click="scope.row[col.prop].show = false"></i> -->
              </div>
              <!-- :class="{ 'custom-border': isInvalid }"  -->
              <input 
                v-show="!scope.row[col.prop].show" v-model.lazy="scope.row[col.prop].content"
                :autosize="{ minRows: 1, maxRows: 2 }"
                class = "generl_input__inner"
                :placeholder="scope.row[col.prop].placeholder" 
                @input="regGatherCheck(col.prop, scope.row, scope.$index),throttledHandleInput"
                >
                <!-- @blur="scope.row[col.prop].show = true" -->
              <!-- </input> -->
            </template>
          </el-table-column>
          <!-- <el-table-column prop="tag" label="Reset(Hex)" >
            <template #default="scope">{{ scope.row.reset.content }}</template>
          </el-table-column> -->
          <el-table-column 
              prop="tag" label="Tag" width="200" :filters="[
              { text: 'Review', value: 'review' },
              { text: 'Pass', value: 'pass' },
              { text: 'Draft', value: 'draft' }
            ]" :filter-method="filterTag" filter-placement="bottom-end">
            <template #default="scope">
              <!-- scope.row.tag === 'pass' ? 'success' : 'danger' -->
              <!-- <el-tag
                :type="scope.row.tag === 'pass' ? 'success' : scope.row.tag === 'review' ? 'danger' : 'info'"
                disable-transitions 
                >{{ scope.row.tag }}</el-tag
              > -->
              <el-popover placement="top-start" title="注意" :width="200" trigger="hover">
                <p v-show="scope.row.tag == 'review'" style="color: red;">Reg需要修改</p>
                <p v-show="scope.row.tag == 'pass'">通过</p>
                <p v-show="scope.row.tag == 'draft'">Reg未评审</p>
                <!-- <p >Reg is draft</p> -->
                <div style="text-align: right; margin: 0">
                  <!-- <el-button v-permission="['admin','DigitalFront','DigitalEnd','DigitalVerification']" size="small" text >review</el-button> -->
                  <el-button 
                    v-permission="['admin','edit','create','delete']" size="small"
                    type="primary" @click="scope.row.tag = 'pass'">pass</el-button>
                </div>
                <template #reference>
                  <el-tag 
                    :type="scope.row.tag === 'pass' ? 'success' : scope.row.tag === 'review' ? 'danger' : 'info'"
                    disable-transitions>{{ scope.row.tag }}</el-tag>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="Actions" :width="300">
            <template #default="scope">
              <el-button 
                v-permission="['admin','edit','create','delete',]"
                type="success" :icon="Edit" text
                @click="editRow(scope.row, scope.$index, scope.row)"></el-button>
              <el-button 
                v-permission="['admin','edit','create','delete',]"
                type="danger" :icon="Delete" text
                @click="delRegGatherRow(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div id="contextmenu">
          <ul>
            <li v-permission="['admin','edit','create','delete',]" @click="addRow()">
              <span>上方插入一行</span></li>
            <li v-permission="['admin','edit','create','delete',]" @click="addRow(true)">
              <span>下方插入一行</span></li>
            <el-popconfirm title="确定删除该行吗？" @confirm="delRow()">
              <template #reference>
                <li><span>删除当前行</span></li>
              </template>
            </el-popconfirm>
          </ul>
        </div>

        <el-dialog v-model="dialogFormVisible" title="Modify Offset">
          <el-form>
            <el-form-item label="OffSet" :label-width="formLabelWidth = '140px'">
              <!-- <template #header>
                <h4>To Other RegGather</h4>
              </template> -->
              <template #default>
                <el-select v-model="regionType" filterable placeholder="Select">
                  <el-option 
                    v-for="item in tableData" :key="item.offset.content" :label="item.offset.content"
                    :value="item.reg_gather_uuid">
                    {{ item.offset.content }}
                  </el-option>
                </el-select>
              </template>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogFormVisible = false">Cancel</el-button>
              <el-button type="primary" @click="confirmClick()">
                Confirm
              </el-button>
            </span>
          </template>
        </el-dialog>

      </div>
    </div>
    <!-- <div>
    <label>数据：</label>
      <ul>
        <li v-for="(data,idx) in tableData" :key="idx">
          <p v-for="(key,idx1) in Object.keys(data)" :key="idx1">{{key + ': ' + JSON.stringify(data[key])}}</p>
        </li>
      </ul>
  </div> -->
  </div>
</template>

<script>
//watchEffect
import { ref, reactive, onMounted,computed,nextTick, onBeforeUnmount, } from 'vue';
import { getRegGatherList, deleteRegGather} from "@/http/api/reggather";
import { getSingleList, deleteSingle } from "@/http/api/singlereg";
import { getValueList, deleteValue } from "@/http/api/value";
import { useStore } from "vuex";
import { useRoute, useRouter} from "vue-router";
import { v4 as uuidv4 } from 'uuid';
import { Delete, MoreFilled, Plus, Edit } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
import { useState } from '@/store/hook/useState';
import ArgonButton from "@/components/ArgonButton.vue";
import Sortable from 'sortablejs';
import { throttle } from 'lodash';




export default {
  // computed:{
  //   ...mapState('IP',['ip_lists']),
  // },
  components: {
    ArgonButton,
  },
  directives: {
    loadmore: {
      // componentUpdated updated
      componentUpdated: function (el, binding, vnode, oldVnode) {
        // 设置默认溢出显示数量
        var spillDataNum = 20;
        // 设置隐藏函数
        var timeout = false;
        let setRowDisableNone = function (topNum, showRowNum, binding) {
          if (timeout) {
            clearTimeout(timeout);
          }
          timeout = setTimeout(() => {
            binding.value.call(
              null,
              topNum,
              topNum + showRowNum + spillDataNum
            );
          });
        };
        setTimeout(() => {
          const dataSize = vnode.data.attrs["data-size"];
          const oldDataSize = oldVnode.data.attrs["data-size"];
          if (dataSize === oldDataSize) return;
          const selectWrap = el.querySelector(".el-table__body-wrapper");
          const selectTbody = selectWrap.querySelector("table tbody");
          const selectRow = selectWrap.querySelector("table tr");
          if (!selectRow) {
            return;
          }
          const rowHeight = selectRow.clientHeight;
          let showRowNum = Math.round(selectWrap.clientHeight / rowHeight);

          const createElementTR = document.createElement("tr");
          let createElementTRHeight =
            (dataSize - showRowNum - spillDataNum) * rowHeight;
          createElementTR.setAttribute(
            "style",
            `height: ${createElementTRHeight}px;`
          );
          selectTbody.append(createElementTR);

          // 监听滚动后事件
          selectWrap.addEventListener("scroll", function () {
            let topPx = this.scrollTop - spillDataNum * rowHeight;
            let topNum = Math.round(topPx / rowHeight);
            let minTopNum = dataSize - spillDataNum - showRowNum;
            if (topNum > minTopNum) {
              topNum = minTopNum;
            }
            if (topNum < 0) {
              topNum = 0;
              topPx = 0;
            }
            selectTbody.setAttribute(
              "style",
              `transform: translateY(${topPx}px)`
            );
            createElementTR.setAttribute(
              "style",
              `height: ${
                createElementTRHeight - topPx > 0
                  ? createElementTRHeight - topPx
                  : 0
              }px;`
            );
            setRowDisableNone(topNum, showRowNum, binding);
          });
        });
      }
    }
  },

  setup() {
    const formatHex=(hexString)=>{
      // 移除字符串开头的 "0x" 前缀（如果有的话）
      const cleanedString = hexString.replace(/^0x/, '');

      // 获取需要填充的零的数量
      // const paddingLength = 4 - cleanedString.length;

      // 使用 "0" 进行左侧填充，使字符串达到固定长度
      const paddedString = cleanedString.padStart(4, '0');

      // 添加 "0x" 前缀
      const formattedString = `0x${paddedString}`;

      return formattedString;
    }
    // const indexMethod = (index) => {
    //   return formatHex((index*4).toString(16))
    // }
    //***************tableEdit****************/
    const columnList = reactive([
      { prop: "offset",label: 'Offset', show: true,width: 100},
      // { prop: "address", label: 'Address', show: true},
      { prop: "reg_gather_name", label: 'RegName', show: true,width: 200},
      { prop: "reset", label: 'Reset(Hex)', show: true,width: 100},
      { prop: "reg_ram", label: 'Reg/Ram', show: true,width: 100},
      { prop: "retention", label: 'Retention', show: true,width: 100},
      { prop: "description", label: 'Description', show: true,width: 300},
    ])

    const regColumnList = reactive([
      { prop: "start_bit", label: 'High', show: true, width: 100 },
      { prop: "end_bit", label: 'Low', show: true, width: 100 },
      { prop: "RW", label: 'R/W', show: true, width: 100 },
      { prop: "hw_RW", label: 'HW R/W', show: true, width: 100 },
      { prop: "reset_value", label: 'Reset Value(Hex)', show: true, width: 100 },
      { prop: "field", label: 'Field', show: true, overflow: true, width: 200 },
      // { prop: "valueid", label: 'ValueId', show: true,width:100},
      { prop: "description", label: 'Description', show: true, overflow: true, width: 300 },
      { prop: "note", label: '修改意见', show: true, overflow: true, width: 170 },
    ])

    const regValue = reactive([
      { prop: "value", label: 'Value', show: true, width: 100 },
      { prop: "valueId", label: 'ValueId', show: true, width: 150 },
      { prop: "description", label: 'Description', show: true, overflow: true, width: 300 },
    ])

    const draggableOptions = {
      group: 'table',
      handle: '.drag-handle',
      animation: 200
    }


    const tableEditInfo = reactive({
      count_col: 0,
      row: {},
      // showMenu: false,
      curTarget: {                 // 当前目标信息
        rowIdx: null,              // 行下标
        // colIdx: null,              // 列下标
        // isHead: undefined          // 当前目标是表头？
      },
    })


    const drawer = ref(false)
    const allowDrop = ref(null)
    const dialogFormVisible = ref(false)
    //校验判断
    const isInvalid = ref(false)
    let expands = [];

    const storeState = useState('reg_gather_list', ['RegGatherList'])
    let reg_gather_list = []
    const route = useRoute()
    const store = useStore()
    const router = useRouter();

    // const reloadVuex=()=>{
    //   window.addEventListener('beforeunload', () => {
    //     sessionStorage.setItem('list', JSON.stringify(store.state))
    //   })
    //   try {
    //     sessionStorage.getItem('list') && store.replaceState(Object.assign({}, store.state, JSON.parse(sessionStorage.getItem('list'))))

    //   } catch (err) {
    //     console.log(err)
    //   }
    //   sessionStorage.removeItem('list')
    // }



    const compareDesc = (p) => { //这是比较函数
      return function (m, n) {
        var a = m[p].content;
        var b = n[p].content;
        return b - a; //降序
      }
    }

    const compareAsc = (p) => { //这是比较函数
      return function (m, n) {
        var a = parseInt(m[p].content, 16);
        var b = parseInt(n[p].content, 16);
        return a - b; //降序
      }
    }

     const  getData = async () => {
      await getRegGatherList(route.params.ip_uuid).then((res) => {
        for (var i = 0; i < res.length; ++i) {
          let regGatherTemp = {}
          let single_reg_list = []
          for (var key in res[i]) {
            if (key === "tag" || key === "ip_uuid" || key === "reg_gather_uuid") {
              regGatherTemp[key] = res[i][key]
            } else {
              regGatherTemp[key] = { content: res[i][key], show: true }
            }
          }

          getSingleList(res[i].reg_gather_uuid).then((res) => {
            for (var j = 0; j < res.length; ++j) {
              let singelRegTemp = {}
              for (var key in res[j]) {
                if (key === "reg_gather_uuid" || key === "single_reg_uuid") {
                  singelRegTemp[key] = res[j][key]
                } else {
                  singelRegTemp[key] = { content: res[j][key], show: true }
                }
              }
              let value_list = []
              getValueList(res[j].single_reg_uuid).then((res) => {
                for (var k = 0; k < res.length; ++k) {
                  let valueTemp = {}
                  for (var key in res[k]) {
                    if (key === "single_reg_uuid" || key === "value_uuid") {
                      valueTemp[key] = res[k][key]
                    } else {
                      valueTemp[key] = { content: res[k][key], show: true }
                    }
                  }
                  value_list.push(valueTemp)
                }
              })
              singelRegTemp.values = value_list
              single_reg_list.push(singelRegTemp)
              single_reg_list.sort(compareDesc("start_bit"))
            }
          })
          regGatherTemp.singleReg = single_reg_list

          reg_gather_list.push(regGatherTemp)
          reg_gather_list.sort(compareAsc("offset"))
        }
        store.commit('reg_gather_list/getRegGatherListValue', reg_gather_list)
        // gatherStore.getRegGather(reg_gather_list)
      })
    }

    // let tbodyList =ref([])
    const loading = ref(true)
    onMounted(()=>{
      setTimeout(() => {
        getData();
        loading.value = false
      },1000)
      
      dropTable(); 
      window.addEventListener('beforeinput',throttledHandleInput)
      window.addEventListener('input',throttledHandleInput)


      // watchEffect(() => {
      //   for (var i in tableData.value) {
      //     //这里重新处理offset
      //     for (var key in tableData.value[i]) {
      //       if (key == "offset") {
      //         if (!tableData.value[i][key].content.includes("~")) {
      //           if (i >= 1) {
      //             if ((parseInt(tableData.value[i][key].content, 16) - parseInt(tableData.value[i - 1][key].content, 16)) <= 4) {
      //               tableData.value[i][key].content = formatHex((parseInt(tableData.value[i - 1][key].content, 16) + 4).toString(16))
      //             }
      //           }
      //         } 
      //       }
      //     }
      //   }
      // })
    });
      
    onBeforeUnmount(()=>{
      window.removeEventListener('beforeinput', throttledHandleInput);
      window.removeEventListener('input', throttledHandleInput);
    })


    
    // reloadVuex()


    let tableData =  reactive(computed(() => storeState.RegGatherList.value))



    // const updateVersion=(ip_uuid)=>{
    //   var ip_list = store.state.IP.ip_lists
    //   for(var i in ip_list){
    //     if(ip_list[i].ip_uuid === ip_uuid){
    //       console.log(ip_list[i].ip_uuid)
    //       console.log("version",parseFloat(ip_list[i].version.match(/\d+(\.\d+)?/)[0])+0.1)
    //       ip_list[i].version = "v"+(parseFloat(ip_list[i].version.match(/\d+(\.\d+)?/)[0])+0.1).toString()
    //       // editIpVersion(ip_uuid,ip_list[i])
    //     }
    //   }
    // }


    let passCount = 0

    const saveData= async ()=>{
      let gatherList = []
        let singleList = []
        let valueList = []
        passCount = 0
        for (var i in tableData.value) {
          //这里重新处理offset
          let gatherObj = {}
          for (var key in tableData.value[i]) {
            if (key == "tag") {
              if (tableData.value[i]["tag"] == "pass") {
                passCount = passCount + 1
              }
            }
            if (key == "reset") {
              continue
            }
            // if (key == "offset"){
            //   if(!tableData.value[i][key].content.includes("~")){
            //     if(i>=1){
            //       if((parseInt(tableData.value[i][key].content,16)-parseInt(tableData.value[i-1][key].content,16))>4){
            //         gatherObj[key] = tableData.value[i][key]
            //       }else{
            //         // console.log((parseInt(tableData.value[i-1][key].content,16)+4).toString(16))
            //         tableData.value[i][key].content = formatHex((parseInt(tableData.value[i-1][key].content,16)+4).toString(16))
            //         // gatherObj[key] = (parseInt(tableData.value[i-1][key].content,16)+4).toString(16)
            //       }
            //     }
            //     gatherObj[key] = tableData.value[i][key]
            //     // tableData.value[i][key].content = formatHex((tableData.value[i].row_index*4).toString(16))
            //   }else{
            //     gatherObj[key] = tableData.value[i][key]
            //   }
            // }
            if (key != "singleReg") {
              gatherObj[key] = tableData.value[i][key]
            } 
            else {
              for (var sr in tableData.value[i][key]) {
                let singleObj = {}
                for (var j in tableData.value[i][key][sr]) {
                  if (j != "values") {
                    if (j == "note") {
                      if (tableData.value[i][key][sr]["note"].content) {
                        gatherObj["tag"] = "review"
                      }
                    }
                    singleObj[j] = tableData.value[i][key][sr][j]
                  } else {
                    for (var k in tableData.value[i][key][sr][j]) {
                      let valObj = {}
                      for (var l in tableData.value[i][key][sr][j][k]) {
                        valObj[l] = tableData.value[i][key][sr][j][k][l]
                      }
                      valueList.push(valObj)
                    }
                  }
                }
                singleList.push(singleObj)
                // singleList.sort(compareDesc("start_bit"))
              }
            }
          }
          let templist = []   //存储reset值
          for (var h = 0; h < tableData.value[i]["singleReg"].length; ++h) {
            var tempRsetValue;
            if((tableData.value[i]["singleReg"][h]["reset_value"].content).includes("b")){
              tempRsetValue = parseInt((tableData.value[i]["singleReg"][h]["reset_value"].content).substr(1), 2)
            }
            else if((tableData.value[i]["singleReg"][h]["reset_value"].content).includes("h")){
              tempRsetValue = parseInt((tableData.value[i]["singleReg"][h]["reset_value"].content).substr(1), 16)
            }
            else if((tableData.value[i]["singleReg"][h]["reset_value"].content).includes("-")) {
              tempRsetValue = parseInt((tableData.value[i]["singleReg"][h]["reset_value"].content),10)>>>0
            }
            else{
              tempRsetValue = parseInt(tableData.value[i]["singleReg"][h]["reset_value"].content)
            }
            // console.log("tempRsetValue", (parseInt("-5",10)>>>0).toString(2))
            templist.push(tempRsetValue << parseInt(tableData.value[i]["singleReg"][h]["end_bit"].content) >>> 0)//.toString(2).padStart(32, '0')

            // templist.push(parseInt(newData[i]["singleReg"][h]["reset_value"].content, 16) << parseInt(newData[i]["singleReg"][h]["end_bit"].content) >>> 0)//.toString(2).padStart(32, '0')
          }

          if (templist.length != 0) {
            const result = templist.reduce((acc, binaryValue) => {
              return acc | binaryValue; // 进行位与运算
            });
            tableData.value[i]["reset"].content = "0x" + parseInt((result >>> 0).toString(2).padStart(32, '0'), 2).toString(16)
            gatherObj["reset"] = { content: "0x" + parseInt((result >>> 0).toString(2).padStart(32, '0'), 2).toString(16), show: true }
          }else{
            gatherObj["reset"] = {content:"0",show: true }
          }
          gatherList.push(gatherObj)
          
          // newData[i]["singleReg"].sort(compareDesc("start_bit"))
          // if(passCount === newData.length){
          //   updateVersion(newData[i].ip_uuid)
          // }
        }
        tableData.value.sort(compareAsc("offset"))
        try {
          await store.commit('reg_gather_list/getRegGatherListValue', tableData.value)
          await store.commit('reg_gather/getRegGather', gatherList)
          await store.commit('single_reg/getSingleReg', singleList)
          await store.commit('value/getValue', valueList)
          router.push({
            path: "/ecommerce/Orders/order-list",
            name: "Order List",
          })
        } catch (error) {
          console.error('Error:', error)
        }

    }



    
    
    

    // watch(
    //   tableData,
    //   async (newData) => {
    //     console.log("newData",newData)
    //     console.log("tableData",tableData)
    //     // if (JSON.stringify(newData) != JSON.stringify(oldData)) {
    //     //   console.log("newData",newData)
    //     //   console.log("oldData",oldData)
    //     // }

    //     let gatherList = []
    //     let singleList = []
    //     let valueList = []
    //     passCount = 0
    //     for (var i in newData) {
    //       let gatherObj = {}
    //       for (var key in newData[i]) {
    //         if (key == "tag") {
    //           if (newData[i]["tag"] == "pass") {
    //             passCount = passCount + 1
    //           }
    //         }
    //         if (key == "reset") {
    //           continue
    //         }
    //         if (key != "singleReg") {
    //           gatherObj[key] = newData[i][key]
    //         } else {
    //           for (var sr in newData[i][key]) {
    //             let singleObj = {}
    //             for (var j in newData[i][key][sr]) {
    //               if (j != "values") {
    //                 if (j == "note") {
    //                   if (newData[i][key][sr]["note"].content) {
    //                     gatherObj["tag"] = "review"
    //                   }
    //                 }
    //                 singleObj[j] = newData[i][key][sr][j]
    //               } else {
    //                 for (var k in newData[i][key][sr][j]) {
    //                   let valObj = {}
    //                   for (var l in newData[i][key][sr][j][k]) {
    //                     valObj[l] = newData[i][key][sr][j][k][l]
    //                   }
    //                   valueList.push(valObj)
    //                 }
    //               }
    //             }
    //             singleList.push(singleObj)
    //             // singleList.sort(compareDesc("start_bit"))
    //           }
    //         }
    //       }
    //       let templist = []   //存储reset值
    //       for (var h = 0; h < newData[i]["singleReg"].length; ++h) {
    //         var tempRsetValue;
    //         if((newData[i]["singleReg"][h]["reset_value"].content).includes("b")){
    //           tempRsetValue = parseInt((newData[i]["singleReg"][h]["reset_value"].content).substr(1), 2)
    //         }
    //         else if((newData[i]["singleReg"][h]["reset_value"].content).includes("h")){
    //           tempRsetValue = parseInt((newData[i]["singleReg"][h]["reset_value"].content).substr(1), 16)
    //         }
    //         else if((newData[i]["singleReg"][h]["reset_value"].content).includes("-")) {
    //           tempRsetValue = parseInt((newData[i]["singleReg"][h]["reset_value"].content),10)>>>0
    //         }
    //         else{
    //           tempRsetValue = parseInt(newData[i]["singleReg"][h]["reset_value"].content)
    //         }
    //         // console.log("tempRsetValue", (parseInt("-5",10)>>>0).toString(2))
    //         templist.push(tempRsetValue << parseInt(newData[i]["singleReg"][h]["end_bit"].content) >>> 0)//.toString(2).padStart(32, '0')

    //         // templist.push(parseInt(newData[i]["singleReg"][h]["reset_value"].content, 16) << parseInt(newData[i]["singleReg"][h]["end_bit"].content) >>> 0)//.toString(2).padStart(32, '0')
    //       }

    //       if (templist.length != 0) {
    //         const result = templist.reduce((acc, binaryValue) => {
    //           return acc | binaryValue; // 进行位与运算
    //         });
    //         newData[i]["reset"].content = "0x" + parseInt((result >>> 0).toString(2).padStart(32, '0'), 2).toString(16)
    //         gatherObj["reset"] = { content: "0x" + parseInt((result >>> 0).toString(2).padStart(32, '0'), 2).toString(16), show: true }
    //       }else{
    //         gatherObj["reset"] = {content:"0",show: true }
    //       }
    //       gatherList.push(gatherObj)
          

    //       // newData[i]["singleReg"].sort(compareDesc("start_bit"))
    //       // if(passCount === newData.length){
    //       //   updateVersion(newData[i].ip_uuid)
    //       // }
    //     }
    //     // newData.sort(compareAsc("offset"))
    //     try {
    //       await store.commit('reg_gather_list/getRegGatherListValue', newData)
    //       await store.commit('reg_gather/getRegGather', gatherList)
    //       await store.commit('single_reg/getSingleReg', singleList)
    //       await store.commit('value/getValue', valueList)
    //     } catch (error) {
    //       console.error('Error:', error)
    //     }
    //   }, { deep: true });


    let regionType = ref("")
    // const selectedAccount = []
    // let regionTypes = []

    // table的左键点击当前行事件
    const clickTableRow = (row) => {
      var menu = document.querySelector("#contextmenu");
      menu.style.display = "none"
      if (row.row_index === expands[0]) {
        //点击另一行的时候，把expands清空。即可把上一行给关闭，展开当前点击行
        expands = [];
      }
      else {
        expands = [];
        expands.push(row.row_index);
      }
            // 当前目标
      tableEditInfo.row = row
      tableEditInfo.curTarget = {
        rowIdx: row ? row.row_index : null,
      }
    }
    // table的右键点击当当前事件

    const rightClick = (row, column, event) => {
        // 阻止浏览器自带的右键菜单弹出
      event.preventDefault() // window.event.returnValue = false
      if (column.index == null) return
      // 定位菜单
      var menu = document.querySelector('#contextmenu')
      menu.style.top = event.clientY - 70 + 'px'
      menu.style.left = event.clientX - 140 + 'px'
      menu.style.display = "block"
      // if(window.innerWidth - 140 < event.clientX) {
      //   ele.style.left = 'unset'
      //   ele.style.right = 0
      // }
      // tableEditInfo.showMenu = true
      // console.log(row.ip_uuid)
      // tableData.forEach((item, index) => {
      //   if (item.reg_gather_uuid === row.reg_gather_uuid) {
      //     console.log(index)
      //     //这里判断相等的条件可以自己改为该行数据的唯一键
      //     // this.currentRowIndex = index;
      //     return false;
      //   }
      // })

      // 当前目标
      tableEditInfo.row = row
      tableEditInfo.curTarget = {
        rowIdx: row ? row.row_index : null,
      }
    }
    // 新增行
    const addRow = (later) => {
      var menu = document.querySelector("#contextmenu");
      menu.style.display = "none";
      let idx;
      let offset_temp;
      // tableEditInfo.showMenu = false
      if (tableEditInfo.curTarget.rowIdx === null) {
        idx = 0
        offset_temp = formatHex("0")
      }
      else {
        idx = later ? tableEditInfo.curTarget.rowIdx + 1 : tableEditInfo.curTarget.rowIdx
        if(idx!=0){
          offset_temp = later ? (parseInt(tableEditInfo.row.offset.content,16)+4).toString(16) : (parseInt(tableEditInfo.row.offset.content,16)-4).toString(16)
        }else{
          offset_temp = formatHex("0")
        }
      }

      let obj = {}
      // let singleRegObj = {}
      // let singleRegValues = {}
      columnList.forEach(p => {
        if(p.prop==="offset"){
          // obj[p.prop] = { content: formatHex((idx*4).toString(16)), show: true, placeholder: "请输入" + p.prop }
          obj[p.prop] = { content: formatHex(offset_temp), show: false, placeholder: "请输入" + p.prop }
        }else{
          obj[p.prop] = { content: "", show: false, placeholder: "请输入" + p.prop }
        }
      })
      //=========================/
      // regColumnList.forEach(p => {
      //   singleRegObj[p.prop] = { content: "", show: false, placeholder: "请输入" + p.prop }

      // })

      obj.ip_uuid = route.params.ip_uuid

      // singleRegObj.single_reg_uuid = uuidv4()
      // regValue.forEach(p => {
      //   singleRegValues[p.prop] = { content: "", show: false, placeholder: "请输入" + p.prop }
      // })
      // singleRegObj.values = []
      // singleRegObj.values.push(singleRegValues)
      obj.reg_gather_uuid = uuidv4()
      obj.tag = "draft"
      obj.singleReg = []
      // obj.singleReg.push(singleRegObj)
      // store.commit('reg_gather/addRegGather', obj)
      if (tableData.value.length !== 0) {
        tableData.value.splice(idx, 0, obj)
      } else {
        tableData.value[0] = obj
      }
    }

    // 删除集合表格一行
    const delRegGatherRow = (index, row) => {
      // console.log(regGather)
      // console.log(row.single_reg_uuid)
      // console.log(index)
      tableData.value.splice(index, 1)
      deleteRegGather(row.reg_gather_uuid)
      // editRow(regGather, index, row)
    }


    // 删除行
    const delRow = () => {
      var menu = document.querySelector("#contextmenu");
      menu.style.display = "none";
      // tableEditInfo.showMenu = false
      // console.log(tableEditInfo.row.ip_uuid)
      tableEditInfo.curTarget.rowIdx !== null && tableData.value.splice(tableEditInfo.curTarget.rowIdx, 1)
      deleteRegGather(tableEditInfo.row.reg_gather_uuid)

    }

    // 添加表格行下标
    const tableRowClassName = ({ row, rowIndex }) => {
      row.row_index = rowIndex
    }


  
    //***************tableInfo********************/
    // 获取行号
    const getRowKeys = (row) => {
      return row.row_index
    }

    // 增加扩展表格一行
    const addRegRow = (regGather, index) => {
      if (index === null) return
      let obj = {}
      obj.reg_gather_uuid = regGather.reg_gather_uuid
      obj.single_reg_uuid = uuidv4()
      regColumnList.forEach(p => {
        obj[p.prop] = { content: "", show: false, placeholder: "请输入" + p.prop }
      })
      obj.values = []
      if (regGather.singleReg.length != 0) {
        regGather.singleReg.splice(index + 1, 0, obj)
      } else {
        regGather.singleReg[0] = obj
      }

    }

    // 删除扩展表格一行
    const delRegRow = (regGather, index, row) => {
      // console.log(regGather)
      // console.log(row.single_reg_uuid)
      // console.log(index)
      regGather.singleReg.splice(index, 1)
      deleteSingle(row.single_reg_uuid)

      // editRow(regGather, index, row)
    }

    const editRow = (regGather, index, row) => {
      allowDrop.value.options.disabled=true
      isLock.value=true
      for (var i in row) {
        if (Object.prototype.toString.call(row[i]) === '[object Object]') {
          row[i].show = !row[i].show
          // if (row[i].show === true) {
          //   row[i].show = false
          // } else {
          //   row[i].show = true
          // }
        } 
        // else if (Object.prototype.toString.call(row[i]) === '[object Array]') {
        //   for (var j in row[i]) {
        //     if (Object.prototype.toString.call(row[i][j]) === '[object Object]') {
        //       for (var k in row[i][j]) {
        //         if (Object.prototype.toString.call(row[i][j][k]) === '[object Object]') {
        //           row[i][j][k].show = !row[i][j][k].show
        //           // if (row[i][j][k].show === true) {
        //           //   row[i][j][k].show = false
        //           // } else {
        //           //   row[i][j][k].show = true
        //           // }
        //         }
        //       }
        //     }
        //   }
        // }
      }
    }
    //增加值的一行
    const addValueRow = (singelReg, index) => {
      let regValues = {}
      regValues.single_reg_uuid = singelReg.single_reg_uuid
      regValues.value_uuid = uuidv4()
      regValue.forEach(p => {
        regValues[p.prop] = { content: "", show: false, placeholder: "请输入" + p.prop }
      })
      singelReg.values.splice(index + 1, 0, regValues)
    }


    //删除值的一行
    const delValueRow = (singelReg, index, row) => {
      singelReg.values.splice(index, 1)
      deleteValue(row.value_uuid.content)

    }

    const gather = ref(null)
    const filterTag = (value, row) => {
      return row.tag === value
    }



    // const resetDateFilter = () => {
    //   console.log(gather.value)
    //   // gatherTable.value!.clearFilter(['date'])
    // }
    // // TODO: improvement typing when refactor table
    // const clearFilter = () => {
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-expect-error
    //   gatherTable.value!.clearFilter()
    // }





    // 选择事件
    // const handleSelect=(selection, row)=>{
    //   console.log(row)
    //   selectedAccount.push(selection)
    //   // console.log(selectedAccount)
    //   // this.stateArr[this.pageNo - 1] = selection
    //   // this.selectedAccount = this.stateArr.flat()
    // }

    //转移寄存器
    const editRowData = ref(null)
    const currentIdx = ref(null)
    const editRegGatherData = ref(null)
    const changeRegGather = (regGather, index, row) => {
      editRegGatherData.value = regGather
      editRowData.value = row
      currentIdx.value = index
      dialogFormVisible.value = true
    }


    const cancelClick = () => {
      drawer.value = false
    }

    const confirmClick = () => {
      // console.log("editData",editRowData.value)
      // console.log("currentIdx",currentIdx.value)
      // console.log("regGather",editRegGatherData.value)
      let selectedName = tableData.value.find((item) => {
        return item.reg_gather_uuid === regionType.value;
        //筛选出匹配数据，是对应数据的整个对象
      });
      // console.log(selectedName)
      if (selectedName) {
        dialogFormVisible.value = false
        editRowData.value.reg_gather_uuid = selectedName.reg_gather_uuid
        selectedName.singleReg.push(editRowData.value)
        editRegGatherData.value.singleReg.splice(currentIdx.value, 1)
      } else {
        ElMessageBox.confirm(`cann't find this reg gather!!!!`)
          .then(() => {
          })
          .catch(() => {
            // catch error
          })
      }
    }

    //***************数据校验********************/
    //监听input输入事件
    const regGatherCheck = (colName, row, index) => {
      const pattern = /^0x[0-9a-fA-F]+$/i;
      if (colName == "offset") {
        if (pattern.test(row[colName].content) === true) {
          isInvalid.value = false
          for (var i in tableData.value) {
            if (i != index) {
              if (tableData.value[i]["offset"].content == row[colName].content) {
                isInvalid.value = true
              }
              else {
                isInvalid.value = false

              }
            }
          }
        } else {
          isInvalid.value = true
        }
      }
    }

    const throttledHandleInput = throttle(regGatherCheck, 500); // 限制事件的触发频率为500毫秒


    const containerRef = ref(null);


    //监听input输入事件
    const singleRegCheck = (colName, row) => {
      //low=end_bit,high=start_bit,start_bit>end_bit
      if (colName == "end_bit") {
        if (parseInt(row[colName].content) > parseInt(row["start_bit"].content) || parseInt(row[colName].content) > 31) {
          isInvalid.value = true
        } else {
          isInvalid.value = false
        }
      } else if (colName == "start_bit") {
        if (parseInt(row[colName].content)  < parseInt(row["end_bit"].content) || parseInt(row[colName].content) > 31) {
          isInvalid.value = true
        } else {
          isInvalid.value = false
        }
      } else if (colName == "RW") {
        if (['R', 'W', 'R/W'].indexOf(row[colName].content.toUpperCase()) === -1) {
          isInvalid.value = true
        } else {
          isInvalid.value = false
        }
      }
    }

    /***************拖拽*****************/
    // 行拖拽
    const dropTable = () => {
      const tbody = document.querySelector('.el-table__body-wrapper tbody');
      allowDrop.value = Sortable.create(tbody, {
        disabled:true,
        onUpdate: (event) => {
          const oldIndex = event.oldIndex,
            newIndex = event.newIndex,
            $child = tbody.children[newIndex],
            $oldChild = tbody.children[oldIndex]
          // 先删除移动的节点
          tbody.removeChild($child)
          // 再插入移动的节点到原有节点，还原了移动的操作
          if (newIndex > oldIndex) {
            tbody.insertBefore($child, $oldChild)
          } else {
            tbody.insertBefore($child, $oldChild.nextSibling)
          }
        },
        onEnd({ newIndex, oldIndex }) {
          if (newIndex == oldIndex) return;
          tableData.value.splice(newIndex, 0, tableData.value.splice(oldIndex, 1)[0]);
          var newArray = tableData.value.slice(0);
          // tableData.value= [];
          nextTick(function () {
            // tableData.value= newArray;
            store.commit('reg_gather_list/getRegGatherListValue', newArray)
            // console.table(storeState.RegGatherList.value)
          });
        }
      })
    }

    const expandChange=(row)=>{
      if (expands.includes(row.row_index)) {
        expands = expands.filter(row_index => row_index !== row.row_index)
      } else {
        expands.push(row.row_index)
      }
    }

    let isLock =ref(true)
    const lockIcon = computed(() => {
      return isLock.value ? 'fa fa-lock' : 'fa fa-unlock';
    });
    
    const lockDrop=()=>{
      allowDrop.value.options.disabled = !allowDrop.value.options.disabled
      isLock.value = allowDrop.value.options.disabled
    }
    let currentStartIndex=0;
    let currentEndIndex=50;

    const filteredData=computed(()=>{
      let list = tableData.value.filter((item, index) => {
        if (index < currentStartIndex) {
          return false;
        } else if (index > currentEndIndex) {
          return false;
        } else {
          return true;
        }
      });
      return list;
    })



    const handelLoadmore=(currentStartIndex1, currentEndIndex1)=>{
      currentStartIndex = currentStartIndex1;
      currentEndIndex = currentEndIndex1;
    }



    return {
      tableData,
      tableEditInfo,
      columnList,
      expands,
      regColumnList,
      drawer,
      regionType,
      regValue,
      gather,
      dialogFormVisible,
      draggableOptions,
      isInvalid,
      isLock,
      lockIcon,
      loading,
      containerRef,
      filteredData,
      expandChange,
      getRowKeys,
      rightClick,
      tableRowClassName,
      addRow,
      delRow,
      delRegRow,
      clickTableRow,
      addRegRow,
      cancelClick,
      confirmClick,
      editRow,
      addValueRow,
      delValueRow,
      filterTag,
      regGatherCheck,
      singleRegCheck,
      changeRegGather,
      compareDesc,
      compareAsc,
      throttledHandleInput,
      // indexMethod,
      saveData,
      formatHex,
      dropTable,
      lockDrop,
      delRegGatherRow,
      MoreFilled,
      Delete,
      Plus,
      Edit,
      ...storeState,
      handelLoadmore

    }
  },
  data() {
    return {
      currentStartIndex: 0,
      currentEndIndex: 20
    };
  },

  // computed: {
  //   filteredData() {
  //     let list = this.tableData.filter((item, index) => {
  //       if (index < this.currentStartIndex) {
  //         return false;
  //       } else if (index > this.currentEndIndex) {
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     });
  //     return list;
  //   }
  // },

  // methods: {
  //   handelLoadmore(currentStartIndex, currentEndIndex) {
  //     console.log(currentStartIndex,currentEndIndex)
  //     this.currentStartIndex = currentStartIndex;
  //     this.currentEndIndex = currentEndIndex;
  //   },
  // },
  
}

</script>

<style scope>
.drag-handle {
  cursor: move;
  display: inline-block;
  width: 16px;
  height: 16px;
  /* background: url(拖拽图标路径) no-repeat center center; */
}
#singelReg{
  position: relative;
  left:150px;
}

#valTable {
  position: relative;
  left: 300px;
}

#contextmenu {
  position: absolute;
  display: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background: #ffffff;
  cursor: pointer;
  color: #606266;
  width: 150px;
  border: 1px solid #e4e7ed;
  /* margin: 50px auto; */
  font-size: 13px;
  z-index: 12
}

#contextmenu ul {
  list-style: none;
  margin: 0px;
  padding: 5px;
}

#contextmenu ul li {
  padding: 0px 10px;
  height: 30px;
  line-height: 30px;
  position: relative;
  box-sizing: border-box;
  text-indent: 8px;
}

#contextmenu ul li ul {
  display: none;
  position: absolute;
  left: 200px;
  top: 0px;
  width: 200px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

#contextmenu ul li ul li {
  background-color: #fff;
}

#contextmenu ul li:hover {
  background-color: #ecf5ff;
}

#contextmenu ul li:hover ul {
  display: block;
}

.header {
  float: left;
}

.addbutton {
  float: right;
}

.addValueButton {
  float: left;
}

.input-div {
  white-space: pre;
}

.custom-border {
  border: 1px solid red;
}

.generl_input__inner {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #606266;
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  width: 100%;  
  padding: 0 15px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
}
</style>