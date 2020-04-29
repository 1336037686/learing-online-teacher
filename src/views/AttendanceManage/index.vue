<template>
  <Row style="margin: 20px">
    <!--面包屑-->
    <Breadcrumb>
      <BreadcrumbItem><Icon type="ios-home-outline"/> 主页</BreadcrumbItem>
      <BreadcrumbItem>签到管理</BreadcrumbItem>
      <BreadcrumbItem>签到操作</BreadcrumbItem>
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
          <Button type="primary" icon="ios-cloud-done-outline" @click="beforeAdd">创建签到流程</Button>
        </Col>
      </Row>
      <Row style="margin-top: 10px">
        <Col span="24">
          <Table border :columns="attendanceTable" :data="$store.state.attendanceManage.attendanceList">
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" size="small" @click="show(index)">查看签到详情</Button>
              <Button type="error" size="small" @click="remove(index)">删除</Button>
            </template>
          </Table>
        </Col>
      </Row>
    </Row>
    <!--新增弹框-->
    <Modal title="签到" v-model="addModelState" :mask-closable="false">
      <p slot="header" style="text-align:center">
        <span>签到操作</span>
      </p>
      <div style="text-align:center">
        <Form :model="formItem" :label-width="120">
          <FormItem label="签到时长">
            <InputNumber :max="100" :min="5" v-model="formItem.date" style="width: 100%"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="this.$store.state.attendanceManage.saveLoding" @click="save">保存</Button>
      </div>
    </Modal>
    <!--查看详情-->
    <Modal title="签到详情" v-model="showModelState" :mask-closable="false">
      <p slot="header" style="text-align:center">
        <span>签到详情</span>
      </p>
      <div style="text-align:center">
        <Table :columns="[
          {title: '学号',key: 'userName'},
          {title: '名字',key: 'name'},
          {
            title: '签到状态',
            key: 'name',
            render: (h, params) => {
              const row = params.row;
              const color = 'error';
              const text = '未签到';
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text);
            }
          }]" :data="$store.state.attendanceManage.attendanceInfo"/>
      </div>
      <div slot="footer"></div>
    </Modal>
  </Row>
</template>

<script>
  export default {
    name: "index",
    data () {
      return {
        formItem: {
          date: 5,
        },
        addModelState: false,
        showModelState: false,
        attendanceTable: [
          {
            title: '序号',
            type: 'index',
            align: 'center'
          },
          {
            title: '签到ID',
            key: 'id'
          },
          {
            title: '起始时间',
            key: 'startTime'
          },
          {
            title: '结束时间',
            key: 'endTime'
          },
          {
            title: '操作',
            slot: 'action',
            width: 300,
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
        this.formItem = {date: 5};
        this.addModelState = true
      },
      //查看签到详情
      show(index) {
        let data = this.$store.state.attendanceManage.attendanceList[index];
        this.$store.dispatch("attendanceManage/doQueryInfoById", data.id).then(() => {
          this.showModelState = true
        })
      },
      // 保存
      save() {
        this.$store.dispatch("attendanceManage/doSave", {"course": this.selectCourse, "date": this.formItem.date})
      },
      // 删除
      remove(index) {
        let data = this.$store.state.attendanceManage.attendanceList[index];
        this.$Modal.confirm({
          title: '删除确认',
          content: '确认删除[' + data.id + "]?",
          onOk: () => {
            this.$store.dispatch("attendanceManage/doRemove", {"id": data.id, "course": this.selectCourse})
          }
        })
      },
      selectCourseHandler(value) {
        this.$store.dispatch("attendanceManage/doQueryAllByCourse", value)
      }
    }
  }
</script>

<style scoped>

</style>
