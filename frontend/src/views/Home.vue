
<template>
  <div class="home-banner">
    <div class="container mt-4 welcom-text">
      <h2>Chào mừng đến 📖 Open Library</h2>
      <p>Nơi khám phá hàng nghìn cuốn sách !</p>
      <router-link to="/books" class="btn btn-success">Xem sách</router-link>
    </div>
  </div>
</template>
<style scoped>
.home-banner {
  background: url("@/assets/banner.jpg") no-repeat;
  background-size: cover;
  height: 88vh;
  display: flex;
  justify-content: center;
  text-align: center;
  position: relative;
}
.welcom-text {
  color: aliceblue;
  position: absolute;
  top: 110px;
  font-size: 26px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
