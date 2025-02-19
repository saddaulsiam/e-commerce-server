const {
  getAllVendorsService,
  createVendorService,
  getVendorByEmailService,
  getVendorByNameService,
  deleteVendorsService,
} = require("../services/vendor.service");

exports.registerVendor = async (req, res) => {
  try {
    const { email, storeName } = req.body;

    const vendorNameExists = await getVendorByNameService(storeName);

    if (vendorNameExists) {
      return res.status(500).json({
        status: "fail",
        message: "This store name already exists",
      });
    }

    // const vendorEmailExists = await getVendorByEmailService(email);

    // if (vendorEmailExists) {
    //   return res.status(500).json({
    //     status: "fail",
    //     error: "This email already exists",
    //   });
    // }

    const vendor = await createVendorService(req.body);

    res.status(200).json({
      status: "success",
      message: "vendor created successfully!",
      data: vendor,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Couldn't create vendor",
      error: error.message,
    });
  }
};

exports.getMyVendor = async (req, res) => {
  try {
    const user = await getVendorByEmailService(req.params.email);

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

exports.deleteVendor = async (req, res) => {
  try {
    const id = req.params.id;

    await deleteVendorsService(id);

    res.status(200).json({
      status: "success",
      message: "vendor delete successfully!",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Couldn't delete vendor",
      error: error.message,
    });
  }
};

exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await getAllVendorsService();

    res.status(200).json({
      status: "success",
      data: vendors,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Can't get the vendors",
      error: error.message,
    });
  }
};

exports.getVendorByName = async (req, res) => {
  try {
    const vendor = await getVendorByNameService(req.params.name);

    res.status(200).json({
      status: "success",
      data: vendor,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Can't get the vendor",
      error: error.message,
    });
  }
};

export const VendorsController = {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  getVendorProducts,
};
