const joi = require('joi');
const {
  Types
} = require('mongoose');
const User = require('../models/userModel');
const Truck = require('../models/truckModel');

const createTruckSchema = joi.object({
  type:
    joi.string().valid('SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT')
      .required()
});

const getTrucks = async (req, res) => {
  const currentUser = await User.findOne({
    _id: req.user._id
  });

  if (!currentUser) {
    return res.status(400).json({
      message: 'User not found!'
    });
  }

  if (currentUser.role != 'DRIVER') {
    return res.status(400).json({
      message: 'You have no right to do this'
    });
  }

  const trucks = await Truck.find({
    created_by: req.user._id
  });

  return res.status(200).json({
    trucks
  });
};

const addTruck = async (req, res) => {
  try {
    const {
      type
    } = joi.attempt(req.body, createTruckSchema);

    const currentUser = await User.findOne({
      _id: req.user._id
    });

    if (!currentUser) {
      return res.status(400).json({
        message: 'User not found!'
      });
    }

    if (currentUser.role !== 'DRIVER') {
      return res.status(400).json({
        message: 'You have no right to do this'
      });
    }

    const newTruck = new Truck({
      type,
      status: 'IS',
      created_by: req.user._id,
      created_date: Date.now()
    });

    await newTruck.save();

    return res.status(200).json({
      message: 'Truck created successfully'
    });
  }
  catch (error) {
    return res.status(400).json({
      message: `Bad request. Check input fields. ${error}`
    });
  }
};

const truckDetailsByID = async (req, res) => {
  const {
    truckId
  } = req.params;

  const currentUser = await User.findOne({
    _id: req.user._id
  });

  if (!currentUser) {
    return res.status(400).json({
      message: 'User not found!'
    });
  }

  if (currentUser.role !== 'DRIVER') {
    return res.status(400).json({
      message: 'You have no right to do this'
    });
  }

  if (!Types.ObjectId.isValid(truckId)) {
    return res.status(400).json({
      message: 'Invalid Truck ID'
    });
  }

  const truck = await Truck.findById(truckId);

  if (!truck) {
    return res.status(400).json({
      message: 'Truck not found'
    });
  }

  if (truck.created_by != req.user._id) {
    return res.status(400).json({
      message: 'You have no right to do this'
    });
  }

  return res.status(200).json({
    truck
  });
};

const updateTruckByID = async (req, res) => {
  try {
    const {
      truckId
    } = req.params;

    const {
      type
    } = joi.attempt(req.body, createTruckSchema);

    const currentUser = await User.findOne({
      _id: req.user._id
    });

    if (!currentUser) {
      return res.status(400).json({
        message: 'User not found!'
      });
    }

    if (currentUser.role !== 'DRIVER') {
      return res.status(400).json({
        message: 'You have no right to do this'
      });
    }

    if (!Types.ObjectId.isValid(truckId)) {
      return res.status(400).json({
        message: 'Invalid Truck ID'
      });
    }

    const truck = await Truck.findById(truckId);

    if (!truck) {
      return res.status(400).json({
        message: 'Truck not found'
      });
    }

    if (truck.created_by != req.user._id) {
      return res.status(400).json({
        message: 'You have no right to do this'
      });
    }

    if (truck.status === 'OL') { // on load and assigned to this driver
      return res.status(400).json({
        message: 'Truck is on load'
      });
    }

    await Truck.findByIdAndUpdate(truckId, {
      type
    });

    return res.status(200).json({
      message: 'Truck details changed successfully'
    });
  }
  catch (error) {
    return res.status(400).json({
      message: `Bad request. Check input fields. ${error}`
    });
  }
};

const deleteTruckByID = async (req, res) => {
  const {
    truckId
  } = req.params;

  const currentUser = await User.findOne({
    _id: req.user._id
  });

  if (!currentUser) {
    return res.status(400).json({
      message: 'User not found!'
    });
  }

  if (currentUser.role !== 'DRIVER') {
    return res.status(400).json({
      message: 'You have no right to do this'
    });
  }

  if (!Types.ObjectId.isValid(truckId)) {
    return res.status(400).json({
      message: 'Invalid Truck ID'
    });
  }

  const truck = await Truck.findById(truckId);

  if (!truck) {
    return res.status(400).json({
      message: 'Truck not found'
    });
  }

  if (truck.created_by != req.user._id) {
    return res.status(400).json({
      message: 'You have no right to do this'
    });
  }

  if (truck.status === 'OL') {
    return res.status(400).json({
      message: 'Truck is on load'
    });
  }

  if (truck.assigned_to !== null) {
    return res.status(400).json({
      message: 'Can not remove Truck assigned to Driver'
    });
  }

  await Truck.findByIdAndDelete(truckId);

  return res.status(200).json({
    message: 'Truck deleted successfully'
  });
};

const assignTruckByID = async (req, res) => {
  const {
    truckId
  } = req.params;

  const currentUser = await User.findOne({
    _id: req.user._id
  });

  if (!currentUser) {
    return res.status(400).json({
      message: 'User not found!'
    });
  }

  if (currentUser.role !== 'DRIVER') {
    return res.status(400).json({
      message: 'You have no right to do this'
    });
  }

  const isDriverHasTruckLoaded = await Truck.find({
    created_by: req.user._id, status: 'OL'
  });

  if (isDriverHasTruckLoaded.length > 0) {
    return res.status(400).json({
      message: 'Driver has a load'
    });
  }

  if (!Types.ObjectId.isValid(truckId)) {
    return res.status(400).json({
      message: 'Invalid Truck ID'
    });
  }

  const truck = await Truck.findById(truckId);

  if (!truck) {
    return res.status(400).json({
      message: 'Truck not found'
    });
  }

  if (truck.created_by != req.user._id) {
    return res.status(400).json({
      message: 'You have no right to do this'
    });
  }

  if (truck.status === 'OL') {
    return res.status(400).json({
      message: 'Truck is on load'
    });
  }

  await Truck.updateMany({
    created_by: req.user._id,
    status: 'IS'
  }, {
    assigned_to: null
  });

  await Truck.findByIdAndUpdate(truckId, {
    assigned_to: req.user._id
  });

  return res.status(200).json({
    message: 'Truck assigned successfully'
  });
};

module.exports = {
  getTrucks,
  addTruck,
  truckDetailsByID,
  updateTruckByID,
  deleteTruckByID,
  assignTruckByID
};
