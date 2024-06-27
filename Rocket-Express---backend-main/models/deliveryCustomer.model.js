const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const deliveryDetailsSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
    },
    addressLine3: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contactNumber: Number,
    category: {
      type: String,
      enum: ['Other', 'Metal', 'Glass', 'Food', 'Jewelry'],
      required: true,
    },
    safetyMode: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },
    weight: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Card'],
      required: true,
    },
    expectedDueDate: {
      type: Date,
      required: true,
    },
    receivedDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Pending', 'On Hold', 'Delivered'],
      required: true,
      default: 'Pending',
    },
    createdBy: {
      type: ObjectId,
      ref: 'Company', // This references the Company collection
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeliveryDetails', deliveryDetailsSchema);
