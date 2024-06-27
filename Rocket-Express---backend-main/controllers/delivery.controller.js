const DeliveryDetail = require('../models/deliveryCustomer.model');

exports.createDelivery = async (req, res) => {
  try {
    const companyId = req.user.id;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is not found',
      });
    }

    const deliveryData = {
      ...req.body,
      createdBy: companyId,
    };
    const delivery = new DeliveryDetail(deliveryData);
    await delivery.save();
    res.status(201).json({
      success: true,
      message: 'Delivery details added successfully',
      data: delivery,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch deliveries for a specific company using the company's ID.
exports.getDeliveriesByCompanyId = async (req, res) => {
  try {
    const companyId = req.user.id;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is not found',
      });
    }
    const deliveries = await DeliveryDetail.find({
      createdBy: companyId,
    }).populate('createdBy', 'companyName address contactNumber username -_id');

    res.status(200).json({
      success: true,
      message: 'Delivery details fetched successfully',
      data: deliveries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllDeliveries = async (req, res) => {
  try {
    const userRole = req.user.userRole;
    if (!userRole || userRole !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    const deliveries = await DeliveryDetail.find().populate(
      'createdBy',
      'companyName address contactNumber username -_id'
    );

    res.status(200).json({
      success: true,
      message: 'All delivery details fetched successfully',
      data: deliveries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is not found',
      });
    }

    const updatedDelivery = await DeliveryDetail.findOneAndUpdate(
      { _id: orderId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedDelivery) {
      return res
        .status(404)
        .json({ success: false, message: 'Delivery detail not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Delivery details updated successfully',
      data: updatedDelivery,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is not found',
      });
    }
    const deletedDelivery = await DeliveryDetail.findByIdAndDelete(orderId);

    if (!deletedDelivery) {
      return res
        .status(404)
        .json({ success: false, message: 'Delivery detail not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Delivery details deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
