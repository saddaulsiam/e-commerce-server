const router = require("express").Router();

const authorization = require("../../middleware/authorization");
const vendorController = require("./vendor.controller");
const verifyToken = require("../../middleware/verifyToken");

router
  .route("/")
  .post(vendorController.registerVendor)
  .get(authorization("admin"), vendorController.getAllVendors);

router
  .route("/:email")
  .delete(authorization("vendor-admin", "admin"), vendorController.deleteVendor)
  .get(vendorController.getMyVendor);

router.get("/me/:email");
router.get("/:name", verifyToken, vendorController.getVendorByName);

module.exports = router;
