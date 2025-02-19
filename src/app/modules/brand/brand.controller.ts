const {
  createBrandService,
  getBrandsService,
  getBrandByIdService,
  updateBrandService,
  getBrandByNameService,
} = require("./brand.service");

exports.createBrand = async (req, res) => {
  try {
    const brandNameExists = await getBrandByNameService(req.body.name);

    if (brandNameExists) {
      return res.status(500).json({
        status: "fail",
        message: "This store name already exists",
      });
    }
    const result = await createBrandService(req.body);

    res.status(200).json({
      status: "success",
      message: "Successfully created the brand",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error,
    });
  }
};

exports.getBrands = async (req, res, next) => {
  try {
    const brands = await getBrandsService(req.body);

    res.status(200).json({
      status: "success",
      data: brands,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      error: "Couldn't get the brands",
    });
  }
};

exports.getBrandById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const brand = await getBrandByIdService(id);

    if (!brand) {
      return res.status(400).json({
        status: "fail",
        error: "Couldn't find a brand with this id",
      });
    }

    res.status(200).json({
      status: "success",
      data: brand,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      error: "Couldn't get the brands",
    });
  }
};

exports.updateBrand = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await updateBrandService(id, req.body);

    console.log(result);

    if (!result.nModified) {
      return res.status(400).json({
        status: "fail",
        error: "Couldn't update the brand with this id",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Successfully updated the brand",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      error: "Couldn't update the brand",
    });
  }
};

export const BrandsController = {
  createBrand,
  getBrands,
  getBrandById,
  updateBrandById,
  deleteBrandById,
};
