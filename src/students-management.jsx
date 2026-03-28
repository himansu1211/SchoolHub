import React, { useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { db } from './firebase-config';
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import StudentForm from './components/StudentForm';
import toast from 'react-hot-toast';
import { Users, UserPlus, GraduationCap, Phone, DollarSign, Edit3, Trash2 } from 'lucide-react';

const StudentsManagement = () => {
  const { userData, hasPermission } = useAuth();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [activeClass, setActiveClass] = useState('all');

  useEffect(() => {
    setIsReadOnly(!hasPermission('students'));
  }, [hasPermission]);

  // Fetch all students
  useEffect(() => {
    if (!userData?.schoolId) return;

    const q = query(
      collection(db, 'students'),
      where('schoolId', '==', userData.schoolId),
      orderBy('name')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allStudents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(allStudents);

      // Group by class
      const classGroups = {};
      allStudents.forEach(student => {
        const cls = student.classGrade || 'Unassigned';
        if (!classGroups[cls]) classGroups[cls] = [];
        classGroups[cls].push(student);
      });
      setClasses(classGroups);
      setLoading(false);
    });

    return unsubscribe;
  }, [userData?.schoolId]);

  const filteredStudents = activeClass === 'all' ? students : classes[activeClass] || [];

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student record?')) return;
    try {
      await deleteDoc(doc(db, 'students', id));
      toast.success('Student record deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const getFeeStatus = (feesPaid, annualFees = 50000) => {
    const percent = (feesPaid / annualFees) * 100;
    if (percent >= 100) return 'paid';
    if (percent >= 50) return 'partial';
    return 'pending';
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
        <div className="p-4 bg-gradient-to-br from-pastel-mint to-pastel-aqua rounded-3xl shadow-glow-lav animate-float">
            <Users className="w-8 h-8 text-pastel-lavender-dark drop-shadow-lg" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pastel-mint via-pastel-aqua to-pastel-lavender bg-clip-text text-transparent drop-shadow-lg mb-1 hover-float">Students Management 🎓 ✨</h1>
            <p className="text-lg text-slate-600 font-medium">
              {students.length} total students •{' '}
              <span className="font-bold bg-pastel-peach/40 px-3 py-1 rounded-2xl badge-glow">
                {Object.keys(classes).length} classes
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex bg-white border border-gray-200 rounded-2xl p-1">
            <button
              onClick={() => setActiveClass('all')}
              className={`px-5 py-2.5 rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-glow-mint hover:scale-105 ${activeClass === 'all' ? 'btn-primary shadow-glow-lg' : 'bg-pastel-lavender/40 text-slate-700 hover:bg-pastel-lavender hover:text-slate-900'}`}
            >
              All Classes ({students.length})
            </button>
            {Object.keys(classes).map(cls => (
              <button
                key={cls}
                onClick={() => setActiveClass(cls)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-glow-peach hover:scale-105 whitespace-nowrap ${activeClass === cls ? 'btn-primary shadow-glow-lg' : 'bg-pastel-rose/40 text-slate-700 hover:bg-pastel-rose hover:text-slate-900'}`}
              >
                {cls} ({classes[cls]?.length || 0})
              </button>
            ))}
          </div>

          {!isReadOnly && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center gap-2 shadow-glow-lg hover:shadow-glow-mint animate-float"
            >
              <UserPlus className="w-5 h-5 drop-shadow-sm" />
              Add Student ✨
            </button>
          )}
        </div>
      </div>

      {/* Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 p-4 flex items-center justify-center overflow-y-auto">
          <StudentForm
            student={selectedStudent}
            onSuccess={() => {
              setShowForm(false);
              setSelectedStudent(null);
            }}
            onCancel={() => {
              setShowForm(false);
              setSelectedStudent(null);
            }}
          />
        </div>
      )}

      {/* Students Table */}
      <div className="card-glow overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">{activeClass === 'all' ? 'No students yet' : `No students in ${activeClass}`}</h3>
            {!isReadOnly ? 'Add your first student above.' : 'Contact admin.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-48">Name / Roll</th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">Parent Contact</th>
                  <th className="px-6 py-5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">Fees</th>
                  <th className="px-6 py-5 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => {
                  const status = getFeeStatus(student.feesPaid);
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-5">
                        <div className="font-semibold text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.rollNumber}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800 text-sm font-semibold rounded-full">
                          {student.classGrade}
                        </span>
                      </td>
                      <td className="px-6 py-5 hidden md:table-cell">
                        <div className="text-sm">
                          <div className="font-medium">{student.parentName}</div>
                          <div className="text-gray-500">{student.parentPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          status === 'paid' ? 'bg-green-100 text-green-800' :
                          status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {status === 'paid' ? '✅ Paid' : status === 'partial' ? '⚠️ Partial' : '❌ Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {!isReadOnly ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedStudent(student);
                                setShowForm(true);
                              }}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                              title="Edit Student"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(student.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">View only</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isReadOnly && (
        <div className="mt-8 p-6 bg-amber-50 border-l-4 border-amber-400 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="text-2xl mt-0.5">👁️</div>
            <div>
              <h3 className="font-semibold text-amber-900">View Only Access</h3>
              <p className="text-amber-800 text-sm">You can browse student records but editing requires "students" permission from admin.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsManagement;

