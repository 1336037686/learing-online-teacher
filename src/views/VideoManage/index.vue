<template>
  <Row style="margin: 20px">
    <!--面包屑-->
    <Breadcrumb>
      <BreadcrumbItem><Icon type="ios-home-outline"/> 主页</BreadcrumbItem>
      <BreadcrumbItem>课程管理</BreadcrumbItem>
      <BreadcrumbItem>课时管理</BreadcrumbItem>
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
          <Button type="primary" icon="ios-cloud-done-outline" @click="beforeAdd">添加课时</Button>
        </Col>
      </Row>
      <Row style="margin-top: 10px">
        <Col span="24">
          <Table border :columns="videoTable" :data="$store.state.videoManage.videoList">
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="success" size="small" style="margin-right: 5px" @click="show(index)">查看视频</Button>
              <Button type="info" size="small" style="margin-right: 5px" @click="beforeUpdate(index)">修改</Button>
              <Button type="error" size="small" @click="remove(index)">删除</Button>
            </template>
          </Table>
        </Col>
      </Row>
    </Row>
    <!--新增弹框-->
    <Modal title="章节" v-model="addModelState" @on-visible-change="addModelWatchHandler(addModelState)" :mask-closable="false">
      <p slot="header" style="text-align:center">
        <span>章节操作</span>
      </p>
      <div style="text-align:center">
        <Form :model="formItem" :label-width="80">
          <FormItem label="课时ID" v-if="updateModelState">
            <Input v-model="formItem.id" placeholder="输入章节ID..." disabled/>
          </FormItem>
          <FormItem label="课时名称">
            <Input v-model="formItem.name" placeholder="输入课时名称..."/>
          </FormItem>
          <FormItem label="课时排序">
            <InputNumber :max="10000" :min="1" v-model="formItem.order" style="width: 100%"/>
          </FormItem>
          <FormItem label="课时视频">
            <Upload
              ref="upload"
              :show-upload-list="true"
              :on-success="handleSuccess"
              type="drag"
              action="/api/v1/upload/video">
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"/>
                <p>点击上传或者托住图片到此处</p>
              </div>
            </Upload>
          </FormItem>
          <FormItem label="上传地址" v-if="formItem.content !== ''">
            <Input v-model="formItem.content" disabled/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="this.$store.state.videoManage.saveLoding" @click="save(updateModelState ? 'update' : 'save')">保存</Button>
      </div>
    </Modal>
    <!--视频模态框-->
    <Modal title="视频查看" v-model="videoModelState" :mask-closable="false" @on-visible-change="videoModelWatchHandler(videoModelState)">
      <p slot="header" style="text-align:center">
        <span>章节视频查看</span>
      </p>
      <div style="text-align:center">
        <video-player class="video-player vjs-custom-skin"
                      ref="videoPlayer"
                      :playsinline="true"
                      :options="playerOptions"
                      style="margin-top: 5px"/>
      </div>
      <div slot="footer"></div>
    </Modal>
  </Row>
</template>

<script>
  import { videoPlayer } from 'vue-video-player'
  import 'video.js/dist/video-js.css'

  export default {
    name: "index",
    components: {
      videoPlayer
    },
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
        videoModelState: false,
        videoTable: [
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
            title: '视频名称',
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
        selectCourse: '',
        selectSection: '',
        // 视频参数
        playerOptions: {
          playbackRates: [0.5, 1.0, 1.5, 2.0],            // 可选的播放速度
          autoplay: false,                                // 如果为true,浏览器准备好时开始回放。
          muted: false,                                   // 默认情况下将会消除任何音频。
          loop: false,                                    // 是否视频一结束就重新开始。
          preload: 'auto',                                // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9',                            // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true,                                    // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "video/mp4",                            // 类型
            src: ''                                       // url地址
          }],
          poster: '',                                     // 封面地址
          notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,                            // 当前时间和持续时间的分隔符
            durationDisplay: true,                        // 显示持续时间
            remainingTimeDisplay: false,                  // 是否显示剩余时间功能
            fullscreenToggle: true                        // 是否显示全屏按钮
          }
        }
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
      addModelWatchHandler(value) {
        if(!value) {
          this.updateModelState = false;
        }
      },
      videoModelWatchHandler(value) {
        if(!value) {
          this.$refs.videoPlayer.player.pause()
        }
      },
      // 保存
      save(value) {
        if(this.formItem.name.trim() === "") {
          this.$Message.error("课时名称输入不能为空");
          return;
        }
        if(this.formItem.content.trim() === "") {
          this.$Message.error("视频不能为空");
          return;
        }
        if(value === 'save') {
          this.$store.dispatch("videoManage/doSave", {"course": this.selectCourse, "section": this.selectSection, "name": this.formItem.name, "addr": this.formItem.content, "order": this.formItem.order})
        }
        if(value === 'update') {
          this.$store.dispatch("videoManage/doUpdate", {"id": this.formItem.id, "course": this.selectCourse, "section": this.selectSection, "name": this.formItem.name, "addr": this.formItem.content, "order": this.formItem.order})
        }
      },
      // 删除
      remove(index) {
        let data = this.$store.state.videoManage.videoList[index];
        this.$Modal.confirm({
          title: '删除确认',
          content: '确认删除[' + data.name + "]?",
          onOk: () => {
            this.$store.dispatch("videoManage/doRemove", data)
          }
        })
      },
      // 修改
      beforeUpdate(index) {
        let data = this.$store.state.videoManage.videoList[index];
        this.formItem.id = data.id
        this.formItem.name = data.name
        this.formItem.content = data.addr
        this.formItem.order = data.order
        this.updateModelState = true
        this.addModelState = true
      },
      // 查看视频
      show(index) {
        let data = this.$store.state.videoManage.videoList[index];
        // this.$refs.videoPlayer.player.src(data.addr)
        this.playerOptions.sources[0].src = data.addr
        this.videoModelState = true
      },
      // 选择课程
      selectCourseHandler(value) {
        this.$store.dispatch("sectionManage/doQueryAll", value)
        this.selectSection = ''
      },
      // 选择章节
      selectSectionHandler(value) {
        if(value !== '' && this.selectSection !== '') {
          this.$store.dispatch("videoManage/doQueryAll", {"course": this.selectCourse, "section": value})
        }
      },
      // 视频上传成功
      handleSuccess (res, file) {
        this.$Notice.info({title: res.head.message , desc: ''});
        file.name = '视频'
        file.url = res.body.data.url
        this.formItem.content = res.body.data.url
      },
    }
  }
</script>

<style scoped>

</style>
