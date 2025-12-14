// controllers/studentDatacontroller.js
import { db, usersTable } from '../src/index.js';  // ← Fixed path + .js extension
import { eq } from 'drizzle-orm';  // ← Added eq import

// Controller to get all student data
export const getAllStudents = async (req, res) => {
  try {
    const students = await db.select().from(usersTable);
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
      .from(usersTable)
      .where(eq(usersTable.id, studentId))
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
      .insert(usersTable)
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
      .update(usersTable)
      .set(req.body)
      .where(eq(usersTable.id, studentId))
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
      .delete(usersTable)
      .where(eq(usersTable.id, studentId))
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