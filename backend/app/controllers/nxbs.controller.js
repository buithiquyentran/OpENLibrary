const ApiError = require("../api-error");
const NXBService = require("../services/nxbs.service");
const MongoDB = require("../utils/mongodb.util");
exports.create = async (req, res, next) => {
  if (!req.body?.TEN_NXB) {
    return next(new ApiError(400, "Name cannot be empy"));
  }
  try {
    const nxbService = new NXBService(MongoDB.client);
    const document = await nxbService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.error("Error fetching", error.message);

    return next(new ApiError(500, "An error occurred while creating the nxbs"));
  }
};
exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const nxbService = new NXBService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await nxbService.findByName(name);
    } else {
      documents = await nxbService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving nxbs"));
  }
  return res.send(documents);
};
exports.findOne = async (req, res, next) => {
  try {
    const nxbService = new NXBService(MongoDB.client);
    const document = await nxbService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving nxbs with id = ${req.params.id}`)
    );
  }
};
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length == 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const nxbService = new NXBService(MongoDB.client);
    const document = await nxbService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was updated successfully" });
  } catch (error) {
    // console.error(error)
    return next(
      new ApiError(500, `Error updating nxbs with id= ${req.params.id}`)
    );
  }
};
exports.delete = async (req, res, next) => {
  try {
    const nxbService = new NXBService(MongoDB.client);
    const document = await nxbService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Could not delete nxbs with id=${req.params.id}, ${error}`
      )
    );
  }
};
exports.deleteAll = async (req, res, next) => {
  try {
    const nxbService = new NXBService(MongoDB.client);
    const deletedCount = await nxbService.deleteAll();
    return res.send({
      message: `${deletedCount} nxbs were deleted successfully`,
    });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while removing all nxbs"));
  }
};
exports.findAllFavorite = async (req, res, next) => {
  try {
    const nxbService = new NXBService(MongoDB.client);
    const documents = await nxbService.findFavorite();
    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving favorite nxbs")
    );
  }
};
