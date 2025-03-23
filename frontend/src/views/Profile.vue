<template>
  <!-- Edit -->
  <div class="container">
    <div class="">
      <h2 class="p-2">Thông tin cá nhân</h2>
      <h5>Họ Lót:</h5>
      <input type="text" v-model="user.HO_LOT" class="form-control" />

      <h5>Tên:</h5>
      <input type="text" v-model="user.TEN" class="form-control" />

      <div class="form-group">
        <h5 for="ngaySinh">Ngày sinh:</h5>
        <input
          type="date"
          id="ngaySinh"
          v-model="user.NGAY_SINH"
          class="form-control"
        />
      </div>

      <div class="form-group">
        <h5>Giới tính:</h5>
        <select v-model="user.PHAI" class="form-control">
          <option>Nam</option>
          <option>Nữ</option>
          <option>Khác</option>
        </select>
      </div>
      <h5>Địa Chỉ:</h5>
      <input type="text" v-model="user.DIA_CHI" class="form-control" />
      <h5>Số Điện Thoại:</h5>
      <input type="text" v-model="user.SDTDG" class="form-control" />
      <!-- username -->
      <h5>Username:</h5>
      <input
        disabled
        type="text"
        v-model="user.USERNAME"
        class="form-control"
      />

      <button class="btn btn-success w-100 mt-3" @click="saveChanges()">
        Lưu
      </button>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import ReaderService from "@/services/reader.service";

export default {
  data() {
    return {
      user: {},
    };
  },
  methods: {
    async getUser() {
      try {
        const response = await AuthService.getUserInfo();
        if (response) {
          this.user = response;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async saveChanges() {
      try {
        const response = await ReaderService.update(this.user._id, this.user);
      } catch (error) {
        console.log(error);
      }
      alert("Lưu thông tin thành công");
    },
  },
  created() {
    this.getUser();
  },
};
</script>

<style scoped></style>
