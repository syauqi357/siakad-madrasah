import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Since we are in an ES module, __dirname is not available. We need to construct it.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct the path to the JSON file and read it
const studentDataPath = path.join(__dirname, '../data/student.json');
const studentData = JSON.parse(fs.readFileSync(studentDataPath, 'utf-8'));

// Controller to get all student data
export const getAllStudents = (req, res) => {
  try {
    // For now, we're just returning the static JSON data.
    // Later, this is where you would add your database logic.
    res.status(200).json(studentData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student data', error });
  }
};
