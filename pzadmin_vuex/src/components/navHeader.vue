<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <el-icon class="icon" size="20" @click="store.commit('collapseMenu')">
        <Fold />
      </el-icon>
      <ul class="flex-box">
        <li v-for="(item, index) in selectMenu" :key="item.path" :class="{ selected: route.path === item.path }"
          class="tab flex-box">
          <el-icon size="12">
            <component :is="item.icon"></component>
          </el-icon>
          <!-- 用路由的功能实现点击跳转 -->
          <router-link class="text flex-box" :to="{ path: item.path }">
            {{ item.name }}
          </router-link>
          <!-- 关闭按钮x -->
          <el-icon class="close" size="12" @click="closeTab(item, index)">
            <Close />
          </el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleClick">
        <div class="el-dropdown-link flex-box">
          <el-avatar :src="userInfo.avatar" />
          <p class="user-name">{{ userInfo.name }}</p>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cancel">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
//拿到store的实例
const store = useStore();
//当前的路由对象
const route = useRoute();
const router = useRouter();
const selectMenu = computed(() => store.state.menu.selectMenu);

const userInfo = JSON.parse(localStorage.getItem("pz_userInfo"));

//点击关闭tag
const closeTab = (item, index) => {
  store.commit("closeMenu", item);
  //删除的是非当前页tag
  if (route.path !== item.path) {
    return;
  }
  // 获取当前所有打开的菜单项数据
  const selectMenuData = selectMenu.value;
  // 如果关闭后没有其他打开的标签页，则跳转到首页
  if (index === selectMenuData.length) {
    //如果只有一个tag
    if (!selectMenuData.length) {
      router.push("/");
    } else {
      // 如果关闭的是最后一个标签页，跳转到前一个标签页
      router.push({
        path: selectMenuData[index - 1].path,
      });
    }
    // 如果关闭的是中间的标签页
    // 跳转到关闭标签页后面的下一个标签页
  } else {
    //如果删除的是中间的tag
    router.push({
      path: selectMenuData[index].path,
    });
  }
};
const handleClick = (command) => {
  // 如果点击的按钮是 "cancel"，则执行以下操作
  if (command === "cancel") {
    // 移除本地存储中的 pz_token
    localStorage.removeItem("pz_token");
    // 移除本地存储中的 pz_userInfo
    localStorage.removeItem("pz_userInfo");
    // 移除本地存储中的 pz_v3pz
    localStorage.removeItem("pz_v3pz");
    // 重定向页面到当前域名的根路径（登录页面）
    window.location.ref = window.location.origin;
  }
};
</script>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
  height: 100%;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background-color: #fff;
  padding-right: 25px;
  .header-left {
    height: 100%;
    .icon {
      width: 45px;
      height: 100%;
    }
    .icon:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }
    .tab {
      padding: 0 10px;
      height: 100%;
      .text {
        margin: 0 5px;
      }
      .close {
        visibility: hidden;
      }
      &.selected {
        a {
          color: #409eff;
        }
        i {
          color: #409eff;
        }
        background-color: #f5f5f5;
      }
    }
    .tab:hover {
      background-color: #f5f5f5;
      .close {
        visibility: inherit;
        cursor: pointer;
        color: #000;
      }
    }
  }
  .header-right {
    .user-name {
      margin-left: 10px;
    }
  }
  a {
    height: 100%;
    color: #333;
    font-size: 15px;
  }
}
</style>

