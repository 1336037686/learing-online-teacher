<template>
    <Row style="margin: 20px">
      <!--面包屑-->
      <Breadcrumb>
        <BreadcrumbItem>
          <Icon type="ios-home-outline"/> 主页
        </BreadcrumbItem>
        <BreadcrumbItem>账号管理</BreadcrumbItem>
        <BreadcrumbItem>教师账号管理</BreadcrumbItem>
      </Breadcrumb>
      <!--操作按钮-->
      <Row  style="margin: 20px">
        <Col span="2">
          <Button type="primary" icon="ios-cloud-done-outline" @click="cleanFormItem();addModelState = true">添加账号</Button>
        </Col>
        <Col span="4">
          <Input v-model="selectContent" placeholder="输入教师姓名"/>
        </Col>
        <Col span="2" style="margin-left: 10px">
          <Button type="primary" @click="search">查找</Button>
        </Col>
      </Row>
      <!--表格-->
      <Row style="margin: 20px">
        <Col span="24">
          <Table border ref="selection" :columns="teacherTable" :data="$store.state.teacherAccountManage.teacherData.pageInfo.list">
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">修改</Button>
              <Button type="error" size="small" @click="remove(index)">删除</Button>
            </template>
          </Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total="$store.state.teacherAccountManage.teacherData.pageInfo.total" :current="currentPage" :page-size="$store.state.teacherAccountManage.size" show-total @on-change="nextPage" />
            </div>
          </div>
        </Col>
      </Row>

      <!--新增弹框-->
      <Modal title="Title" v-model="addModelState" :mask-closable="false">
        <p slot="header" style="text-align:center">
          <span>添加学生账号</span>
        </p>
        <div style="text-align:center">
          <Form :model="formItem" :label-width="80">
            <FormItem label="工号">
              <Input v-model="formItem.userName" placeholder="输入工号..."/>
            </FormItem>
            <FormItem label="姓名">
              <Input v-model="formItem.name" placeholder="输入姓名..."/>
            </FormItem>
            <FormItem label="密码">
              <Input v-model="formItem.password" placeholder="输入密码..."/>
            </FormItem>
            <FormItem label="性别" style="text-align: left">
              <RadioGroup v-model="formItem.sex">
                <Radio label="男" border></Radio>
                <Radio label="女" border></Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="院系">
              <Select v-model="formItem.department" filterable>
                <Option v-for="item in $store.state.teacherAccountManage.departmentSelectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="电话">
              <Input v-model="formItem.phone" placeholder="输入电话..."/>
            </FormItem>
            <FormItem label="邮箱">
              <Input v-model="formItem.email" placeholder="输入邮箱..."/>
            </FormItem>
            <FormItem label="住址">
              <Input v-model="formItem.address" placeholder="输入住址..."/>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button type="primary" size="large" long :loading="this.$store.state.teacherAccountManage.saveLoding" @click="save">保存</Button>
        </div>
      </Modal>
      <!--修改弹框-->
      <Modal title="Title" v-model="updateModelState" :mask-closable="false">
        <p slot="header" style="text-align:center">
          <span>修改学生账号</span>
        </p>
        <div style="text-align:center">
          <Form :model="formItem" :label-width="80">
            <FormItem label="ID">
              <Input v-model="formItem.id" placeholder="输入ID..." disabled/>
            </FormItem>
            <FormItem label="工号">
              <Input v-model="formItem.userName" placeholder="输入工号..." disabled/>
            </FormItem>
            <FormItem label="姓名">
              <Input v-model="formItem.name" placeholder="输入姓名..."/>
            </FormItem>
            <FormItem label="密码">
              <Input v-model="formItem.password" placeholder="输入密码..."/>
            </FormItem>
            <FormItem label="性别" style="text-align: left">
              <RadioGroup v-model="formItem.sex">
                <Radio label="男" border></Radio>
                <Radio label="女" border></Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="院系">
              <Select v-model="formItem.department" filterable>
                <Option v-for="item in $store.state.teacherAccountManage.departmentSelectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="电话">
              <Input v-model="formItem.phone" placeholder="输入电话..."/>
            </FormItem>
            <FormItem label="邮箱">
              <Input v-model="formItem.email" placeholder="输入邮箱..."/>
            </FormItem>
            <FormItem label="住址">
              <Input v-model="formItem.address" placeholder="输入住址..."/>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button type="primary" size="large" long :loading="this.$store.state.teacherAccountManage.saveLoding" @click="update">保存</Button>
        </div>
      </Modal>
    </Row>
</template>

<script>
    export default {
        name: "index",
      data () {
        return {
          currentPage: 1,
          selectContent: '',
          formItem: {
            id: '',
            userName: '',
            name: '',
            sex: '',
            phone: '',
            password: '',
            department: '',
            address: '',
            email: '',
          },
          addModelState: false,
          updateModelState: false,
          teacherTable: [
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
              title: '院系',
              key: 'departmentName'
            },
            {
              title: '工号',
              key: 'userName'
            },
            {
              title: '姓名',
              key: 'name'
            },
            {
              title: '性别',
              key: 'sex'
            },
            {
              title: '操作',
              slot: 'action',
              width: 150,
              align: 'center'
            }
          ],
          cityList: [
            {
              value: 'New York',
              label: 'New York'
            },
          ],
          model11: '',
        }
      },
      mounted() {
        // 请求列表
        this.$store.dispatch("teacherAccountManage/doQueryAll", 1)
        this.$store.dispatch("teacherAccountManage/doQueryDeparmentToSelectList")
      },
      methods: {
        search() {
          if(this.selectContent.trim() == "") {
            this.$store.dispatch("teacherAccountManage/doQueryAll", 1)
          } else {
            this.$store.dispatch("teacherAccountManage/doQueryCondition", {"currentPage": 1, "name": this.selectContent.trim()})
          }
        },
        nextPage(index) {
          // 搜索条件为空，则查询所有
          if(this.selectContent.trim() == "") {
            this.$store.dispatch("teacherAccountManage/doQueryAll", index)
          } else {
            this.$store.dispatch("teacherAccountManage/doQueryCondition", {"currentPage": index, "name": this.selectContent.trim()})
          }
          this.currentPage = index
        },
        remove(index) {
          let data = this.$store.state.teacherAccountManage.teacherData.pageInfo.list[index]
          this.$Modal.confirm({
            title: '删除确认',
            content: '确认删除[<b style="color: red">' + data.userName + "</b>]?",
            onOk: () => {
              this.$store.dispatch("teacherAccountManage/doRemove", {"id": data.id, "currentPage": this.currentPage})
            }
          });
        },
        show(index) {
          let data = this.$store.state.teacherAccountManage.teacherData.pageInfo.list[index]
          this.formItem = data
          this.updateModelState = true;
        },
        update() {
          this.$store.dispatch("teacherAccountManage/doUpdate", {"data": this.formItem, "currentPage": this.currentPage})
        },
        save() {
          this.$store.dispatch("teacherAccountManage/doSave", this.formItem)
        },
        cleanFormItem() {
          this.formItem = {id: '', userName: '', name: '', sex: '', phone: '', password: '', department: '', address: '', email: ''}
        }
      }
    }
</script>

<style scoped>

</style>
