const express = require('express');
const Booking = require('../models/bookingModel');
const router = express.Router();

// Get available slots
router.get('/available/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const bookings = await Booking.find({ date });

    // Logic to filter available slots
    const availableTimes = ["12:00", "14:00", "16:00", "18:00", "20:00"]; // Example
    const bookedTimes = bookings.map(booking => booking.time);

    const availableSlots = availableTimes.filter(time => !bookedTimes.includes(time));

    res.json({ availableTimes: availableSlots });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available times' });
  }
});

// Create a booking
router.post('/', async (req, res) => {
  const { date, time, guests, name, contact } = req.body;

  // Check if the booking already exists for that time on the selected date
  const existingBooking = await Booking.findOne({ date, time });
  if (existingBooking) {
    return res.status(400).json({ message: 'Booking already exists for this time' });
  }

  const newBooking = new Booking({ date, time, guests, name, contact });

  try {
    await newBooking.save();
    res.status(201).json({ newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking' });
  }
});

module.exports = router;
