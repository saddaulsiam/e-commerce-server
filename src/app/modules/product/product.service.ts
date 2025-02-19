const Product = require("../models/Product");
const Brand = require("../models/Brand");
const Category = require("../models/Category");

exports.createProductService = async (data) => {
  const product = await Product.create(data);
  const { _id: productId, brand, category } = product;

  //update Brand
  await Brand.updateOne({ _id: brand.id }, { $push: { products: productId } });

  //update category
  await Category.updateOne(
    { _id: category.id },
    { $push: { products: productId } }
  );

  return product;
};

exports.getProductsService = async (filters, queries) => {
  const products = await Product.find(filters)
    .skip(queries.skip)
    .limit(queries.limit)
    .select(queries.fields)
    .sort(queries.sortBy)
    .populate("category.id")
    .populate("supplier.id")
    .populate("brand.id");

  const total = await Product.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);
  return { total, page, products };
};

exports.getProductByIdService = async (id) => {
  const product = await Product.findById({ _id: id });
  return product;
};

exports.updateProductByIdService = async (productId, data) => {
  const result = await Product.updateOne(
    { _id: productId },
    { $set: data },
    {
      runValidators: true,
    }
  );

  return result;
};

exports.deleteProductByIdService = async (id) => {
  const result = await Product.deleteOne({ _id: id });
  return result;
};

/* exports.bulkUpdateProductService = async (data) => {
  // console.log(data.ids,data.data)
  // const result = await Product.updateMany({ _id: data.ids }, data.data, {
  //     runValidators: true
  // });

  const products = [];

  data.ids.forEach((product) => {
    products.push(Product.updateOne({ _id: product.id }, product.data));
  });

  const result = await Promise.all(products);
  console.log(result);

  return result;
}; */

/* exports.bulkDeleteProductService = async (ids) => {
  const result = await Product.deleteMany({ _id: ids });

  return result;
}; */
