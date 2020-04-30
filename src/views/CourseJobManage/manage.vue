<template>
  <Row style="margin: 20px">
    <!--面包屑-->
    <Breadcrumb>
      <BreadcrumbItem><Icon type="ios-home-outline"/> 主页</BreadcrumbItem>
      <BreadcrumbItem>作业管理</BreadcrumbItem>
      <BreadcrumbItem>作业发布</BreadcrumbItem>
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
          <Button type="primary" icon="ios-cloud-done-outline" @click="beforeAdd">发布作业</Button>
        </Col>
      </Row>
      <Row style="margin-top: 10px">
        <Col span="24">
          <Table border :columns="courseJobTable" :data="$store.state.courseJobManage.courseJobData">
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="success" size="small" @click="show(index)">查看</Button>
              <Button type="primary" size="small" @click="beforeUpdate(index)">修改</Button>
              <Button type="error" size="small" @click="remove(index)">删除</Button>
            </template>
          </Table>
        </Col>
      </Row>
    </Row>
    <!--新增弹框-->
    <!--添加课程-->
    <Modal v-model="addModelState" @on-visible-change="modelWatchHandler(addModelState)"  fullscreen title="公告操作">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"/>
        <span>发布作业信息</span>
      </p>
      <div style="text-align:center">
        <Row style="background:#eee;padding: 20px">
          <!--标题-->
          <Row>
            <Col span="2">
              <span style="color: red;font-size: 20px">*</span>
              <span style="font-size: 20px"> 标 题 </span>
            </Col>
            <Col span="22">
              <Input v-model="modelForm.title" placeholder="填写标题"/>
            </Col>
          </Row>
          <Row style="margin-top: 20px">
            <Col span="2">
              <span style="color: red;font-size: 20px">*</span>
              <span style="font-size: 20px"> 时间 选择 </span>
            </Col>
            <Col span="22">
              <DatePicker type="datetimerange" v-model="modelForm.date" format="yyyy-MM-dd HH:mm" placeholder="时间选择" style="width: 100%"></DatePicker>
            </Col>
          </Row>
          <!--附件-->
          <Row style="margin-top: 20px">
            <Col span="2">
              <span style="color: red;font-size: 20px">*</span>
              <span style="font-size: 20px">附件上传</span>
            </Col>
            <Col span="22">
              <Card>
                <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :on-success="handleSuccess"
                  type="drag"
                  action="/api/v1/upload/resource">
                  <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击上传或者托住文件到此处</p>
                  </div>
                </Upload>
              </Card>
            </Col>
          </Row>
          <Row style="margin-top: 20px">
            <Col span="2">
              <span style="color: red;font-size: 20px">*</span>
              <span style="font-size: 20px">附件地址</span>
            </Col>
            <Col span="22">
              <Input v-model="modelForm.resourse" placeholder="" disabled/>
            </Col>
          </Row>
        </Row>
        <Row span="24" style="margin-top: 10px">
          <Col>
            <TinymceEditer :height="700" ref="editor" v-model="modelForm.content"  />
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" :loading="$store.state.courseJobManage.saveLoding" long @click="save(updateModelState ? 'update':'save')">保存</Button>
      </div>
    </Modal>

    <!--查看弹框-->
    <Modal v-model="showModelState" fullscreen title="Fullscreen Modal">
      <p slot="header" style="text-align:center">
        <span v-html="showModelForm.title"/>
      </p>
      <div>
        <p style="text-align: center;font-size: 20px"><span>上交时间: </span><span> [{{showModelForm.startTime}}] - [{{showModelForm.endTime}}]</span></p>
        <div style="margin: 20px" v-html="showModelForm.content"></div>
      </div>
      <div slot="footer">
        <Card v-if="showModelForm.resource !== null && showModelForm.resource.trim() !== ''" style="text-align: center">
          <Button type="success" long @click="download(showModelForm.resource)" icon="ios-arrow-round-down">下载附件</Button>
        </Card>
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
        modelForm: {
          title: '',
          content: '',
          resourse: '',
          date: [],
        },
        showModelForm: {
          title: '',
          content: '',
          resource: '',
          startTime: '',
          endTime: '',
        },
        addModelState: false,
        updateModelState: false,
        showModelState: false,
        courseJobTable: [
          {
            title: '序号',
            type: 'index',
            align: 'center'
          },
          {
            title: '作业ID',
            key: 'id'
          },
          {
            title: '作业名称',
            key: 'title'
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
        this.modelForm = {
          title: '',
          content: '',
          resourse: '',
          date: [],
        };
        this.addModelState = true
      },
      // 模态框监听器
      modelWatchHandler(value) {
        if(!value) {
          this.updateModelState = false;
        }
      },
      // 保存
      save(value) {
        if(!this.dataValidate(this.modelForm.title)) {
          this.$Message.error("作业标题不能为空");
          return;
        }
        if (this.modelForm.date.length != 2) {
          this.$Message.error("时间选择错误");
          return;
        }
        if(value === 'save') {
          this.$store.dispatch("courseJobManage/doSave", {"course": this.selectCourse, "resource": this.modelForm.resourse, "title": this.modelForm.title, "content": this.modelForm.content, "startTime": this.modelForm.date[0], "endTime": this.modelForm.date[1]})
        }
        if(value === 'update') {
          this.$store.dispatch("courseJobManage/doUpdate", {"id": this.modelForm.id, "course": this.selectCourse, "resource": this.modelForm.resourse, "title": this.modelForm.title, "content": this.modelForm.content, "startTime": this.modelForm.date[0], "endTime": this.modelForm.date[1]})
        }
      },
      // 更新
      beforeUpdate(index) {
        let data = this.$store.state.courseJobManage.courseJobData[index];
        this.modelForm.title = data.title
        this.modelForm.content = data.content
        this.modelForm.resourse = data.resource
        this.modelForm.date = [data.startTimeOriginal, data.endTimeOriginal]
        this.modelForm.id = data.id
        this.updateModelState = true
        this.addModelState = true
      },
      // 删除
      remove(index) {
        let data = this.$store.state.courseJobManage.courseJobData[index];
        this.$Modal.confirm({
          title: '删除确认',
          content: '确认删除[' + data.title + "]?",
          onOk: () => {
            this.$store.dispatch("courseJobManage/doRemove", {"id": data.id, "course": data.course})
          }
        })
      },
      // 查看
      show(index) {
        let data = this.$store.state.courseJobManage.courseJobData[index];
        this.showModelForm = data
        this.showModelState = true
      },
      //下载
      download(url) {
        window.location.href = url
      },
      selectCourseHandler(value) {
        this.$store.dispatch("courseJobManage/doQueryAllByCourse", value)
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
