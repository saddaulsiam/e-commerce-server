const {
  getProductsService,
  createProductService,
  updateProductByIdService,
  bulkUpdateProductService,
  deleteProductByIdService,
  bulkDeleteProductService,
  getProductByIdService,
} = require("./product.service");

exports.createProduct = async (req, res, next) => {
  try {
    const result = await createProductService(req.body);

    res.status(200).json({
      status: "success",
      message: "Product created successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: "Product is not inserted ",
      error: error.message,
    });
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    let filters = { ...req.query };

    if (filters.search?.length) {
      filters = {
        $text: {
          $search: filters.search,
        },
      };
    }

    //sort , page , limit -> exclude
    const excludeFields = ["sort", "page", "limit"];
    excludeFields.forEach((field) => delete filters[field]);

    //gt ,lt ,gte .lte
    let filtersString = JSON.stringify(filters);
    filtersString = filtersString.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    filters = JSON.parse(filtersString);

    const queries = {};

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queries.sortBy = sortBy;
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queries.fields = fields;
    }

    if (req.query.page) {
      const { page = 1, limit = 10 } = req.query;

      const skip = (page - 1) * parseInt(limit);
      queries.skip = skip;
      queries.limit = parseInt(limit);
    }

    const products = await getProductsService(filters, queries);

    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the data",
      error: error.message,
    });
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getProductByIdService(id);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Couldn't get the product",
      error: error.message,
    });
  }
};

exports.updateProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await updateProductByIdService(id, req.body);

    res.status(200).json({
      status: "success",
      message: "Successfully updated the product",
      result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Couldn't update the product",
      error: error.message,
    });
  }
};

exports.deleteProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await deleteProductByIdService(id);

    if (!result.deletedCount) {
      return res.status(400).json({
        status: "fail",
        error: "Couldn't delete the product",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Successfully deleted the product",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Couldn't delete the product",
      error: error.message,
    });
  }
};

/* exports.bulkUpdateProduct = async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await bulkUpdateProductService(req.body);

    res.status(200).json({
      stauts: "success",
      message: "Successfully updated the product",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Couldn't update the product",
      error: error.message,
    });
  }
}; */

/* exports.bulkDeleteProduct = async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await bulkDeleteProductService(req.body.ids);

    res.status(200).json({
      stauts: "success",
      message: "Successfully deleted the given products",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Couldn't delete the given products",
      error: error.message,
    });
  }
}; */

/* exports.fileUpload = async (req, res) => {
  try {
    res.status(200).json(req.files);
  } catch (error) {}
}; */
