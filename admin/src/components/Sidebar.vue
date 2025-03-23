<template>
  <div class="d-flex flex-column vh-100 bg-dark text-white p-3">
    <!-- Logo -->
    <h4 class="text-center mb-4">📖 Admin Panel</h4>

    <!-- Menu -->
    <ul class="nav flex-column">
      <li class="nav-item">
        <router-link class="nav-link text-white" to="/books">
          <i class="bi bi-book me-2"></i> QUẢN LÍ SÁCH
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link text-white" to="/publishers">
          <i class="bi bi-buildings me-2"></i> NHÀ XUẤT BẢN
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link text-white" to="/readers">
          <i class="bi bi-person me-2"></i> ĐỌC GIẢ
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link text-white" to="/staffs">
         <i class="bi bi-person-badge me-2"></i> NHÂN VIÊN
        </router-link>
      </li>
    </ul>

    <!-- Logout -->
    <button @click="logout" class="btn btn-danger mt-auto">Đăng Xuất</button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem("ROLE");
      localStorage.removeItem("TOKEN"); 
      this.$router.push("/login"); // Chuyển về trang đăng nhập
    },
  },
};
</script>

<style scoped>
.nav-link {
  padding: 10px;
  border-radius: 5px;
}
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
