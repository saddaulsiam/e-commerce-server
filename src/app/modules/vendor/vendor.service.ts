const Vendor = require("../../models/Vendor");

exports.createVendorService = async (data) => {
  const vendor = await Vendor.create(data);

  return vendor;
};

exports.deleteVendorsService = async (id) => {
  return await Vendor.findByIdAndDelete({ _id: id });
};

exports.getVendorByEmailService = async (email) => {
  const vendor = await Vendor.findOne({ email });
  return vendor;
};

exports.getVendorByNameService = async (storeName) => {
  const vendor = await Vendor.findOne({ storeName });
  return vendor;
};

exports.getVendorByIdService = async (storeId) => {
  const vendor = await Vendor.findOne({ _id: storeId });
  return vendor;
};

exports.getAllVendorsService = async () => {
  const vendors = await Vendor.find({});
  return vendors;
};
