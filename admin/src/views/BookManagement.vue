<template>
  <div class="container mt-4">
    <h2 class="mb-3">Quản lý Sách</h2>

    <!-- Thanh tìm kiếm -->
    <div class="input-group mb-3">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        placeholder="Tìm kiếm sách..."
      />
      <button class="btn btn-primary" @click="searchBooks">Tìm kiếm</button>
    </div>
    <!-- Add -->
    <button
      class="btn btn-success mb-1"
      @click="
        isEditing = true;
        isCreatingBook = true;
      "
    >
      Thêm sách
    </button>

    <!-- Bảng hiển thị sách -->
    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>Ảnh</th>
          <th>Tên sách</th>
          <th>Tác giả</th>
          <th>Đơn giá</th>
          <th>Nhà xuất bản</th>
          <th>Số quyển thực tế</th>
          <th>Số quyển có sẵn</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in filteredBooks" :key="book.id">
          <td>
            <img :src="book.IMG" alt="Ảnh sách" class="book-IMG" />
          </td>
          <td>{{ book.TEN_SACH }}</td>

          <td>{{ book.TAC_GIA }}</td>
          <td>{{ formatPrice(book.DON_GIA) }}</td>
          <td>{{ book.NXB.TEN_NXB }}</td>
          <td>{{ book.SO_QUYEN }}</td>
          <td class="d-flex justify-content-between border-0">
            <span>
              {{ book.SO_QUYEN_SAN_CO }}
            </span>
            <div class="edit-btn" @click="openEditDialog(book)">
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
        <h3>{{ isCreatingBook ? "Thêm sách" : "Chỉnh sửa sách" }}</h3>
        <label>Tên sách:</label>
        <input
          type="text"
          v-model="editingBook.TEN_SACH"
          class="form-control"
        />

        <label>Tác giả:</label>
        <input type="text" v-model="editingBook.TAC_GIA" class="form-control" />

        <label>Đơn giá:</label>
        <input
          type="number"
          v-model="editingBook.DON_GIA"
          class="form-control"
        />
        <div class="form-group">
          <label>Nhà xuất bản:</label>
          <select v-model="editingBook.MA_NXB" class="form-control">
            <option v-for="nxb in publishers" :key="nxb.id" :value="nxb._id">
              {{ nxb.TEN_NXB }}
            </option>
          </select>
        </div>

        <label>Số quyển:</label>
        <input
          type="number"
          v-model="editingBook.SO_QUYEN"
          class="form-control"
        />
        <label>Năm xuất bản:</label>
        <input
          type="number"
          v-model="editingBook.NAM_XUAT_BAN"
          class="form-control"
        />
        <div class="modal-actions">
          <button
            v-if="!isCreatingBook"
            @click="deleteBook()"
            class="btn btn-danger mt-auto"
          >
            <i class="bi bi-trash"></i>
          </button>
          <button
            class="btn btn-primary flex-grow-1 ml-1 mr-1"
            @click="isCreatingBook ? addBook() : saveChanges()"
          >
            Lưu
          </button>
          <button
            class="btn btn-secondary"
            @click="
              isEditing = false;
              isCreatingBook = false;
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
import BookService from "@/services/book.service";
import NXBService from "@/services/nxb.service";

export default {
  data() {
    return {
      books: [],
      searchQuery: "",
      isEditing: false, // Trạng thái hộp thoại chỉnh sửa
      isCreatingBook: false,
      editingBook: {
        TEN_SACH: "",
        DON_GIA: "",
        SO_QUYEN_SAN_CO: "",
        SO_QUYEN: "",
        NAM_XUAT_BAN: "",
        TAC_GIA: "",
        IMG: "",
        MA_NXB: "",
      }, // Lưu sách đang chỉnh sửa
      publishers: [],
    };
  },
  computed: {
    bookStrings() {
      return this.books.map((book) => {
        const {
          TEN_SACH,
          DON_GIA,
          NAM_XUAT_BAN,
          TAC_GIA,
          SO_QUYEN,
          SO_QUYEN_SAN_CO,
          NXB,
        } = book;
        return [
          TEN_SACH,
          DON_GIA,
          NAM_XUAT_BAN,
          TAC_GIA,
          SO_QUYEN,
          SO_QUYEN_SAN_CO,
          NXB?.TEN_NXB,
        ].join(" ");
      });
    },
    filteredBooks() {
      if (!this.searchQuery) return this.books;
      return this.books.filter((_book, index) =>
        this.bookStrings[index]
          ?.toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async fetchBooks() {
      try {
        const books = await BookService.getAll();
        if (books) {
          this.books = books;
        }
        const nxb = await NXBService.getAll();
        if (nxb) {
          this.publishers = nxb;
        }
      } catch (error) {
        this.books = [];
        this.publishers = [];

        console.log(error);
      }
    },
    searchBooks() {
      console.log("Tìm kiếm:", this.searchQuery);
    },
    formatPrice(DON_GIA) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(DON_GIA);
    },
    openEditDialog(book) {
      if (book) {
        this.editingBook = { ...book }; // Sao chép dữ liệu sách
      }
      this.isEditing = true; // Hiển thị hộp thoại
    },
    async saveChanges() {
      try {
        const response = await BookService.update(
          this.editingBook._id,
          this.editingBook
        );
        this.isEditing = false;
      } catch (error) {
        console.log(error);
      }
    },
    async addBook() {
      try {
        console.log(this.editingBook);
        const response = await BookService.create(this.editingBook);
        this.isEditing = false;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteBook() {
      try {
        const isConfirmed = confirm(
          `Bạn có chắc chắn muốn xóa ${this.editingBook.TEN_SACH} không?`
        );
        if (!isConfirmed) {
          this.isEditing = false;
          return;
        }
        const response = await BookService.delete(this.editingBook._id);
        this.isEditing = false;
      } catch (error) {
        console.log(error);
      }
    },
    resetEditing() {
      this.editingBook = {
        TEN_SACH: "",
        DON_GIA: "",
        SO_QUYEN_SAN_CO: "",
        SO_QUYEN: "",
        NAM_XUAT_BAN: "",
        TAC_GIA: "",
        IMG: "",
        MA_NXB: "",
      };
    },
  },

  created() {
    this.fetchBooks();
  },
};
</script>

<style scoped>
.book-IMG {
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
