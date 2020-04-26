<template>
  <div class="login">
    <Row style="margin-top: 10%">
      <Col span="5" offset="17">
        <Card>
          <p slot="title" style="text-align: center">
            管理员登录
          </p>
          <Form ref="formCustom" style="margin-left: 10px;margin-top: 15px">
            <FormItem prop="用户名" style="margin-top: 15px">
              <Input type="text" size="large" placeholder="用户名" v-model="form.name"></Input>
            </FormItem>
            <FormItem prop="密码" style="margin-top: 15px">
              <Input type="password" password  size="large" placeholder="密码" v-model="form.pwd"></Input>
            </FormItem>
            <FormItem>
              <drag-verify :width="width" :height="height" :text="text" :success-text="successText" :background="background" :progress-bar-bg="progressBarBg" :completed-bg="completedBg" :handler-bg="handlerBg" :handler-icon="handlerIcon" :text-size="textSize" :success-icon="successIcon" ref="Verify"/>
            </FormItem>
            <FormItem>
              <Button type="primary" long style="height: 40px" @click="submitForm">登陆</Button>
            </FormItem>
          </Form>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import 'font-awesome/css/font-awesome.min.css'
  import dragVerify from 'vue-drag-verify'
    export default {
        components: {
          dragVerify,
        },
        name: "index",
      data () {
        return {
          // 验证码
          handlerIcon: "fa fa-angle-double-right",
          successIcon: "fa fa-check",
          background: "#cccccc",
          progressBarBg: "#4b0",
          completedBg: "#66cc66",
          handlerBg: "#fff",
          text: "请将滑块拖动到右侧",
          successText: "验证成功",
          width: 350,
          height: 42,
          textSize: "18px",
          isCircle:'true',
          form: {
            name: "",
            pwd: ""
          }
        }
      },
      methods: {
        submitForm() {
          if(this.form.name.trim() == "" || this.form.pwd.trim() == "") {
            this.$Message.error("填写错误,不能为空")
            return
          }
          if(this.$refs.Verify.isPassing) {
              this.$store.dispatch("loginManage/doLogin", {"userName": this.form.name, "password": this.form.pwd}).then(()=>{
              this.$router.push("/admin/welcome")
            })
          } else {
            this.$Message.error("需要验证, 才能登陆")
          }
        }
      }
    }
</script>

<style scoped>
  .login {
    background:url('../../assets/login-bg.jpg')no-repeat;
    width:100%;
    height:100%;
    background-size:100% 100%;
    position:absolute;
  }

</style>
