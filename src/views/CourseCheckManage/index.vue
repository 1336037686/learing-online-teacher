<template>
  <Row style="margin: 20px">
    <!--面包屑-->
    <Breadcrumb>
      <BreadcrumbItem>
        <Icon type="ios-home-outline"/>
        主页
      </BreadcrumbItem>
      <BreadcrumbItem>课程管理</BreadcrumbItem>
      <BreadcrumbItem>课程管理</BreadcrumbItem>
    </Breadcrumb>
    <!--操作按钮-->
    <Row style="margin-top: 20px;background:#eee;padding: 20px">
      <Col span="2">
        <Button type="primary" icon="ios-cloud-done-outline" @click="beforeAdd">添加课程</Button>
      </Col>
      <Col span="4">
        <Input v-model="formItem.selectContent" placeholder="输入课程名称"/>
      </Col>
      <Col span="2" style="margin-left: 10px">
        <Button type="primary" @click="search">查找</Button>
      </Col>
    </Row>
    <!--表格-->
    <Row style="margin-top: 20px">
      <Col span="24">
        <Table border :columns="courseTable" :data="$store.state.courseManage.courseData.pageInfo.list">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看简介</Button>
            <Button type="success" size="small" @click="beforeUpdate(index)">修改</Button>
            <Button type="error" size="small" @click="remove(index)">删除</Button>
          </template>
        </Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="$store.state.courseManage.courseData.pageInfo.total" :current="currentPage" :page-size="$store.state.courseManage.size" show-total @on-change="nextPage"/>
          </div>
        </div>
      </Col>
    </Row>

    <!--添加课程-->
    <Modal v-model="addModelState" fullscreen title="公告操作">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"/>
        <span>添加课程信息</span>
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
          <!--类别-->
          <Row style="margin-top: 20px">
            <Col span="2">
              <span style="color: red;font-size: 20px">*</span>
              <span style="font-size: 20px">课程类别</span>
            </Col>
            <Col span="22">
              <Select v-model="modelForm.type">
                <Option v-for="item in $store.state.categoryManage.categoryList" :value="item.id" :key="item.id">{{ item.categoryName }}</Option>
              </Select>
            </Col>
          </Row>
          <!--封面-->
          <Row style="margin-top: 20px">
            <Col span="2">
              <span style="color: red;font-size: 20px">*</span>
              <span style="font-size: 20px">封面上传</span>
            </Col>
            <Col span="19">
              <Card>
                <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :format="['jpg','jpeg','png']"
                  :on-success="handleSuccess"
                  type="drag"
                  action="/api/v1/upload/image">
                  <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击上传或者托住图片到此处</p>
                  </div>
                </Upload>
              </Card>
            </Col>
            <Col span="3">
                <Avatar shape="square" :src="modelForm.uploadPic" size="large" style="width: 150px;height: 150px;"/>
            </Col>
          </Row>
        </Row>
        <Row>
          <Col span="24" style="margin-top: 10px">
            <TinymceEditer :height="700" ref="editor" v-model="modelForm.content"  />
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="save(!updateModelState ? 'save': 'update')">保存</Button>
      </div>
    </Modal>
    <!--查看课程-->
    <Modal v-model="showModelState" fullscreen title="Fullscreen Modal">
      <p slot="header" style="text-align:center">
        <span v-html="showModelForm.title"/>
      </p>
      <div>
        <div style="margin: 20px" v-html="showModelForm.content"></div>
      </div>
      <div slot="footer"/>
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
    data() {
      return {
        currentPage: 1,
        formItem: {
          selectContent: ''
        },
        modelForm: {
          title: '',
          type: '',
          content: '',
          // 默认封面
          uploadPic: 'http://lgx-tvt.oss-cn-shenzhen.aliyuncs.com/image/20200424202201830-413639373138608128.jpg?Expires=1588824926&OSSAccessKeyId=LTAIeh9HSUIOFLPX&Signature=J%2BwcBp08W835M8J7h%2B5vEUig4pM%3D'
        },
        showModelForm: {
          title: '',
          content: ''
        },
        addModelState: false,
        showModelState: false,
        updateModelState: false,
        courseTable: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '课程号',
            key: 'id'
          },
          {
            title: '课程名称',
            key: 'name'
          },
          {
            title: '课程类别',
            key: 'typeName'
          },
          {
            title: '课程封面',
            key: 'cover',
            align: 'center',
            width: 110,
            render: (h, params) => {
              return h('img', {
                style:{
                  width:'100px',
                  height:'100px',
                },
                attrs: {
                  src: params.row.cover,
                }
              });
            }
          },
          {
            title: '申请时间',
            key: 'time'
          },
          {
            title: '审核状态',
            key: 'checkState',
            render: (h, params) => {
              const row = params.row;
              const color = row.checkState === '0'? 'warning': row.checkState === '1' ? 'success' : 'error';
              const text = row.checkState === '0'? '未审核': row.checkState === '1'? '已通过' : '未通过';
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
      }
    },
    mounted() {
      // 请求列表
      this.$store.dispatch("categoryManage/doQueryAll")
      this.$store.dispatch("courseManage/doQueryAll", {"currentPage": 1, "teacher": this.$store.state.loginManage.id})

    },
    methods: {
      search() {
        if(this.formItem.selectContent.trim() == "") {
          this.$store.dispatch("courseManage/doQueryAll", 1)
        } else {
          // this.$store.dispatch("courseManage/doQueryCondition", {"currentPage": 1, "name": this.formItem.selectContent.trim()})
        }
      },
      // 下一页
      nextPage(index) {
        if(this.formItem.selectContent.trim() == "") {
          this.$store.dispatch("courseManage/doQueryAll", {"currentPage": index, "teacher": this.$store.state.loginManage.id})
        } else {
          // this.$store.dispatch("courseManage/doQueryCondition", {"currentPage": index, "teacher": this.$store.state.loginManage.id, "name": this.formItem.selectContent.trim()})
        }
        this.currentPage = index
      },
      // 添加课程信息
      beforeAdd() {
        this.modelForm = {
          title: '',
          type: '',
          content: '',
          uploadPic: 'http://lgx-tvt.oss-cn-shenzhen.aliyuncs.com/image/20200424202201830-413639373138608128.jpg?Expires=1588824926&OSSAccessKeyId=LTAIeh9HSUIOFLPX&Signature=J%2BwcBp08W835M8J7h%2B5vEUig4pM%3D'
        }
        this.addModelState = true
      },
      // 查看简介
      show (index) {
        let data = this.$store.state.courseManage.courseData.pageInfo.list[index]
        this.showModelForm.title = data.name
        this.showModelForm.content = data.intro
        this.showModelState = true
      },
      // 保存
      save(type) {
        if(!this.dataValidate(this.modelForm.title)) {
          this.$Message.error("标题必须填写")
          return
        }
        if(!this.dataValidate(this.modelForm.type)) {
          this.$Message.error("请选择课程类别")
          return
        }
        if(!this.dataValidate(this.modelForm.uploadPic)) {
          this.$Message.error("请选择一张封面")
          return
        }
        if(!this.dataValidate(this.modelForm.content)) {
          this.$Message.error("请填写课程简介")
          return
        }
        // 保存
        if(type === 'save') {
          this.$store.dispatch("courseManage/doSave", {"name": this.modelForm.title, "type": this.modelForm.type, "cover": this.modelForm.uploadPic, "intro": this.modelForm.content, "teacher": this.$store.state.loginManage.id})
        }
        if(type == 'update') {
          this.$store.dispatch("courseManage/doUpdate", {"currentPage": this.currentPage, "data": {"id": this.modelForm.id, "name": this.modelForm.title, "type": this.modelForm.type, "cover": this.modelForm.uploadPic, "intro": this.modelForm.content, "teacher": this.$store.state.loginManage.id}})
        }
      },
      // 修改
      beforeUpdate(index) {
        let data = this.$store.state.courseManage.courseData.pageInfo.list[index]
        this.modelForm.id = data.id
        this.modelForm.title = data.name
        this.modelForm.type = data.type
        this.modelForm.content = data.intro
        this.modelForm.uploadPic = data.cover
        this.updateModelState = true
        this.addModelState = true
      },
      // 删除
      remove(index) {
        let data = this.$store.state.courseManage.courseData.pageInfo.list[index]
        this.$Modal.confirm({
          title: '删除确认',
          content: '确认删除[' + data.name + "]?",
          onOk: () => {
            this.$store.dispatch("courseManage/doRemove", {"data": {"id": data.id}, "currentPage": this.currentPage})
          }
        });
      },
      handleSuccess (res, file) {
        this.$Notice.info({title: res.head.message , desc: ''});
        this.modelForm.uploadPic = res.body.data.url
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
