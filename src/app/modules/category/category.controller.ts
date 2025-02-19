const {
  getAllCategoriesService,
  createCategoryService,
  getCategoryByIdService,
} = require("./category.service");

exports.createCategory = async (req, res) => {
  try {
    const result = await createCategoryService(req.body);

    res.status(200).json({
      status: "success",
      messgae: "Category created successfully!",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: " Data is not inserted ",
      error: error.message,
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesService();

    res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the categories",
      error: error.message,
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await getCategoryByIdService(id);

    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the categories",
      error: error.message,
    });
  }
};
