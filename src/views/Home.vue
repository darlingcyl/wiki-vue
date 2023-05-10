<template>
  <a-layout>
    <a-layout-sider width="200" style="background: #fff">
      <a-menu
              mode="inline"
              v-model:selectedKeys="selectedKeys2"
              v-model:openKeys="openKeys"
              :style="{ height: '100%', borderRight: 0 }"
              @click="handleClick"
      >
        <a-menu-item key="welcome">
          <router-link :to="'/'">
          <MailOutlined />
          <span>欢迎</span>
          </router-link>
        </a-menu-item>
        <a-sub-menu v-for="item in level1" :key="item.id" >
          <template v-slot:title>
            <span><user-outlined />{{item.name}}</span>
          </template>
          <a-menu-item v-for="child in item.children" :key="child.id">
            <MailOutlined /><span>{{child.name}}</span>
          </a-menu-item>
        </a-sub-menu>
        <!--<a-sub-menu key="sub1">-->
          <!--<template #title>-->
              <!--<span>-->
                <!--<user-outlined />-->
                <!--subnav 1-->
              <!--</span>-->
          <!--</template>-->
          <!--<a-menu-item key="1">Java集合</a-menu-item>-->
          <!--<a-menu-item key="2">Vue集合</a-menu-item>-->
          <!--<a-menu-item key="3">mysql集合</a-menu-item>-->
          <!--<a-menu-item key="4">架构师之路</a-menu-item>-->
        <!--</a-sub-menu>-->
        <!--<a-sub-menu key="sub2">-->
          <!--<template #title>-->
              <!--<span>-->
                <!--<laptop-outlined />-->
                <!--subnav 2-->
              <!--</span>-->
          <!--</template>-->
          <!--<a-menu-item key="5">option5</a-menu-item>-->
          <!--<a-menu-item key="6">option6</a-menu-item>-->
          <!--<a-menu-item key="7">option7</a-menu-item>-->
          <!--<a-menu-item key="8">option8</a-menu-item>-->
        <!--</a-sub-menu>-->
        <!--<a-sub-menu key="sub3">-->
          <!--<template #title>-->
              <!--<span>-->
                <!--<notification-outlined />-->
                <!--subnav 3-->
              <!--</span>-->
          <!--</template>-->
          <!--<a-menu-item key="9">option9</a-menu-item>-->
          <!--<a-menu-item key="10">option10</a-menu-item>-->
          <!--<a-menu-item key="11">option11</a-menu-item>-->
          <!--<a-menu-item key="12">option12</a-menu-item>-->
        <!--</a-sub-menu>-->
      </a-menu>
    </a-layout-sider>
    <a-layout-content
            :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
    >
      <div class="welcome" v-show="isShowWelcome">
        <h1>欢迎来到我的知识库</h1>
      </div>

      <!--{{ebooks}}-->
        <a-list v-show="!isShowWelcome" item-layout="vertical" size="large" :grid="{gutter:20,column:3}" :pagination="pagination" :data-source="ebooks">
          <template #renderItem="{ item }">
            <a-list-item key="item.name">
              <template #actions>
          <span v-for="{ type, text } in actions" :key="type">
            <component v-bind:is="type" style="margin-right: 8px" />
            {{ text }}
          </span>
              </template>

              <a-list-item-meta :description="item.description">
                <template #title>
                  <router-link :to="'/doc?ebookId='+item.id">
                    {{ item.name }}
                  </router-link>
                </template>
                <template #avatar><a-avatar :src="item.cover" /></template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      <!--<script lang="ts">-->
        <!--import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';-->
        <!--import { defineComponent } from 'vue';-->

        <!--const listData: Record<string, string>[] = [];-->

        <!--for (let i = 0; i < 23; i++) {-->
          <!--listData.push({-->
            <!--href: 'https://www.antdv.com/',-->
            <!--title: `ant design vue part ${i}`,-->
            <!--avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',-->
            <!--description:-->
                    <!--'Ant Design, a design language for background applications, is refined by Ant UED Team.',-->
            <!--content:-->
                    <!--'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',-->
          <!--});-->
        <!--}-->

        <!--export default defineComponent({-->
          <!--components: {-->
            <!--StarOutlined,-->
            <!--LikeOutlined,-->
            <!--MessageOutlined,-->
          <!--},-->
          <!--setup() {-->
            <!--const pagination = {-->
              <!--onChange: (page: number) => {-->
                <!--console.log(page);-->
              <!--},-->
              <!--pageSize: 3,-->
            <!--};-->
            <!--const actions: Record<string, string>[] = [-->
              <!--{ type: 'StarOutlined', text: '156' },-->
              <!--{ type: 'LikeOutlined', text: '156' },-->
              <!--{ type: 'MessageOutlined', text: '2' },-->
            <!--];-->
            <!--return {-->
              <!--listData,-->
              <!--pagination,-->
              <!--actions,-->
            <!--};-->
          <!--},-->
        <!--});-->
      <!--</script>-->

    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
  import { defineComponent, ref} from 'vue';
  import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
  import axios from 'axios';
  import {onMounted} from 'vue'
  import {StarOutlined, LikeOutlined, MessageOutlined} from '@ant-design/icons-vue';
  import {message} from 'ant-design-vue';
  import {Tool} from "@/util/tool";

  const listData:Record<string,string>[] = [];
  for (let i = 0; i < 23; i++) {
    listData.push({
      href: 'https://www.antdv.com/',
      title: `ant design vue part ${i}`,
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      description:
              'Ant Design, a design language for background applications, is refined by Ant UED Team.',
      content:
              'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    });
  }
  export default defineComponent({
    name: 'Home',
    components:{
      StarOutlined,
      LikeOutlined,
      MessageOutlined
    },
    // components: {
    //   HelloWorld,
    // },
    setup(){
      console.log("setup");
      const ebooks = ref();
      const level1 =  ref();
      let categorys: any;
      /**
       * 查询所有分类
       **/
      const handleQueryCategory = () => {
        axios.get("/category/all").then((response) => {
          const data = response.data;
          if (data.success) {
            categorys = data.content;
            console.log("原始数组：", categorys);
            level1.value = [];
            level1.value = Tool.array2Tree(categorys, 0);
            console.log("树形结构：", level1.value);
          } else {
            message.error(data.message);
          }
        });
      };

      const isShowWelcome = ref(true);
      let categoryId2 = 0;
      const handleQueryEbook = () => {
        axios.get("/ebook/getEbook", {
          params: {
            page: 1,
            size: 1000,
            categoryId2: categoryId2
          }
        }).then((response) => {
          const data = response.data;
          ebooks.value = data.content.list;
        });
      };
      const handleClick = (value: any) => {
        console.log("首页左边分类被点击啦啦啦", value);
        if (value.key === 'welcome'){
          isShowWelcome.value = true;
        } else {
          categoryId2=value.key;
          isShowWelcome.value = false;
          handleQueryEbook();
        }
      };
      onMounted(()=>{
        handleQueryCategory();
        // console.log("onMounted");
        //用axios发送请求到服务器
        // axios.get("/ebook/getEbook?name=spring",{
        //   params: {
        //     page: 1,
        //     size: 1000
        //   }
        // }).then((response)=>{
        //   //响应体
        //   // console.log(response);
        //   const data = response.data;
        //   ebooks.value = data.content.list;
        // });
      });
      const pagination = {
        onChange: (page: number) => {
          console.log(page);
        },
        pageSize: 3,
      };
      const actions: Record<string, string>[] = [
        { type: 'StarOutlined', text: '156' },
        { type: 'LikeOutlined', text: '156' },
        { type: 'MessageOutlined', text: '2' },
      ];
      return {
        ebooks,
        listData,
        pagination,
        actions,
        handleClick,
        level1,
        isShowWelcome
      }
    }
  });
</script>
