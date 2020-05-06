<template>
  <Row style="margin: 20px">
    <!--面包屑-->
    <Breadcrumb>
      <BreadcrumbItem><Icon type="ios-home-outline"/> 主页</BreadcrumbItem>
      <BreadcrumbItem>学生管理</BreadcrumbItem>
      <BreadcrumbItem>审核申请</BreadcrumbItem>
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
      <Row style="margin-top: 10px">
        <Col span="24">
          <Table border :columns="studentTable" :data="$store.state.studentManage.studentData">
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="info" size="small" style="margin-right: 5px" @click="update(index, 'success')" :disabled="$store.state.studentManage.studentData[index].checkState !== '0'">通过</Button>
              <Button type="error" size="small" @click="update(index, 'fail')" :disabled="$store.state.studentManage.studentData[index].checkState !== '0'">不通过</Button>
            </template>
          </Table>
        </Col>
      </Row>
    </Row>
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
          order: 1,
          content: '',
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
            title: '审核状态',
            key: 'checkState',
            render: (h, params) => {
              const row = params.row;
              const color = row.checkState === '1' ? 'success' : row.checkState === '0' ? 'warning' : 'error';
              const text = row.checkState === '1' ? '通过' : row.checkState === '0' ? '待审核' : '未通过';
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text);
            }
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
      // 修改
      update(index, type) {
        let checkState = '1'
        if(type === 'success') {
          checkState = '1'
        }
        if(type === 'fail') {
          checkState = '2'
        }
        let data = this.$store.state.studentManage.studentData[index];
        this.$Modal.confirm({
          title: '审查确认',
          content: '确认[' + data.name + "]?",
          onOk: () => {
            this.$store.dispatch("studentManage/doUpdateCheckState", {"course": this.selectCourse, "checkState": checkState, "id": data.id})
          }
        })
      },
      selectCourseHandler(value) {
        this.$store.dispatch("studentManage/doQueryAllByCourse", value)
      }
    }
  }
</script>

<style scoped>

</style>
