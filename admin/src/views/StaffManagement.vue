<template>
  <div class="container mt-4">
    <h2 class="mb-3">Quản lý Nhân Viên</h2>

    <!-- Thanh tìm kiếm -->
    <div class="input-group mb-3">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        placeholder="Tìm kiếm nhân viên..."
      />
      <button class="btn btn-primary" @click="searchStaffs">Tìm kiếm</button>
    </div>
    <!-- Add -->
    <button
      class="btn btn-success mb-1"
      @click="
        isEditing = true;
        isCreatingStaff = true;
      "
    >
      Thêm nhân viên
    </button>

    <!-- Bảng hiển thị sách -->
    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>Họ Tên Nhân Viên</th>
          <th>Chức Vụ</th>
          <th>Địa Chỉ</th>
          <th>SDT</th>
          <th>Username</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="staff in filteredStaffs" :key="staff.id">
          <td>{{ staff.HOTEN_NV }}</td>
          <td>{{ staff.CHUCVU }}</td>
          <td>{{ staff.DIACHI }}</td>
          <td>{{ staff.SDTNV }}</td>

          <td class="d-flex justify-content-between border-0">
            <span>
              {{ staff.USERNAME }}
            </span>
            <div class="edit-btn" @click="openEditDialog(staff)">
              <i class="bi bi-pencil"></i>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Edit -->
    <div v-if="isEditing" class="modal-overlay">
      <div class="modal-content">
        <!-- <h3> {Chỉnh sửa sách} </h3>  -->
        <h3>
          {{ isCreatingStaff ? "Thêm Nhân Viên" : "Chỉnh Sửa Nhân Viên" }}
        </h3>
        <label>Họ tên nhân viên:</label>
        <input
          type="text"
          v-model="editingStaff.HOTEN_NV"
          class="form-control"
        />

        <label>Chức vụ:</label>
        <input type="text" v-model="editingStaff.CHUCVU" class="form-control" />

        <label>Địa Chỉ:</label>
        <input type="text" v-model="editingStaff.DIACHI" class="form-control" />
        <label>Số Điện Thoại:</label>
        <input type="text" v-model="editingStaff.SDTNV" class="form-control" />
        <label>Mật khẩu:</label>
        <input
          type="text"
          v-model="editingStaff.PASSWORD"
          class="form-control"
        />
        <div class="modal-actions">
          <button
            v-if="!isCreatingStaff"
            @click="deleteStaff()"
            class="btn btn-danger mt-auto"
          >
            <i class="bi bi-trash"></i>
          </button>
          <button
            class="btn btn-primary flex-grow-1 ml-1 mr-1"
            @click="isCreatingStaff ? addStaff() : saveChanges()"
          >
            Lưu
          </button>
          <button
            class="btn btn-secondary"
            @click="
              isEditing = false;
              isCreatingStaff = false;
              resetEditing();
            "
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StaffService from "@/services/staff.service";

export default {
  data() {
    return {
      readers: [],
      searchQuery: "",
      isEditing: false, // Trạng thái hộp thoại chỉnh sửa
      isCreatingStaff: false,
      editingStaff: {
        HOTEN_NV: "",
        CHUCVU: "",
        DIACHI: "",
        SDTNV: "",
        USERNAME: "",
        PASSWORD: "",
      }, // Lưu sách đang chỉnh sửa
    };
  },
  computed: {
    readerStrings() {
      return this.readers.map((staff) => {
        const { HOTEN_NV, CHUCVU, DIACHI, SDTNV, USERNAME } = staff;
        return [HOTEN_NV, CHUCVU, DIACHI, SDTNV, USERNAME].join(" ");
      });
    },
    filteredStaffs() {
      if (!this.searchQuery) return this.readers;
      return this.readers.filter((_reader, index) =>
        this.readerStrings[index]
          ?.toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async fetchBooks() {
      try {
        const readers = await StaffService.getAll();
        if (readers) {
          this.readers = readers;
        }
      } catch (error) {
        this.readers = [];

        console.log(error);
      }
    },
    searchStaffs() {
      console.log("Tìm kiếm:", this.searchQuery);
    },

    openEditDialog(staff) {
      if (staff) {
        this.editingStaff = { ...staff }; // Sao chép dữ liệu sách
      }
      this.isEditing = true; // Hiển thị hộp thoại
    },
    async saveChanges() {
      try {
        const response = await StaffService.update(
          this.editingStaff._id,
          this.editingStaff
        );
        this.isEditing = false;
      } catch (error) {
        console.log(error);
      }
    },
    async addStaff() {
      try {
        this.editingStaff.USERNAME = this.editingStaff.SDTNV;
        console.log(this.editingStaff);
        const response = await StaffService.create(this.editingStaff);
        this.isEditing = false;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteStaff() {
      try {
        const isConfirmed = confirm(
          `Bạn có chắc chắn muốn xóa người dùng ${this.editingStaff.USERNAME} không?`
        );
        if (!isConfirmed) {
          this.isEditing = false;
          return;
        }

        const response = await StaffService.delete(this.editingStaff._id);
        this.isEditing = false;
      } catch (error) {
        console.log(error);
      }
    },
    resetEditing() {
      this.editingStaff = {
        HOTEN_NV: "",
        CHUCVU: "",
        DIACHI: "",
        SDTNV: "",
        USERNAME: "",
      };
    },
  },

  created() {
    this.fetchBooks();
  },
};
</script>

<style scoped>
.staff-IMG {
  width: 80px;
  height: 100px;
  object-fit: cover;
}
.edit-btn {
  cursor: pointer;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
