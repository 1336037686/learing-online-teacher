<template>
  <Row style="margin: 20px">
    <!--面包屑-->
    <Breadcrumb>
      <BreadcrumbItem><Icon type="ios-home-outline"></Icon> 主页</BreadcrumbItem>
      <BreadcrumbItem>基础管理</BreadcrumbItem>
      <BreadcrumbItem>学校院系管理</BreadcrumbItem>
    </Breadcrumb>
    <!--操作按钮-->
    <Row  style="margin-top: 20px;background:#eee;padding: 20px">
      <Col span="2">
        <Button type="primary" icon="ios-cloud-done-outline" @click="formItem.input = '';addModelState = true">添加院系</Button>
      </Col>
    </Row>
    <!--表格-->
    <Row style="margin-top: 20px">
      <Col span="24">
        <Table border :columns="departmentTable" :data="$store.state.departmentManage.departmentList">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="info" size="small" style="margin-right: 5px" @click="update(index)">修改</Button>
            <Button type="error" size="small" @click="remove(index)">删除</Button>
          </template>
        </Table>
      </Col>
    </Row>
    <!--新增弹框-->
    <Modal title="类别" v-model="addModelState">
      <p slot="header" style="text-align:center">
        <span>院系操作</span>
      </p>
      <div style="text-align:center">
        <Form :model="formItem" :label-width="80">
          <FormItem label="院系名称">
            <Input v-model="formItem.input" placeholder="输入院系名称..."></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="this.$store.state.departmentManage.saveLoding" @click="save">保存院系</Button>
      </div>
    </Modal>
    <!--修改弹框-->
    <Modal title="类别" v-model="updateModelState">
      <p slot="header" style="text-align:center">
        <span>院系修改</span>
      </p>
      <div style="text-align:center">
        <Form :model="formItem" :label-width="80">
          <FormItem label="院系ID">
            <Input v-model="formItem.id" :disabled="true"></Input>
          </FormItem>
          <FormItem label="院系名称">
            <Input v-model="formItem.input" placeholder="输入院系名称..."></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long :loading="this.$store.state.departmentManage.saveLoding" @click="updateSave">修改类别</Button>
      </div>
    </Modal>
  </Row>
</template>

<script>
  export default {
    name: "index",
    data () {
      return {
        formItem: {
          id: '',
          input: '',
        },
        addModelState: false,
        updateModelState: false,
        departmentTable: [
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
            title: '院系名称',
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
      this.$store.dispatch("departmentManage/doQueryAll")
    },
    methods: {
      handleSelectAll (status) {
        this.$refs.selection.selectAll(status);
      },
      save() {
        this.saveLogin = true
        if(this.formItem.input.trim() == "") {
          this.$Message.error("输入不能为空")
          return;
        }
        this.$store.dispatch("departmentManage/doSave", {"name": this.formItem.input})
      },
      remove(index) {
        let row = this.$store.state.categoryManage.categoryList[index]
        this.$store.dispatch("departmentManage/doRemove", row)
      },
      update(index) {
        let row = this.$store.state.departmentManage.departmentList[index]
        this.formItem.id = row.id
        this.formItem.input = row.name
        this.updateModelState = true
      },
      updateSave() {
        this.$store.dispatch("departmentManage/doUpdate", {"id": this.formItem.id, "name" : this.formItem.input})
      }
    }
  }
</script>

<style scoped>

</style>
