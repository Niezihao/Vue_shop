<template>
  <div>
    <el-container class="home_container">
      <el-header
        ><div>
          <span>电商后台管理系统</span>
        </div>
        <el-button type="primary" @click="back">返回</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="zhedie" @click="toggle">|||</div>
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="getPath"
          >
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in menuList"
              :key="item.id"
            >
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="saveNavState('/' + subItem.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </template></el-menu-item
              >
            </el-submenu>
          </el-menu></el-aside
        >
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        125: 'el-icon-s-data',
        103: 'el-icon-s-opportunity',
        101: 'el-icon-s-shop',
        102: 'el-icon-s-claim',
        145: 'el-icon-s-marketing',
      },
      isCollapse: false,
      getPath: '',
    }
  },
  created() {
    this.getMenuList()
    this.getPath = window.sessionStorage.getItem('path')
  },
  methods: {
    back() {
      window.sessionStorage.clear()
      this.$router.replace('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggle() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(itemPath) {
      window.sessionStorage.setItem('path', itemPath)
      this.getPath = itemPath
    },
  },
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100vh;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 15px;
  span {
    font-size: 25px;
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
// .el-submenu {
//   margin: 10px;
// }
.el-menu {
  border-right: 0;
}
.zhedie {
  width: 100%;
  background-color: #4a5064;
  line-height: 24px;
  text-align: center;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
