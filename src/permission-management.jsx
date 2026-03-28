import React, { useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { db } from './firebase-config';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';

const availableModules = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'staff', label: 'Staff Management', icon: '👥' },
  { id: 'students', label: 'Students Management', icon: '🎓' },
  { id: 'attendance', label: 'Attendance', icon: '📅' },
  { id: 'marks', label: 'Marks & Grades', icon: '📝' },
  { id: 'library', label: 'Library', icon: '📚' },
  { id: 'fees', label: 'Fees Management', icon: '💰' },
  { id: 'finances', label: 'Finances', icon: '📈' }
];

export function PermissionManagementPage({ localStaff = [] }) {
  const { userData } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffPermissions, setStaffPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch registered staff for this school from Firestore
  useEffect(() => {
    if (!userData?.schoolId) return;

    const q = query(
      collection(db, "users"), 
      where("schoolId", "==", userData.schoolId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const registeredStaff = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Merge registered staff with local staff from App.jsx
      // This ensures even teachers who haven't logged in yet are visible
      const mergedList = [...registeredStaff];
      
      localStaff.forEach(ls => {
        const isAlreadyInList = registeredStaff.some(rs => rs.email === ls.email);
        if (!isAlreadyInList) {
          mergedList.push({
            id: `local_${ls.id}`,
            email: ls.email,
            displayName: ls.name,
            role: 'teacher', // Default to teacher for local staff
            isLocal: true
          });
        }
      });

      setStaffList(mergedList);
      setLoading(false);
    });

    return unsubscribe;
  }, [userData?.schoolId, localStaff]);

  // Fetch permissions for selected staff
  useEffect(() => {
    if (!selectedStaff) return;

    // Permissions are keyed by email for teachers to ensure it works across multiple logins
    const unsubscribe = onSnapshot(doc(db, "permissions", selectedStaff.email), (doc) => {
      if (doc.exists()) {
        setStaffPermissions(doc.data().allowedModules || []);
      } else {
        setStaffPermissions([]);
      }
    });

    return unsubscribe;
  }, [selectedStaff]);

  const togglePermission = async (moduleId) => {
    if (!selectedStaff) return;

    let newPermissions = [...staffPermissions];
    if (newPermissions.includes(moduleId)) {
      newPermissions = newPermissions.filter(id => id !== moduleId);
    } else {
      newPermissions.push(moduleId);
    }

    try {
      // Keying permissions by email to ensure it works for the specific teacher
      const permDocRef = doc(db, "permissions", selectedStaff.email);
      await setDoc(permDocRef, {
        allowedModules: newPermissions,
        schoolId: userData.schoolId,
        email: selectedStaff.email,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Error updating permissions", error);
    }
  };

  const applyPreset = async (type) => {
    if (!selectedStaff) return;

    let newPermissions = [];
    if (type === 'all') {
      newPermissions = availableModules.map(m => m.id);
    } else if (type === 'teaching') {
      newPermissions = ['attendance', 'marks', 'library'];
    } else if (type === 'none') {
      newPermissions = [];
    }

    try {
      // Keying permissions by email
      const permDocRef = doc(db, "permissions", selectedStaff.email);
      await setDoc(permDocRef, {
        allowedModules: newPermissions,
        schoolId: userData.schoolId,
        email: selectedStaff.email,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Error applying preset", error);
    }
  };

  return (
    <div className="space-y-8 font-inter">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-jakarta font-bold text-slate-800">Permissions 🔐</h1>
          <p className="text-slate-500 mt-2">Manage module access for teachers and staff.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
        {/* Staff List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Staff Members</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading staff...</div>
            ) : staffList.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No staff members found.</div>
            ) : (
              staffList.map(staff => (
                <button
                  key={staff.id}
                  onClick={() => setSelectedStaff(staff)}
                  className={`w-full p-6 text-left transition-all hover:bg-sh-neutral-50 flex items-center gap-4 ${
                    selectedStaff?.id === staff.id 
                    ? 'bg-sh-primary-light border-r-4 border-sh-primary' 
                    : ''
                  }`}
                >
                  <div className="w-12 h-12 bg-sh-accent-light rounded-xl flex items-center justify-center font-bold text-sh-accent">
                    {(staff.displayName || staff.name || staff.email).split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-sh-neutral-800">{staff.displayName || staff.name || staff.email}</p>
                    <p className="text-sm text-sh-neutral-500">{staff.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Permissions Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {selectedStaff ? (
            <div className="space-y-8">
              <div className="flex justify-between items-end border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-2xl font-jakarta font-bold text-slate-800">{selectedStaff.displayName || selectedStaff.name || selectedStaff.email}</h2>
                  <p className="text-slate-500">Configure access for this user</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => applyPreset('none')} className="px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded-lg text-sm font-bold text-white transition-all shadow-sm">None</button>
                  <button onClick={() => applyPreset('teaching')} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-bold transition-all shadow-sm">Teaching</button>
                  <button onClick={() => applyPreset('all')} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold transition-all shadow-sm">All Access</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableModules.map(module => {
                  const isAllowed = staffPermissions.includes(module.id);
                  return (
                    <button
                      key={module.id}
                      onClick={() => togglePermission(module.id)}
                      className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between group min-h-20 ${
                        isAllowed 
                        ? 'border-sh-success bg-sh-success-light shadow-sm shadow-sh-success/10' 
                        : 'border-sh-neutral-100 hover:border-sh-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{module.icon}</span>
                        <span className={`font-bold ${isAllowed ? 'text-sh-neutral-800' : 'text-sh-neutral-400'}`}>{module.label}</span>
                      </div>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isAllowed 
                        ? 'bg-sh-success text-white' 
                        : 'bg-sh-neutral-100 text-sh-neutral-300 group-hover:bg-sh-neutral-200'
                      }`}>
                        {isAllowed ? '✓' : ''}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                <span className="text-4xl text-slate-200">👥</span>
              </div>
              <h3 className="text-xl font-bold text-slate-400 mb-2">No Staff Selected</h3>
              <p className="text-slate-300 max-w-xs">Select a staff member from the left to manage their permissions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
