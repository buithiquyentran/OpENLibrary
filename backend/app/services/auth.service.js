const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthService {
  constructor(client) {
    this.User = client.db().collection("USER");
  }
  // Trích xuất dữ liệu user từ payload
  extractUserData(payload) {
    const user = {
      USERNAME: payload.USERNAME,
      PASSWORD: payload.PASSWORD,
      ROLE: 2, // 2: Người dùng
    };

    // Xóa các trường undefined
    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );
    return user;
  }

  // Đăng ký tài khoản
  async register(payload) {
    const user = this.extractUserData(payload);
    user.PASSWORD = await bcrypt.hash(user.PASSWORD, 10);

    const result = await this.User.insertOne(user);

    return { _id: result.insertedId, ...user };
  }

  // Đăng nhập
  async login(payload) {
    const user = this.extractUserData(payload);

    const userExist = await this.User.findOne({ USERNAME: user.USERNAME });

    if (!userExist) throw new Error("User not found");

    const isMatch = await bcrypt.compare(user.PASSWORD, userExist.PASSWORD);
    if (!isMatch) throw new Error("Invalid credentials");

    const user_data = {
      USERNAME: userExist.USERNAME,
      ROLE: userExist.ROLE,
    };
    // Tạo JWT
    const token = jwt.sign(user_data, "SECRET_KEY", { expiresIn: "24h" });

    // Xóa PASSWORD trước khi trả về
    delete userExist.PASSWORD;
    return { token, user: userExist };
  }



  async findByUsername(USERNAME) {
    return await this.User.findOne({
      USERNAME: USERNAME, // bieu thuc chinh quy, khong phan biet hoa thuong
    });
  }

  async createStaff(payload) {
    const user = this.extractUserData(payload);
    user.ROLE = 1;
    const sdtExist = await this.User.findOne({ USERNAME: user.USERNAME });
    if (sdtExist) throw new Error("SDT exist");

    const result = await this.User.insertOne(user);
    return result;
  }
  async delete(username) {
    const result = await this.User.findOneAndDelete({
      USERNAME: username ? username : null,
    });

    return result;
  }
}
module.exports = AuthService;
