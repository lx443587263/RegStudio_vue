<template>
  <div class="container-fluid">
    <div class="col-12">
      <div class="card">
        <!-- Card header -->
        <div class="card-header">
          <h5 class="mb-0">新建寄存器集合</h5>
          <!-- <p class="mb-0 text-sm">
          A lightweight, extendable, dependency-free javascript HTML table plugin.
        </p> -->
        </div>
        <div class="container-fluid">
          <div id="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { onMounted,onUnmounted } from 'vue';
import { useState } from '@/store/hook/useState'


export default {
  setup() {
    /// 声明定义一下echart
    let echart = echarts;
    
    const storeState = useState('reg_gather_list', ['RegGatherList'])


    onMounted(() => {
      initChart();
    });

    onUnmounted(() => {
      echart.dispose;
    });

    function color16(){
      var str="#";
      var arr=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
      for(var i=0;i<6;i++){
          var num=parseInt(Math.random()*16);
          str+=arr[num];
      }
      return str;
    }

    // 基础配置一下Echarts
    function initChart() {
      let chart = echarts.getInstanceByDom(document.getElementById("chart-container"))
      if (chart != null) { 
        echart.dispose(document.getElementById("chart-container"))
      }
      chart = echart.init(document.getElementById('chart-container'), null, {
          renderer: 'canvas',
          useDirtyRect: false
      });
      // 把配置和数据放这里
      var option;


      var data = [];
      var categories = [];
      var types = [];
      for(var index in storeState.RegGatherList.value){
          categories.push(storeState.RegGatherList.value[index].reg_gather_name)
          const tempObj = {gatherName:storeState.RegGatherList.value[index].reg_gather_name}
          tempObj.singleList = []
          for(var j in storeState.RegGatherList.value[index].singleReg){
            var temp = {}
            temp.name = storeState.RegGatherList.value[index].singleReg[j].field
            temp.start = storeState.RegGatherList.value[index].singleReg[j].start_bit
            temp.end = storeState.RegGatherList.value[index].singleReg[j].end_bit
            temp.color = color16()
            tempObj.singleList.push(temp)
          }
          types.push(tempObj)
        }


      // Generate mock data
      categories.forEach(function (category, index) {
        types[index].singleList.forEach(function (item){
          data.push({
            name: item.name,
            value: [index,  parseInt(item.start)==parseInt(item.end)?(parseInt(item.start)+1):parseInt(item.start)+1, parseInt(item.end),(parseInt(item.start)-parseInt(item.end))+1],
            itemStyle: {
                color: item.color
            }
          });
        })
      });
      function renderItem(params, api) {
        var categoryIndex = api.value(0);
        var start = api.coord([api.value(1), categoryIndex]);
        var end = api.coord([api.value(2), categoryIndex]);
        var height = api.size([0, 1])[1] * 0.6;
        var rectShape = echarts.graphic.clipRectByRect(
          {
            x: start[0] + 15,
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height
          },
          {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
          }
        );
        return (
          rectShape && {
            type: 'rect',
            transition: ['shape'],
            shape: rectShape,
            style: api.style()
          }
        );
      }
      option = {
        tooltip: {
          formatter: function (params) {
            return params.marker + params.name + ': ' + params.value[3] + 'bit ('+(parseInt(params.value[1])-1)+','+params.value[2]+')';
          }
        },
        title: {
          text: 'Reg Location',
          left: 'center'
        },
        // dataZoom: [
        //   {
        //     type: 'slider',
        //     filterMode: 'weakFilter',
        //     showDataShadow: false,
        //     top: 'bottom',
        //     labelFormatter: ''
        //   },
        //   {
        //     type: 'inside',
        //     filterMode: 'weakFilter'
        //   }
        // ],
        // grid: {
        //   height: 'auto',
        // },
        xAxis: {
          type: 'category',
          min:0,
          // boundaryGap:false,
          max:31,
          // alignWithLabel:false,
          // interval: 1,
          inverse:true,
          data:Array.from(new Array(32).keys()),
        },
        yAxis: {
          data: categories
        },
        series: [
          {
            type: 'custom',
            renderItem: renderItem,
            itemStyle: {
              opacity: 0.8
            },
            encode: {
              x: [1, 2],
              y: 0
            },
            data: data
          }
        ]
      };

      option && chart.setOption(option);
    }

    return { initChart };
  }
};

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

#chart-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
</style>