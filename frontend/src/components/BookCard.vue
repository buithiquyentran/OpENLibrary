<template>
  <div class="d-flex card">
    <img :src="book.IMG" class="card-img-top img-book" alt="Book Image" />
    <div class="card-body">
      <h5 class="card-title">{{ book.TEN_SACH }}</h5>
      <p>Tác giả: {{ book.TAC_GIA }}</p>
      <p>Giá: {{ book.DON_GIA }} VNĐ</p>
      <p>Nhà xuất bản: {{ book.NXB.TEN_NXB }}</p>
      <p>Số lượng có sẵn: {{ book.SO_QUYEN }} quyển</p>
      <button
        :disabled="book.SO_QUYEN < 1"
        class="btn btn-success btn-borrow"
        @click="borrowBook"
        :title="book.SO_QUYEN < 1 ? 'Hết sách, không thể mượn' : ''"
      >
        Đặt Mượn Sách Trong 2 Tuần
      </button>
    </div>
  </div>
</template>

<script>
import TrackingService from "@/services/tracking.service";
import AuthService from "@/services/auth.service";

export default {
  props: ["book"],
  data() {
    return {
      user_id: "",
    };
  },
  methods: {
    async borrowBook() {
      try {
        const data = {
          MASACH: this.book._id,
          MADOCGIA: this.user_id,
        };
        // console.log(data);
        const isConfirmed = confirm(
          `Bạn có chắc chắn muốn mượn sách "${this.book.TEN_SACH}" không?`
        );

        if (!isConfirmed) return;
        const response = await TrackingService.create(data);
        alert(`Mượn sách: ${this.book.TEN_SACH}`);
      } catch (error) {
        console.log(error);
      }
    },
    async getUserInfo() {
      try {
        const response = await AuthService.getUserInfo();
        console.log(response.user._id);
        if (response) {
          this.user_id = response.user._id;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getUserInfo();
  },
};
</script>
<style scoped>
.img-book {
  max-width: 300px;
}
.card {
  flex-direction: row;
  width: 100%;
  max-height: 300px;
}
.btn-borrow {
  width: 100%;
}
</style>
