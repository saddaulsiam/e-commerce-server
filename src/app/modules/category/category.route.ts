const router = require("express").Router();

const verifyToken = require("../../middleware/verifyToken");
const authorization = require("../../middleware/authorization");
const categoryController = require("../controllers/category.controller");

router
  .route("/")
  .post(
    authorization("vendor-admin", "admin"),
    categoryController.createCategory
  )
  .get(categoryController.getAllCategories);

router.get("/:id", verifyToken, categoryController.getCategoryById);

module.exports = router;
