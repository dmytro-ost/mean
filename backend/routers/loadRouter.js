const express = require('express');

const router = new express.Router();
const ash = require('express-async-handler');

const {
  authMiddleware
} = require('./middlewares/authMiddleware');

const {
  getLoads,
  addLoad,
  activeLoad,
  iterateState,
  getLoadByID,
  updateLoadByID,
  deleteLoadByID,
  postLoadByID,
  shippingInfo
} = require('../controllers/loadController');

router.get('/loads', authMiddleware, ash(getLoads));
router.post('/loads', authMiddleware, ash(addLoad));
router.get('/loads/active', authMiddleware, ash(activeLoad));
router.patch('/loads/active/state', authMiddleware, ash(iterateState));
router.get('/loads/:loadId', authMiddleware, ash(getLoadByID));
router.put('/loads/:loadId', authMiddleware, ash(updateLoadByID));
router.delete('/loads/:loadId', authMiddleware, ash(deleteLoadByID));
router.post('/loads/:loadId/post', authMiddleware, ash(postLoadByID));
router.get('/loads/:loadId/shipping_info', authMiddleware, ash(shippingInfo));

module.exports = router;
