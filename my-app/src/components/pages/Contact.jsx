import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to server)
    console.log('Form Submitted:', formData);
    alert('Message sent successfully!')
  };

  return (
    <div className="contact-page">
        
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We're here to assist you. Please fill out the form below, and we’ll get back to you shortly.</p>
      </div>
      
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Your Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Your Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Your Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="How can we help you?"
            rows="6"
            required
          ></textarea>
        </div>
        
        <button type="submit" className="submit-btn">Send Message</button>
      </form>

      <div className="contact-info">
        <p>CampusKart, 123 University Avenue, City Center</p>
        <p>Phone: +1 234 567 890</p>
        <p>Email: support@campuskart.com</p>
      </div>
    </div>
  );
};

export default Contact;
