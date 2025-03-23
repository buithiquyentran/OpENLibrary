<template>
  <div class="container mt-4">
    <h2 class="mb-3">Lịch sử mượn sách</h2>

    <!-- Kiểm tra nếu không có dữ liệu -->
    <div v-if="borrowHistory.length === 0" class="alert alert-warning">
      Bạn chưa có lịch sử mượn sách nào.
    </div>

    <!-- Bảng hiển thị lịch sử mượn sách -->
    <table v-else class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Tên sách</th>
          <th scope="col">Tác giả</th>
          <th scope="col">Ngày mượn</th>
          <th scope="col">Ngày trả</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in borrowHistory" :key="record._id">
          <td>{{ index + 1 }}</td>
          <td>{{ record.SACH.TEN_SACH }}</td>
          <td>{{ record.SACH.TAC_GIA }}</td>
          <td>{{ formatDate(record.NGAYMUON) }}</td>
          <td>
            {{ record.NGAYTRA ? formatDate(record.NGAYTRA) : "Chưa trả" }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import BorrowService from "@/services/tracking.service"; // Giả sử có file gọi API
import AuthService from "@/services/auth.service";

export default {
  data() {
    return {
      borrowHistory: [],
    };
  },
  methods: {
    async fetchBorrowHistory() {
      try {
        // get user_data
        const user = await AuthService.getUserInfo();
        const MADOCGIA = user._id;
        // lấy lịch sử mượn dựa trên mã đọc giả
        const response = await BorrowService.getHistory(MADOCGIA);
        if (response) {
          console.log(response);
          this.borrowHistory = response; 
        }
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử mượn sách:", error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("vi-VN");
    },
  },
  created() {
    this.fetchBorrowHistory();
  },
};
</script>

<style scoped>
/* Tăng khoảng cách giữa các dòng */
.table td,
.table th {
  vertical-align: middle;
}
</style>
