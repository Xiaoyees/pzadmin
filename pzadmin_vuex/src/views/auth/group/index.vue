<template>
  <!-- 使用 kebab-case（短横线分隔）法引用组件 -->
  <panel-head :route="route" />
  <div class="btns">
    <el-button :icon="Plus" size="small" type="primary" @click="open(null)">新增</el-button>
  </div>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissionName" label="菜单权限" width="500px" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <div class="pagination-info">
    <el-pagination v-model:current-page="paginationData.pageNum" :page-size="paginationData.pageSize"
      :background="false" size="small" layout="total, prev, pager, next" :total="tableData.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>

  <!-- 编辑的弹窗 -->
  <el-dialog v-model="dialogFromVisible" :before-close="beforeClose" title='添加权限' width="500">
    <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写权限名称" />
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree ref="treeRef" style="max-width: 600px" :data="permissionData" node-key="id" show-checkbox
          :default-checked-keys="defaultKeys" :default-expanded-keys="[2]" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref,reactive,onMounted,nextTick} from 'vue'
import { userGetMenu,userSetmenu, menuList } from '../../../api';
import { Plus } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

const route = useRoute();
//打开编辑的弹窗
const open = (rowData={}) => {
  dialogFromVisible.value=true;
  //弹窗打开form生成是异步的
   nextTick(() => {
    if (rowData) {
      //浅拷贝，from是reactive所以用Object.assign去整体替换
      Object.assign(form, { id: rowData.id, name: rowData.name });
      treeRef.value.setCheckedKeys(rowData.permission);
    }
  });
};
//分页数据
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});

const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getListData();
};

// 点击页码
const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getListData();
};

//列表数据
const tableData = reactive({
  list: [],
  total: 0,
});
//请求列表数据 复用的逻辑
const getListData = () => {
  menuList(paginationData).then(({ data }) => {
    const { list, total } = data.data;
    tableData.list = list;
    tableData.total = total;
  });
};

const formRef = ref()
//form的数据
const form = reactive({
  name: '',
  permissions: '',
  id:''
})
//树形菜单权限数据
const permissionData = ref([])

onMounted(() => {
  // 在组件挂载时获取菜单数据
  userGetMenu().then(({ data }) => {
    // 打印从服务器获取的菜单数据
    console.log(data);
    // 将获取到的菜单数据赋值给 permissionData 响应式变量
    permissionData.value = data.data;
  })
  getListData()
});
//弹窗的显示状态，默认不显示
const dialogFromVisible = ref(false)
//关闭弹窗的回调
const beforeClose = () => {
  dialogFromVisible.value = false
  //重置表单
  formRef.value.resetFields();
  //tree选中重置
  treeRef.value.setCheckedKeys(defaultKeys);
}
//默认勾选权限管理的两个选项
const defaultKeys = [4,5]
const treeRef=ref()
const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入权限名称" }],
});
// 表单提交
const confirm = async (formEl) => {
  // 校验表单
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 获取到选择的 checkbox 的数据
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys());
      // 调用 API 提交表单数据
      userSetmenu({ name: form.name, permissions, id: form.id }).then(({ data }) => {
        // // 打印服务器返回的数据
        // console.log(data);
        // 关闭弹窗
        beforeClose();
        // 刷新列表数据
        getListData();
      });
    } else {
      // 表单校验失败时打印错误信息
      console.log("error submit!", fields);
    }
  });
};

</script>

<style lang="less" scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}

.el-header {
  height: 50px !important;
  padding: 0 !important;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid transparent;
}

.pagination-info {
  padding: 10px 0;
  background-color: #fff;

  .el-pagination {
    justify-content: end;
  }
}
</style>