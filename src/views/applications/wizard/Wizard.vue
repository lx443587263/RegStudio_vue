<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <!-- Card header -->
          <div class="pb-0 card-header">
            <div class="d-lg-flex">
              <div>
                <h5 class="mb-0">版本变更日志</h5>
              </div>
            </div>
          </div>
          <div class="px-0 pb-0 card-body">
            <div class="container-fluid">
              <div>
                <vxe-table
                 
                  show-overflow
                  height="800"
                  :row-config="{isHover: true}"
                  :data="tableData"
                  :scroll-y="{enabled: true}">
                  <vxe-column type="seq" width="100"></vxe-column>
                  <vxe-column field="operate_ip_name" title="ip名字" sortable></vxe-column>
                  <vxe-column field="source_project" title="源项目" sortable></vxe-column>
                  <vxe-column field="des_project" title="目标项目"></vxe-column>
                  <vxe-column field="edit_user" title="修改人"></vxe-column>
                  <vxe-column field="data" title="修改日期"></vxe-column>
                </vxe-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>




<script setup>
import {getProjectChangeApi} from '@/http/api/projectchange'
import { ref } from 'vue'
const tableData = ref([])
setTimeout(() => {
  // 模拟数据
  getProjectChangeApi().then(res=>{
    tableData.value = res
  })
}, 100)
</script>