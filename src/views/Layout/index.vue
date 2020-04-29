<template>
  <div class="layout">
    <Layout>
      <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
        <Menu active-name="1-1" theme="dark" width="auto" :class="menuitemClasses">
          <Submenu name="1">
            <template slot="title">
              <Icon type="ios-people" />
              <span>课程管理</span>
            </template>
            <router-link to="/admin/course"><MenuItem name="1-1">课程管理</MenuItem></router-link>
            <router-link to="/admin/section"><MenuItem name="1-2">章节管理</MenuItem></router-link>
            <router-link to="/admin/video"><MenuItem name="1-3">课时管理</MenuItem></router-link>
            <router-link to="/admin/resource"><MenuItem name="1-4">资源管理</MenuItem></router-link>
          </Submenu>
          <Submenu name="2">
            <template slot="title">
              <Icon type="ios-people" />
              <span>学生管理</span>
            </template>
            <router-link to="/admin/studentCheck"><MenuItem name="2-1">审核申请</MenuItem></router-link>
            <router-link to="/admin/studentManage"><MenuItem name="2-2">选课学生管理</MenuItem></router-link>
          </Submenu>
          <Submenu name="3">
            <template slot="title">
              <Icon type="ios-people" />
              <span>考试管理</span>
            </template>
            <MenuItem name="3-1">试卷管理</MenuItem>
            <MenuItem name="3-2">考试管理</MenuItem>
          </Submenu>
          <Submenu name="4">
            <template slot="title">
              <Icon type="ios-people" />
              <span>作业管理</span>
            </template>
            <MenuItem name="4-1">作业发布</MenuItem>
            <MenuItem name="4-2">作业审查</MenuItem>
          </Submenu>
          <Submenu name="5">
            <template slot="title">
              <Icon type="ios-people" />
              <span>签到管理</span>
            </template>
            <router-link to="/admin/attendance"><MenuItem name="5-1">签到操作</MenuItem></router-link>
          </Submenu>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{padding: 0}" class="layout-header-bar">
          <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"/>
          教师管理后台
          <Dropdown style="float: right;margin-right: 40px">
            <a href="javascript:void(0)">
              <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
              <span>{{$store.state.loginManage.userName}}</span>
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <router-link to="/admin/info"><DropdownItem>个人中心</DropdownItem></router-link>
              <DropdownItem><span @click="logout">退出</span></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Header>
        <Content :style="{margin: '20px', background: '#fff', minHeight: '830px'}">
          <router-view />
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
    export default {
        name: "index",
      data () {
        return {
          isCollapsed: false
        }
      },
      computed: {
        rotateIcon () {
          return [
            'menu-icon',
            this.isCollapsed ? 'rotate-icon' : ''
          ];
        },
        menuitemClasses () {
          return [
            'menu-item',
            this.isCollapsed ? 'collapsed-menu' : ''
          ]
        }
      },
      methods: {
        collapsedSider () {
          this.$refs.side1.toggleCollapse();
        },
        logout() {
          this.$store.dispatch("loginManage/doLogout").then(() => {
            this.$Notice.info({title:"退出成功", desc: ''})
            this.$router.push("/")
          })
        }
      }
    }
</script>

<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .layout-header-bar{
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
  }
  .layout-logo-left{
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }
  .menu-icon{
    transition: all .3s;
  }
  .rotate-icon{
    transform: rotate(-90deg);
  }
  .menu-item span{
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }
  .menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }
  .collapsed-menu span{
    width: 0px;
    transition: width .2s ease;
  }
  .collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }
</style>
