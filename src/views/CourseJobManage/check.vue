<template>
  <Row style="margin: 20px">
    <!--面包屑-->
    <Breadcrumb>
      <BreadcrumbItem><Icon type="ios-home-outline"/> 主页</BreadcrumbItem>
      <BreadcrumbItem>作业管理</BreadcrumbItem>
      <BreadcrumbItem>作业审查</BreadcrumbItem>
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
      <Col span="1" style="margin-top: 5px;margin-left: 10px">
        <h3>作业选择</h3>
      </Col>
      <Col span="5" style="margin-left: 10px">
        <Select v-model="selectCourseJob" @on-change="selectCourseJobHandler(selectCourseJob)" :disabled="selectCourse === ''">
          <Option v-for="item in $store.state.courseJobManage.courseJobData" :value="item.id" :key="item.id">{{ item.title }}</Option>
        </Select>
      </Col>
    </Row>
    <!--表格-->
    <Row style="margin-top: 20px" v-if="selectCourse.trim() !== '' && selectCourseJob.trim() !== ''">
      <Tabs value="name1">
        <TabPane label="已提交作业" name="name1">
          <Row style="margin-top: 10px">
            <Col span="24">
              <Table border :columns="studentJobTable" :data="$store.state.courseJobManage.studentJobData">
                <template slot-scope="{ row }" slot="name">
                  <strong>{{ row.name }}</strong>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                  <Button type="primary" size="small" @click="show(index)">批改</Button>
                </template>
              </Table>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="未提交作业" name="name2">
          <Row>
            <Col span="24">
              <Table :columns="[
          {title: '序号',type: 'index',align: 'center'},
          {title: '学号',key: 'studentUserName'},
          {title: '名字',key: 'studentName'},
          {
            title: '提交状态',
            key: 'name',
            render: (h, params) => {
              const row = params.row;
              const color = 'error';
              const text = '未提交';
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text);
            }
          }]" :data="$store.state.courseJobManage.missStudentJobData"/>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Row>

    <!--查看弹框-->
    <Modal v-model="showModelState" fullscreen title="Fullscreen Modal">
      <p slot="header" style="text-align:center">
        <span v-html="showModelForm.title"/>
      </p>
      <div>
        <Row>
          <Col span="24">
            <p style="text-align: center;font-size: 20px;color: red"><span>上交时间: </span><span> [{{showModelForm.time}}]</span></p>
          </Col>
        </Row>
        <Row style="margin-top: 10px">
          <Col span="24">
            <Card>
              <Row>
                <Col span="24">
                  <div style="margin: 20px" v-html="showModelForm.content"></div>
                </Col>
              </Row>
              <Row style="margin-top: 10px" v-if="showModelForm.resource !== null && showModelForm.resource.trim() !== ''">
                <Col span="24">
                  <Button type="success" long @click="download(showModelForm.resource)" icon="ios-arrow-round-down">下载附件</Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <!--评分表单-->
        <Row style="margin-top: 20px">
          <Col span="24">
            <Card>
              <!--分数-->
              <Row style="margin-top: 20px">
                <Col span="2">
                  <span style="color: red;font-size: 20px">*</span>
                  <span style="font-size: 20px"> 教师评分 </span>
                </Col>
                <Col span="22">
                  <Input v-model="showModelForm.score" placeholder="填写分数（数字）"/>
                </Col>
              </Row>
              <!--评语-->
              <Row style="margin-top: 20px">
                <Col span="2">
                  <span style="color: red;font-size: 20px">*</span>
                  <span style="font-size: 20px"> 教师评语 </span>
                </Col>
                <Col span="22">
                  <Input v-model="showModelForm.evaluate" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="填写评语..." />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" long @click="update" :loading="$store.state.courseJobManage.saveLoding">保存</Button>
      </div>
    </Modal>
  </Row>
</template>

<script>
  import TinymceEditer from '@/components/Editer/TinymceEditer/index.vue'
  export default {
    name: "index",
    components: {
      TinymceEditer,
    },
    data () {
      return {
        showModelForm: {
          title: '',
          content: '',
          resource: '',
          time: '',
        },
        showModelState: false,
        studentJobTable: [
          {
            title: '序号',
            type: 'index',
            align: 'center'
          },
          {
            title: '学号',
            key: 'studentUserName'
          },
          {
            title: '名字',
            key: 'studentName'
          },
          {
            title: '作业名称',
            key: 'title'
          },
          {
            title: '时间',
            key: 'time'
          },
          {
            title: '批改状态',
            key: 'checkState',
            render: (h, params) => {
              const row = params.row;
              const color = row.checkState === '0'? 'error': 'success';
              const text = row.checkState === '0'? '未批改': '已批改';
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text);
            }
          },
          {
            title: '作业分数',
            key: 'score'
          },
          {
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ],
        selectCourse: '',
        selectCourseJob: ''
      }
    },
    mounted() {
      this.$store.dispatch("courseManage/doQueryAllPass")
    },
    methods: {
      // 查看
      show(index) {
        let data = this.$store.state.courseJobManage.studentJobData[index];
        this.showModelForm = JSON.parse(JSON.stringify(data))
        this.showModelState = true
      },
      //下载
      download(url) {
        window.location.href = url
      },
      update() {
        if(!this.dataValidate(this.showModelForm.score)) {
          this.$Message.error("分数不能为空")
          return
        }
        this.showModelForm.score = parseFloat(this.showModelForm.score)
        this.showModelForm.checkState = '1'
        this.$store.dispatch("courseJobManage/doUpdateStudentJob", {"id": this.showModelForm.id, "courseJob": this.showModelForm.courseJob, "checkState": this.showModelForm.checkState, "score": this.showModelForm.score, "evaluate": this.showModelForm.evaluate})
      },
      // 选择课程
      selectCourseHandler(value) {
        this.$store.dispatch("courseJobManage/doQueryAllByCourse", value)
        this.selectCourseJob = ''
      },
      // 选择作业
      selectCourseJobHandler(value) {
        if(value !== '') {
          this.$store.dispatch("courseJobManage/doQueryAllStudentJobByJobId", value)
          this.$store.dispatch("courseJobManage/doQueryMissStudentJobByJobId", {"course": this.selectCourse, "courseJob": value})
        }
      },
      handleSuccess (res, file) {
        this.$Notice.info({title: res.head.message , desc: ''});
        this.modelForm.resourse = res.body.data.url
      },
      // 表单验证
      dataValidate(value) {
        if(value === undefined || value.trim() === "") {
          return false;
        }
        return true;
      }
    }
  }
</script>

<style scoped>

</style>
