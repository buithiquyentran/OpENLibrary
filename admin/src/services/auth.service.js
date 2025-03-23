import createApiClient from "./api.service";

class AuthService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
  }
  async Login(data) {
    return (await this.api.post("/login", data)).data;
  }
  async Logout() {
    return (await this.api.post("/logout")).data;
  }
  async Register(data) { 
    return (await this.api.post("/register", data)).data;
  }
  async Delete(username) {
    return (await this.api.delete(`/delete/${username}`)).data;
  }
  async getUserInfo() {
    return (
      await this.api.get("/user-info", {
        withCredentials: true,
      })
    ).data;
  }
}

export default new AuthService();
