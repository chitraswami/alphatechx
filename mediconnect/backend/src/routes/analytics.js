/**
 * Analytics Routes
 */
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Conversation = require('../models/Conversation');
const Patient = require('../models/Patient');

// GET /api/analytics/dashboard?hospitalId=xxx
router.get('/dashboard', async (req, res) => {
  try {
    const hospitalId = req.query.hospitalId;
    const filter = hospitalId ? { hospitalId } : {};
    const today = new Date().toISOString().split('T')[0];

    const [
      totalAppointments,
      todaysAppointments,
      totalCalls,
      totalPatients,
      appointmentsByStatus,
      recentCalls,
    ] = await Promise.all([
      Appointment.countDocuments(filter),
      Appointment.countDocuments({ ...filter, appointmentDate: today }),
      Conversation.countDocuments(filter),
      Patient.countDocuments(filter),
      Appointment.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Conversation.find(filter).sort({ startTime: -1 }).limit(10),
    ]);

    // Calculate booking success rate
    const completedCalls = await Conversation.countDocuments({ ...filter, status: 'completed' });
    const bookedViaBot = await Appointment.countDocuments({ ...filter, bookedVia: 'voice_bot' });
    const successRate = completedCalls > 0 ? ((bookedViaBot / completedCalls) * 100).toFixed(1) : 0;

    // Revenue estimate (₹50 per call)
    const estimatedRevenue = totalCalls * 50;

    res.json({
      success: true,
      dashboard: {
        totalAppointments,
        todaysAppointments,
        totalCalls,
        totalPatients,
        successRate: `${successRate}%`,
        estimatedRevenue: `₹${estimatedRevenue}`,
        appointmentsByStatus: appointmentsByStatus.reduce((acc, s) => {
          acc[s._id] = s.count;
          return acc;
        }, {}),
        recentCalls: recentCalls.map((c) => ({
          callSid: c.callSid,
          caller: c.callerNumber,
          hospital: c.hospitalName,
          status: c.status,
          duration: c.duration,
          time: c.startTime,
          turnsCount: c.turns?.length || 0,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/analytics/calls-per-day?days=30&hospitalId=xxx
router.get('/calls-per-day', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const hospitalId = req.query.hospitalId;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const match = { startTime: { $gte: fromDate } };
    if (hospitalId) match.hospitalId = hospitalId;

    const callsPerDay = await Conversation.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } },
          calls: { $sum: 1 },
          avgDuration: { $avg: '$duration' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, callsPerDay });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
