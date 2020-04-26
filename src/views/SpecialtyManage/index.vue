<template>
  <Row style="margin: 20px">
    <!--面包屑-->
    <Breadcrumb>
      <BreadcrumbItem>
        <Icon type="ios-home-outline"/>
        主页
      </BreadcrumbItem>
      <BreadcrumbItem>基础管理</BreadcrumbItem>
      <BreadcrumbItem>学校专业管理</BreadcrumbItem>
    </Breadcrumb>
    <!--操作按钮-->
    <Row style="margin-top: 20px;background:#eee;padding: 20px">
      <Col span="2">
        <Button type="primary" icon="ios-cloud-done-outline" @click="changeAddModelState">添加专业</Button>
      </Col>
    </Row>
    <!--表格-->
    <Row style="margin-top: 20px">
      <Col span="24">
        <Table border :columns="specialtyTable" :data="$store.state.specialtyManage.specialtyData.pageInfo.list">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">修改</Button>
            <Button type="error" size="small" @click="remove(index)">删除</Button>
          </template>
        </Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="$store.state.specialtyManage.specialtyData.pageInfo.total" :current="currentPage" :page-size="$store.state.specialtyManage.size" show-total @on-change="nextPage"/>
          </div>
        </div>
      </Col>
    </Row>

    <!--添加公告-->
    <Modal v-model="addModelState" title="专业操作">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"/>
        <span>添加专业</span>
      </p>
      <div style="text-align:center">
        <Form :model="modelForm" :label-width="80">
          <FormItem label="专业名称">
            <Input v-model="modelForm.name" placeholder="输入院系名称..."></Input>
          </FormItem>
          <FormItem label="所属院系">
            <Select v-model="modelForm.depId">
              <Option v-for="item in $store.state.departmentManage.departmentSelectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="save">提交保存</Button>
      </div>
    </Modal>

    <!--修改公告-->
    <Modal v-model="updateModelState" title="专业操作">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"/>
        <span>修改专业</span>
      </p>
      <div style="text-align:center">
        <Form :model="modelForm" :label-width="80">
          <FormItem label="专业名称">
            <Input v-model="modelForm.name" placeholder="输入院系名称..."></Input>
          </FormItem>
          <FormItem label="所属院系">
            <Select v-model="modelForm.depId">
              <Option v-for="item in $store.state.departmentManage.departmentSelectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="update">提交保存</Button>
      </div>
    </Modal>

  </Row>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        currentPage: 1,
        formItem: {
          selectContent: ''
        },
        modelForm: {
          id: '',
          name: '',
          depId: '',
        },
        addModelState: false,
        showModelState: false,
        updateModelState: false,
        specialtyTable: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: 'ID',
            key: 'id'
          },
          {
            title: '院系',
            key: 'departmentName'
          },
          {
            title: '专业',
            key: 'name'
          },
          {
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ]
      }
    },
    mounted() {
      // 请求列表
      this.$store.dispatch("specialtyManage/doQueryAll", 1)
      // 查询院系
      this.$store.dispatch("departmentManage/doQueryDeparmentToSelectList")
    },
    methods: {
      search() {
        alert("还未实现")
      },
      nextPage(index) {
        this.$store.dispatch("specialtyManage/doQueryAll", index)
        this.currentPage = index
      },
      //保存公告
      save() {
        this.$store.dispatch("specialtyManage/doSave", this.modelForm)
      },
      show (index) {
        let data = this.$store.state.specialtyManage.specialtyData.pageInfo.list[index]
        this.modelForm.id = data.id
        this.modelForm.name = data.name
        this.modelForm.depId = data.depId
        this.updateModelState = true
      },
      update () {
        this.$store.dispatch("specialtyManage/doUpdate", {"data": this.modelForm, "currentPage": this.currentPage})
      },
      remove (index) {
        let data = this.$store.state.specialtyManage.specialtyData.pageInfo.list[index]
        this.$Modal.confirm({
          title: '删除确认',
          content: '确认删除[' + data.name + "]?",
          onOk: () => {
            this.$store.dispatch("specialtyManage/doRemove", {"id": data.id, "currentPage": this.currentPage})
          }
        });
      },
      changeAddModelState() {
        this.modelForm.id=''
        this.modelForm.depId=''
        this.modelForm.name=''
        this.addModelState = true
      }
    }
  }
</script>

<style scoped>

</style>
