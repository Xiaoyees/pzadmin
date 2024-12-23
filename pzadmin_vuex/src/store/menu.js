// 从本地存储中获取数据
const localData = localStorage.getItem('pz_v3pz');

// 初始化状态，如果本地存储中有数据则使用，否则使用默认值
const state = localData ? JSON.parse(localData).menu : {
  isCollapse: false, // 是否折叠菜单
  selectMenu: [],   // 当前选中的菜单项
  routerList: [],   // 路由列表
  menuActive: '1-1' // 当前激活的菜单项
};

const mutations = {
  // 切换菜单的折叠状态
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse;
  },

  // 添加菜单项，避免重复添加
  addMenu(state, payload) {
    if (state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
      state.selectMenu.push(payload);
    }
  },

  // 关闭指定名称的菜单项
  closeMenu(state, payload) {
    const index = state.selectMenu.findIndex(val => val.name === payload.name);
    if (index !== -1) {
      state.selectMenu.splice(index, 1);
    }
  },

  // 动态设置菜单路由
  dynamicMenu(state, payload) {
    // 使用 glob 导入所有匹配的 Vue 组件文件
    const modules = import.meta.glob('../views/**/**/*.vue');

    // 递归函数，设置路由组件
    function routerSet(router) {
      router.forEach(route => {
        if (!route.children) {
          const url = `../views${route.meta.path}/index.vue`;
          route.component = modules[url];
        } else {
          routerSet(route.children);
        }
      });
    }

    // 设置路由组件
    routerSet(payload);

    // 更新路由列表
    state.routerList = payload;
  },

  // 更新当前激活的菜单项（选中的高亮效果）
  updateMenuActive(state, payload) {
    state.menuActive = payload;
  }
};

export default {
  state,
  mutations
};