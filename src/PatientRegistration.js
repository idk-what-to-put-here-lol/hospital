import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    phoneNumber: '',
    email: '',
    gender: '',
    departmentId: '',
  });

  const [departments, setDepartments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://3.108.77.197:3005/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setErrorMessage('Error fetching departments. Please try again later.');
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.departmentId) {
      setErrorMessage('Please select a department.');
      return;
    }

    try {
      const response = await axios.post('http://3.108.77.197:3005/register', formData);

      toast.success('Patient registered successfully!');

      setFormData({
        name: '',
        dob: '',
        phoneNumber: '',
        email: '',
        gender: '',
        departmentId: '',
      });

      console.log('Patient registered successfully:', response.data);
    } catch (error) {
      console.error('Error registering patient:', error);
      setErrorMessage('Failed to register patient. Please try again.');
      toast.error('Failed to register patient. Please try again later.'); // Display error message
    }
  };

  return (
    <div>
      <h1>Patient Registration</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Full Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="dob">Date of Birth:</label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="gender">Gender:</label>
        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="" defaultValue>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <br />
       <label htmlFor="departmentId">Department:</label>
        <select
          id="departmentId"
          name="departmentId"
          value={formData.departmentId || ''}
          onChange={handleChange}
          required
        >
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.departmentId} value={department.departmentId}>
              {department.name}
            </option>
          ))}
        </select>
        <br />
        <button type="submit">Register Patient</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default PatientRegistration;
