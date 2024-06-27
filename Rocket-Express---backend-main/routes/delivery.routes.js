const express = require('express');
const router = express.Router();
const {
  createDelivery,
  updateDelivery,
  deleteDelivery,
  getDeliveriesByCompanyId,
  getAllDeliveries,
} = require('../controllers/delivery.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');

router.post('/', authenticateJWT, createDelivery);
router.get('/history', authenticateJWT, getDeliveriesByCompanyId);
router.get('/all', authenticateJWT, getAllDeliveries);
router.put('/:orderId', authenticateJWT, updateDelivery);
router.delete('/:orderId', authenticateJWT, deleteDelivery);

module.exports = router;
