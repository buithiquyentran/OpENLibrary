<template>
  <div class="d-flex flex-column vh-100 bg-dark text-white p-3">
    <!-- Logo -->
    <h4 class="text-center mb-4">📖 My Account</h4>

    <!-- Menu -->
    <ul class="nav flex-column">
      <li class="nav-item">
        <router-link class="nav-link text-white" to="/profile">
          <i class="bi bi-book me-2"></i> Tài Khoản
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link text-white" to="/history">
          <i class="bi bi-buildings me-2"></i> Lịch Sử Mượn Sách
        </router-link>
      </li>
      <!-- Logout -->
      <li class="nav-item nav-link text-white">
        <button @click="logout" class="btn btn-danger mt-auto">
          Đăng Xuất
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {
  methods: {
    async logout() {
      try {
        const isConfirmed = confirm("Bạn có muốn đăng xuất không?");
        if (!isConfirmed) {
          return;
        }
        const response = await AuthService.Logout();
        this.$router.push("/login");
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
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
