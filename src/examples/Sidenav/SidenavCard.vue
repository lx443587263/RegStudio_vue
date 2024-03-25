<template>
  <div id="sidenavCard" class="card card-plain shadow-none">
    <img
      class="w-60 mx-auto"
      src="../../assets/img/illustrations/icon-documentation.svg"
      alt="sidebar_illustration"
    />
    <div class="p-3 card-body text-center w-100 pt-0">
      <div class="docs-info">
        <h6
          class="mb-0 up"
          :class="
            $store.state.sidebarType === 'bg-default' ||
            $store.state.darkMode ||
            $store.state.layout === 'landing'
              ? 'text-white'
              : 'text-dark'
          "
        >
          {{ card.title }}
        </h6>
        <p class="text-xs font-weight-bold">{{ card.description }}</p>
        <a
          v-for="({ label, route, color }, index) of card.links"
          :key="index"
          :href="route"
          target="_blank"
          :class="`btn btn-${color} btn-sm w-100 ${
            index === 0 ? 'mb-3' : 'mb-0'
          }`"
          @click="download_help_doc"
          >{{ label }}</a
        >
      </div>
    </div>
  </div>
</template>

<script>

import {getHelpFileApi} from "@/http/api/template_file";
import { saveAs } from "file-saver";
// import PizZip from 'pizzip';
// import Docxtemplater from 'docxtemplater';
import { renderAsync } from "docx-preview";
export default {
  name: "SidenavCard",
  props: {
    card: {
      type: Object,
      required: true,
      title: String,
      description: String,
      links: {
        type: Array,
        label: String,
        route: String,
        color: String
      }
    }
  },
  data() {
    return {    
    };
  },
  methods:{
    download_help_doc(){
      getHelpFileApi().then((res)=>{
        saveAs(res, "RegStudio使用手册.docx");
        this.preDocx(res)
      })
    },
 
    preDocx(file) {
      let blob = new Blob([file], { type: 'text/xml' })
      let bodyContainer = window.open("")
      let box = document.createElement('div')
      // let docx = require("docx-preview")
      renderAsync(
        blob, // Blob | ArrayBuffer | Uint8Array, 可以是 JSZip.loadAsync 支持的任何类型
        box, // HTMLElement 渲染文档内容的元素,
        // null, // HTMLElement, 用于呈现文档样式、数字、字体的元素。如果为 null，则将使用 bodyContainer。
         // 配置
      ).then(res => {
          console.log("res---->", res)
          bodyContainer.document.write(box.outerHTML);
          bodyContainer.document.title = "使用说明"
          bodyContainer.document.getElementsByClassName('docx')[0].style.width = 'auto'
      })
    },

    // base64DataURLToArrayBuffer(dataURL) {
    //   const base64Regex = /^data:image\/(png|jpg|jpeg|svg|svg\+xml);base64,/;
    //   if (!base64Regex.test(dataURL)) {
    //     return false;
    //   }
    //   const stringBase64 = dataURL.replace(base64Regex, "");
    //   let binaryString;
    //   if (typeof window !== "undefined") {
    //     binaryString = window.atob(stringBase64);
    //   } else {
    //     binaryString = new Buffer(stringBase64, "base64").toString("binary");
    //   }
    //   const len = binaryString.length;
    //   const bytes = new Uint8Array(len);
    //   for (let i = 0; i < len; i++) {
    //     const ascii = binaryString.charCodeAt(i);
    //     bytes[i] = ascii;
    //   }
    //   return bytes.buffer;
    // },
    
    // loadDocxFun(response){
    //   var reader = new FileReader();
    //   const templateContent = response;
    //   reader.readAsBinaryString(templateContent);

    //   reader.onerror = function (evt) {
    //     console.log("error reading file", evt);
    //     alert("error reading file" + evt);
    //   };
    //   reader.onload = function (evt) {
    //     const content = evt.target.result;
    
    //     var zip = new PizZip(content);
    //     var doc = new Docxtemplater(zip, {
    //       paragraphLoop: true,
    //       linebreaks: true,
    //     });
    //     try {
    //       // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
    //       doc.render();
    //     } catch (error) {
    //       // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).

    //       console.log(JSON.stringify({ error: error }, this.replaceErrors));

    //       if (error.properties && error.properties.errors instanceof Array) {
    //         const errorMessages = error.properties.errors
    //           .map(function (error) {
    //             return error.properties.explanation;
    //           })
    //           .join('\n');
    //         console.log('errorMessages', errorMessages);
    //         // errorMessages is a humanly readable message looking like this :
    //         // 'The tag beginning with "foobar" is unopened'
    //       }
    //       throw error;
    //     }
    //     // 进行渲染和预览
    //     var blob = doc.getZip().generate({
    //       type: "blob",
    //       mimeType:
    //         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    //       compression: "DEFLATE",
    //     });
    //     // Output the document using Data-URI
    //     // 将file转为buffer
    //     let fr = new FileReader();
        
    //     // fr.readAsBinaryString(blob)
    //     fr.readAsDataURL(blob)
    //     fr.addEventListener("loadend",(e) => {
    //         console.log("loadend---->", e)
    //         let buffer = e.target.result;
    //         // let bodyContainer = document.getElementById("Container");
    //         // let bodyContainer = document.getElementById("bodyContainer");
    //         let bodyContainer = window.open("",'DetailRunTime')
    //         let box = document.createElement('div')
    //         // let docx = require("docx-preview")
    //         renderAsync(
    //             buffer, // Blob | ArrayBuffer | Uint8Array, 可以是 JSZip.loadAsync 支持的任何类型
    //             box, // HTMLElement 渲染文档内容的元素,
    //             // null, // HTMLElement, 用于呈现文档样式、数字、字体的元素。如果为 null，则将使用 bodyContainer。
    //             // this.docxOptions // 配置
    //         ).then(res => {
    //             console.log("res---->", res)
    //             bodyContainer.document.write(box.outerHTML);
    //             bodyContainer.document.title = "使用说明"
    //             bodyContainer.document.getElementsByClassName('docx')[0].style.width = 'auto'
    //         })
      
    //     },false);
    //   }
      
    // }
  }
};
</script>
