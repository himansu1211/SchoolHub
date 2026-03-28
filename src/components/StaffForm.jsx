import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth-context';
import { db, auth } from '../firebase-config';
import { doc, setDoc, collection, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import toast from 'react-hot-toast';

const StaffForm = ({ staff = null, onSuccess, onCancel }) => {
  const { userData, schoolData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'teacher',
    category: 'Teaching',
    salary: '',
    status: 'active'
  });
  const [tempPassword, setTempPassword] = useState('');

  // Edit mode
  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || staff.displayName || '',
        email: staff.email || '',
        phone: staff.phone || '',
        role: staff.role || 'teacher',
        category: staff.category || 'Teaching',
        salary: staff.salary || '',
        status: staff.status || 'active'
      });
    }
  }, [staff]);

  const generateTempPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData.schoolId) {
      toast.error('No school registered');
      return;
    }

    setLoading(true);
    try {
      if (staff) {
        // Update existing staff (no auth change)
        const staffRef = doc(db, 'staff', staff.id);
        await updateDoc(staffRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
        toast.success('Staff updated successfully');
      } else {
        // Create new staff account
        const password = generateTempPassword();
        setTempPassword(password);

        // 1. Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, password);
        const newUser = userCredential.user;

        // 2. Create users doc
        await setDoc(doc(db, 'users', newUser.uid), {
          uid: newUser.uid,
          email: formData.email,
          displayName: formData.name,
          role: formData.role,
          schoolId: userData.schoolId,
          status: 'active',
          createdAt: serverTimestamp()
        });

        // 3. Create staff doc
        const staffId = await addDoc(collection(db, 'staff'), {
          userId: newUser.uid,
          schoolId: userData.schoolId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          category: formData.category,
          salary: parseFloat(formData.salary),
          status: formData.status,
          createdAt: serverTimestamp()
        }).then(ref => ref.id);

        // 4. Default permissions (none)
        await setDoc(doc(db, 'permissions', newUser.uid), {
          allowedModules: [],
          schoolId: userData.schoolId,
          updatedAt: serverTimestamp()
        });

        toast.success(`Staff "${formData.name}" created! Temp password: ${password}`);
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving staff:', error);
      toast.error(error.code === 'auth/email-already-in-use' ? 'Email already registered' : 'Failed to save staff');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-auto border-t-4 border-blue-400">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {staff ? 'Edit Staff Member' : 'Add New Staff'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="teacher@school.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="teacher">Teacher</option>
              <option value="staff">Management Staff</option>
              <option value="worker">Support Worker</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
              placeholder="Math Teacher"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Salary (₹)</label>
            <input
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
              placeholder="25000"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
              placeholder="9876543210"
            />
          </div>
        </div>

        {!staff && tempPassword && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-yellow-800">Temporary Password:</p>
            <code className="block mt-1 bg-yellow-100 px-3 py-1 rounded text-sm font-mono">{tempPassword}</code>
            <p className="text-xs text-yellow-700 mt-1">Share this securely with the staff member.</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-600 disabled:bg-blue-400 transition shadow-md"
          >
            {loading ? 'Saving...' : staff ? 'Update Staff' : 'Create Staff'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StaffForm;

