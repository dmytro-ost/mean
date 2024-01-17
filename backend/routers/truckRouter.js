const express = require('express');

const router = new express.Router();
const ash = require('express-async-handler');

const {
  authMiddleware
} = require('./middlewares/authMiddleware');

const {
  getTrucks,
  addTruck,
  truckDetailsByID,
  updateTruckByID,
  deleteTruckByID,
  assignTruckByID
} = require('../controllers/truckController');

router.get('/trucks', authMiddleware, ash(getTrucks));
router.post('/trucks', authMiddleware, ash(addTruck));
router.get('/trucks/:truckId', authMiddleware, ash(truckDetailsByID));
router.put('/trucks/:truckId', authMiddleware, ash(updateTruckByID));
router.delete('/trucks/:truckId', authMiddleware, ash(deleteTruckByID));
router.post('/trucks/:truckId/assign', authMiddleware, ash(assignTruckByID));

module.exports = router;
