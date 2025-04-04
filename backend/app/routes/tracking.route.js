const express = require("express");
const trackings = require("../controllers/trackings.controller");
const router = express.Router();

router.route("/my-borrow/:MADOCGIA").get(trackings.findByMaDocGia);

router
  .route("/")
  .get(trackings.findAll)
  .post(trackings.create)
  .delete(trackings.delete);
router
  .route("/:id")
  .get(trackings.findOne)
  .put(trackings.update)
  .delete(trackings.delete);

module.exports = router;
