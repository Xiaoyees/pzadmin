<!-- 底部导航标签栏 -->
<template>
  <RouterView />
  <van-tabbar v-model="active">
    <van-tabbar-item
      v-for="item in router.options.routes[0].children"
      :key="item.path"
      :url="`#/${item.path}`"
      :icon="item.meta.icon"
      >{{ item.meta.name }}
    </van-tabbar-item>
  </van-tabbar>

</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const active = ref(0);
const router = useRouter();
const route = useRoute();

 onMounted(() => {
   console.log(router,'router')
   const data = router.options.routes[0]
   active.value = data.children.findIndex((item) => {
     //  "/" + item.path === route.path
     const pathWithSlashes = `/${item.path}/`;
     const routePathWithSlashes = `/${route.path}/`;
     return pathWithSlashes === routePathWithSlashes;
   });
});
</script>
