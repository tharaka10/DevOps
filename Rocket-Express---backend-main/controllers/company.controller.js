const CompanyModel = require('../models/company.model');

exports.getCompanyDetails = async (req, res) => {
  try {
    const companyId = req.user.id;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is not found',
      });
    }

    const company = await CompanyModel.findById(companyId).select('-password');
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found with the provided ID',
      });
    }

    res.status(200).send({
      company: company,
      success: true,
      message: 'Company data fetched',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCompanyDetails = async (req, res) => {
  try {
    const { password, companyName, address, contactNumber } = req.body;
    const companyId = req.user.id;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is not found',
      });
    }

    const company = await CompanyModel.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: 'Company not found' });
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password should be at least 6 characters long',
        });
      }
      company.password = password; // the password will be hashed by the pre-save hook in the schema.
    }
    if (companyName) {
      company.companyName = companyName;
    }
    if (address) {
      company.address = address;
    }
    if (contactNumber) {
      company.contactNumber = contactNumber;
    }

    await company.save();

    // Exclude sensitive data like hashed password before sending it back
    const updatedCompany = company.toObject();
    delete updatedCompany.password;

    res.status(200).json({
      success: true,
      message: 'Company details updated successfully',
      company: updatedCompany, // Send the updated company details with the response
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
