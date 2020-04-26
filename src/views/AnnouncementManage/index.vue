<template>
  <Row style="margin: 20px">
    <!--面包屑-->
    <Breadcrumb>
      <BreadcrumbItem>
        <Icon type="ios-home-outline"/>
        主页
      </BreadcrumbItem>
      <BreadcrumbItem>公告管理</BreadcrumbItem>
      <BreadcrumbItem>公告管理</BreadcrumbItem>
    </Breadcrumb>
    <!--操作按钮-->
    <Row style="margin-top: 20px;background:#eee;padding: 20px">
      <Col span="2">
        <Button type="primary" icon="ios-cloud-done-outline" @click="changeAddModelState">添加公告</Button>
      </Col>
      <Col span="1" offset="1"><span style="font-size: 20px">筛选:</span></Col>
      <Col span="6">
        <Row>
          <Col span="11">
            <DatePicker type="date" placeholder="开始日期" v-model="formItem.startTime"/>
          </Col>
          <Col span="1" style="text-align: center">-</Col>
          <Col span="11">
            <DatePicker type="date" placeholder="结束日期" v-model="formItem.endTime"/>
          </Col>
        </Row>
      </Col>
      <Col span="4">
        <Input v-model="formItem.selectContent" placeholder="输入关键字"/>
      </Col>
      <Col span="2" style="margin-left: 10px">
        <Button type="primary" @click="search">查找</Button>
      </Col>
    </Row>
    <!--表格-->
    <Row style="margin-top: 20px">
      <Col span="24">
        <Table border :columns="announcementTable" :data="$store.state.announcementManage.announcementData.pageInfo.list">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看</Button>
            <Button type="error" size="small" @click="remove(index)">删除</Button>
          </template>
        </Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="$store.state.announcementManage.announcementData.pageInfo.total" :current="currentPage" :page-size="$store.state.announcementManage.size" show-total @on-change="nextPage"/>
          </div>
        </div>
      </Col>
    </Row>

    <!--添加公告-->
    <Modal v-model="addModelState" fullscreen title="公告操作">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"/>
        <span>添加公告</span>
      </p>
      <div style="text-align:center">
        <Row style="background:#eee;padding: 20px">
          <Col span="1">
            <span style="color: red;font-size: 20px">*</span>
            <span style="font-size: 20px">标题</span>
          </Col>
          <Col span="23">
            <Input v-model="modelForm.title" placeholder="填写标题"/>
          </Col>
        </Row>
        <Row>
          <Col span="24" style="margin-top: 10px">
            <TinymceEditer :height="700" ref="editor" v-model="modelForm.content"  />
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="save">发布公告</Button>
      </div>
    </Modal>

    <!--查看公告-->
    <Modal v-model="showModelState" fullscreen title="Fullscreen Modal">
      <p slot="header" style="text-align:center">
        <span v-html="showModelForm.title"/>
      </p>
      <div>
        <div style="margin: 20px" v-html="showModelForm.content"></div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </Row>
</template>

<script>
  import TinymceEditer from '@/components/Editer/TinymceEditer/index.vue'
  export default {
    name: "index",
    components: {
      TinymceEditer
    },
    data() {
      return {
        currentPage: 1,
        formItem: {
          startTime: '',
          endTime: '',
          selectContent: ''
        },
        modelForm: {
          title: '',
          content: ''
        },
        showModelForm: {
          title: '',
          content: ''
        },
        addModelState: false,
        showModelState: false,
        updateModelState: false,
        announcementTable: [
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
            title: '标题',
            key: 'title'
          },
          {
            title: '公告时间',
            key: 'time'
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
      this.$store.dispatch("announcementManage/doQueryAll", 1)
    },
    methods: {
      search() {
        // 搜索条件不为空，则根据条件查询所有
        if((this.formItem.endTime != '' && this.formItem.startTime != '') || this.formItem.selectContent != '') {
          if(this.formItem.endTime < this.formItem.startTime) {
            this.$Notice.error({title: "日期填写错误" , desc: ''})
            return;
          }
          let data = {"startTime": this.formItem.startTime, "endTime": this.formItem.endTime, "selectContent": this.formItem.selectContent, "currentPage": 1}
          this.$store.dispatch("announcementManage/doQueryByCondition", data)
        }
        // 搜索条件为空，则查询所有
        if((this.formItem.endTime === '' || this.formItem.startTime === '') && this.formItem.selectContent === '') {
          this.$store.dispatch("announcementManage/doQueryAll", 1)
        }
      },
      nextPage(index) {
        if((this.formItem.endTime != '' && this.formItem.startTime != '') || this.formItem.selectContent != '') {
          if(this.formItem.endTime < this.formItem.startTime) {
            this.$Notice.error({title: "日期填写错误" , desc: ''})
            return;
          }
          let data = {"startTime": this.formItem.startTime, "endTime": this.formItem.endTime, "selectContent": this.formItem.selectContent, "currentPage": index}
          this.$store.dispatch("announcementManage/doQueryByCondition", data)
        }
        // 搜索条件为空，则查询所有
        if((this.formItem.endTime === '' || this.formItem.startTime === '') && this.formItem.selectContent === '') {
          this.$store.dispatch("announcementManage/doQueryAll", index)
        }
        this.currentPage = index
      },
      //保存公告
      save() {
        this.$store.dispatch("announcementManage/doSave", this.modelForm)
      },
      show (index) {
        let data = this.$store.state.announcementManage.announcementData.pageInfo.list[index]
        this.showModelForm.title = data.title
        this.showModelForm.content = data.content
        this.showModelState = true
      },
      remove (index) {
        let data = this.$store.state.announcementManage.announcementData.pageInfo.list[index]
        this.$store.dispatch("announcementManage/doRemove", {"id": data.id, "currentPage": this.currentPage})
      },
      changeAddModelState() {
        this.modelForm.title=''
        this.modelForm.content=''
        this.addModelState = true
      }
    }
  }
</script>

<style scoped>

</style>
