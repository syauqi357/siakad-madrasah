// controllers/studentDatacontroller.js
import { db } from '../src/index.js';
import { studentTable } from '../src/db/schema/studentsdataTable.js';
import { eq } from 'drizzle-orm';

// Controller to get all student data
export const getAllStudents = async (req, res) => {
  try {

    // async to ORM using select function from studentTable (changed)
    const students = await db.select().from(studentTable);
    res.status(200).json(students);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error fetching student data', error: error.message });
  }
};

// controller to get student by id
export const getStudentById = async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    
    const student = await db
      .select()
      .from(studentTable)
      .where(eq(studentTable.id, studentId))
      .limit(1);

    if (!student || student.length === 0) {
      return res.status(404).json({ message: `No student found with id ${studentId}` });
    }

    res.status(200).json(student[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error fetching student data', error: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const newStudent = await db
      .insert(studentTable)
      .values(req.body)
      .returning();
    
    res.status(201).json(newStudent[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    
    const updated = await db
      .update(studentTable)
      .set(req.body)
      .where(eq(studentTable.id, studentId))
      .returning();
    
    if (!updated || updated.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(200).json(updated[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    
    const deleted = await db
      .delete(studentTable)
      .where(eq(studentTable.id, studentId))
      .returning();
    
    if (!deleted || deleted.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(200).json({ message: 'Student deleted successfully', student: deleted[0] });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
};