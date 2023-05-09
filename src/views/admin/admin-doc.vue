<template>
    <a-layout>

        <a-layout-content
                :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
        >
    <!--<div class="about">-->
        <!--<h1>管理文档页面</h1>-->
    <!--</div>-->
            <p>
                <!--<a-button type="primary" @click="add()">-->
                    <!--新增-->
                <!--</a-button>-->
                <a-form layout="inline" :model="param">
                    <a-form-item>
                        <a-input v-model:value="param.name" placeholder="名称">
                        </a-input>
                    </a-form-item>
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
                    :columns="columns"
                    :row-key="'record => record.id'"
                    :data-source="docs"
                    :pagination="pagination"
                    :loading="loading"
                    @change="handleTableChange"
            >

                <template #cover="{ text: cover }">
                    <img v-if="cover" :src="cover" alt="avatar" />
                </template>

                <template v-slot:category="{ text, record }">
                    <span>{{ getCategoryName(record.category1Id) }} / {{ getCategoryName(record.category2Id) }}</span>
                </template>

                <template v-slot:action="{ text, record }">
                    <a-space size="small">
                        <router-link :to="'/admin/doc?docId=' + record.id">
                            <a-button type="primary">
                                文档管理
                            </a-button>
                        </router-link>
                        <a-button type="primary" @click="edit(record)">
                            编辑
                        </a-button>
                        <a-popconfirm
                                title="删除后不可恢复，确认删除?"
                                ok-text="是"
                                cancel-text="否"
                                @confirm="handleDelete(record.id)"
                        >
                            <a-button type="danger">
                                删除
                            </a-button>
                        </a-popconfirm>
                    </a-space>
                </template>
            </a-table>

            <!--点击编辑弹出的modal框-->
            <div>
                <a-modal
                        title="Title"
                        v-model:visible="modalVisible"
                        :confirm-loading="modalLoading"
                        @ok="handleModalOk"
                >
                    <a-form :model="doc" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                        <a-form-item label="封面">
                            <a-input v-model:value="doc.cover" />
                        </a-form-item>
                        <a-form-item label="名称">
                            <a-input v-model:value="doc.name" />
                        </a-form-item>
                        <a-form-item label="分类">
                            <a-cascader
                                    v-model:value="categoryIds"
                                    :field-names="{ label: 'name', value: 'id', children: 'children' }"
                                    :options="level1"
                            />
                        </a-form-item>
                        <a-form-item label="描述">
                            <a-input v-model:value="doc.description" type="textarea" />
                        </a-form-item>
                    </a-form>
                    <!--<p>展示编辑区域</p>-->
                </a-modal>
            </div>

        </a-layout-content>
    </a-layout>
</template>
<script lang="ts">
    import { defineComponent, onMounted, ref } from 'vue';
    import axios from 'axios';
    import {message} from "ant-design-vue";
    import {Tool} from "@/util/tool";
    import {useRoute} from "vue-router";
    export default defineComponent({
        name: 'AdminDoc',
        setup() {
            const route = useRoute();
            const param=ref();
            param.value={};
            const docs = ref();
            const pagination = ref({
                current: 1,
                pageSize: 10,
                total: 0
            });
            const loading = ref(false);

            const columns = [
                {
                    title: '封面',
                    dataIndex: 'cover',
                    slots: { customRender: 'cover' }
                },
                {
                    title: '名称',
                    dataIndex: 'name'
                },
                {
                    title: '分类一',
                    Key:'category1Id',
                    dataIndex:'category1Id'
                },
                {
                    title: '分类二',
                    dataIndex:'category2Id'
                },
                {
                    title: '文档数',
                    dataIndex: 'docCount'
                },
                {
                    title: '阅读数',
                    dataIndex: 'viewCount'
                },
                {
                    title: '点赞数',
                    dataIndex: 'voteCount'
                },
                {
                    title: 'Action',
                    key: 'action',
                    slots: { customRender: 'action' }
                }
            ];
            /**
             * 数据查询
             **/
            const handleQuery = (params: any) => {
                loading.value = true;
                axios.get("/doc/getDoc",{
                    params:{
                        page: params.page,
                        size: params.size,
                        name: param.value.name
                    }
                }).then((response) => {
                    loading.value = false;
                    const data = response.data;
                    docs.value = data.content.list;

                    // 重置分页按钮
                    pagination.value.current = params.page;
                    pagination.value.total = data.content.total;
                });
            };

            // const handleQuery = (params: any) => {
            //     loading.value = true;
            //     axios.get("http://localhost:8880/doc/getDoc", {
            //         params:{
            //             page: params.page,
            //             size: params.size,
            //             name: param.value.name
            //         }
            //     }).then((response) => {
            //         loading.value = false;
            //         const data = response.data;
            //         if (data.success){
            //             doc.value = data.content.list;
            //             // doc.value = {cover: "11",name: "223"},{cover: "2",name: "5"};
            //             console.log("shuju"+doc.value);
            //             // 重置分页按钮
            //             pagination.value.current = params.page;
            //             pagination.value.total = data.content.total;
            //         }else {
            //             message.error(data.message);
            //         }
            //
            //
            //     });
            // };

            /**
             * 表格点击页码时触发
             */
            const handleTableChange = (pagination: any) => {
                console.log("看看自带的分页参数都有啥：" + pagination);
                handleQuery({
                    page: pagination.current,
                    size: pagination.pageSize
                });
            };

            // -------- 表单 ---------
            const doc = ref({});
            const modalVisible = ref(false);
            const modalLoading = ref(false);
            const handleModalOk = () => {
                modalLoading.value = true;
                axios.post("/doc/save", doc.value).then((response) => {
                    modalLoading.value = false;
                    const data = response.data; // data = commonResp
                    if (data.success) {
                        modalVisible.value = false;
                        // 重新加载列表
                        handleQuery({
                            page: pagination.value.current,
                            size: pagination.value.pageSize,
                        });
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
             * 编辑
             */
            const edit = (record: any) => {
                modalVisible.value = true;
                //doc.value=record
                doc.value=Tool.copy(record);
            };

            /**
             * 新增
             */
            const add = () => {
                modalVisible.value = true;
                doc.value = {
                    ebookId : route.query.ebookId
                };
            };

            /**删除 */
            const handleDelete = (id: number) => {
                axios.delete("/doc/delete/" + id).then((response) => {
                    const data = response.data; // data = commonResp
                    if (data.success) {
                        // 重新加载列表
                        handleQuery({
                            page: pagination.value.current,
                            size: pagination.value.pageSize,
                        });
                    }
                });
            };

            onMounted(() => {
                handleQuery({
                    page: pagination.value.current,
                    size: pagination.value.pageSize
                    // page: 1,
                    // size: pagination.value.pageSize
                });
            });
            return {
                docs,
                pagination,
                columns,
                loading,
                handleTableChange,
                param,
                handleQuery,

                edit,
                add,
                handleDelete,
                doc,
                modalLoading,
                modalVisible,
                handleModalOk,
            }
        }
    });
</script>