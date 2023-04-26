<template>
  <a-layout>
    <a-layout-sider width="200" style="background: #fff">
      <a-menu
              mode="inline"
              v-model:selectedKeys="selectedKeys2"
              v-model:openKeys="openKeys"
              :style="{ height: '100%', borderRight: 0 }"
      >
        <a-sub-menu key="sub1">
          <template #title>
              <span>
                <user-outlined />
                subnav 1
              </span>
          </template>
          <a-menu-item key="1">Java集合</a-menu-item>
          <a-menu-item key="2">Vue集合</a-menu-item>
          <a-menu-item key="3">mysql集合</a-menu-item>
          <a-menu-item key="4">架构师之路</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
              <span>
                <laptop-outlined />
                subnav 2
              </span>
          </template>
          <a-menu-item key="5">option5</a-menu-item>
          <a-menu-item key="6">option6</a-menu-item>
          <a-menu-item key="7">option7</a-menu-item>
          <a-menu-item key="8">option8</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub3">
          <template #title>
              <span>
                <notification-outlined />
                subnav 3
              </span>
          </template>
          <a-menu-item key="9">option9</a-menu-item>
          <a-menu-item key="10">option10</a-menu-item>
          <a-menu-item key="11">option11</a-menu-item>
          <a-menu-item key="12">option12</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout-content
            :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
    >
      Content
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
  import axios from 'axios';

  export default defineComponent({
    name: 'Home',
    // components: {
    //   HelloWorld,
    // },
    setup(){
      console.log("setup");
      //用axios发送请求到服务器
      axios.get("http://localhost:8880/ebook/getEbook?name=spring").then((response)=>{
        //响应体
        console.log(response);
      });
    }
  });
</script>
