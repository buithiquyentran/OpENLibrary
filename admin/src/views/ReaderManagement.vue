<template>
  <div class="container mt-4">
    <h2 class="mb-3">Quản lý Đọc Giả</h2>

    <!-- Thanh tìm kiếm -->
    <div class="input-group mb-3">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        placeholder="Tìm kiếm đọc giả..."
      />
      <button class="btn btn-primary" @click="searchReaders">Tìm kiếm</button>
    </div>
    <!-- Add -->
    <button
      class="btn btn-success mb-1"
      @click="
        isEditing = true;
        isCreatingReader = true;
      "
    >
      Thêm đọc giả
    </button>

    <!-- Bảng hiển thị sách -->
    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>Họ Lót</th>
          <th>Tên</th>
          <th>Ngày Sinh</th>
          <th>Giới tính</th>
          <th>SDT</th>
          <th>Địa Chỉ</th>
          <th>Username</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="reader in filteredReaders" :key="reader.id">
          <td>{{ reader.HO_LOT }}</td>
          <td>{{ reader.TEN }}</td>
          <td>{{ reader.NGAY_SINH }}</td>
          <td>{{ reader.PHAI }}</td>
          <td>{{ reader.SDTDG }}</td>

          <td>{{ reader.DIA_CHI }}</td>

          <td class="d-flex justify-content-between border-0">
            <span>
              {{ reader.USERNAME }}
            </span>
            <div class="edit-btn" @click="openEditDialog(reader)">
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
        <h3>{{ isCreatingReader ? "Thêm đọc giả" : "Chỉnh sửa đọc giả" }}</h3>
        <label>Họ Lót:</label>
        <input
          type="text"
          v-model="editingReader.HO_LOT"
          class="form-control"
        />

        <label>Tên:</label>
        <input type="text" v-model="editingReader.TEN" class="form-control" />

        <div class="form-group">
          <label for="ngaySinh">Ngày sinh:</label>
          <input
            type="date"
            id="ngaySinh"
            v-model="editingReader.NGAY_SINH"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label>Giới tính:</label>
          <select v-model="editingReader.PHAI" class="form-control">
            <option>Nam</option>
            <option>Nữ</option>
            <option>Khác</option>
          </select>
        </div>
        <label>Địa Chỉ:</label>
        <input
          type="text"
          v-model="editingReader.DIA_CHI"
          class="form-control"
        />
        <label>Số Điện Thoại:</label>
        <input type="text" v-model="editingReader.SDTDG" class="form-control" />
        <!-- PASSWORD -->
        <div v-if="isCreatingReader">
          <label>Mật khẩu:</label>
          <input
            type="text"
            v-model="editingReader.PASSWORD"
            class="form-control"
          />
        </div>
        <div class="modal-actions">
          <button
            v-if="!isCreatingReader"
            @click="deleteBook()"
            class="btn btn-danger mt-auto"
          >
            <i class="bi bi-trash"></i>
          </button>
          <button
            class="btn btn-primary flex-grow-1 ml-1 mr-1"
            @click="isCreatingReader ? addReader() : saveChanges()"
          >
            Lưu
          </button>
          <button
            class="btn btn-secondary"
            @click="
              isEditing = false;
              isCreatingReader = false;
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
import ReaderService from "@/services/reader.service";
// import NXBService from "@/services/nxb.service";

export default {
  data() {
    return {
      readers: [],
      searchQuery: "",
      isEditing: false, // Trạng thái hộp thoại chỉnh sửa
      isCreatingReader: false,
      editingReader: {
        HO_LOT: "",
        TEN: "",
        NGAY_SINH: "",
        PHAI: "",
        DIA_CHI: "",
        SDTDG: "",
        USERNAME: "",
        PASSWORD: "",
      }, // Lưu sách đang chỉnh sửa
    };
  },
  computed: {
    readerStrings() {
      return this.readers.map((reader) => {
        const { HO_LOT, TEN, NGAY_SINH, PHAI, DIA_CHI, SDTDG, USERNAME } =
          reader;
        return [HO_LOT, TEN, NGAY_SINH, PHAI, DIA_CHI, SDTDG, USERNAME].join(
          " "
        );
      });
    },
    filteredReaders() {
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
        const readers = await ReaderService.getAll();
        if (readers) {
          this.readers = readers;
        }
      } catch (error) {
        this.readers = [];

        console.log(error);
      }
    },
    searchReaders() {
      console.log("Tìm kiếm:", this.searchQuery);
    },

    openEditDialog(reader) {
      if (reader) {
        this.editingReader = { ...reader }; // Sao chép dữ liệu sách
      }
      this.isEditing = true; // Hiển thị hộp thoại
    },
    async saveChanges() {
      try {
        const response = await ReaderService.update(
          this.editingReader._id,
          this.editingReader
        );
        this.isEditing = false;
      } catch (error) {
        console.log(error);
      }
    },
    async addReader() {
      try {
        this.editingReader.USERNAME = this.editingReader.SDTDG;
        console.log(this.editingReader);
        const response = await ReaderService.create(this.editingReader);
        this.isEditing = false;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteBook() {
      try {
        const isConfirmed = confirm(
          `Bạn có chắc chắn muốn xóa người dùng ${this.editingReader.USERNAME} không?`
        );
        if (!isConfirmed) {
          this.isEditing = false;
          return;
        }
        const response = await ReaderService.delete(this.editingReader._id);
        this.isEditing = false;
      } catch (error) {
        console.log(error);
      }
    },
    resetEditing() {
      this.editingReader = {
        HO_LOT: "",
        TEN: "",
        NGAY_SINH: "",
        PHAI: "",
        DIA_CHI: "",
        SDTDG: "",
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
/* .reader-IMG {
  width: 80px;
  height: 100px;
  object-fit: cover;
} */
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
