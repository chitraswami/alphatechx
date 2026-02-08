/**
 * Doctor Routes
 */
const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// GET /api/doctors - List doctors (optionally filter by hospital)
router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.hospitalId) filter.hospitalId = req.query.hospitalId;
    if (req.query.department) filter.department = new RegExp(req.query.department, 'i');

    const doctors = await Doctor.find(filter).populate('hospitalId', 'name');
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/doctors/:id - Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('hospitalId', 'name');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/doctors - Add a doctor
router.post('/', async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json({ success: true, doctor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/doctors/:id - Update doctor
router.put('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, doctor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/doctors/:id/slots?date=2026-02-09 - Get available slots
router.get('/:id/slots', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const date = req.query.date || new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    if (!doctor.availableDays.map(d => d.toLowerCase()).includes(dayOfWeek)) {
      return res.json({ success: true, available: false, message: `Doctor not available on ${dayOfWeek}`, slots: [] });
    }

    // Get booked appointments for this date
    const Appointment = require('../models/Appointment');
    const bookedAppointments = await Appointment.find({
      doctorId: doctor._id,
      appointmentDate: date,
      status: { $in: ['confirmed', 'pending'] },
    });

    const bookedTimes = bookedAppointments.map(a => a.appointmentTime);
    const availableSlots = doctor.availableSlots.filter(slot => !bookedTimes.includes(slot));

    res.json({ success: true, available: true, date, slots: availableSlots, bookedCount: bookedTimes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
