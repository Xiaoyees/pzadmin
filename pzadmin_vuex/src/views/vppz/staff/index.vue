<template>
  <panel-head :route="route" />
  <div class="btns">
    <el-button :icon="Plus" size="small" type="primary" @click="open(null)">新增</el-button>
    <!-- 点击删除后的气泡弹窗 -->
    <el-popconfirm
      confirm-button-text="是"
      cancel-button-text="否"
      :icon="InfoFilled"
      title="是否确认删除?"
      @confirm="confirmEvent"
      @cancel="cancelEvent"
    >
      <template #reference>
        <el-button :icon="Delete" type="danger" size="small">删除</el-button>
      </template>
    </el-popconfirm>
  </div>
  <!-- 展示页面表格 -->
  <el-table :data="tableData.list" style="width: 100%" @selection-change="handleSelectionChange">
    <!-- 多选框 -->
    <el-table-column type="selection" width="55" />
    <el-table-column label="id" prop="id" />
    <el-table-column label="昵称" prop="name" />
    <el-table-column label="头像">
      <template #default="scope">
        <el-image style="width: 50px; height: 50px" :src="scope.row.avatar" />
      </template>
    </el-table-column>
    <el-table-column label="性别" prop="sex">
      <template #default="scope">
        {{ scope.row.sex === "1" ? "男" : "女" }}
      </template>
    </el-table-column>
    <el-table-column label="手机号" prop="mobile" />
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'">{{
          scope.row.active ? "正常" : "失效"
          }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间">
      <template #default="scope">
        <div class="flex-box">
          <el-icon>
            <Clock />
          </el-icon>
          <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 页码显示 -->
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      :background="false"
      size="small"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <el-dialog v-model="dialogFormVisible" :before-close="beforeClose" title="陪护师添加" width="500">
    <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id" />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-button v-if="!form.avatar" type="primary" @click="dialogImgVisible = true">点击上传</el-button>
        <el-image v-else :src="form.avatar" style="width: 100px; height: 100px" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="女" value="2"></el-option>
          <el-option label="男" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="18" :max="50" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="是否生效" prop="active">
        <el-radio-group v-model="form.active">
          <el-radio :value="0">失效</el-radio>
          <el-radio :value="1">生效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 选头像的弹窗 -->
  <el-dialog v-model="dialogImgVisible" :before-close="photoClose" title="选择图片" width="680">
    <div class="image-list">
      <div v-for="(item, index) in fileList" :key="item.name" class="img-box" @click="selectIndex = index">
        <div v-if="selectIndex === index" class="select">
          <el-icon color="#FFF">
            <Check />
          </el-icon>
        </div>

        <el-image style="width: 148px; height: 148px" :src="item.url" />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogImgVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmImage">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { Plus, Check, InfoFilled, Delete } from "@element-plus/icons-vue";
import {
  photoList,
  companion,
  companionList,
  deleteCompanion,
} from "../../../api/index.js";
import dayjs from "dayjs";
import { useRoute } from "vue-router";

const route = useRoute();

onMounted(() => {
  photoList().then(({ data }) => {
    fileList.value = data.data;
  });

  getListData();
});
//分页数据
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});

//列表数据
const tableData = reactive({
  list: [],
  total: 0,
});
// 定义获取列表数据的函数
const getListData = () => {
  // 调用 companionList 函数并传入分页数据，获取响应数据
  companionList(paginationData).then(({ data }) => {
    // 从响应数据中解构出列表数据和总条数
    const { list, total } = data.data;
    // 遍历列表数据，格式化创建时间
    list.forEach((item) => {
      item.create_time = dayjs(item.create_time).format("YYYY-MM-DD");
    });
    // 将格式化后的列表数据和总条数赋值给 tableData 对象
    tableData.list = list;
    tableData.total = total;
  });
};

// 信息填写弹窗
const dialogFormVisible = ref(false);
// 关闭弹窗
const beforeClose = () => {
  dialogFormVisible.value = false;
  // 重置数据
  formRef.value.resetFields();
};

const formRef = ref();
const form = reactive({
  id: "",
  mobile: "",
  active: 1,
  age: 28,
  avatar: "",
  name: "",
  sex: "",
});
const rules = reactive({
  name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  avatar: [{ required: true, message: "请选择头像" }],
  sex: [{ required: true, message: "请选择性别", trigger: "change" }],
  age: [{ required: true, message: "请选择年龄", trigger: "blur" }],
  mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
});
//表单提交
const confirm = async (formEl) => {
  //校验表单
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      //获取到选择的checkbox的数据
      companion(form).then(({ data }) => {
        if (data.code === 10000) {
          ElMessage.success("成功");
          beforeClose();
          getListData();
        } else {
          ElMessage.error(data.message);
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};
const open = (rowData = {}) => {
  dialogFormVisible.value = true;
  nextTick(() => {
    //如果是编辑
    if (rowData) {
      Object.assign(form, rowData);
    }
  });
};
//选择头像弹窗
const dialogImgVisible = ref(false);
const fileList = ref([]);
const selectIndex = ref(0);
// 图片确认按钮事件
const confirmImage = () => {
  form.avatar = fileList.value[selectIndex.value].url;
  dialogImgVisible.value = false;
};

//分页
const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getListData();
};
const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getListData();
};

//选择checkbox
const selectTableData = ref([]);

const handleSelectionChange = (val) => {
  selectTableData.value = val.map((item) => {
    id: item.id;
  });
};
//左上角删除按钮的删除事件
const confirmEvent = () => {
  //没有选择数据的情况下
  if (!selectTableData.value.length) {
    return ElMessage.error("请选择至少一项删除的数据");
  }
  deleteCompanion({ id: selectTableData.value }).then(({ data }) => {
    if (data.code === 10000) {
      getListData();
    }
  });
};

</script>

<style lang="less" scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}

.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .img-box {
    position: relative;

    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

.pagination-info {
  padding: 10px 0;
  background-color: #fff;

  .el-pagination {
    justify-content: end;
  }
}
</style>