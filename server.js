const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'hospital.cdi6ia4aw6r1.ap-south-1.rds.amazonaws.com',
  database: 'postgres',
  password: 'Hospital',
  port: '5432',
});

console.log('Connected to PostgreSQL database successfully!');

const app = express();

app.use(cors({ origin: 'http://13.200.151.52:3000' }));
app.use(express.json());

// Endpoint to register a patient
app.post('/register', async (req, res) => {
  const { name, dob, phoneNumber, email, gender, departmentId } = req.body;

  try {
    // Construct the name of the department-specific table based on departmentId
    const departmentTable = `${departmentId.toLowerCase()}_patients`; // Convert departmentId to lowercase
    console.log('my control came here'); // Check if it can form table name

    // Insert data into the department-specific table
    await pool.query(
      `INSERT INTO ${departmentTable} (name, dob, phone_number, email, gender, status) VALUES ($1, $2, $3, $4, $5, DEFAULT)`,
      [name, dob, phoneNumber, email, gender]
    );

    res.status(201).json({ message: 'Patient registered successfully' });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ message: 'Failed to register patient' });
  }
});

// Endpoint to fetch departments
app.get('/departments', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT department_id, name FROM departments');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
});

// Endpoint to fetch patients by department name
app.get('/patients/:departmentName', async (req, res) => {
  console.log('my control came here');
  const departmentName = req.params.departmentName;
  console.log('department selected as' + req.params.departmentName);

  try {
    // Construct the name of the department-specific table based on departmentName
    const departmentTable = `${departmentName.toLowerCase()}_patients`; // Convert departmentName to lowercase

    // Fetch patients with status 'waiting' from the department-specific table
    const { rows } = await pool.query(`SELECT * FROM ${departmentTable} WHERE status = 'waiting'`);
    res.json(rows);
  } catch (error) {
    console.error(`Error fetching patients for department ${departmentName}:`, error);
    res.status(500).json({ message: `Failed to fetch patients for department ${departmentName}` });
  }
});

// Endpoint to update patient status and move to the next patient
app.put('/patients/:departmentName/:patientId/status', async (req, res) => {
  const { departmentName, patientId } = req.params;

  try {
    // Construct the name of the department-specific table based on departmentName
    const departmentTable = `${departmentName.toLowerCase()}_patients`; // Convert departmentName to lowercase

    // Update the status of the patient to 'done' in the department-specific table
    await pool.query(`UPDATE ${departmentTable} SET status = 'done' WHERE patient_id = $1`, [patientId]);

    res.json({ message: 'Patient status updated to done successfully' });
  } catch (error) {
    console.error(`Error updating status for patient ${patientId} in department ${departmentName}:`, error);
    res.status(500).json({
      message: `Failed to update patient status for patient ${patientId} in department ${departmentName}`,
    });
  }
});

app.listen(3005, () => {
  console.log('Server listening on port 3005!');
});
