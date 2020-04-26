<template>
  <Row style="margin: 20px">
    <!--面包屑-->
    <Breadcrumb>
      <BreadcrumbItem><Icon type="ios-home-outline"/> 主页</BreadcrumbItem>
      <BreadcrumbItem>课程管理</BreadcrumbItem>
      <BreadcrumbItem>章节管理</BreadcrumbItem>
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
          <Button type="primary" icon="ios-cloud-done-outline" @click="beforeAdd">添加章节</Button>
        </Col>
      </Row>
      <Row style="margin-top: 10px">
        <Col span="24">
          <Table border :columns="sectionTable" :data="$store.state.sectionManage.sectionList">
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="success" size="small" style="margin-right: 5px" @click="show(index)">查看简介</Button>
              <Button type="info" size="small" style="margin-right: 5px" @click="beforeUpdate(index)">修改</Button>
              <Button type="error" size="small" @click="remove(index)">删除</Button>
            </template>
          </Table>
        </Col>
      </Row>
    </Row>
    <!--新增弹框-->
    <Modal title="章节" v-model="addModelState" @on-visible-change="modelWatchHandler(addModelState)" :mask-closable="false">
      <p slot="header" style="text-align:center">
        <span>章节操作</span>
      </p>
      <div style="text-align:center">
        <Form :model="formItem" :label-width="80">
          <FormItem label="章节ID" v-if="updateModelState">
            <Input v-model="formItem.id" placeholder="输入章节ID..." disabled/>
          </FormItem>
          <FormItem label="章节名称">
            <Input v-model="formItem.name" placeholder="输入章节名称..."/>
          </FormItem>
          <FormItem label="章节排序">
            <InputNumber :max="10000" :min="1" v-model="formItem.order" style="width: 100%"/>
          </FormItem>
          <FormItem label="章节简介">
            <Input v-model="formItem.content" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="输入章节简介..."/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="this.$store.state.sectionManage.saveLoding" @click="save(updateModelState ? 'update' : 'save')">保存</Button>
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
          order: 1,
          content: '',
        },
        addModelState: false,
        updateModelState: false,
        sectionTable: [
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
            title: '章节名称',
            key: 'name'
          },
          {
            title: '排序',
            key: 'order'
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
        this.formItem = {id: '', name: '', order: 1, content: ''};
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
        if(this.formItem.name.trim() === "") {
          this.$Message.error("章节名称输入不能为空");
          return;
        }
        if(value === 'save') {
          this.$store.dispatch("sectionManage/doSave", {"course": this.selectCourse, "name": this.formItem.name, "intro": this.formItem.content, "order": this.formItem.order})
        }
        if(value === 'update') {
          this.$store.dispatch("sectionManage/doUpdate", {"id": this.formItem.id, "course": this.selectCourse, "name": this.formItem.name, "intro": this.formItem.content, "order": this.formItem.order})
        }
      },
      // 删除
      remove(index) {
        let data = this.$store.state.sectionManage.sectionList[index];
        this.$Modal.confirm({
          title: '删除确认',
          content: '确认删除[' + data.name + "]?",
          onOk: () => {
            this.$store.dispatch("sectionManage/doRemove", data)
          }
        })
      },
      // 修改
      beforeUpdate(index) {
        let data = this.$store.state.sectionManage.sectionList[index];
        this.formItem.id = data.id
        this.formItem.name = data.name
        this.formItem.content = data.intro
        this.formItem.order = data.order
        this.updateModelState = true
        this.addModelState = true
      },
      // 查看简介
      show(index) {
        let data = this.$store.state.sectionManage.sectionList[index];
        this.$Modal.info({
          title: '简介',
          content: '<p>' + data.intro + '</p>'
        });
      },
      selectCourseHandler(value) {
        this.$store.dispatch("sectionManage/doQueryAll", value)
      }
    }
  }
</script>

<style scoped>

</style>
