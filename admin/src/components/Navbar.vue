<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container">
      <router-link class="navbar-brand" to="/"> 📖 Open Library</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link
              class="nav-link"
              :class="{ active: isActive('home') }"
              @click.prevent="navigate('home')"
              to="/"
              >Trang chủ</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :class="{ active: isActive('books') }"
              @click.prevent="navigate('books')"
              to="/books"
              >Danh mục sách</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :class="{ active: isActive('about') }"
              href="#"
              @click.prevent="navigate('about')"
              to="/about"
              >Về chúng tôi</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :class="{ active: isActive('contact') }"
              @click.prevent="navigate('contact')"
              to="/contact"
              >Liên hệ</router-link
            >
          </li>
        </ul>
      </div> -->
      <div class="text-light">
        Xin chào {{ user.HOTEN_NV }}, bạn đang đăng nhập với vai trò admin
      </div>
      <!-- Search -->
      <!-- <form
        class="d-flex"
        @keyup.enter="searchBooks"
        @submit.prevent="searchBooks"
      >
        <input
          class="form-control me-2"
          type="search"
          placeholder="Bạn muốn tìm sách gì?"
          aria-label="Search"
          v-model="searchQuery"
        />
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form> -->
      <div>
        <router-link
          v-if="!isLoggedIn"
          class="nav-link login-btn"
          :class="{ active: isActive('login') }"
          @click.prevent="navigate('login')"
          to="/login"
          >Login</router-link
        >
        <i
          v-else
          class="fa fa-user-circle nav-link my-icon"
          @click="toggleTooltip"
        ></i>
      </div>
      <!-- Tooltip -->
      <div
        v-if="showTooltip"
        class="position-absolute mt-2 bg-white border rounded shadow-lg p-2 my-account"
        style="width: 200px; z-index: 1000"
      >
        <p v-if="user" class="fw-bold text-dark mb-2">
          Xin chào, {{ user.HOTEN_NV }}
        </p>
        <hr />

        <ul class="list-unstyled">
          <li
            class="py-1 px-2 cursor-pointer text-dark"
            @click="goToProfile"
            style="cursor: pointer !important"
          >
            <i class="fa fa-user"></i> Tài khoản
          </li>
          <li
            class="py-1 px-2 cursor-pointer text-dark"
            @click="goToPersonalInfo"
            style="cursor: pointer !important"
          >
            <i class="fa fa-id-card"></i> Thông tin cá nhân
          </li>
          <li
            class="py-1 px-2 cursor-pointer text-dark"
            style="cursor: pointer !important"
            @click="goToChangAccount"
          >
            <i class="fa fa-book"></i> Chuyển đổi tài khoản
          </li>
          <li
            class="py-1 px-2 cursor-pointer text-danger"
            style="cursor: pointer !important"
            @click="logout"
          >
            <i class="fa fa-sign-out-alt"></i> Đăng xuất
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {
  name: "Navbar",
  data() {
    return {
      currentRoute: "home",
      isLoggedIn: false,
      showTooltip: false,
      user: {},
      searchQuery: "", // Biến lưu từ khóa nhập vào
    };
  },
  methods: {
    navigate(route) {
      this.currentRoute = route;
      this.$emit("route-change", route);
    },
    isActive(route) {
      return this.currentRoute === route;
    },
    async checkLoginStatus() {
      try {
        const response = await AuthService.getUserInfo();
        // console.log(response);
        if (response) {
          this.isLoggedIn = true;
          this.user = response;
        }
      } catch (error) {
        this.isLoggedIn = false;
      }
    },
    toggleTooltip() {
      this.showTooltip = !this.showTooltip;
    },

    goToProfile() {
      this.$router.push("/profile");
      this.showTooltip = false;
    },
    goToPersonalInfo() {
      this.$router.push("/personal-info");
      this.showTooltip = false;
    },
    goToChangAccount() {
      this.$router.push("/login");
      this.showTooltip = false;
    },
    async logout() {
      try {
        const response = await AuthService.Logout();
        this.$router.push("/login");
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    },
    async searchBooks() {
      // Chuyển hướng đến trang Books.vue kèm từ khóa tìm kiếm
      this.$router.push({ name: "books", query: { q: this.searchQuery } });
    },
  },
  created() {
    this.checkLoginStatus();
  },
};
</script>

<style scoped>
.navbar {
  background-color: #16a34a;
}
.container {
  max-width: 1280px;
}
.navbar-brand {
  font-weight: bold;
  margin-right: 3rem;
  font-size: 26px;
  color: #fff;
}
.nav-link.active {
  color: #d0f90be6;
  /* font-weight: 700; */
}
.nav-link {
  font-size: 22px;
  color: #fff;
  padding: 12px;
  font-weight: 700;
}
.login-btn {
  color: #fff;
  text-decoration: underline;
  font-size: 18px;
  margin-left: 40px;
  font-weight: 700;
}
.btn,
.form-control {
  font-size: 18px;
}

.btn-success {
  background-color: #16a34a;
  border-color: #16a34a;
}
.btn-outline-success {
  color: #fff;
  border-color: #c4bfbf;
}
.btn-outline-success:hover {
  color: white;
  border-color: #fff;
}
.my-icon {
  margin-left: 12px;
  cursor: pointer;
}
.my-account {
  right: 100px;
  top: 32px;
  width: unset !important;
  max-width: 400px;
}
</style>
