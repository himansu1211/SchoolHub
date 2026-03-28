// Demo Data Seeder for SchoolHub
// Run from admin dashboard to populate test data

import { db } from '../firebase-config';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export const seedDemoData = async (userData) => {
  if (!userData.schoolId) {
    toast.error('School not registered');
    return;
  }

  try {
    // 1. Add demo staff (if none exist)
    const staffCount = await (await fetchStaffCount(userData.schoolId)).docs.length;
    if (staffCount === 0) {
      const demoStaff = [
        {
          name: 'Priya Patel',
          email: `priya-${userData.schoolId}@demo.school`,
          phone: '9876543210',
          role: 'teacher',
          category: 'Mathematics',
          salary: 35000,
          status: 'active'
        },
        {
          name: 'Rahul Sharma',
          email: `rahul-${userData.schoolId}@demo.school`,
          phone: '9876543211',
          role: 'teacher',
          category: 'Science',
          salary: 32000,
          status: 'active'
        },
        {
          name: 'Anita Desai',
          email: `anita-${userData.schoolId}@demo.school`,
          phone: '9876543212',
          role: 'staff',
          category: 'Admin',
          salary: 28000,
          status: 'active'
        }
      ];

      for (const staffData of demoStaff) {
        const tempPass = Math.random().toString(36).slice(-8).toUpperCase();
        // Note: In production, use createUserWithEmailAndPassword here
        await addDoc(collection(db, 'staff'), {
          schoolId: userData.schoolId,
          userId: `demo-${uuidv4().slice(0,8)}`,
          ...staffData,
          createdAt: serverTimestamp()
        });
      }
      toast.success('3 demo staff added!');
    }

    // 2. Add demo students
    const studentCount = await (await fetchStudentCount(userData.schoolId)).docs.length;
    if (studentCount === 0) {
      const demoStudents = [
        { name: 'Aarav Singh', classGrade: '5', rollNumber: 'A-01', parentName: 'Mr. Vikram Singh', parentPhone: '98765 43210', feesPaid: 45000, status: 'active' },
        { name: 'Diya Patel', classGrade: '5', rollNumber: 'A-02', parentName: 'Mrs. Meera Patel', parentPhone: '98765 43211', feesPaid: 25000, status: 'active' },
        { name: 'Kian Gupta', classGrade: '8', rollNumber: 'B-15', parentName: 'Mr. Raj Gupta', parentPhone: '98765 43212', feesPaid: 50000, status: 'active' },
        { name: 'Saanvi Reddy', classGrade: '8', rollNumber: 'B-16', parentName: 'Mrs. Lakshmi Reddy', parentPhone: '98765 43213', feesPaid: 0, status: 'active' },
        { name: 'Vihaan Joshi', classGrade: '10', rollNumber: 'C-05', parentName: 'Mr. Anil Joshi', parentPhone: '98765 43214', feesPaid: 48000, status: 'active' }
      ];

      for (const student of demoStudents) {
        await addDoc(collection(db, 'students'), {
          schoolId: userData.schoolId,
          ...student,
          createdAt: serverTimestamp()
        });
      }
      toast.success('5 demo students added!');
    }

    // 3. Add demo books to library
    await addDoc(collection(db, 'books'), {
      schoolId: userData.schoolId,
      title: 'Mathematics for Class 8',
      author: 'NCERT',
      isbn: '978-817450',
      quantity: 25,
      issued: 3,
      category: 'Textbook'
    });
    await addDoc(collection(db, 'books'), {
      schoolId: userData.schoolId,
      title: 'Science Adventures',
      author: 'R.K. Bansal',
      isbn: '978-123456',
      quantity: 15,
      issued: 8,
      category: 'Reference'
    });
    toast.success('Demo library books added!');

    toast.success('🎓 Demo data seeded! Check Staff/Students/Library modules.');
  } catch (error) {
    console.error('Demo seed error:', error);
    toast.error('Failed to seed data');
  }
};

// Helper queries (replace with actual)
const fetchStaffCount = (schoolId) => query(collection(db, 'staff'), where('schoolId', '==', schoolId));
const fetchStudentCount = (schoolId) => query(collection(db, 'students'), where('schoolId', '==', schoolId));

export default seedDemoData;

