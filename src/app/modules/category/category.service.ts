const Category = require("../models/Category");

exports.createCategoryService = async (data) => {
  const category = await Category.create(data);
  return category;
};

exports.getAllCategoriesService = async () => {
  const categories = await Category.find({});
  return categories;
};

exports.getCategoryByIdService = async (id) => {
  const category = await Category.findOne({ _id: id });
  return category;
};
