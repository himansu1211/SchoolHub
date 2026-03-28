import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth-context';
import { db } from '../firebase-config';
import { doc, setDoc, updateDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { User, Users, GraduationCap, Phone, MapPin, DollarSign, Edit } from 'lucide-react';

const StudentForm = ({ student = null, onSuccess, onCancel }) => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    classGrade: '',
    rollNumber: '',
    parentName: '',
    parentPhone: '',
    address: '',
    feesPaid: 0,
    status: 'active'
  });

  // Edit mode
  useEffect(() => {
    if (student) {
      setFormData(student);
    }
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData.schoolId) return toast.error('No school registered');

    setLoading(true);
    try {
      if (student) {
        // Update
        const studentRef = doc(db, 'students', student.id);
        await updateDoc(studentRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
        toast.success('Student updated');
      } else {
        // Create
        await addDoc(collection(db, 'students'), {
          schoolId: userData.schoolId,
          ...formData,
          createdAt: serverTimestamp()
        });
        toast.success('Student added');
      }
      onSuccess();
    } catch (error) {
      toast.error('Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full mx-auto border-t-4 border-emerald-400">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <GraduationCap className="w-7 h-7 text-emerald-600" />
        {student ? 'Edit Student' : 'Add New Student'}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
          <input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400"
            placeholder="Riya Sharma"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Class/Grade</label>
          <select
            required
            value={formData.classGrade}
            onChange={(e) => setFormData({ ...formData, classGrade: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">Select Class</option>
            <option value="KG">KG</option>
            <option value="1">Class 1</option>
            <option value="2">Class 2</option>
            <option value="3">Class 3</option>
            <option value="4">Class 4</option>
            <option value="5">Class 5</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Roll Number</label>
          <input
            required
            type="text"
            value={formData.rollNumber}
            onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400"
            placeholder="A-15"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Student Email (optional)</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400"
            placeholder="riya@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Student Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400"
            placeholder="9876543210"
          />
        </div>

        {/* Parent Info */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            Parent/Guardian Details
          </label>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Parent Name</label>
          <input
            required
            value={formData.parentName}
            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400"
            placeholder="Mr. Anil Sharma"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Parent Phone</label>
          <input
            required
            type="tel"
            value={formData.parentPhone}
            onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400"
            placeholder="9876543211"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-2">Address</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows="2"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 resize-vertical"
            placeholder="123, Park Street, Mumbai, MH 400001"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Fees Paid (₹)</label>
          <input
            type="number"
            value={formData.feesPaid}
            onChange={(e) => setFormData({ ...formData, feesPaid: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400"
            placeholder="45000"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400"
          >
            <option value="active">Active</option>
            <option value="transferred">Transferred Out</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="md:col-span-2 pt-6 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-500 text-white font-semibold py-3 px-8 rounded-xl hover:bg-emerald-600 disabled:bg-emerald-400 shadow-lg flex items-center justify-center gap-2"
          >
            <Edit className="w-5 h-5" />
            {loading ? 'Saving...' : student ? 'Update Student' : 'Add Student'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentForm;

