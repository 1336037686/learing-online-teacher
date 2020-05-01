<template>
  <Row style="margin: 20px">
    <!--面包屑-->
    <Breadcrumb>
      <BreadcrumbItem><Icon type="ios-home-outline"/> 主页</BreadcrumbItem>
      <BreadcrumbItem>考试管理</BreadcrumbItem>
      <BreadcrumbItem>试卷批改</BreadcrumbItem>
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
        <h3>试卷选择</h3>
      </Col>
      <Col span="5" style="margin-left: 10px">
        <Select v-model="selectExam" @on-change="selectExamHandler(selectExam)" :disabled="selectCourse === ''">
          <Option v-for="item in $store.state.examManage.examData" :value="item.id" :key="item.id">{{ item.title }}</Option>
        </Select>
      </Col>
    </Row>
    <!--表格-->
    <Row style="margin-top: 20px" v-if="selectCourse !== '' && selectExam !== ''">
      <Tabs value="name1">
        <TabPane label="已提交试卷" name="name1">
          <Row style="margin-top: 10px">
            <Col span="24">
              <Table border :columns="studentExamTable" :data="$store.state.examManage.studentExamData">
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
        <TabPane label="未提交试卷" name="name2">
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
          }]" :data="$store.state.examManage.missStudentExamData"/>
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
              <Row style="margin-top: 10px" v-if="showModelForm.resource !== null && showModelForm.resource !== ''">
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
        <Button type="primary" long @click="update" :loading="$store.state.examManage.saveLoding">保存</Button>
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
        studentExamTable: [
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
            title: '试卷名称',
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
            title: '试卷分数',
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
        selectExam: ''
      }
    },
    mounted() {
      this.$store.dispatch("courseManage/doQueryAllPass")
    },
    methods: {
      // 查看
      show(index) {
        let data = this.$store.state.examManage.studentExamData[index];
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
        this.$store.dispatch("examManage/doUpdateStudentExam", {"id": this.showModelForm.id, "examination": this.showModelForm.examination, "checkState": this.showModelForm.checkState, "score": this.showModelForm.score, "evaluate": this.showModelForm.evaluate})
      },
      // 选择课程
      selectCourseHandler(value) {
        this.$store.dispatch("examManage/doQueryAllByCourse", value)
        this.selectExam = ''
      },
      // 选择试卷
      selectExamHandler(value) {
        if(value !== '') {
          this.$store.dispatch("examManage/doQueryAllStudentExamByExamId", value)
          this.$store.dispatch("examManage/doQueryMissStudentExamByExamId", {"course": this.selectCourse, "examination": value})
        }
      },
      handleSuccess (res, file) {
        this.$Notice.info({title: res.head.message , desc: ''});
        this.modelForm.resourse = res.body.data.url
      },
      // 表单验证
      dataValidate(value) {
        if(value === undefined || value === "") {
          return false;
        }
        return true;
      }
    }
  }
</script>

<style scoped>

</style>
