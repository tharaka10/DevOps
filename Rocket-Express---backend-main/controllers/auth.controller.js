const CompanyModel = require('../models/company.model');

exports.register = async (req, res) => {
  try {
    const company = new CompanyModel(req.body);
    await company.save();
    const token = company.generateAuthToken();
    res.status(201).header('x-auth-token', token).send({
      company: company,
      token,
      success: true,
      message: 'Company registered successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const company = await CompanyModel.findOne({ username });

    if (!company) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid username or password' });
    }

    const isMatch = await company.comparePassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid username or password' });
    }

    const token = company.generateAuthToken();
    res.status(200).header('x-auth-token', token).send({
      company: company,
      token,
      success: true,
      message: 'Logged in successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
