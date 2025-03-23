const ApiError = require("../api-error");
const StaffService = require("../services/staffs.service");
const MongoDB = require("../utils/mongodb.util");
const AuthService = require("../services/auth.service");

exports.create = async (req, res, next) => {
  if (!req.body?.HOTEN_NV) {
    return next(new ApiError(400, "Name cannot be empy"));
  }
  try {
    // Thêm user
    const authService = new AuthService(MongoDB.client);

    const user = await authService.createStaff({
      PASSWORD: req.body.PASSWORD,
      USERNAME: req.body.SDTNV,
    });

    const staffService = new StaffService(MongoDB.client);
    const document = await staffService.create({
      HOTEN_NV: req.body.HOTEN_NV,
      CHUCVU: req.body.CHUCVU,
      DIACHI: req.body.DIACHI,
      SDTNV: req.body.SDTNV,
      USERNAME: req.body.SDTNV,
    });

    res.status(201).send({ document, user });
  } catch (error) {
    console.error("Error fetching", error.message);
    res.status(400).json({ error: error.toString() });
    return next(new ApiError(500, "An error occurred while creating the nxbs"));
  }
};
exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const staffService = new StaffService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await staffService.findByName(name);
    } else {
      documents = await staffService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving nxbs"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const staffService = new StaffService(MongoDB.client);
    const document = await staffService.findById(req.params.id);
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
    const staffService = new StaffService(MongoDB.client);
    const document = await staffService.update(req.params.id, req.body);
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
    const staffService = new StaffService(MongoDB.client);
    const authService = new AuthService(MongoDB.client);

    const staff = await staffService.findById(req.params.id);
    const username = staff.USERNAME;
    const response1 = await authService.deleteByUsername(username);
    const response2 = await staffService.delete(req.params.id);

    if (!response1 || !response2) {
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
    const staffService = new StaffService(MongoDB.client);
    const deletedCount = await staffService.deleteAll();
    return res.send({
      message: `${deletedCount} nxbs were deleted successfully`,
    });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while removing all nxbs"));
  }
};

