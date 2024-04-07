import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import necessary components from react-router-dom

import PatientRegistration from './PatientRegistration'; // Assuming PatientRegistration.js is in the same directory
import DoctorLogin from './DoctorLogin'; // Assuming DoctorLogin.js is in the same directory

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Welcome to the Doctor's Appointment System</h1>
        <div className="button-container">
          <Link to="/register">
            <button>Patient Registration</button>
          </Link>
          <Link to="/doctor">
            <button>Doctor Login</button>
          </Link>
        </div>

        <Routes>
          <Route path="/register" element={<PatientRegistration />} />
          <Route path="/doctor" element={<DoctorLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
