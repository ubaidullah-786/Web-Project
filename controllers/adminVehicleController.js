const Vehicle = require('../models/vehicleModel');
const fs = require('fs');
const path = require('path');

exports.listVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 }).lean();
    res.render('adminVehicles', { vehicles });
  } catch (err) {
    req.flash('danger', 'Error loading vehicles');
    res.redirect('/admin');
  }
};

exports.renderAddForm = (req, res) => {
  res.render('adminVehicleForm', {
    vehicle: null,
    action: 'add',
    title: 'Add New Vehicle',
  });
};

exports.addVehicle = async (req, res) => {
  try {
    const { name, brand, price, type } = req.body;

    // Validation
    if (!name || !brand || !price || !type) {
      req.flash('danger', 'All fields are required');
      return res.redirect('/admin/vehicles/addForm');
    }

    if (!req.file) {
      req.flash('danger', 'Vehicle image is required');
      return res.redirect('/admin/vehicles/addForm');
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const vehicle = new Vehicle({
      name: name.trim(),
      brand: brand.trim(),
      price: parseFloat(price),
      type,
      image: imagePath,
    });

    await vehicle.save();
    req.flash('success', 'Vehicle added successfully');
    res.redirect('/admin/vehicles');
  } catch (err) {
    if (req.file) {
      // Delete uploaded file if vehicle creation fails
      fs.unlink(
        path.join('public', 'images', 'vehicles', req.file.filename),
        () => {}
      );
    }
    req.flash('danger', 'Error adding vehicle: ' + err.message);
    res.redirect('/admin/vehicles/addForm');
  }
};

exports.renderEditForm = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).lean();
    if (!vehicle) {
      req.flash('danger', 'Vehicle not found');
      return res.redirect('/admin/vehicles');
    }
    res.render('adminVehicleForm', {
      vehicle,
      action: 'edit',
      title: 'Edit Vehicle',
    });
  } catch (err) {
    req.flash('danger', 'Error loading vehicle');
    res.redirect('/admin/vehicles');
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const { name, brand, price, type } = req.body;
    const vehicleId = req.params.id;

    // Validation
    if (!name || !brand || !price || !type) {
      req.flash('danger', 'All fields are required');
      return res.redirect(`/admin/vehicles/edit/${vehicleId}`);
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      req.flash('danger', 'Vehicle not found');
      return res.redirect('/admin/vehicles');
    }

    // Update vehicle data
    vehicle.name = name.trim();
    vehicle.brand = brand.trim();
    vehicle.price = parseFloat(price);
    vehicle.type = type;

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (vehicle.image) {
        const oldImagePath = path.join('public', vehicle.image);
        fs.unlink(oldImagePath, () => {});
      }
      vehicle.image = `/images/vehicles/${req.file.filename}`;
    }

    await vehicle.save();
    req.flash('success', 'Vehicle updated successfully');
    res.redirect('/admin/vehicles');
  } catch (err) {
    if (req.file) {
      // Delete uploaded file if update fails
      fs.unlink(
        path.join('public', 'images', 'vehicles', req.file.filename),
        () => {}
      );
    }
    req.flash('danger', 'Error updating vehicle: ' + err.message);
    res.redirect(`/admin/vehicles/edit/${req.params.id}`);
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      req.flash('danger', 'Vehicle not found');
      return res.redirect('/admin/vehicles');
    }

    // Delete associated image
    if (vehicle.image) {
      const imagePath = path.join('public', vehicle.image);
      fs.unlink(imagePath, () => {});
    }

    await Vehicle.findByIdAndDelete(req.params.id);
    req.flash('success', 'Vehicle deleted successfully');
    res.redirect('/admin/vehicles');
  } catch (err) {
    req.flash('danger', 'Error deleting vehicle');
    res.redirect('/admin/vehicles');
  }
};
