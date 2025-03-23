<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import Sidebar from "@/components/Sidebar.vue";
export default {
  components: {
    Navbar,
    Footer,
    Sidebar,
  },
};
</script>

<template>
  <div id="app">
    <Navbar />
    <body class="d-flex">
      <!-- Chỉ hiển thị Sidebar nếu không phải trang chủ -->
      <Sidebar v-if="$route.path !== '/'" />

      <div class="flex-grow-1">
        <router-view /> 
      </div>
    </body>
    <Footer />
  </div>
</template>

<style></style>
