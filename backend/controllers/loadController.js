/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const joi = require('joi');
const {
  Types
} = require('mongoose');
const User = require('../models/userModel');
const Truck = require('../models/truckModel');
const Load = require('../models/loadModel');

const SIZE = {
  SPRINTER_MAX: {
    payload: 1700,
    width: 300,
    length: 250,
    height: 170
  },
  SMALL_MAX: {
    payload: 2500,
    width: 500,
    length: 250,
    height: 170
  },
  LARGE_MAX: {
    payload: 4000,
    width: 700,
    length: 350,
    height: 200
  }
};

const searchSchema = joi.object({
  status:
    joi.string().allow(null, '').empty(['', null]).default(null)
      .valid('NEW', 'POSTED', 'ASSIGNED', 'SHIPPED'),

  limit:
    // numbers from 0 to 50 allowed
    joi.string().allow('', null).empty(['', null]).default('10')
      .pattern(/^(?:[0-9]|[1-4][0-9]|50)$/mi),

  offset:
    joi.string().allow('', null).empty(['', null]).default('0')
      .pattern(/^\d*$/mi)
});

const addLoadSchema = joi.object({
  name:
    joi.string().allow(null, '').empty(['', null])
      .default('Name not specified'),

  payload:
    joi.number().integer().min(0).default(0),

  pickup_address:
    joi.string().allow(null, '').empty(['', null])
      .default('Pickup address not specified'),

  delivery_address:
    joi.string().allow(null, '').empty(['', null])
      .default('Delivery address not specified'),

  dimensions:
    joi.object({
      width:
        joi.number().integer().min(0).default(0),

      length:
        joi.number().integer().min(0).default(0),

      height:
        joi.number().integer().min(0).default(0)
    }).allow(null, '').default({
      width: 0,
      length: 0,
      height: 0
    })
});

const getLoads = async (req, res) => {
  try {
    let {
      status,
      limit,
      offset
    } = joi.attempt(req.query, searchSchema);

    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);

    const currentUser = await User.findOne({
      _id: req.user._id
    });

    if (!currentUser) {
      return res.status(400).json({
        message: 'User not found!'
      });
    }

    if (currentUser.role === 'SHIPPER') {
      const query = {};

      query.created_by = currentUser._id;

      if (status) {
        query.status = status;
      }
      // status ? query.status = status : null;

      const loads = await Load.find(query).skip(offset).limit(limit);

      return res.json({
        loads
      });
    }

    // DRIVER
    const query = {};

    query.assigned_to = currentUser._id;

    if (status) {
      query.status = status;
    }
    // status ? query.status = status : null;

    const loads = await Load.find(query).skip(offset).limit(limit);

    return res.json({
      loads
    });
  }
  catch (error) {
    return res.status(400).json({
      message: `Bad request. Check input fields. ${error}`
    });
  }
};

const addLoad = async (req, res) => {
  try {
    const {
      name,
      payload,
      pickup_address,
      delivery_address,
      dimensions
    } = joi.attempt(req.body, addLoadSchema);

    const currentUser = await User.findOne({
      _id: req.user._id
    });

    if (!currentUser) {
      return res.status(400).json({
        message: 'User not found!'
      });
    }

    if (currentUser.role !== 'SHIPPER') {
      return res.status(400).json({
        message: 'You have no right to do this'
      });
    }

    const newLoad = new Load({
      name,
      payload,
      pickup_address,
      delivery_address,
      dimensions,
      created_by: req.user._id,
      created_date: Date.now(),
      status: 'NEW'
    });

    await newLoad.save();

    return res.json({
      message: 'Load created successfully'
    });
  }
  catch (error) {
    return res.status(400).json({
      message: `Bad request. Check input fields. ${error}`
    });
  }
};

const activeLoad = async (req, res) => {
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

  const load = await Load.findOne({
    status: 'ASSIGNED',
    assigned_to: req.user._id
  });

  if (!load) {
    return res.status(400).json({
      message: 'Load not found'
    });
  }

  return res.json({
    load
  });
};

const iterateState = async (req, res) => {
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

  const load = await Load.findOne({
    status: 'ASSIGNED',
    assigned_to: req.user._id
  });

  if (!load) {
    return res.status(400).json({
      message: 'Load not found'
    });
  }

  if (load.assigned_to !== req.user._id) {
    return res.status(400).json({
      message: 'You have no right to do this'
    });
  }

  const _enumArray = load.schema.path('state').enumValues;
  let curIndex = _enumArray.findIndex((str) => str === load.state);

  curIndex = curIndex < _enumArray.length - 1 ? curIndex += 1 : _enumArray.length - 1;

  await Load.findOneAndUpdate({
    _id: load._id
  }, {
    state: _enumArray[curIndex],
    status: curIndex === _enumArray.length - 1 ? 'SHIPPED' : 'ASSIGNED',
    $push:
    {
      logs:
      {
        message: `Load state changed to '${_enumArray[curIndex]}'`
      }
    }
  });

  // reset Truck to IS on SHIPPED status
  if (curIndex === _enumArray.length - 1) {
    await Truck.findOneAndUpdate({
      assigned_to: load.assigned_to,
      status: 'OL'
    }, {
      status: 'IS'
    });
  }

  return res.json({
    message: `Load state changed to '${_enumArray[curIndex]}'`
  });
};

const getLoadByID = async (req, res) => {
  const {
    loadId
  } = req.params;

  const currentUser = await User.findOne({
    _id: req.user._id
  });

  if (!currentUser) {
    return res.status(400).json({
      message: 'User not found!'
    });
  }

  if (!Types.ObjectId.isValid(loadId)) {
    return res.status(400).json({
      message: 'Invalid Load ID'
    });
  }

  const load = await Load.findById(loadId);

  if (!load) {
    return res.status(400).json({
      message: 'Load not found'
    });
  }

  if (currentUser.role === 'SHIPPER') {
    if (load.created_by !== req.user._id) {
      return res.status(400).json({
        message: 'You have no right to do this'
      });
    }

    return res.json({
      load
    });
  }
  if (load.assigned_to !== req.user._id) {
    return res.status(400).json({
      message: 'You have no right to do this'
    });
  }

  return res.json({
    load
  });
};

const updateLoadByID = async (req, res) => {
  try {
    const {
      loadId
    } = req.params;

    const {
      name,
      payload,
      pickup_address,
      delivery_address,
      dimensions
    } = joi.attempt(req.body, addLoadSchema);

    const currentUser = await User.findOne({
      _id: req.user._id
    });

    if (!currentUser) {
      return res.status(400).json({
        message: 'User not found!'
      });
    }

    if (currentUser.role !== 'SHIPPER') {
      return res.status(400).json({
        message: 'You have no right to do this'
      });
    }

    if (!Types.ObjectId.isValid(loadId)) {
      return res.status(400).json({
        message: 'Invalid Load ID'
      });
    }

    const load = await Load.findById(loadId);

    if (!load) {
      return res.status(400).json({
        message: 'Load not found'
      });
    }

    if (load.created_by !== req.user._id) {
      return res.status(400).json({
        message: 'You have no right to do this'
      });
    }

    if (load.status !== 'NEW') {
      return res.status(400).json({
        message: 'Load is already in progress'
      });
    }

    if (name) {
      await Load.findOneAndUpdate({
        _id: load._id
      }, {
        name
      });
    }

    if (payload) {
      await Load.findOneAndUpdate({
        _id: load._id
      }, {
        payload
      });
    }

    if (pickup_address) {
      await Load.findOneAndUpdate({
        _id: load._id
      }, {
        pickup_address
      });
    }

    if (delivery_address) {
      await Load.findOneAndUpdate({
        _id: load._id
      }, {
        delivery_address
      });
    }

    if (dimensions) {
      await Load.findOneAndUpdate({
        _id: load._id
      }, {
        dimensions
      });
    }

    return res.json({
      message: 'Load updated successfully'
    });
  }
  catch (error) {
    return res.status(400).json({
      message: `Bad request. Check input fields. ${error}`
    });
  }
};

const deleteLoadByID = async (req, res) => {
  const {
    loadId
  } = req.params;

  const currentUser = await User.findOne({
    _id: req.user._id
  });

  if (!currentUser) {
    return res.status(400).json({
      message: 'User not found!'
    });
  }

  if (currentUser.role !== 'SHIPPER') {
    return res.status(400).json({
      message: 'You have no right to do this'
    });
  }

  if (!Types.ObjectId.isValid(loadId)) {
    return res.status(400).json({
      message: 'Invalid load ID'
    });
  }

  const load = await Load.findById(loadId);

  if (!load) {
    return res.status(400).json({
      message: 'Load not found'
    });
  }

  if (load.created_by.toString() !== req.user._id) {
    return res.status(400).json({
      message: 'You have no right to do this'
    });
  }

  if (load.status !== 'NEW') {
    return res.status(400).json({
      message: 'Load is already in progress'
    });
  }

  await Load.findByIdAndDelete(loadId);

  return res.json({
    message: 'Load deleted successfully'
  });
};

const postLoadByID = async (req, res) => {
  const {
    loadId
  } = req.params;

  const currentUser = await User.findOne({
    _id: req.user._id
  });

  if (!currentUser) {
    return res.status(400).json({
      message: 'User not found!'
    });
  }

  if (currentUser.role !== 'SHIPPER') {
    return res.status(400).json({
      message: 'You have no right to do this'
    });
  }

  if (!Types.ObjectId.isValid(loadId)) {
    return res.status(400).json({
      message: 'Invalid Load ID'
    });
  }

  const load = await Load.findById(loadId);

  if (!load) {
    return res.status(400).json({
      message: 'Load not found'
    });
  }

  if (load.status !== 'NEW') {
    return res.status(400).json({
      message: 'Load is already in progress'
    });
  }

  const trucks = await Truck.find({
    status: 'IS',
    assigned_to: {
      $ne: null // truck assigned to driver
    }
  });

  if (trucks.length === 0) {
    await Load.findByIdAndUpdate(load._id, {
      $push:
      {
        logs:
        {
          message: 'No trucks in service'
        }
      }
    });

    return res.json({
      message: 'No trucks in service',
      driver_found: false
    });
  }

  (async (trucks) => {
    for (const truck of trucks) {
      const truckType = `${truck.type.split(' ')[0]}_MAX`;

      if (load.payload <= SIZE[truckType].payload
        && load.dimensions.width <= SIZE[truckType].width
        && load.dimensions.length <= SIZE[truckType].length
        && load.dimensions.height <= SIZE[truckType].height) {
        await Truck.findByIdAndUpdate(truck._id, {
          status: 'OL'
        });

        await Load.findByIdAndUpdate(load._id, {
          status: 'ASSIGNED',
          state: 'En route to Pick Up',
          assigned_to: truck.assigned_to,
          $push:
          {
            logs: {
              $each: [
                {
                  message: `Load assigned to driver with id ${truck.assigned_to}`
                },
                {
                  message: 'Load state changed to \'En route to Pick Up\''
                }
              ]
            }
          }
        });

        return res.json({
          message: 'Load posted successfully',
          driver_found: true
        });
      }
    }

    await Load.findByIdAndUpdate(load._id, {
      $push:
      {
        logs:
        {
          message: 'There is no truck corresponding to the size of the load'
        }
      }
    });

    return res.json({
      message: 'There is no truck corresponding to the size of the load',
      driver_found: false
    });
  })(trucks);
};

const shippingInfo = async (req, res) => {
  const {
    loadId
  } = req.params;

  const currentUser = await User.findOne({
    _id: req.user._id
  });

  if (!currentUser) {
    return res.status(400).json({
      message: 'User not found!'
    });
  }

  if (currentUser.role !== 'SHIPPER') {
    return res.status(400).json({
      message: 'You have no right to do this'
    });
  }

  if (!Types.ObjectId.isValid(loadId)) {
    return res.status(400).json({
      message: 'Invalid load id'
    });
  }

  const load = await Load.findById(loadId);

  if (!load) {
    return res.status(400).json({
      message: 'Load not found'
    });
  }

  if (load.status === 'NEW') {
    return res.status(400).json({
      message: 'No shipment for this load'
    });
  }

  const truck = await Truck.findOne({
    assigned_to: load.assigned_to
  });

  if (!truck) {
    return res.status(400).json({
      message: 'Truck not found'
    });
  }

  return res.json({
    load, truck
  });
};

module.exports = {
  getLoads,
  addLoad,
  activeLoad,
  iterateState,
  getLoadByID,
  updateLoadByID,
  deleteLoadByID,
  postLoadByID,
  shippingInfo
};
