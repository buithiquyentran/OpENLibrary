<template>
  <div class="auth-container">
    <!-- Tabs -->
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: isLogin }"
          @click="isLogin = true"
        >
          Đăng Nhập
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: !isLogin }"
          @click="isLogin = false"
        >
          Đăng Ký
        </button>
      </li>
    </ul>

    <div class="tab-content">
      <!-- Form Đăng Nhập -->
      <div v-if="isLogin" class="tab-pane fade show active">
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label">Số điện thoại</label>
            <input
              v-model="loginData.USERNAME"
              type="text"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Mật khẩu</label>
            <input
              v-model="loginData.PASSWORD"
              type="password"
              class="form-control"
              required
            />
          </div>
          <button type="submit" class="btn btn-success w-100">Đăng Nhập</button>
        </form>
      </div>

      <!-- Form Đăng Ký -->
      <div v-else class="tab-pane fade show active">
        <form @submit.prevent="handleRegister">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Họ</label>
              <input
                v-model="registerData.HO_LOT"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Tên</label>
              <input
                v-model="registerData.TEN"
                type="text"
                class="form-control"
                required
              />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Số điện thoại</label>
            <input
              v-model="registerData.SDTDG"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Mật khẩu</label>
            <input
              v-model="registerData.PASSWORD"
              type="password"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Địa chỉ</label>
            <input
              v-model="registerData.DIA_CHI"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Ngày sinh</label>
              <input
                v-model="registerData.NGAY_SINH"
                type="date"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Giới tính</label>
              <select v-model="registerData.PHAI" class="form-control">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <button type="submit" class="btn btn-success w-100">Đăng Ký</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";
export default {
  data() {
    return {
      isLogin: true,
      loginData: {
        USERNAME: "",
        PASSWORD: "",
      },
      registerData: {
        HO_LOT: "",
        TEN: "",
        SDTDG: "",
        DIA_CHI: "",
        NGAY_SINH: "",
        PHAI: "",
        PASSWORD: "",
      },
    };
  },
  methods: {
    async handleLogin() {
      try {
        const res = await AuthService.Login(this.loginData);
        const ROLE = res.user.ROLE;
        console.log(ROLE);
        localStorage.setItem("ROLE", ROLE);
        if (ROLE === 0 || ROLE === 1) {
          window.location.href = "http://localhost:5174"; // admin
        } else {
          window.location.href = "http://localhost:5173"; // user
        }
      } catch (error) {
        alert("Tài khoản hoặc mật khẩu chưa đúng!");
        console.error(error);
      }
    },

    async handleRegister() {
      try {
        const response = await AuthService.Register(this.registerData);
        console.log(response);
        if (response) {
          alert("Đăng ký thành công!");
        }
      } catch (error) {
        alert("Đăng ký thất bại!");
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 50px;
}

.nav-tabs {
  display: flex;
  justify-content: center;
}

.nav-tabs .nav-item {
  width: 50%;
}

.nav-tabs .nav-link {
  width: 100%;
  text-align: center;
  font-weight: bold;
  color: #333;
}

.nav-tabs .nav-link.active {
  background-color: #16a34a;
  color: white;
}

button {
  margin-top: 10px;
}
</style>
