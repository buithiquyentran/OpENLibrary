<template>
  <div class="container mt-4">
    <h2 class="mb-3">Quản Lý Nhà Xuất Bản</h2>

    <!-- Thanh tìm kiếm -->
    <div class="input-group mb-3">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        placeholder="Tìm kiếm nhà xuất bản..."
      />
      <button class="btn btn-primary" @click="searchNXBs">Tìm kiếm</button>
    </div>
    <!-- Add -->
    <button
      class="btn btn-success mb-1"
      @click="
        isEditing = true;
        isCreating = true;
      "
    >
      Thêm nhà xuất bản
    </button>

    <!-- Bảng hiển thị sách -->
    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>Mã NXB</th>
          <th>Tên NXB</th>
          <th>Địa Chỉ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="nxb in filteredNXBs" :key="nxb._id">
          <td>{{ nxb._id }}</td>
          <td>{{ nxb.TEN_NXB }}</td>
          <td class="d-flex justify-content-between border-0">
            <span>
              {{ nxb.DIA_CHI }}
            </span>
            <div class="edit-btn" @click="openEditDialog(nxb)">
              <i class="bi bi-pencil"></i>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Edit -->
    <div v-if="isEditing" class="modal-overlay">
      <div class="modal-content">
        <h3>
          {{ isCreating ? "Thêm nhà xuất bản" : "Chỉnh sửa nhà xuất bản" }}
        </h3>

        <label>Tên NXB:</label>
        <input type="text" v-model="editingNXB.TEN_NXB" class="form-control" />

        <label>Địa chỉ:</label>
        <input type="text" v-model="editingNXB.DIA_CHI" class="form-control" />

        <div class="modal-actions">
          <button
            v-if="!isCreating"
            @click="deleteNXB()"
            class="btn btn-danger mt-auto"
          >
            <i class="bi bi-trash"></i>
          </button>
          <button
            class="btn btn-primary flex-grow-1 ml-1 mr-1"
            @click="isCreating ? add() : saveChanges()"
          >
            Lưu
          </button>
          <button
            class="btn btn-secondary"
            @click="
              isEditing = false;
              isCreating = false;
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
import BookService from "@/services/nxb.service";
import NXBService from "@/services/nxb.service";

export default {
  data() {
    return {
      searchQuery: "",
      isEditing: false, // Trạng thái hộp thoại chỉnh sửa
      isCreating: false,
      editingNXB: {
        TEN_NXB: "",
        DIA_CHI: "",
      }, // Lưu sách đang chỉnh sửa
      publishers: [],
    };
  },
  computed: {
    nxbStrings() {
      return this.publishers.map((nxb) => {
        const { TEN_NXB, DIA_CHI } = nxb;
        return [TEN_NXB, DIA_CHI].join(" ");
      });
    },
    filteredNXBs() {
      if (!this.searchQuery) return this.publishers;
      return this.publishers.filter((_publisher, index) =>
        this.nxbStrings[index]
          ?.toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async fetchNXBs() {
      try {
        const publishers = await NXBService.getAll();
        if (publishers) {
          this.publishers = publishers;
        }
      } catch (error) {
        this.publishers = [];

        console.log(error);
      }
    },
    searchNXBs() {
      console.log("Tìm kiếm:", this.searchQuery);
    },

    openEditDialog(nxb) {
      if (nxb) {
        this.editingNXB = { ...nxb }; // Sao chép dữ liệu sách
      }
      this.isEditing = true; // Hiển thị hộp thoại
    },
    async saveChanges() {
      try {
        const response = await NXBService.update(
          this.editingNXB._id,
          this.editingNXB
        );
        this.isEditing = false;
      } catch (error) {
        console.log(error);
      }
    },
    async add() {
      try {
        console.log(this.editingNXB);
        const response = await NXBService.create(this.editingNXB);
        this.isEditing = false;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteNXB() {
      try {
        const isConfirmed = confirm(
          `Bạn có chắc chắn muốn xóa ${this.editingNXB.TEN_NXB} không?`
        );
        if (!isConfirmed) {
          this.isEditing = false;
          return;
        }
        const response = await NXBService.delete(this.editingNXB._id);
        this.isEditing = false;
      } catch (error) {
        console.log(error);
      }
    },
    resetEditing() {
      this.editingNXB = {
        TEN_NXB: "",
        DIA_CHI: "",
      };
    },
  },

  created() {
    this.fetchNXBs();
  },
};
</script>

<style scoped>
.nxb-IMG {
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
