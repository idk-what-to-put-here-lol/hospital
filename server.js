const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'database-1.clmee66q0sxg.us-east-1.rds.amazonaws.com',
  database: 'postgres',
  password: 'hospital',
  port: '5432',
});

console.log('Connected to PostgreSQL database successfully!');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Endpoint to register a patient
app.post('/register', async (req, res) => {
  const { name, dob, phoneNumber, email, gender, departmentId } = req.body;

  try {
    // Construct the name of the department-specific table based on departmentId
    const departmentTable = `${departmentId.toLowerCase()}_patients`; // Convert departmentId to lowercase

    // Insert data into the department-specific table
    await pool.query(
      `INSERT INTO ${departmentTable} (name, dob, phonenumber, email, gender) VALUES ($1, $2, $3, $4, $5)`,
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
    const { rows } = await pool.query('SELECT departmentid, name FROM departments');
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

    // Fetch patients from the department-specific table
    const { rows } = await pool.query(`SELECT * FROM ${departmentTable}`);
    res.json(rows);
  } catch (error) {
    console.error(`Error fetching patients for department ${departmentName}:`, error);
    res.status(500).json({ message: `Failed to fetch patients for department ${departmentName}` });
  }
});

// Endpoint to update patient status
app.put('/patients/:departmentName/:patientId/status', async (req, res) => {
  const { departmentName, patientId } = req.params;
  const { status } = req.body;

  try {
    // Construct the name of the department-specific table based on departmentName
    const departmentTable = `${departmentName.toLowerCase()}_patients`; // Convert departmentName to lowercase

    // Update the status of the patient in the department-specific table
    await pool.query(`UPDATE ${departmentTable} SET status = $1 WHERE patient_id = $2`, [status, patientId]);

    res.json({ message: 'Patient status updated successfully' });
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
