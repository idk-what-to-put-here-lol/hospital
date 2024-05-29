import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorInterface = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [patients, setPatients] = useState([]);
  const [currentPatientIndex, setCurrentPatientIndex] = useState(0);
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

  const fetchPatients = async (selectedDepartmentName) => {
    try {
      const response = await axios.get(`http://3.108.77.197:3005/patients/${encodeURIComponent(selectedDepartmentName)}`);
      setPatients(response.data);
      setCurrentPatientIndex(0);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setErrorMessage('Error fetching patients. Please try again later.');
    }
  };

  const handleDepartmentChange = async (event) => {
    const selectedDepartmentName = event.target.value;
    setSelectedDepartment(selectedDepartmentName);
    await fetchPatients(selectedDepartmentName);
  };

  const handleNextPatient = () => {
    setCurrentPatientIndex((prevIndex) => prevIndex + 1);
  };

  const handlePatientSelect = (index) => {
    setCurrentPatientIndex(index);
  };

  const handlePatientStatusChange = async () => {
    const patientId = patients[currentPatientIndex]?.patient_id;
    console.log('Patient ID:', patientId);

    if (!patientId) {
      console.error('Invalid patientId:', patientId);
      return;
    }

    try {
      await axios.put(`http://3.108.77.197:3005/patients/${encodeURIComponent(selectedDepartment)}/${patientId}/status`, { status: 'done' });
      setPatients((prevPatients) =>
        prevPatients.map((patient, index) =>
          index === currentPatientIndex ? { ...patient, status: 'done' } : patient
        )
      );
    } catch (error) {
      console.error('Error updating patient status:', error);
      setErrorMessage('Error updating patient status. Please try again later.');
    }
  };

  return (
    <div>
      <h1>Doctor Interface</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div>
        <label htmlFor="department">Select Department:</label>
        <select id="department" value={selectedDepartment} onChange={handleDepartmentChange}>
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.departmentid} value={department.name}>
              {department.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h2>Patient Information</h2>
        {patients.length > 0 ? (
          <div>
            <p>Name: {patients[currentPatientIndex].name}</p>
            <p>Date of Birth: {patients[currentPatientIndex].dob}</p>
            <p>Phone Number: {patients[currentPatientIndex].phonenumber}</p>
            <p>Email: {patients[currentPatientIndex].email}</p>
            <p>Gender: {patients[currentPatientIndex].gender}</p>
            <p>Status: {patients[currentPatientIndex].status}</p>
            <button onClick={handlePatientStatusChange}>
              Mark as Done
            </button>
            {currentPatientIndex < patients.length - 1 && (
              <button onClick={handleNextPatient}>Next Patient</button>
            )}
          </div>
        ) : (
          <p>No patients found for the selected department.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorInterface;
