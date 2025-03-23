<template>
  <div class="d-flex card">
    <img :src="book.IMG" class="card-img-top img-book" alt="Book Image" />
    <div class="card-body">
      <h5 class="card-title">{{ book.TEN_SACH }}</h5>
      <p>Tác giả: {{ book.TAC_GIA }}</p>
      <p>Giá: {{ book.DON_GIA }} VNĐ</p>
      <p>Nhà xuất bản: {{ book.NXB.TEN_NXB }}</p>
      <p>Số lượng có sẵn: {{ book.SO_QUYEN_SAN_CO }} quyển</p>
      <button
        :disabled="book.SO_QUYEN_SAN_CO < 1 || unreturnedBooksCount >= 3"
        class="btn btn-success btn-borrow"
        @click="borrowBook"
        :title="getBorrowButtonTitle()"
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
      unreturnedBooksCount: 0,
    };
  },
  methods: {
    async borrowBook() {
      try {
        const data = {
          MASACH: this.book._id,
          MADOCGIA: this.user_id,
        };
        const isConfirmed = confirm(
          `Bạn có chắc chắn muốn mượn sách "${this.book.TEN_SACH}" không?`
        );

        if (!isConfirmed) return;
        const response = await TrackingService.create(data);
      } catch (error) {
        console.log(error);
      }
    },
    async getUserInfo() {
      try {
        const response = await AuthService.getUserInfo();
        console.log(response._id);
        if (response) {
          this.user_id = response._id;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async fetchBorrowHistory() {
      try {
        // get user_data
        const user = await AuthService.getUserInfo();
        const MADOCGIA = user._id;
        // lấy lịch sử mượn dựa trên mã đọc giả
        const response = await TrackingService.getHistory(MADOCGIA);
        if (response) {
          console.log(response);
          this.borrowHistory = response;
        }
        if (response) {
          console.log(response);
          this.unreturnedBooksCount = response.filter(
            (record) => !record.NGAYTRA
          ).length;
          console.log(this.unreturnedBooksCount);
        }
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử mượn sách:", error);
      }
    },
    getBorrowButtonTitle() {
      if (this.unreturnedBooksCount >= 3) {
        return "Đã đạt tới số lượng mượn cho phép (3 sách)";
      }
      if (this.book.SO_QUYEN_SAN_CO < 1) {
        return "Hết sách, không thể mượn";
      }

      return "";
    },
  },
  created() {
    this.getUserInfo();
    this.fetchBorrowHistory();
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
