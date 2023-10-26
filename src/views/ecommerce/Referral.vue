<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div style="margin-bottom: 5px;">
          <argon-button color="white" variant="outline" class="btn-icon ms-2 export"  @click="exportDialogExcelVisible = true">
            <span class="btn-inner--icon">
              <i class="ni ni-archive-2"></i>
            </span>
            <span class="btn-inner--text">导出Excel</span>
          </argon-button>
        </div>
        <div class="card">
          <div class="container-fluid">
            <div style="width:300px; height:auto; float:right; display:inline">
              <vxe-toolbar ref="toolbarRef" custom>
              </vxe-toolbar>

            </div>
            <div style="margin-top: 10px;">
              <p>
                <vxe-input v-model="filterName" type="search" placeholder="试试全表搜索" @keyup="searchEvent"></vxe-input>
              </p>
            </div>
            <vxe-table id="toolbar_demo3" ref="tableRef" height="500" border :column-config="{ resizable: true }"
              :custom-config="{ storage: true }" :data="tableData" style="margin-bottom: 20px;">
              <div v-for="(col, idx) in columnList" :key="idx" :index="idx">
                <vxe-column
                  v-if="col.prop == 'MBIST' || col.prop == 'TWO_NODE' || col.prop == 'CHECK_WAVE' || col.prop == 'JTAG_ACCESS'"
                  :field="col.prop" :title="col.label" :filters="boolOptions" :filter-multiple="false">
                  <template #edit="{ row }">
                    <input v-model.lazy="row[col.prop]">
                  </template>
                </vxe-column>
                <vxe-column v-else-if="col.prop == 'TIME'" :field="col.prop" :title="col.label" sortable
                  :filters="DataFilter" :filter-method="customDateFilterMethod">
                  <template #filter="{ $panel, column }">
                    <template v-for="(option, i) in column.filters" :key="i">
                      <div style="display: flex">
                        <span style="line-height: 42px; margin-right: 5px; margin-left: 10px">{{ option.label }}</span>
                        <vxe-input v-model="option.prop" type="datetime" placeholder="请选择" transfer clearable
                          @input="$panel.changeOption($event, !!option.prop, option)" />
                      </div>
                    </template>
                  </template>
                </vxe-column>
                <vxe-column v-else-if="col.prop == 'RTL_VERSION'" :field="col.prop" :title="col.label" sortable
                  :filters="versionOptions" :filter-method="filterversionMethod"
                  :filter-recover-method="filterversionRecoverMethod">
                  <template #filter="{ $panel, column }">
                    <input v-for="(option, index) in column.filters" :key="index" v-model="option.prop" type="type"
                      class="my-input" @input="$panel.changeOption($event, !!option.prop, option)"
                      @keyup.enter="$panel.confirmFilter()" placeholder="按回车确认筛选">
                  </template>
                </vxe-column>
                <vxe-column v-else :field="col.prop" :title="col.label" sortable>
                  <template #edit="{ row }">
                    <input v-model.lazy="row[col.prop]">
                  </template>
                </vxe-column>
              </div>
            </vxe-table>
            <el-dialog v-model="exportDialogExcelVisible" class="dialogLarge" title="导出" append-to-body
              :destroy-on-close="true">
              <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">Check
                all</el-checkbox>
              <el-checkbox-group v-model="checkedPatternField" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="city in PatternField" :key="city" :label="city">
                  {{ city }}
                </el-checkbox>
              </el-checkbox-group>
              <el-button type="primary" style="margin-left: 10px;padding: 10px;"
                @click="downloadReg">导出</el-button>
              <!-- <div id="bodyContainer"></div> -->
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import ArgonButton from "@/components/ArgonButton.vue";
import { ref, nextTick, reactive, computed, onMounted } from 'vue'
import { getIpListApi } from "@/http/api/pattern_info"
import { useStore } from "vuex";
import { useState } from '@/store/hook/useState';
import dayjs from "dayjs";
import Sortable from 'sortablejs'
import ExcelJS from "exceljs";
import { ElMessage } from 'element-plus';
import { saveAs } from "file-saver";

const store = useStore();
const tableRef = ref()
const toolbarRef = ref()
const columnList = ref([
  { prop: "TEST_ITEM", label: 'TestItem' },
  { prop: "PATTERN_NAME", label: 'PatternName' },
  { prop: "TEST_CATEGORY", label: 'TestCategory' },
  { prop: "TEST_PURPOSE", label: 'TestPurpose' },
  { prop: "TEST_PROCESS", label: 'TestProcess' },
  { prop: "TEST_NOTES", label: 'TestNotes' },
  { prop: "USER", label: 'User' },
  { prop: "TIME", label: 'Time' },
  { prop: "RTL_VERSION", label: 'RtlVersion' },
  { prop: "NETLIST_VERSION", label: 'NetlistVersion' },
  { prop: "SIM_MODE", label: 'SimMode' },
  { prop: "TOOL", label: 'Tool' },
  { prop: "CORNER", label: 'Corner' },
  { prop: "MTM", label: 'Mtm' },
  { prop: "SIM_SEED", label: 'SimSeed' },
  { prop: "TWO_NODE", label: 'TwoNode' },
  { prop: "MBIST", label: 'Mbist' },
  { prop: "FPGA_FLOW", label: 'FPGAFlow' },
  { prop: "FPGA_WORK", label: 'FPGAWork' },
  { prop: "WORK_PATH", label: 'WorkPath' },
  { prop: "LOG_NAME", label: 'LogName' },
  { prop: "SIM_RESULTS", label: 'SimResults' },
  { prop: "CHECK_WAVE", label: 'CheckWave' },
  { prop: "JTAG_ACCESS", label: 'JtagAccess' },
  { prop: "PATTERN_MD5", label: 'PatternMD5' },
  { prop: "PROJECT_NAME", label: 'ProjectName' },
])
const DataFilter = ref([
  { data: '', label: '起:' },
  { data: '', label: '止:' }
])
const boolOptions = ref([
  { label: 'True', value: true },
  { label: 'False', value: false }
])
const versionOptions = ref([
  { data: '' }
])
const Field = ["TEST_ITEM",
      "PATTERN_NAME",
      "TEST_CATEGORY",
      "TEST_PURPOSE",
      "TEST_PROCESS",
      "TEST_NOTES",
      "USER",
      "TIME",
      "RTL_VERSION",
      "NETLIST_VERSION",
      "SIM_MODE",
      "TOOL",
      "CORNER",
      "MTM",
      "SIM_SEED",
      "TWO_NODE",
      "MBIST",
      "FPGA_FLOW",
      "FPGA_WORK",
      "WORK_PATH",
      "LOG_NAME",
      "SIM_RESULTS",
      "CHECK_WAVE",
      "JTAG_ACCESS",
      "PATTERN_MD5",
      "PROJECT_NAME"]
const exportDialogExcelVisible=ref(false)
const checkedPatternField = ref(Field)
const PatternField = ref(Field)
const filterversionRecoverMethod = ({ option }) => {
  // 如果是自定义筛选模板，当为点击确认时，该选项将被恢复为默认值
  option.data = ''
}
const filterversionMethod = ({ option, row }) => {
  return row.RTL_VERSION === option.prop
}
getIpListApi().then(async (res) => {
  await store.commit('patterninfo/PatternList', res)
  // getCategoryList(res)
})

const storeState = useState('patterninfo', ['pattern_lists'])
// let tableData = reactive(storeState.pattern_lists.value)
/***************搜索数据**************/
const filterName = ref('')

let tableData = reactive(computed(() => searchEvent()))
const searchEvent = () => {
  const filterVal = String(filterName.value).trim().toLowerCase()
  if (filterVal) {
    const filterRE = new RegExp(filterVal, 'gi')
    const searchProps = [
      "TEST_ITEM",
      "PATTERN_NAME",
      "TEST_CATEGORY",
      "TEST_PURPOSE",
      "TEST_PROCESS",
      "TEST_NOTES",
      "USER",
      "RTL_VERSION",
      "PROJECT_NAME"]
    const rest = storeState.pattern_lists.value.filter(item => searchProps.some(key => String(item[key]).toLowerCase().indexOf(filterVal) > -1))
    return rest.map(row => {
      const item = Object.assign({}, row)
      searchProps.forEach(key => {
        item[key] = String(item[key]).replace(filterRE, match => `${match}`);
      })
      return item
    })
  }
  return storeState.pattern_lists.value
}
const stateDate = ref("")
const customDateFilterMethod = ({ option, row }) => {

  if (option.prop) {
    if (option.label === "起:") {
      stateDate.value = dayjs(option.prop).valueOf();
    }
    if (option.label === "止:") {
      let date = dayjs(row.TIME).valueOf();
      if (date > stateDate.value && date < dayjs(option.prop).valueOf()) {
        return true;
      } else {
        return false;
      }
    }
  }
}



// const fixedColNameEvent = () => {
//   const $table = tableRef.value
//   if ($table) {
//     $table.setColumnFixed('TEST_ITEM', 'left')
//   }
// }
// const clearFixedColNameEvent = () => {
//   const $table = tableRef.value
//   if ($table) {
//     $table.clearColumnFixed('TEST_ITEM')
//   }
// }
nextTick(() => {
  // 将表格和工具栏进行关联
  const $table = tableRef.value
  const $toolbar = toolbarRef.value
  if ($table && $toolbar) {
    $table.connect($toolbar)
  }
})

const columnDrop = () => {
  nextTick(() => {
    const tbody = document.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row');
    Sortable.create(tbody, {
      handle: '.vxe-header--column',
      onEnd: ({ newIndex, oldIndex }) => {
        let tableColumn = tableRef.value.getColumns()
        let currRow = tableColumn.splice(oldIndex, 1)[0];
        tableColumn.splice(newIndex, 0, currRow);
        tableRef.value.loadColumn(tableColumn);
        //此处可根据实际需求写
      }
    })
  });
}

onMounted(() => {
  columnDrop()
})


const checkAll=ref(false)
const isIndeterminate=ref(true)


const handleCheckAllChange = (val)=>{
      checkedPatternField.value = val ? PatternField.value : []
      isIndeterminate.value = false
    }

const handleCheckedCitiesChange = (value)=>{
  const checkedCount = value.length
  checkAll.value = checkedCount === PatternField.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < PatternField.value.length
}

const exportFile=(workbook,header, columns, dataList, expertName, sheetName)=>{
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
    }


const downloadReg = () => {
  if (tableData.length != 0) {
    let workbook = new ExcelJS.Workbook()
      const header = checkedPatternField.value
      const value = {     "TEST_ITEM":"TEST_ITEM",
    "PATTERN_NAME":"PATTERN_NAME",
    "TEST_CATEGORY":"TEST_CATEGORY",
    "TEST_PURPOSE":"TEST_PURPOSE",
    "TEST_PROCESS":"TEST_PROCESS",
    "TEST_NOTES":"TEST_NOTES",
    "USER":"USER",
    "TIME":"TIME",
    "RTL_VERSION":"RTL_VERSION",
    "NETLIST_VERSION":"NETLIST_VERSION",
    "SIM_MODE":"SIM_MODE",
    "TOOL":"TOOL",
    "CORNER":"CORNER",
    "MTM":"MTM",
    "SIM_SEED":"SIM_SEED",
    "TWO_NODE":"TWO_NODE",
    "MBIST":"MBIST",
    "FPGA_FLOW":"FPGA_FLOW",
    "FPGA_WORK":"FPGA_WORK",
    "WORK_PATH":"WORK_PATH",
    "LOG_NAME":"LOG_NAME",
    "SIM_RESULTS":"SIM_RESULTS",
    "CHECK_WAVE":"CHECK_WAVE",
    "JTAG_ACCESS":"JTAG_ACCESS",
    "PATTERN_MD5":"PATTERN_MD5",
    "PROJECT_NAME":"PROJECT_NAME"}
      const columns = header.map((item) => {
        return {
          header: item,
          key: value[item],
          width: 30
        }
      })
      const dataList = []
      tableData.value.map((item) => {
        let gather_res = {}
        gather_res.TEST_ITEM = item.TEST_ITEM
        gather_res.PATTERN_NAME = item.PATTERN_NAME
        gather_res.TEST_CATEGORY = item.TEST_CATEGORY
        gather_res.TEST_PURPOSE = item.TEST_PURPOSE
        gather_res.TEST_PROCESS = item.TEST_PROCESS
        gather_res.TEST_NOTES = item.TEST_NOTES
        gather_res.USER = item.USER
        gather_res.TIME = item.TIME
        gather_res.RTL_VERSION = item.RTL_VERSION
        gather_res.NETLIST_VERSION = item.NETLIST_VERSION
        gather_res.SIM_MODE = item.SIM_MODE
        gather_res.TOOL = item.TOOL
        gather_res.CORNER = item.CORNER
        gather_res.MTM = item.MTM
        gather_res.SIM_SEED = item.SIM_SEED
        gather_res.TWO_NODE = item.TWO_NODE
        gather_res.MBIST = item.MBIST
        gather_res.FPGA_FLOW = item.FPGA_FLOW
        gather_res.FPGA_WORK = item.FPGA_WORK
        gather_res.WORK_PATH = item.WORK_PATH
        gather_res.LOG_NAME = item.LOG_NAME
        gather_res.SIM_RESULTS = item.SIM_RESULTS
        gather_res.CHECK_WAVE = item.CHECK_WAVE
        gather_res.JTAG_ACCESS = item.JTAG_ACCESS
        gather_res.PATTERN_MD5 = item.PATTERN_MD5
        gather_res.PROJECT_NAME = item.PROJECT_NAME
        dataList.push(gather_res)
      })
      let date = new Date()
      exportFile(workbook, header, columns, dataList, date.toString(), "1")
    
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
      message: "数据为空",
      type: 'error',
    })
  }
}

</script>

<style lang='less' scoped></style>