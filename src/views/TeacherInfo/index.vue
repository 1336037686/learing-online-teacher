<template>
  <Row style="margin-top: 20px">
    <Col span="22" offset="1">
      <Tabs value="tab1">
        <TabPane label="个人资料" name="tab1">
          <Row>
            <Col span="10" offset="7">
              <div style="background:#eee;padding: 20px">
                <Card :bordered="false">
                  <p slot="title" style="height: 30px">
                    <span>个人资料</span>
                    <Button type="primary" size="small" shape="circle" style="float: right" @click="cancle" v-if="!isUpdate">
                      <span >取消</span>
                    </Button>
                    <Button :type="isUpdate ? 'error': 'primary'" size="small" shape="circle" style="float: right;margin-right: 10px" @click="update(isUpdate)">
                      <span v-if="isUpdate">修改个人资料</span>
                      <span v-if="!isUpdate">保存个人资料</span>
                    </Button>
                  </p>
                  <Form :label-width="80">
                    <FormItem label="教师 ID">
                      <Input v-model="$store.state.teacherInfo.teacherInfo.id" placeholder="输入教师 ID" disabled/>
                    </FormItem>
                    <FormItem label="教师账号">
                      <Input v-model="$store.state.teacherInfo.teacherInfo.userName" placeholder="输入教师账号" disabled/>
                    </FormItem>
                    <FormItem label="教师名称">
                      <Input v-model="$store.state.teacherInfo.teacherInfo.name" placeholder="输入教师名称" :disabled="isUpdate"/>
                    </FormItem>
                    <FormItem label="所属院系">
                      <Select v-model="$store.state.teacherInfo.teacherInfo.department" :disabled="isUpdate">
                        <Option value="beijing" v-for="item in $store.state.departmentManage.departmentSelectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="教师性别">
                      <RadioGroup v-model="$store.state.teacherInfo.teacherInfo.sex">
                        <Radio label="男" :disabled="isUpdate">男</Radio>
                        <Radio label="女" :disabled="isUpdate">女</Radio>
                      </RadioGroup>
                    </FormItem>
                    <FormItem label="教师电话" >
                      <Input v-model="$store.state.teacherInfo.teacherInfo.phone"
                             placeholder="输入教师电话" :disabled="isUpdate"/>
                    </FormItem>
                    <FormItem label="教师地址">
                      <Input v-model="$store.state.teacherInfo.teacherInfo.address"
                             placeholder="输入教师地址" :disabled="isUpdate"/>
                    </FormItem>
                    <FormItem label="教师邮箱">
                      <Input v-model="$store.state.teacherInfo.teacherInfo.email"
                             placeholder="输入教师邮箱" :disabled="isUpdate"/>
                    </FormItem>
                  </Form>
                </Card>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="密码修改" name="tab2">
          <Row>
            <Col span="10" offset="7">
              <div style="background:#eee;padding: 20px">
                <Card :bordered="false">
                  <p slot="title" style="height: 30px">
                    <span>修改密码</span>
                  </p>
                  <Form :label-width="150">
                    <FormItem label="输入新密码">
                      <Input v-model="formItem.password1" type="password" placeholder="输入密码" password/>
                    </FormItem>
                    <FormItem label="再次输入新密码">
                      <Input v-model="formItem.password2" type="password" placeholder="输入密码" password/>
                    </FormItem>
                    <FormItem>
                      <Button type="primary" @click="updatePassword">提交</Button>
                    </FormItem>
                  </Form>
                </Card>
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Col>
  </Row>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        isUpdate: true,
        formItem: {
          password1: '',
          password2: ''
        }
      }
    },
    mounted() {
      this.$store.dispatch("teacherInfo/doQueryTeacherInfoByTeacherId")
      this.$store.dispatch("departmentManage/doQueryDeparmentToSelectList")
    },
    methods: {
      // 更新基本信息
      update(isUpdate) {
        if(isUpdate) {
          this.isUpdate = !isUpdate;
          return;
        } else {
          this.$store.dispatch("teacherInfo/doUpdate", this.$store.state.teacherInfo.teacherInfo).then(() => {
            this.isUpdate = !isUpdate
          })
        }
      },
      // 取消更新
      cancle() {
        this.isUpdate = true
      },
      // 修改密码
      updatePassword() {
        if(this.formItem.password1 !== this.formItem.password2) {
          this.$Message.error("两次输入密码不同!")
          return;
        }
        this.$store.dispatch("teacherInfo/doUpdatePassword", {"password": this.formItem.password1, "id": this.$store.state.loginManage.id}).then(() => {
          this.formItem = {password1: '', password2: ''}
        })
      }
    }
  }
</script>

<style scoped>

</style>
