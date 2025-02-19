const router = require("express").Router();

const authorization = require("../../middleware/authorization");
const productController = require("./product.controller");

router
  .route("/")
  .post(authorization("vendor-admin", "admin"), productController.createProduct)
  .get(productController.getProducts);

router
  .route("/:id")
  .get(productController.getProductById)
  .patch(authorization("vendor-admin", "admin"), productController.updateProductById)
  .delete(authorization("vendor-admin", "admin"), productController.deleteProductById);

// router.route("/bulk-update").patch(productController.bulkUpdateProduct);
// router.route("/bulk-delete").delete(productController.bulkDeleteProduct);
module.exports = router;
