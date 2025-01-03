"use client"; // For Next.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './module.css'; // Assuming you have CSS module

export default function Home() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Fetch available slots for the selected date
  const fetchAvailableSlots = async (selectedDate) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/available/${selectedDate}`);
      setAvailableTimes(response.data.availableTimes);
    } catch (error) {
      setMessage('Error fetching availability');
      console.error('Error fetching availability:', error);
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    fetchAvailableSlots(selectedDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`, {
        date,
        time,
        guests,
        name,
        contact,
      });

      setMessage('Booking created successfully');
      setBookingDetails(response.data.newBooking);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Error creating booking');
      }
      console.error('Error creating booking:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Restaurant Booking</h1>
      <form onSubmit={handleSubmit}>
        <input type="date" value={date} onChange={handleDateChange} required />
        {date && (
          <select value={time} onChange={(e) => setTime(e.target.value)} required>
            <option value="">Select time</option>
            {availableTimes.map((availableTime, index) => (
              <option key={index} value={availableTime}>{availableTime}</option>
            ))}
          </select>
        )}
        <input type="number" value={guests} onChange={(e) => setGuests(e.target.value)} placeholder="Guests" required />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
        <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contact" required />
        <button type="submit">Book Now</button>
      </form>
      {message && <p>{message}</p>}
      {bookingDetails && (
        <div>
          <h2>Booking Summary</h2>
          <p>Date: {bookingDetails.date}</p>
          <p>Time: {bookingDetails.time}</p>
          <p>Guests: {bookingDetails.guests}</p>
          <p>Name: {bookingDetails.name}</p>
          <p>Contact: {bookingDetails.contact}</p>
        </div>
      )}
    </div>
  );
}
