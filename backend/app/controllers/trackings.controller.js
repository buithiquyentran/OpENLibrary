const mongoose = require("mongoose");
const ApiError = require("../api-error");
const TrackingService = require("../services/trackings.service");
const BookService = require("../services/books.service");

const MongoDB = require("../utils/mongodb.util");
exports.create = async (req, res, next) => {
  if (!req.body?.MASACH || !req.body?.MADOCGIA) {
    return next(new ApiError(400, "Name cannot be empy"));
  }

  try {
    const bookService = new BookService(MongoDB.client);
    const book = await bookService.decreaseQuantity(req.body?.MASACH);
    if (book.SO_QUYEN_SAN_CO < 1) {
      return next(
        new ApiError(
          400,
          `This book with _id = ${req.body?.MASACH}is not availble`
        )
      );
    }
    const trackingService = new TrackingService(MongoDB.client);
    const document = await trackingService.create(req.body);

    return res.send(document);
  } catch (error) {
    console.error("Error fetching", error.message);
    return next(
      new ApiError(500, "An error occurred while creating the trackings")
    );
  }
};
exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const trackingService = new TrackingService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await trackingService.findByName(name);
    } else {
      documents = await trackingService.find({});
    }
  } catch (error) {
    console.error(error);
    return next(
      new ApiError(500, "An error occurred while retrieving trackings")
    );
  }
  return res.send(documents);
};
exports.findOne = async (req, res, next) => {
  try {
    const trackingService = new TrackingService(MongoDB.client);
    const document = await trackingService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Tracking not found"));
    }
    res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving trackings with id = ${req.params.id}`)
    );
  }
};
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length == 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const trackingService = new TrackingService(MongoDB.client);
    const document = await trackingService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Tracking not found"));
    }
    return res.send({ message: "Tracking was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating trackings with id= ${req.params.id}`)
    );
  }
};
exports.delete = async (req, res, next) => {
  try {
    const trackingService = new TrackingService(MongoDB.client);
    const document = await trackingService.delete(req.body._id);

    const bookService = new BookService(MongoDB.client);
    const book = await bookService.increaseQuantity(req.body?.MASACH);

    if (!document) {
      return next(new ApiError(404, "Tracking not found"));
    }
    return res.send({ message: "Tracking was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Could not delete trackings with id=${req.params.id}, ${error}`
      )
    );
  }
};
// exports.deleteAll = async (req, res, next) => {
//   try {
//     const trackingService = new TrackingService(MongoDB.client);
//     const deletedCount = await trackingService.deleteAll();
//     return res.send({
//       message: `${deletedCount} trackings were deleted successfully`,
//     });
//   } catch (error) {
//     return next(
//       new ApiError(500, "An error occurred while removing all trackings")
//     );
//   }
// };
exports.findByMaDocGia = async (req, res, next) => {
  let documents = [];

  try {
    // console.log("sReceived params:", req.params); // Debug xem MADOCGIA có tồn tại không

    const trackingService = new TrackingService(MongoDB.client);

    // Đảm bảo MADOCGIA được truyền đúng
    const { MADOCGIA } = req.params;
    if (!MADOCGIA) {
      return res.status(400).json({ message: "MADOCGIA is required" });
    }

    documents = await trackingService.findByMaDocGia(MADOCGIA);

    if (!documents) {
      return res
        .status(404)
        .json({ message: "No document found with the given MADOCGIA" });
    }

    // return res.json({ document });
  } catch (error) {
    console.error("Error in findByMaDocGia:", error);
    return next(
      new ApiError(500, "An error occurred while retrieving tracking data")
    );
  }
  return res.send(documents);
};
