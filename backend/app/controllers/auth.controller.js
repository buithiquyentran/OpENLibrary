const jwt = require("jsonwebtoken");

const ApiError = require("../api-error");
const AuthService = require("../services/auth.service");
const ReaderService = require("../services/readers.service");
const StaffService = require("../services/staffs.service");

const MongoDB = require("../utils/mongodb.util");
exports.register = async (req, res, next) => {
  if (!req.body?.SDTDG || !req.body?.PASSWORD) {
    return next(new ApiError(400, "Username and password cannot be empy"));
  }
  try {
    const user_data = {
      USERNAME: req.body.SDTDG,
      PASSWORD: req.body.PASSWORD,
    };
    const reader_data = {
      HO_LOT: req.body.HO_LOT,
      TEN: req.body.TEN,
      NGAY_SINH: req.body.NGAY_SINH,
      PHAI: req.body.PHAI,
      DIA_CHI: req.body.DIA_CHI,
      SDTDG: req.body.SDTDG,
      USERNAME: req.body.SDTDG,
    };
    // Thêm user
    const authService = new AuthService(MongoDB.client);
    const user = await authService.register(user_data);
    // Thêm đọc giả
    const readerService = new ReaderService(MongoDB.client);
    const reader = await readerService.create(reader_data);
    res.status(201).json({ user, reader });
  } catch (error) {
    console.error("Error fetching", error);
    // res.status(400).json(error);
    res.status(400).json({ error: error.toString() });
  }
};

exports.login = async (req, res, next) => {
  if (!req.body?.USERNAME || !req.body?.PASSWORD) {
    return next(new ApiError(400, "Usernam and password cannot be empy"));
  }
  try {
    const authService = new AuthService(MongoDB.client);
    const { user, token } = await authService.login(req.body);
    if (token) {
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 60 * 60 * 1000 * 24 * 7, // 1 giờ
      });
      res.status(200).json({ message: "Đăng nhập thành công", user, token });
    } else {
      res.status(500).json({ message: "Đăng nhập thất bại" });
    }

    // return res.send(document);
  } catch (error) {
    // console.error("Error fetching", error.message);
    res.status(400).json({ error: error.toString() });

    return next(
      new ApiError(500, "An error occurred while creating the books")
    );
  }
};
exports.delete = async (req, res, next) => {
  try {
    const authService = new AuthService(MongoDB.client);
    const document = await authService.delete(req.params.username);

    const staffService = new StaffService(MongoDB.client);
    const readerService = new ReaderService(MongoDB.client);

    const staff = await staffService.deleteByUsername(req.params.username);
    if (!staff) {
      const reader = await readerService.deleteByUsername(req.params.username);
    }
    if (!document) {
      return next(new ApiError(404, "user not found"));
    }
    return res.send({ message: "User was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Could not delete nxbs with id=${req.params.username}, ${error}`
      )
    );
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    // Lấy token từ cookie
    console.log("Cookies từ client:", req.cookies);
    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }
    const authService = new AuthService(MongoDB.client);
    // Giải mã token với xử lý lỗi
    let decoded;
    try {
      decoded = jwt.verify(token, "SECRET_KEY");
    } catch (error) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // if (!USERNAME) {
    //   return res.status(400).json({ message: "Token không hợp lệ" });
    // }
    const { USERNAME } = decoded;
    // Tìm người dùng trong database
    const user = await authService.findByUsername(USERNAME);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi lấy thông tin người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getUserInfo = async (req, res) => {
  const authService = new AuthService(MongoDB.client);
  const readerService = new ReaderService(MongoDB.client);
  const staffService = new StaffService(MongoDB.client);

  try {
    // Lấy token từ cookie
    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    // Giải mã token với xử lý lỗi
    let decoded;
    try {
      decoded = jwt.verify(token, "SECRET_KEY");
    } catch (error) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    const USERNAME = decoded?.USERNAME;
    if (!USERNAME) {
      return res.status(400).json({ message: "Token không hợp lệ" });
    }

    // Tìm người dùng trong database
    let user = await readerService.findByUsername(USERNAME);
    if (!user) {
      user = await staffService.findByUsername(USERNAME);
    }

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Trả về thông tin người dùng (ẩn đi mật khẩu để bảo mật)
    // const { PASSWORD, ...userWithoutPassword } = user;
    res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi lấy thông tin người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

  // Đăng xuất
exports.logout = (req, res) => {
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
  res.status(200).json({ message: "Đăng xuất thành công!" });
};
