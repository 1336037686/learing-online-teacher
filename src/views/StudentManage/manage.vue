<template>
  <Row style="margin: 20px">
    <!--面包屑-->
    <Breadcrumb>
      <BreadcrumbItem><Icon type="ios-home-outline"/> 主页</BreadcrumbItem>
      <BreadcrumbItem>学生管理</BreadcrumbItem>
      <BreadcrumbItem>选课学生管理</BreadcrumbItem>
    </Breadcrumb>
    <!--操作按钮-->
    <Row  style="margin-top: 20px;background:#eee;padding: 20px">
      <Col span="1" style="margin-top: 5px">
        <h3>课程选择</h3>
      </Col>
      <Col span="5" style="margin-left: 10px">
        <Select v-model="selectCourse" @on-change="selectCourseHandler(selectCourse)">
          <Option v-for="item in $store.state.courseManage.courseList" :value="item.id" :key="item.id">{{ "【" + item.id + "】" + item.name }}</Option>
        </Select>
      </Col>
    </Row>
    <!--表格-->
    <Row style="margin-top: 20px" v-if="selectCourse.trim() !== ''">
      <Row>
        <Col span="2">
          <Button type="primary" icon="ios-cloud-done-outline" @click="beforeAdd">添加学生</Button>
        </Col>
      </Row>
      <Row style="margin-top: 10px">
        <Col span="24">
          <Table border :columns="studentTable" :data="$store.state.studentManage.studentData">
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="error" size="small" @click="remove(index)">删除</Button>
            </template>
          </Table>
        </Col>
      </Row>
    </Row>
    <!--新增弹框-->
    <Modal title="学生" v-model="addModelState" :mask-closable="false">
      <p slot="header" style="text-align:center">
        <span>学生操作</span>
      </p>
      <div style="text-align:center">
        <Form :model="formItem" :label-width="120">
          <FormItem label="学号">
            <Input v-model="formItem.name" placeholder="输入学生学号..."/>
          </FormItem>
          <FormItem label="再次输入学号">
            <Input v-model="formItem.name2" placeholder="再次输入学生学号..."/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="this.$store.state.studentManage.saveLoding" @click="save">保存</Button>
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
          name: '',
          name2: '',
        },
        addModelState: false,
        updateModelState: false,
        studentTable: [
          {
            title: '序号',
            type: 'index',
            align: 'center'
          },
          {
            title: '院系',
            key: 'department'
          },
          {
            title: '专业',
            key: 'specialty'
          },
          {
            title: '学号',
            key: 'username'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '邮箱',
            key: 'email'
          },
          {
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ],
        selectCourse: ''
      }
    },
    mounted() {
      this.$store.dispatch("courseManage/doQueryAllPass")
    },
    methods: {
      // 点击添加按钮前置操作
      beforeAdd() {
        this.formItem = {id: '', name: '', name2: ''};
        this.addModelState = true
      },
      // 保存
      save() {
        if(this.formItem.name.trim() === "" || this.formItem.name.trim() === "") {
          this.$Message.error("学号输入不能为空");
          return;
        }
        if (this.formItem.name !== this.formItem.name2) {
          this.$Message.error("两次学号输入不同");
          return;
        }
        this.$store.dispatch("studentManage/doSave", {"course": this.selectCourse, "student": this.formItem.name, "checkState": '1'})
      },
      // 删除
      remove(index) {
        let data = this.$store.state.studentManage.studentData[index];
        this.$Modal.confirm({
          title: '删除确认',
          content: '确认删除[' + data.name + "]?",
          onOk: () => {
            this.$store.dispatch("studentManage/doRemove", data)
          }
        })
      },
      selectCourseHandler(value) {
        this.$store.dispatch("studentManage/doQueryAllPassByCourse", value)
      }
    }
  }
</script>

<style scoped>

</style>
