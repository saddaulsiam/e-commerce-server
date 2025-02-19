const router = require("express").Router();

const verifyToken = require("../../middleware/verifyToken");
const authorization = require("../../middleware/authorization");
const brandController = require("./brand.controller");

router
  .route("/")
  .post(authorization("vendor-admin", "admin"), brandController.createBrand)
  .get(authorization("customer", "vendor-admin", "admin"), brandController.getBrands);

router.route("/:id").get(verifyToken, brandController.getBrandById).patch(verifyToken, brandController.updateBrand);

module.exports = router;
