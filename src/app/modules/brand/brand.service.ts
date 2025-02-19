const Brand = require("../../Schema/Brand");

exports.createBrandService = async (data) => {
  const result = await Brand.create(data);
  return result;
};

exports.getBrandsService = async () => {
  const brands = await Brand.find({}); //.populate("products");
  return brands;
};

exports.getBrandByNameService = async (name) => {
  const brand = await Brand.findOne({ name });
  return brand;
};

exports.getBrandByIdService = async (id) => {
  const brand = await Brand.findOne({ _id: id });

  return brand;
};

exports.updateBrandService = async (id, data) => {
  const result = await Brand.updateOne({ _id: id }, data, {
    runValidators: true,
  });
  return result;
};
