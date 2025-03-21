<template>
  <div class="container mt-4">
    <h2>Lịch Sử Mượn Sách</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Tên sách</th>
          <th>Ngày mượn</th>
          <th>Ngày trả</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="history in borrowHistory" :key="history._id">
          <td>{{ history.sach.TEN_SACH }}</td>
          <td>{{ history.NGAYMUON }}</td>
          <td>{{ history.NGAYTRA || "Chưa trả" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return { borrowHistory: [] };
  },
  async mounted() {
    const response = await axios.get("http://localhost:5000/borrow/history");
    this.borrowHistory = response.data;
  },
};
</script>
