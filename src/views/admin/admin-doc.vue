<template>
    <a-layout>

        <a-layout-content
                :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
        >
            <a-row :gutter="24">
                <a-col :span="8">
                    <p>
                    <!--<a-button type="primary" @click="add()">-->
                    <!--新增-->
                    <!--</a-button>-->
                    <a-form layout="inline" :model="param">
                        <a-form-item>
                            <a-button type="primary" @click="handleQuery()">
                                刷新
                            </a-button>
                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" @click="add()">
                                新增
                            </a-button>
                        </a-form-item>
                    </a-form>
                </p>
                    <a-table
                            v-if="level1.length>0"
                            :columns="columns"
                            :row-key="'record => record.id'"
                            :data-source="level1"
                            :pagination="false"
                            :loading="loading"
                            size="small"
                            :defaultExpandAllRows="true"

                    >
                    <!--@change="handleTableChange"-->
                        <template #name="{ text: record }">
                            {{record.sort}} {{text}}
                        </template>


                        <template v-slot:action="{ text, record }">
                            <a-space size="small">
                                <a-button type="primary" @click="edit(record)" size="small">
                                    编辑
                                </a-button>
                                <a-popconfirm
                                        title="删除后不可恢复，确认删除?"
                                        ok-text="是"
                                        cancel-text="否"
                                        @confirm="handleDelete(record.id)"
                                >
                                    <a-button type="danger" size="small">
                                        删除
                                    </a-button>
                                </a-popconfirm>
                            </a-space>
                        </template>
                    </a-table>
                </a-col>
                <a-col :span="16">
                    <p>
                        <a-form layout="inline" :model="param">
                            <a-form-item>
                                <a-button type="primary" @click="handleSave()">
                                    保存
                                </a-button>
                            </a-form-item>
                        </a-form>
                    </p>
                    <a-form :model="doc" layout="vertical">
                        <a-form-item>
                            <a-input v-model:value="doc.name" placeholder="名字"/>
                        </a-form-item>
                        <a-form-item label="父文档">
                            <a-tree-select
                                    v-model:value="doc.parent"
                                    style="width: 100%"
                                    :dropdown-style="{maxHeight: '400px', overflow: 'auto'}"
                                    :tree-data="treeSelectData"
                                    placeholder="请选择父文档"
                                    tree-default-expand-all
                                    :replaceFields="{title:'name',key:'id',value:'id'}"
                            >

                            </a-tree-select>
                        </a-form-item>

                        <!--<a-form-item label="父文档">-->
                        <!--<a-select v-model:values="doc.parent" ref="select">-->
                        <!--<a-select-option :value="0">无</a-select-option>-->
                        <!--<a-select-option v-for="c in level1" :key="c.id" :value="c.id"-->
                        <!--:disabled="doc.id===c.id">{{c.name}}-->
                        <!--</a-select-option>-->
                        <!--</a-select>-->
                        <!--</a-form-item>-->
                        <a-form-item>
                            <a-input v-model:value="doc.sort" placeholder="顺序"/>
                        </a-form-item>
                        <a-form-item>
                            <div id="content" placeholder="内容"></div>
                        </a-form-item>
                    </a-form>
                </a-col>
            </a-row>
            <!--<div class="about">-->
            <!--<h1>管理电子书页面</h1>-->
            <!--</div>-->




            <!--点击编辑弹出的modal框-->
            <!--<div>-->
                <!--<a-modal-->
                        <!--title="Title"-->
                        <!--v-model:visible="modalVisible"-->
                        <!--:confirm-loading="modalLoading"-->
                        <!--@ok="handleModalOk"-->
                <!--&gt;-->
                    <!---->
                    <!--&lt;!&ndash;<p>展示编辑区域</p>&ndash;&gt;-->
                <!--</a-modal>-->
            <!--</div>-->

        </a-layout-content>
    </a-layout>
</template>
<script lang="ts">
    import { defineComponent, onMounted, ref } from 'vue';
    import axios from 'axios';
    import {message} from "ant-design-vue";
    import {Tool} from "@/util/tool";
    import {useRoute} from "vue-router";
    import E from 'wangeditor';
    export default defineComponent({
        name: 'AdminDoc',
        setup() {
            const route = useRoute();
            const param=ref();
            param.value={};
            const docs = ref();
            const loading = ref(false);
            const treeSelectData=ref();
            treeSelectData.value=[];
            const columns = [
                {
                    title: '名称',
                    dataIndex: 'name',
                    slots: {customRender: 'name'}
                },
                // {
                //     title: '父文档',
                //     Key:'parent',
                //     dataIndex:'parent'
                // },
                // {
                //     title: '排序',
                //     dataIndex:'sort'
                // },
                {
                    title: '操作',
                    key: 'action',
                    slots: { customRender: 'action' }
                }
            ];
            /**
             * 一级文档树的数据层级说明，children属性就是二级文档
             * [{
             *   id: "",
             *   name: "",
             *   children: [{
             *     id: "",
             *     name: "",
             *   }]
             * }]
             */
            const level1 = ref(); // 一级文档树，children属性就是二级文档
            level1.value=[];
            /**
             * 数据查询
             **/
            const handleQuery = () => {
                loading.value = true;
                level1.value=[];
                axios.get("/doc/all").then((response) => {
                    loading.value = false;
                    const data = response.data;
                    if (data.success) {
                        docs.value = data.content;
                        console.log("原始数组：", docs.value);

                        level1.value = [];
                        level1.value = Tool.array2Tree(docs.value, 0);
                        // 父文档下拉框初始化，相当于点击新增
                        treeSelectData.value = Tool.copy(level1.value) || [];
                        // 为选择树添加一个"无"
                        treeSelectData.value.unshift({id: 0, name: '无'});
                        console.log("树形结构的数组：", level1);
                    }else {
                        message.error(data.message);
                    }

                });
            };



            // -------- 表单 ---------

            const doc = ref();
            doc.value={};
            const modalVisible = ref(false);
            const modalLoading = ref(false);
            //创建富文本框对象
            let editor:any;
            const createEditor = ()=>{
                editor = new E('#content');
                editor.create();
                editor.config.zIndex=0;//编辑时下拉不被遮挡住，修改他显示层级级别
            }
            // const editor = new E('#content');

            const handleSave = () => {
                modalLoading.value = true;
                doc.value.content = editor.txt.html();
                axios.post("/doc/save", doc.value).then((response) => {
                    modalLoading.value = false;
                    const data = response.data; // data = commonResp
                    if (data.success) {
                        // modalVisible.value = false;
                        // 重新加载列表
                        message.success("保存成功！")
                        handleQuery();
                    }else {
                        message.error(data.message);
                    }
                });
                // setTimeout(() => {
                //     modalVisible.value = false;
                //     modalLoading.value = false;
                // }, 1000);
            };

            /**
             * 将某节点及其子孙节点全部置为disabled
             */
            const setDisable = (treeSelectData: any, id: any) => {
                // console.log(treeSelectData, id);
                // 遍历数组，即遍历某一层节点
                for (let i = 0; i < treeSelectData.length; i++) {
                    const node = treeSelectData[i];
                    if (node.id === id) {
                        // 如果当前节点就是目标节点
                        console.log("disabled", node);
                        // 将目标节点设置为disabled
                        node.disabled = true;

                        // 遍历所有子节点，将所有子节点全部都加上disabled
                        const children = node.children;
                        if (Tool.isNotEmpty(children)) {
                            for (let j = 0; j < children.length; j++) {
                                setDisable(children, children[j].id)
                            }
                        }
                    } else {
                        // 如果当前节点不是目标节点，则到其子节点再找找看。
                        const children = node.children;
                        if (Tool.isNotEmpty(children)) {
                            setDisable(children, id);
                        }
                    }
                }
            };

            /**
             * 内容查询
             */
            const  handleQueryContent = ()=>{
                axios.get("/doc/find-content/"+doc.value.id).then((response)=>{
                    const  data=response.data;
                    if(data.success){
                        editor.txt.html(data.content);
                    }else{
                        message.error(data.message);
                    }
                });
            };

            /**
             * 编辑
             */
            const edit = (record: any) => {
                editor.txt.html("");
                modalVisible.value = true;
                //doc.value=record
                doc.value=Tool.copy(record);
                handleQueryContent();
                // 不能选择当前节点及其所有子孙节点，作为父节点，会使树断开
                treeSelectData.value = Tool.copy(level1.value);
                setDisable(treeSelectData.value, record.id);

                // 为选择树添加一个"无"
                treeSelectData.value.unshift({id: 0, name: '无'});// unshift({id: 0, name: '无'})的作用就是在数组的前面加一个指定节点
            };


            /**
             * 获取某节点及其子孙节点全部id
             */
            const ids:Array<string> = [];
            const getDeleteIds = (treeSelectData: any, id: any) => {
                // 遍历数组，即遍历某一层节点
                for (let i = 0; i < treeSelectData.length; i++) {
                    const node = treeSelectData[i];
                    if (node.id === id) {
                        // 把目标id放入结果集
                        ids.push(id);
                        // 遍历所有子节点
                        const children = node.children;
                        if (Tool.isNotEmpty(children)) {
                            for (let j = 0; j < children.length; j++) {
                                getDeleteIds(children, children[j].id)
                            }
                        }
                    } else {
                        // 如果当前节点不是目标节点，则到其子节点再找找看。
                        const children = node.children;
                        if (Tool.isNotEmpty(children)) {
                            getDeleteIds(children, id);
                        }
                    }
                }
            };
            /**
             * 新增
             */
            const add = () => {
                editor.txt.html("");
                modalVisible.value = true;
                doc.value = {
                    ebookId:route.query.ebookId
                };
                treeSelectData.value = Tool.copy(level1.value);
                // 为选择树添加一个"无"
                treeSelectData.value.unshift({id: 0, name: '无'});
            };

            /**删除 */
            const handleDelete = (id: number) => {
                getDeleteIds(level1.value,id);
                axios.delete("/doc/delete/" + ids.join(",")).then((response) => {
                    const data = response.data; // data = commonResp
                    if (data.success) {
                        // 重新加载列表
                        handleQuery();
                    }
                });
            };

            onMounted(() => {
                handleQuery();
                createEditor();
            });
            return {
                // docs
                level1,
                columns,
                loading,
                handleQuery,

                edit,
                add,
                handleDelete,
                doc,
                modalLoading,
                modalVisible,
                handleSave,
                treeSelectData
            }
        }
    });
</script>

<style>
    .w-e-menu {
        z-index: 2 !important;
    }
    .w-e-text-container {
        z-index: 1 !important;
    }
</style>