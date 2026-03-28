import React, { useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { db } from './firebase-config';
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import StaffForm from './components/StaffForm';
import toast from 'react-hot-toast';
import { Users, UserPlus, Phone, DollarSign, Edit, Trash2 } from 'lucide-react';

const StaffManagement = () => {
  const { userData, hasPermission } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Check read-only mode
  useEffect(() => {
    setIsReadOnly(!hasPermission('staff'));
  }, [hasPermission]);

  // Fetch staff for school
  useEffect(() => {
    if (!userData?.schoolId) return;

    const q = query(
      collection(db, 'staff'),
      where('schoolId', '==', userData.schoolId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const staff = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStaffList(staff);
      setLoading(false);
    });

    return unsubscribe;
  }, [userData?.schoolId]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff member? This action cannot be undone.')) return;

    try {
      await deleteDoc(doc(db, 'staff', id));
      toast.success('Staff deleted');
    } catch (error) {
      toast.error('Failed to delete staff');
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedStaff(null);
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 spinner-pastel border-4"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-pastel-pink to-pastel-peach rounded-2xl shadow-glow-mint animate-float">
            <Users className="w-8 h-8 text-pastel-lavender-dark drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pastel-pink via-pastel-peach to-pastel-mint bg-clip-text text-transparent drop-shadow-lg mb-1 hover-float">Staff Management 👥 ✨</h1>
            <p className="text-lg text-slate-600 font-medium">
              {staffList.length} active staff members •{' '}
              <span className="font-bold bg-pastel-mint/30 px-2 py-1 rounded-xl badge-glow">
                Total monthly salary: ₹{staffList.reduce((sum, s) => sum + (s.salary || 0), 0).toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        {!isReadOnly && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2 shadow-glow-lg hover:shadow-glow animate-float"
          >
            <UserPlus className="w-5 h-5" />
            Add New Staff ✨
          </button>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <StaffForm
            staff={selectedStaff}
            onSuccess={closeForm}
            onCancel={closeForm}
          />
        </div>
      )}

      {/* Staff Table */}
      <div className="card-glow overflow-hidden">
        {staffList.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No staff members yet</h3>
            {!isReadOnly ? (
              <p>Add your first staff member using the button above.</p>
            ) : (
              <p>Contact admin for access.</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="bg-gradient-to-r from-pastel-rose/30 to-pastel-aqua/30">
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider bg-pastel-lavender/20">Name</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider bg-pastel-peach/20">Role/Category</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider bg-pastel-mint/20 hidden md:table-cell">Salary</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider bg-pastel-pink/20 hidden lg:table-cell">Phone</th>
                  <th className="px-6 py-5 text-right text-xs font-bold text-slate-700 uppercase tracking-wider bg-pastel-rose/20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staffList.map((member) => (
                  <tr key={member.id} className="hover:bg-gradient-to-r from-pastel-rose/20 to-pastel-mint/20 transition-all hover:shadow-inner border-l-4 border-pastel-peach/50">
                    <td className="px-6 py-5">
                      <div className="font-bold text-2xl text-slate-800 drop-shadow-sm hover-float">{member.name}</div>
                      <div className="text-sm text-slate-500 bg-slate-100/50 px-3 py-1 rounded-lg">{member.email}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="badge-pastel bg-gradient-to-r from-pastel-lavender to-pastel-aqua text-slate-800 shadow-glow-lav">
                        {member.role}
                      </span>
                      <div className="text-sm text-gray-600 mt-1">{member.category}</div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-pastel-peach-dark drop-shadow-sm" />
                        ₹{member.salary?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden lg:table-cell">
                      {member.phone || '—'}
                    </td>
                    <td className="px-6 py-5 text-right">
                      {!isReadOnly ? (
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => {
                              setSelectedStaff(member);
                              setShowForm(true);
                            }}
                            className="p-2.5 text-pastel-mint-dark hover:bg-pastel-mint/30 rounded-2xl shadow-md hover:shadow-glow-mint hover:scale-110 transition-all duration-200 badge-glow"
                            title="Edit"
                          >
                            <Edit className="w-4.5 h-4.5 drop-shadow-sm" />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="p-2.5 text-pastel-rose-dark hover:bg-pastel-rose/30 rounded-2xl shadow-md hover:shadow-glow-peach hover:scale-110 transition-all duration-200"
                            title="Delete"
                          >
                            <Trash2 className="w-4.5 h-4.5 drop-shadow-sm" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">View only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isReadOnly && (
        <div className="mt-8 p-8 card-glow max-w-2xl mx-auto text-center border-l-8 border-pastel-lavender/50 bg-gradient-to-r from-pastel-lavender/10 to-pastel-rose/10">
          <div className="text-5xl mb-6 animate-bounce">👁️</div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-pastel-peach to-pastel-pink bg-clip-text text-transparent mb-4">View Only Mode ✨</h3>
          <p className="text-xl text-slate-700 font-medium">You can view staff data but cannot make changes. <span className="font-bold text-pastel-mint-dark">Contact admin</span> to request edit permissions!</p>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;

