<template>
  <Row style="margin: 20px">
    <!--面包屑-->
    <Breadcrumb>
      <BreadcrumbItem><Icon type="ios-home-outline"/> 主页</BreadcrumbItem>
      <BreadcrumbItem>课程管理</BreadcrumbItem>
      <BreadcrumbItem>资源管理</BreadcrumbItem>
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
      <Col span="1" style="margin-top: 5px;margin-left: 5px">
        <h3>章节选择</h3>
      </Col>
      <Col span="5" style="margin-left: 10px">
        <Select v-model="selectSection" @on-change="selectSectionHandler(selectSection)" :disabled="selectCourse === ''">
          <Option v-for="item in $store.state.sectionManage.sectionList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </Col>
    </Row>
    <!--表格-->
    <Row style="margin-top: 20px" v-if="selectCourse !== '' && selectSection !== ''">
      <Row>
        <Col span="2">
          <Button type="primary" icon="ios-cloud-done-outline" @click="beforeAdd">添加资源</Button>
        </Col>
      </Row>
      <Row style="margin-top: 10px">
        <Col span="24">
          <Table border :columns="resourceTable" :data="$store.state.resourceManage.resourceList">
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="info" size="small" style="margin-right: 5px" @click="show(index)">下载</Button>
              <Button type="error" size="small" @click="remove(index)">删除</Button>
            </template>
          </Table>
        </Col>
      </Row>
    </Row>
    <!--新增弹框-->
    <Modal title="章节" v-model="addModelState" @on-visible-change="addModelWatchHandler(addModelState)" :mask-closable="false">
      <p slot="header" style="text-align:center">
        <span>资源操作</span>
      </p>
      <div style="text-align:center">
        <Form :model="formItem" :label-width="80">
          <FormItem label="资源">
            <Input v-model="formItem.name" placeholder="输入资源名称..."/>
          </FormItem>
          <FormItem label="上传资源">
            <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="handleSuccess"
              type="drag"
              action="/api/v1/upload/resource">
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"/>
                <p>点击上传或者托住文件到此处</p>
              </div>
            </Upload>
          </FormItem>
          <FormItem label="上传地址" v-if="formItem.content !== ''">
            <Input v-model="formItem.content" disabled/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="this.$store.state.resourceManage.saveLoding" @click="save">保存</Button>
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
          name: '',
          content: '',
        },
        addModelState: false,
        resourceTable: [
          {
            title: '序号',
            type: 'index',
            align: 'center'
          },
          {
            title: 'ID',
            key: 'id'
          },
          {
            title: '资源名称',
            key: 'name'
          },
          {
            title: '操作',
            slot: 'action',
            width: 300,
            align: 'center'
          }
        ],
        selectCourse: '',
        selectSection: '',
      }
    },
    mounted() {
      this.$store.dispatch("courseManage/doQueryAllPass")
    },
    methods: {
      // 点击添加按钮前置操作
      beforeAdd() {
        this.formItem = {name: '', content: ''};
        this.addModelState = true
      },
      // 模态框监听器
      addModelWatchHandler(value) {
        if(!value) {
          this.updateModelState = false;
        }
      },
      // 保存
      save(value) {
        if(this.formItem.name.trim() === "") {
          this.$Message.error("资源名称输入不能为空");
          return;
        }
        if(this.formItem.content.trim() === "") {
          this.$Message.error("资源不能为空");
          return;
        }
        this.$store.dispatch("resourceManage/doSave", {"course": this.selectCourse, "section": this.selectSection, "name": this.formItem.name, "addr": this.formItem.content})
      },
      // 删除
      remove(index) {
        let data = this.$store.state.resourceManage.resourceList[index];
        this.$Modal.confirm({
          title: '删除确认',
          content: '确认删除[' + data.name + "]?",
          onOk: () => {
            this.$store.dispatch("resourceManage/doRemove", data)
          }
        })
      },
      // 查看资源
      show(index) {
        let data = this.$store.state.resourceManage.resourceList[index];
        window.location.href = data.addr
      },
      // 选择课程
      selectCourseHandler(value) {
        this.$store.dispatch("sectionManage/doQueryAll", value)
        this.selectSection = ''
      },
      // 选择章节
      selectSectionHandler(value) {
        if(value !== '' && this.selectSection !== '') {
          this.$store.dispatch("resourceManage/doQueryAll", {"course": this.selectCourse, "section": value})
        }
      },
      // 资源上传成功
      handleSuccess (res, file) {
        this.$Notice.info({title: res.head.message , desc: ''});
        file.name = '资源'
        file.url = res.body.data.url
        this.formItem.content = res.body.data.url
      },
    }
  }
</script>

<style scoped>

</style>
