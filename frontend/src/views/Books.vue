<template>
  <div class="container mt-4">
    <h2>Danh Sách Sách</h2>
    <p v-if="searchQuery">
      Kết quả tìm kiếm cho: <strong>{{ searchQuery }}</strong>
    </p>
    <div class="row">
      <BookCard v-for="book in filteredBooks" :key="book._id" :book="book" />
    </div>
  </div> 
</template>

<script>
import BookCard from "@/components/BookCard.vue";
import BookService from "@/services/book.service";

export default {
  components: { BookCard },
  data() {
    return {
      books: [],
      searchQuery: "", // Lấy từ khóa từ URL
     
    };
  },
  computed: {
    // Chuyển các đối tượng book  thành chuỗi để tiện cho tìm kiếm.
    bookStrings() {
      return this.books.map((book) => {
        const { TEN_SACH, DON_GIA, NAM_XUAT_BAN, TAC_GIA, NXB } = book;
        return [TEN_SACH, DON_GIA, NAM_XUAT_BAN, TAC_GIA, NXB?.TEN_NXB].join(
          " "
        );
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
      } catch (error) {
        this.books = [];
        console.log(error);
      }
    },

  },
  watch: {
    "$route.query.q"(newQuery) {
      this.searchQuery = newQuery || "";
    },
  },
  created() {
    this.fetchBooks();
    
  },
};
</script>
