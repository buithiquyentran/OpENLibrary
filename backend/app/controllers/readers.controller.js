const ApiError = require("../api-error");
const ReaderService = require("../services/readers.service");
const AuthService = require("../services/auth.service");

const MongoDB = require("../utils/mongodb.util");
exports.create = async (req, res, next) => {
  if (!req.body?.HO_LOT || !req.body?.TEN) {
    return next(new ApiError(400, "Name cannot be empy"));
  }
  try {
    // Thêm user
    const authService = new AuthService(MongoDB.client);
    const user = await authService.register({
      PASSWORD: req.body.PASSWORD,
      USERNAME: req.body.USERNAME,
    });
    const readerService = new ReaderService(MongoDB.client);

    const document = await readerService.create({
      HO_LOT: req.body.HO_LOT,
      TEN: req.body.TEN,
      NGAY_SINH: req.body.NGAY_SINH,
      PHAI: req.body.PHAI,
      DIA_CHI: req.body.DIA_CHI,
      SDTDG: req.body.SDTDG, 
      USERNAME: req.body.USERNAME,
    });

    return res.send(document);
  } catch (error) {
    console.error("Error fetching", error.message);

    return next(
      new ApiError(500, "An error occurred while creating the readers")
    );
  }
};
exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const readerService = new ReaderService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await readerService.findByName(name);
    } else {
      documents = await readerService.find({});
    }
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving readers")
    );
  }
  return res.send(documents);
};
exports.findOne = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving readers with id = ${req.params.id}`)
    );
  }
};
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length == 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating readers with id= ${req.params.id}`)
    );
  }
};
exports.delete = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const authService = new AuthService(MongoDB.client);

    const reader = await readerService.findById(req.params.id);
    const username = reader.USERNAME;
    const response1 = await authService.deleteByUsername(username); //Xóa tài khoản
    const response2 = await readerService.delete(req.params.id); // Xóa đọc giả

    if (!response1 || !response2) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Could not delete readers with id=${req.params.id}, ${error}`
      )
    );
  }
};
exports.deleteAll = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const deletedCount = await readerService.deleteAll();
    return res.send({
      message: `${deletedCount} readers were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all readers")
    );
  }
};
// exports.findAllFavorite = async (req, res, next) => {
//   try {
//     const readerService = new ReaderService(MongoDB.client);
//     const documents = await readerService.findFavorite();
//     return res.send(documents);
//   } catch (error) {
//     return next(
//       new ApiError(500, "An error occurred while retrieving favorite readers")
//     );
//   }
// };
