<template>
    <div class="py-4 container-fluid">
        <div class="card">
            <!-- Card header -->
            <div class="card-header" style="height: 80px;">
                <div class="header" style="padding:10px">
                    <h5 class="mb-0">寄存器清单</h5>
                </div>
                <div style="float: left;">
                    <argon-button 
                    v-permission="['admin', 'edit', 'create', ]" variant="gradient"
                        @click="fullValidEvent"><i class="vxe-icon-save"></i> Save</argon-button>
                </div>
                <argon-button 
                    v-model="isLock" v-permission="['admin', 'edit', 'create']" variant="gradient"
                    style="margin-left:1%;" @click="lockDrop"><i :class="lockIcon"></i> Lock</argon-button>
                <div v-show="tableData.length === 0" class="addbutton"><el-button
                        v-permission="['admin', 'edit', 'create',]" @click="insertEvent">Add</el-button>
                </div>
                <div v-show="tableData.length != 0" class="addbutton">
                    <router-link :to="{ name: 'Charts' }" style="padding: 10px;">
                        <argon-button variant="gradient"><i class="vxe-icon-chart-bar-x"></i> Reg Graph</argon-button>
                    </router-link>
                    <router-link :to="{ name: 'Timeline' }">
                        <argon-button variant="gradient">Modify Timeline</argon-button>
                    </router-link>
                </div>

            </div>
            <p>
                <vxe-input 
                v-model="filterName" type="search" placeholder="search" style="margin-left: 30px;" 
                @keyup="searchEvent" ></vxe-input>
            </p>
            <div class="container-fluid">
                <keep-alive>
                    <vxe-table 
                        ref="GatherxTable" keep-source :data="tableData" row-id="id"
                        border = "inner"
                        :loading = "loading"
                        :edit-config="{ trigger: 'manual', mode: 'row' }" :menu-config="gatherTable.tableMenu" 
                        :checkbox-config="{checkField: 'checked'}"
                        :edit-rules="validRules"
                        :expand-config="{lazy: true, loadMethod: loadContentMethod}"
                        show-overflow max-height="675px" style="margin-bottom: 20px;" @menu-click="contextMenuClickEvent" @cell-click="getTableCategory">
                        <!-- 子表格  -->
                        <vxe-column type="checkbox" width="50px"></vxe-column>
                        <vxe-column type="expand" width="50px">
                            <!-- rowIndex: parentIndex  -->
                            <template #content="{ row: gatherRow, rowIndex: gatherIndex }">
                                    <el-button v-show="gatherRow.singleReg.length === 0" v-permission="['admin', 'edit', 'create']" @click="insertSingleEvent(gatherRow)">Add</el-button>
                                <vxe-table 
                                    id="singelReg" 
                                    ref="SinglexTable" 
                                    border = "inner" 
                                    keep-source :data="gatherRow.singleReg"
                                    :edit-config="{ trigger: 'manual', mode: 'row' }" 
                                    :edit-rules="validRules"
                                    :expand-config="{lazy: true, loadMethod: loadContentMethod}"
                                    row-id="id" show-overflow style="margin-left: 50px;" @cell-click="getTableCategory">
                                    <vxe-column type="expand" width="50px">
                                        <template #content="{ row: singleRow, rowIndex: singleIndex}">
                                            <el-button v-show="singleRow.values.length === 0" v-permission="['admin', 'edit', 'create']" @click="insertValueEvent(singleRow)">Add</el-button>
                                            <vxe-table 
                                                ref="ValuexTable" border = "inner" keep-source :data="singleRow.values" style="margin-left: 450px;"
                                                :edit-config="{ trigger: 'manual', mode: 'row' }" row-id="id" show-overflow @cell-click="getTableCategory">
                                                <vxe-column 
                                                    v-for="(colVal, idxVal) in regValue" :key="idxVal" :field="colVal.prop" :width="colVal.width"
                                                    :title="colVal.label" :edit-render="{}">
                                                    <template #edit="{ row }">
                                                        <vxe-input v-model="row[colVal.prop]" type="text"></vxe-input>
                                                    </template>
                                                </vxe-column>
                                                <vxe-column title="操作" width="200px">
                                                    <template #default="{ row }">
                                                        <template v-if="isActiveStatus(row)">
                                                            <el-button 
                                                                v-permission="['admin', 'edit', 'create']"
                                                                type="success" text
                                                                @click="cancelRowEvent(row)"><i class="vxe-icon-save"></i></el-button>
                                                        </template>
                                                        <template v-else>
                                                            <el-button 
                                                                v-permission="['admin','edit']"
                                                                type="primary" :icon="Edit" text
                                                                @click="editRowEvent(row)"></el-button>
                                                            <el-button 
                                                                v-permission="['admin','edit','create']"
                                                                type="success" :icon="Plus" text
                                                                @click="insertValueEvent(singleRow,row,singleIndex)"></el-button>
                                                            <el-button 
                                                                v-permission="['admin','delete']"
                                                                type="danger" :icon="Delete" text
                                                                @click="delValueRow(singleRow,row)"></el-button>
                                                        </template>
                                                    </template>
                                                </vxe-column>
                                            </vxe-table>
                                        </template>
                                    </vxe-column>
                                    <vxe-column 
                                        v-for="(col, idx) in regColumnList" :key="idx" :field="col.prop"
                                        :title="col.label" :edit-render="{}" :width="col.width">
                                        <template #edit="{ row }">
                                            <vxe-input v-model="row[col.prop]" type="text"></vxe-input>
                                        </template>
                                    </vxe-column>
                                    <vxe-column title="操作" width="250px">
                                        <template #default="{ row }">
                                            <template v-if="isActiveStatus(row)">
                                                <el-button 
                                                    v-permission="['admin', 'edit', 'create']" type="success"
                                                    text @click="cancelRowEvent(row)"><i class="vxe-icon-save"></i></el-button>
                                                <!-- <vxe-button @click="cancelRowEvent(row)">取消</vxe-button> -->
                                            </template>
                                            <template v-else>
                                                <el-button 
                                                    v-permission="['admin', 'edit']" type="primary"
                                                    :icon="Edit" text @click="editRowEvent(row)"></el-button>
                                                <el-button 
                                                    v-permission="['admin', 'edit', 'create']" type="success"
                                                    :icon="Plus" text @click="insertSingleEvent(gatherRow,row,gatherIndex)" />
                                                <el-button 
                                                    v-permission="['admin', 'delete']" type="danger"
                                                    :icon="Delete" text @click="delRegRow(gatherRow,row)" />
                                                <el-button 
                                                    v-permission="['admin', 'edit']" type="info"
                                                    :icon="MoreFilled" text @click="changeRegGather(gatherRow,row)" />
                                            </template>
                                        </template>
                                    </vxe-column>
                                </vxe-table>
                            </template>
                        </vxe-column>

                        <!-- 父表格列 -->
                        <vxe-column 
                            v-for="(col, idx) in columnList" :key="idx" :index="idx" :field="col.prop"
                            :title="col.label" :edit-render="{}">
                            <template #edit="{ row }">
                                <input v-model.lazy="row[col.prop]" class="generl_input__inner" :placeholder="row[col.prop]">
                            </template>
                        </vxe-column>
                        <vxe-column title="操作" width="160px">
                            <template #default="{ row }">
                                <template v-if="isActiveStatus(row)">
                                    <el-button 
                                    v-permission="['admin', 'edit', 'create']" type="success" text
                                        @click="cancelRowEvent(row)"><i class="vxe-icon-save"></i></el-button>
                                    <!-- <vxe-button @click="cancelRowEvent(row)">取消</vxe-button> -->
                                </template>
                                <template v-else>
                                    <el-button 
                                    v-permission="['admin', 'edit', ]" type="primary" :icon="Edit"
                                        text @click="editRowEvent(row)"></el-button>
                                    <el-button 
                                    v-permission="['admin','delete',]" type="danger" :icon="Delete"
                                        text @click="delRegGatherRow(row)"></el-button>
                                </template>
                            </template>
                        </vxe-column>
                    </vxe-table>
                </keep-alive>

                <!-- 新增子表格弹窗 -->
                <el-dialog v-model="dialogFormVisible" title="Modify Offset">
                    <el-form>
                        <el-form-item label="OffSet" :label-width="formLabelWidth = '140px'">
                        <template #default>
                            <el-select v-model="regionType" filterable placeholder="Select">
                            <el-option 
                                v-for="item in tableData" :key="item.offset" :label="item.offset"
                                :value="item.reg_gather_uuid">
                                {{ item.offset }}
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
    </div>
</template>
  
<script>
import { ref, computed, onMounted, reactive, nextTick, watchEffect} from 'vue';
import VXETable from 'vxe-table';
import ArgonButton from "@/components/ArgonButton.vue";
import { getRegGatherList,deleteRegGather,addRegGather,editRegGatherApi} from "@/http/api/reggather";
import { getSingleList,deleteSingle,addSingle,editSingle} from "@/http/api/singlereg";
import { getValueList,deleteValue,addValue,editValue} from "@/http/api/value";
import { useStore } from "vuex";
import { useState } from '@/store/hook/useState';
import { Delete, MoreFilled, Plus, Edit } from '@element-plus/icons-vue';
import Sortable from 'sortablejs';
// import { useRouter } from "vue-router";
import { v4 as uuidv4 } from 'uuid';
import { ElMessageBox } from 'element-plus';


export default {
    components: {
        ArgonButton,
    },
    setup() {
        //***************tableEdit****************/
        const columnList = reactive([
            { prop: "offset", label: 'Offset',  width: 100 },
            // { prop: "address", label: 'Address', show: true},
            { prop: "reg_gather_name", label: 'RegName',  width: 200 },
            { prop: "reset", label: 'Reset(Hex)',  width: 100 },
            { prop: "reg_ram", label: 'Reg/Ram',  width: 100 },
            { prop: "retention", label: 'Retention',  width: 100 },
            { prop: "description", label: 'Description',  width: 200 },
        ])

        const regColumnList = reactive([
            { prop: "start_bit", label: 'High',  width: 100 },
            { prop: "end_bit", label: 'Low',  width: 100 },
            { prop: "RW", label: 'R/W',  width: 80 },
            { prop: "hw_RW", label: 'HW R/W',  width: 100 },
            { prop: "reset_value", label: 'Reset Value',  width: 130 },
            { prop: "field", label: 'Field',  overflow: true, width: 200 },
            // { prop: "valueid", label: 'ValueId', width:100},
            { prop: "description", label: 'Description',  overflow: true, width: 200 },
            { prop: "note", label: '修改意见',  overflow: true, width: 170 },
        ])

        const regValue = reactive([
            { prop: "value", label: 'Value',  width: 100 },
            { prop: "valueId", label: 'ValueId',  width: 150 },
            { prop: "description", label: 'Description',  overflow: true, width: 300 },
        ])

        const validRules = ref({
            offset: [
                { required: true, pattern:'^0[xX]([0-9A-Fa-f]{4})$',message: '必填项:(0x0004)' }
            ],
            reg_gather_name: [
                { required: true, message: '必填项' }
            ],
            start_bit:[ 
                {
                  validator ({ row,cellValue }) {
                    if(parseInt(cellValue)<parseInt(row.end_bit)){
                        return new Error('High Bit必须大于Low Bit')
                    }
                  }
                },
                { required: true, pattern: '^(?:[0-9]|[1-2][0-9]|3[0-1])$', message: '格式不正确,并且需小于等于31' }
            ],
            end_bit:[ 
                {
                  validator ({ row,cellValue }) {
                    if(parseInt(cellValue)>parseInt(row.start_bit)){
                        return new Error('Low Bit必须小于High Bit')
                    }
                  }
                },
                { required: true, pattern: '^(?:[0-9]|[1-2][0-9]|3[0-1])$', message: '格式不正确,并且需小于等于31' }
            ],
            RW:[
                {
                    validator ({ cellValue }) {
                        if (cellValue && !['R/W', 'R', 'W', 'r','r/w','w'].includes(cellValue)) {
                            return new Error('值输入不正确(R/W, R, W, r,r/w,w)')
                        }
                }
                },
                { required: true, message: '必填项' }
            ],
            reset_value:[
                { required: true, message: '必填项(二进制:b01,十六进制:h0x0004,十进制:10,有符号数:-100)' }
            ],
            field:[
                { required: true, message: '必填项' }         
            ],
            
        })
        //***************数据校验*************
        const fullValidEvent = async () => {
            const $xtable = GatherxTable.value
            const errMap = await $xtable.fullValidate()
            if (errMap) {
                const msgList = []
                Object.values(errMap).forEach((errList) => {
                    errList.forEach((params) => {
                        const { rowIndex, column, rules } = params
                        rules.forEach((rule) => {
                            msgList.push(`第 ${rowIndex + 1} 行 ${column.title} 校验错误：${rule.message}`)
                        })
                    })
                })
                VXETable.modal.message({
                    status: 'error',
                    slots: {
                        default() {
                            return [
                                <div class="red" style="max-height: 400px;overflow: auto;">
                                    {
                                        msgList.map(msg => <div>{msg}</div>)
                                    }
                                </div>
                            ]
                        }
                    }
                })
            } else {
                VXETable.modal.message({ status: 'success', content: '校验成功！' })
                saveData()
            }
        }

        const selectValidEvent = async (table,row) => {
              if (row) {
                const errMap = await table.validate(row)
                if (errMap) {
                    return false
                //   VXETable.modal.message({ status: 'error', content: '校验不通过！' })
                } else {
                    return true
                //   VXETable.modal.message({ status: 'success', content: '校验成功！' })
                }
              } else {
                return false
                // VXETable.modal.message({ status: 'warning', content: '未选中数据！' })
              }
        }

        const storeState = useState('reg_gather_list', ['RegGatherList'])
        // let tableData = reactive(computed(() => storeState.RegGatherList.value))

        //格式化offset
        const formatHex = (hexString) => {
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

        /***************搜索数据**************/
        const filterName = ref('')

        let tableData = reactive(computed(() => searchEvent()))
        const searchEvent = () => {
            const filterVal = String(filterName.value).trim().toLowerCase()
            if (filterVal) {
                const filterRE = new RegExp(filterVal, 'gi')
                const searchProps = ['reg_gather_name','offset']
                const rest = storeState.RegGatherList.value.filter(item => searchProps.some(key => String(item[key]).toLowerCase().indexOf(filterVal) > -1))  
                return rest.map(row => {
                    const item = Object.assign({}, row)
                    searchProps.forEach(key => {
                        item[key] = String(item[key]).replace(filterRE, match => `${match}`);
                    })
                    return item
                })
            }
            return storeState.RegGatherList.value
        }

            
        /***************保存数据**************/
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
        //右键菜单栏
        const gatherTable = reactive({
            loading: false,
            tableMenu: {
                body: {
                    options: [
                        [
                            // { code: 'copy', name: '复制', prefixIcon: 'vxe-icon-question-circle-fill', disabled: false },
                            { code: 'insertAtUp', name: '上方插入一行', disabled: false },
                            { code: 'insertAtDown', name: '下方插入一行', disabled: false },
                            // { code: 'remove', name: '删除', disabled: false },
                            // { code: 'save', name: '保存', prefixIcon: 'vxe-icon-question-circle-fill', disabled: false }
                        ]
                    ]
                },
                visibleMethod({ options, column }) {
                    const isDisabled = !column
                    options.forEach(list => {
                        list.forEach(item => {
                            item.disabled = isDisabled
                        })
                    })
                    return true
                }
            }
        })

        //增加gather行
        const addRow=(row,column,later)=>{
            const $table = GatherxTable.value
            tableEditInfo.row = row
            tableEditInfo.curTarget = {
                rowIdx: row ? $table.getRowIndex(row) : null,
            }
            
            // const record = {
            //         //route.params.ip_uuid,
            //         ip_uuid: store.state.IP.current_ip_uuid,
            //         reg_gather_uuid: uuidv4(),
            //         tag: "draft",
            //         singleReg: []
            //     }
            //     columnList.forEach(p => {
            //         if (p.prop === "offset") {
            //             record[p.prop] = formatHex(offset_temp)
            //         } else {
            //             record[p.prop] = null
            //         }
            //     })

            //     const { row: newRow } = await $table.insertAt(record)
            //     await $table.setEditCell(newRow,'reg_gather_name')

            $table.insertAt({}, row || -1).then(async ({ row }) => {
                let idx;
                let offset_temp;
                if (tableEditInfo.curTarget.rowIdx === null) {
                    idx = 0
                    offset_temp = formatHex("0")
                }
                else {
                    idx = later ? tableEditInfo.curTarget.rowIdx + 1 : tableEditInfo.curTarget.rowIdx
                    if (idx != 0) {
                        offset_temp = (parseInt(tableEditInfo.row.offset, 16) - 4).toString(16)
                    } else {
                        offset_temp = formatHex("0")
                    }
                }
                //route.params.ip_uuid

                row.ip_uuid = store.state.IP.current_ip_uuid
                row.reg_gather_uuid = uuidv4()
                row.tag = "draft"
                row.singleReg = []
                columnList.forEach(p => {
                    if (p.prop === "offset") {
                        row[p.prop] = formatHex(offset_temp)
                    } else {
                        row[p.prop] = null
                    }
                })
                await $table.setEditCell(row,"reg_gather_name")
                if (tableData.value.length !== 0) {
                    tableData.value.splice(idx, 0, row)
                } else {
                    tableData.value[0] = row
                }
            })
        }

        //菜单页面
        const contextMenuClickEvent = ({ menu, row, column }) => {
            switch (menu.code) {
                case 'insertAtUp':
                    addRow(row,column,false)
                    break
                case 'insertAtDown':
                    addRow(row,column,true)
                    break
            }
        }

        //监听offset
        watchEffect(() => {
            for (var i in tableData.value) {
                //这里重新处理offset
                for (var key in tableData.value[i]) {
                    if (key == "offset") {
                        if (!tableData.value[i][key].includes("~")) {
                            if (i >= 1) {
                                if ((parseInt(tableData.value[i][key], 16) - parseInt(tableData.value[i - 1][key], 16)) <= 4) {
                                    tableData.value[i][key] = formatHex((parseInt(tableData.value[i - 1][key], 16) + 4).toString(16))
                                }
                            }
                        }
                    }
                }
            }
        })

        const dialogFormVisible = ref(false)
        let regionType = ref(null)
        const editRowData = ref(null)
        const currentIdx = ref(null)
        const editRegGatherData = ref(null)
        //转移寄存器
        const changeRegGather = (regGather,row) => {
            // regGather, index, 
            const $table = SinglexTable.value
            editRegGatherData.value = regGather           
            currentIdx.value = $table.getRowIndex(row)
            editRowData.value = row
            dialogFormVisible.value = true

        }
        const confirmClick = () => {
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
        

        // 删除集合表格一行
        const delRegGatherRow = (row) => {
            const index = tableData.value.findIndex(item => item.reg_gather_uuid === row.reg_gather_uuid)
            if (index != -1) {
                tableData.value.splice(index, 1)
                deleteRegGather(row.reg_gather_uuid)
                VXETable.modal.message({ content: '删除成功', status: 'success' })
            }
        }
        //插入表格一行
        const insertEvent = async () => {
            const $table = GatherxTable.value
            if ($table) {
                let offset_temp;
                if (tableEditInfo.curTarget.rowIdx === null) {
                    offset_temp = formatHex("0")
                }
                const record = {
                    //route.params.ip_uuid,
                    ip_uuid: store.state.IP.current_ip_uuid,
                    reg_gather_uuid: uuidv4(),
                    tag: "draft",
                    singleReg: []
                }
                columnList.forEach(p => {
                    if (p.prop === "offset") {
                        record[p.prop] = formatHex(offset_temp)
                    } else {
                        record[p.prop] = null
                    }
                })

                const { row: newRow } = await $table.insertAt(record)
                await $table.setEditCell(newRow,'reg_gather_name')
                tableData.value[0] = newRow
            }
            }
        // 增加扩展表格一行
        const insertSingleEvent = async (regGatherRow,row,index) => {
            const $table = SinglexTable.value
            if ($table) {
                const record = {
                    reg_gather_uuid: regGatherRow.reg_gather_uuid,
                    single_reg_uuid: uuidv4(),
                    values: [],
                }
                const { row: newRow } = await $table.insertAt(record, row)
                regColumnList.forEach(p => {
                    $table.setEditCell(newRow, p.prop)
                })
                // await $table.setEditCell(newRow)
                if (regGatherRow.singleReg.length != 0) {
                    regGatherRow.singleReg.splice(index + 1, 0, newRow)
                } else {
                    regGatherRow.singleReg[0] = newRow
                }
            }
        }


        // 删除扩展表格一行
        const delRegRow = (regGather, row) => {
            const $table = SinglexTable.value
            regGather.singleReg.splice($table.getRowIndex(row), 1)
            deleteSingle(row.single_reg_uuid)
        }

        // 增加Value表格一行
        const insertValueEvent = async (singleReg,row) => {
            const $table = ValuexTable.value
            if ($table) {
                const record = {
                    single_reg_uuid: singleReg.single_reg_uuid,
                    value_uuid :uuidv4(),
                }
                const { row: newRow } = await $table.insertAt(record, row)
                regValue.forEach(p => {
                    $table.setEditCell(newRow, p.prop)
                })
                singleReg.values.splice(singleReg.values[$table.getRowIndex(row)] + 1, 0, newRow)
                
            }
        }

        //删除value表格一行
        const delValueRow = (singleReg,row)=>{
            const $table = ValuexTable.value
            singleReg.values.splice($table.getRowIndex(row),1)
            deleteValue(row.value_uuid)
        }

        //获取多选事项
        const getSelectEvent = () => {
            const $table = GatherxTable.value
            if ($table) {
                const selectRecords = $table.getCheckboxRecords()
                console.log(selectRecords)
            }
        }

        let passCount = 0
        //保存全部数据
        const saveData = async () => {
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
                    if (key != "singleReg") {
                        gatherObj[key] = tableData.value[i][key]
                    }
                    else {
                        for (var sr in tableData.value[i][key]) {
                            let singleObj = {}
                            for (var j in tableData.value[i][key][sr]) {
                                if (j != "values") {
                                    if (j == "note") {
                                        if (tableData.value[i][key][sr]["note"]) {
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
                // let templist = []   //存储reset值
                // for (var h = 0; h < tableData.value[i]["singleReg"].length; ++h) {
                //     var tempRsetValue;
                //     if ((tableData.value[i]["singleReg"][h]["reset_value"]).includes("b")) {
                //         tempRsetValue = parseInt((tableData.value[i]["singleReg"][h]["reset_value"]).substr(1), 2)
                //     }
                //     else if ((tableData.value[i]["singleReg"][h]["reset_value"]).includes("h")) {
                //         tempRsetValue = parseInt((tableData.value[i]["singleReg"][h]["reset_value"]).substr(1), 16)
                //     }
                //     else if ((tableData.value[i]["singleReg"][h]["reset_value"]).includes("-")) {
                //         tempRsetValue = parseInt((tableData.value[i]["singleReg"][h]["reset_value"]), 10) >>> 0
                //     }
                //     else {
                //         tempRsetValue = parseInt(tableData.value[i]["singleReg"][h]["reset_value"])
                //     }
                //     templist.push(tempRsetValue << parseInt(tableData.value[i]["singleReg"][h]["end_bit"]) >>> 0)
                // }
                // if (templist.length != 0) {
                //     const result = templist.reduce((acc, binaryValue) => {
                //         return acc | binaryValue; // 进行位与运算
                //     });
                //     tableData.value[i]["reset"] = "0x" + parseInt((result >>> 0).toString(2).padStart(32, '0'), 2).toString(16)
                //     gatherObj["reset"] = "0x" + parseInt((result >>> 0).toString(2).padStart(32, '0'), 2).toString(16)
                // } else {
                //     gatherObj["reset"] = "0"
                // }
                tableData.value[i]["reset"] = calculateOffset(tableData.value[i]["singleReg"])
                gatherObj["reset"] = calculateOffset(tableData.value[i]["singleReg"])

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
                VXETable.modal.message({ content: '保存成功', status: 'success' })
            } catch (error) {
                VXETable.modal.message({ content: '保存失败', status: 'error' })
            }

        }

        /***************拖拽*****************/
        let isLock = ref(true)
        const lockIcon = computed(() => {
            return isLock.value ? 'fa fa-lock' : 'fa fa-unlock';
        });

        const allowDrop = ref(null)
        const lockDrop = () => {
            allowDrop.value.options.disabled = !allowDrop.value.options.disabled
            isLock.value = allowDrop.value.options.disabled
        }


        // 行拖拽
        const dropTable = () => {
            const tbody = document.querySelector('.body--wrapper>.vxe-table--body tbody');
            allowDrop.value = Sortable.create(tbody, {
                disabled: true,
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


        const GatherxTable = ref(null)
        const SinglexTable = ref(null)
        const ValuexTable = ref(null)
        const CurrentTable = ref(null)
        //获取当前表格种类
        const getTableCategory = (row) =>{
            CurrentTable.value = row.$table;
        }
        
        //当前操作状态切换
        const isActiveStatus = (row) => {
            getTableCategory
            const $table = CurrentTable.value
            if ($table) {
                return $table.isEditByRow(row)
            }
        }
        //编辑事件
        const editRowEvent = (row) => {
            const $table = CurrentTable.value
            if ($table) {
                $table.setEditRow(row)
            }
        }
        //退出保存事件
        const cancelRowEvent = (row) => {
            const $table = CurrentTable.value
            if ($table) {
                selectValidEvent($table, row).then((res) => {
                    if (!res) {
                        VXETable.modal.message({ status: 'error', content: '校验不通过！' })
                    } else {
                        if (typeof (row.id) === 'string') {
                            if ('reg_gather_name' in row) {
                                row.reset = calculateOffset(row.singleReg)
                                addRegGather(row)
                            } else if ('start_bit' in row) {
                                addSingle(row)
                            } else {
                                addValue(row)
                            }
                            VXETable.modal.message({ content: '新增成功', status: 'success' })
                        } else {
                            if ('reg_gather_name' in row) {
                                const index = storeState.RegGatherList.value.findIndex(item => item.reg_gather_uuid === row.reg_gather_uuid)
                                storeState.RegGatherList.value[index] = row
                                row.reset = calculateOffset(row.singleReg)
                                editRegGatherApi(row.reg_gather_uuid, row)
                            } else if ('start_bit' in row) {
                                editSingle(row.single_reg_uuid, row)
                            } else {
                                editValue(row.value_uuid, row)
                            }
                            VXETable.modal.message({ content: '保存成功', status: 'success' })
                        }
                    }
                })
                $table.clearEdit()
            }
        }

        // const route = useRoute();
        const store = useStore();
        let reg_gather_list = []
        // const router = useRouter();

        const compareDesc = (p) => { //这是比较函数
            return function (m, n) {
                var a = m[p];
                var b = n[p];
                return b - a; //降序
            }
        }

        const compareAsc = (p) => { //这是比较函数
            return function (m, n) {
                var a = parseInt(m[p], 16);
                var b = parseInt(n[p], 16);
                return a - b; //降序
            }
        }
        //route.params.ip_uuid
        const getData = async () => {
            await getRegGatherList(store.state.IP.current_ip_uuid).then((res) => {
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
                                    for(var key in res[k]){
                                        valueTemp[key] = res[k][key]
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
                loading.value = false
            })
        }

        const calculateOffset = (singleList)=>{
            let templist = []   //存储reset值
            for (var h = 0; h < singleList.length; ++h) {
                var tempRsetValue;
                if ((singleList[h]["reset_value"]).includes("b")) {
                    tempRsetValue = parseInt((singleList[h]["reset_value"]).substr(1), 2)
                }
                else if ((singleList[h]["reset_value"]).includes("h")) {
                    tempRsetValue = parseInt((singleList[h]["reset_value"]).substr(1), 16)
                }
                else if ((singleList[h]["reset_value"]).includes("-")) {
                    tempRsetValue = parseInt((singleList[h]["reset_value"]), 10) >>> 0
                }
                else {
                    tempRsetValue = parseInt(singleList[h]["reset_value"])
                }
                templist.push(tempRsetValue << parseInt(singleList[h]["end_bit"]) >>> 0)
            }

            if (templist.length != 0) {
                const result = templist.reduce((acc, binaryValue) => {
                    return acc | binaryValue; // 进行位与运算
                });
                return "0x" + parseInt((result >>> 0).toString(2).padStart(32, '0'), 2).toString(16)
            } else {
                return "0"
            }
        }
        
        const loadContentMethod=()=>{
          return new Promise(resolve => {
            setTimeout(() => {
              resolve()
            }, 200)
          })
        }

        const loading = ref(true)
        onMounted(() => {
            setTimeout(() => {
                getData();
                
            }, 1000)
            dropTable()
        })



        return {
            //拖拽相关
            isLock,
            lockIcon,
            lockDrop,
            dropTable,
            //表头
            columnList,
            regColumnList,
            regValue,
            //表格数据
            tableData,
            //表格引用
            GatherxTable,
            SinglexTable,
            gatherTable,   
            ValuexTable,
            CurrentTable,
            //表格数据操作
            isActiveStatus,
            editRowEvent,
            cancelRowEvent,
            delRegGatherRow,
            addRow,
            insertEvent,
            saveData,
            insertSingleEvent,
            delRegRow,
            delValueRow,
            insertValueEvent,
            //计算偏移量
            calculateOffset,
            //vuex数据源头
            store,
            ...storeState,
            //表格右键菜单操作
            contextMenuClickEvent,
            //转移寄存器错做函数
            changeRegGather,
            confirmClick,
            dialogFormVisible,
            regionType,
            //获取表格种类
            getTableCategory,
            searchEvent,
            // searchEvent1,
            filterName,
            //多选函数
            getSelectEvent,
            //图标
            MoreFilled,
            Delete,
            Plus,
            Edit,
            loading,
            //数据校验
            validRules,
            fullValidEvent,
            selectValidEvent,
            loadContentMethod,
        }


    },


}
</script>
  
<style>
#singelReg {
    position: relative;
    left: 150px;
}

#valTable {
    position: relative;
    left: 300px;
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

.generl_input__inner {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    color: #606266;
    font-size: 14px;
    height: 36px;
    line-height: 36px;
    width: 100%;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
}
</style>
  