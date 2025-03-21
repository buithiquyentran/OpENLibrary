<template>
  <footer class="footer mt-auto py-3">
    <div class="d-flex justify-content-around">
      <!-- Logo & Tên -->
      <div class="footer-brand">
        <h3>📖 Open Library</h3>
      </div>
      <div>
        <div class="footer-links-container">
          <!-- Các liên kết -->
          <ul class="footer-links">
            <li><a href="#">Trang Chủ</a></li>
            <li><a href="#">Giới Thiệu</a></li>
            <li><a href="#">Liên Hệ</a></li>
          </ul>
          <!-- Mạng xã hội -->
          <div class="footer-social">
            <a href="#" class="social-icon"><i class="fab fa-facebook"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2025 📖 Open Library. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #16a34a;
  color: white;
}
.footer-brand {
  align-items: center;
}
.footer-links-container {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
}
.footer-links {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 20px;
  margin: 10px 24px;
}

.footer-links a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.footer-links a:hover {
  text-decoration: underline;
}

.footer-social {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.social-icon {
  font-size: 20px;
  color: white;
}

.social-icon:hover {
  color: #d4d4d4;
}

.footer-bottom {
  text-align: center;
  padding: 10px;
  font-size: 14px;
}
</style>
