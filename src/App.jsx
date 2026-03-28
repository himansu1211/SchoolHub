import React, { useState } from 'react';
import { ChevronDown, Plus, Edit2, Trash2, Mail, DollarSign, Users, BookOpen, TrendingUp, X, Save, Clock, Check, AlertCircle, BookMarked, Eye, EyeOff, GraduationCap, MessageSquare, Send, UserCheck } from 'lucide-react';
import DashboardStats from './components/Dashboard.jsx';
import { PermissionManagementPage } from './permission-management';

const SchoolManagementSystem = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Attendance state
  const [staffAttendance, setStaffAttendance] = useState({});
  const [studentAttendance, setStudentAttendance] = useState({});
  
  // Data state - updated colors to match new theme
  const [staffCategories, setStaffCategories] = useState([
    { id: 1, name: 'Teachers', color: '#d1fae5' }, // emerald-100
    { id: 2, name: 'Management Staff', color: '#fef3c7' }, // amber-100
    { id: 3, name: 'Workers', color: '#cffafe' } // cyan-100
  ]);
  
  const [staffMembers, setStaffMembers] = useState([
    { id: 1, categoryId: 1, name: 'Mr. John Smith', email: 'john@school.com', phone: '9876543210', salary: 50000, lastPaid: '2024-03-01' },
    { id: 2, categoryId: 1, name: 'Ms. Sarah Johnson', email: 'sarah@school.com', phone: '9876543211', salary: 48000, lastPaid: '2024-03-01' }
  ]);

  const [classes, setClasses] = useState([
    { id: 1, name: 'Class 10-A', strength: 45, monthlyFee: 5000 },
    { id: 2, name: 'Class 10-B', strength: 42, monthlyFee: 5000 },
    { id: 3, name: 'Class 11-A', strength: 38, monthlyFee: 6500 }
  ]);

  const [students, setStudents] = useState([
    { id: 1, classId: 1, name: 'Aaryan Singh', parentName: 'Mr. Rajesh Singh', phone1: '9876543210', phone2: '9876543211', email: 'rajesh@email.com', feePaid: false },
    { id: 2, classId: 1, name: 'Priya Sharma', parentName: 'Mrs. Anjali Sharma', phone1: '9876543212', phone2: '9876543213', email: 'anjali@email.com', feePaid: true },
    { id: 3, classId: 2, name: 'Rohit Patel', parentName: 'Mr. Vikram Patel', phone1: '9876543214', phone2: '9876543215', email: 'vikram@email.com', feePaid: false },
    { id: 4, classId: 3, name: 'Ananya Iyer', parentName: 'Mr. S. Iyer', phone1: '9876543216', phone2: '9876543217', email: 'iyer@email.com', feePaid: true }
  ]);

  // Modal states
  const [modals, setModals] = useState({
    addStaff: false,
    editStaff: null,
    addClass: false,
    editClass: null,
    sendEmail: false,
    salaryPayment: null,
    payAllSalaries: false,
    studentForm: false,
    editStudent: null,
    viewStudent: null,
    addMarks: false,
    addBook: false,
    issueBook: false,
    editBook: null,
    composeMessage: false
  });

  const [formData, setFormData] = useState({
    staff: { name: '', email: '', phone: '', salary: '', categoryId: 1 },
    class: { name: '', monthlyFee: '' },
    student: { name: '', parentName: '', phone1: '', phone2: '', email: '', classId: 1 },
    marks: { studentId: '', subjectId: '', obtainedMarks: '', classId: 1 },
    book: { title: '', author: '', isbn: '', totalCopies: '', category: 'Fiction' },
    issueBook: { bookId: '', issuedTo: '', issuedToType: 'student', dueDate: '' },
    message: { recipient: 'all', subject: '', content: '' }
  });

  // Calculate financial metrics
  const calculateFinancials = () => {
    const totalFeeCollected = students
      .filter(s => s.feePaid)
      .reduce((sum, s) => {
        const cls = classes.find(c => c.id === s.classId);
        return sum + (cls?.monthlyFee || 0);
      }, 0);

    const totalSalaryExpense = staffMembers.reduce((sum, s) => sum + s.salary, 0);
    
    const totalFeeDue = students
      .filter(s => !s.feePaid)
      .reduce((sum, s) => {
        const cls = classes.find(c => c.id === s.classId);
        return sum + (cls?.monthlyFee || 0);
      }, 0);

    return {
      totalFeeCollected,
      totalSalaryExpense,
      totalFeeDue,
      balance: totalFeeCollected - totalSalaryExpense,
      expectedRevenue: totalFeeCollected + totalFeeDue
    };
  };

  const financials = calculateFinancials();

  // Messages state
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Admin', recipient: 'Everyone', subject: 'Welcome to SchoolHub', content: 'We are excited to launch our new portal!', date: '2024-03-25', status: 'sent' },
    { id: 2, sender: 'Admin', recipient: 'Mr. John Smith', subject: 'Class Schedule Update', content: 'Please check the new schedule for Class 10A.', date: '2024-03-26', status: 'sent' }
  ]);

  // Library Management state
  const [books, setBooks] = useState([
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', totalCopies: 5, availableCopies: 3, category: 'Fiction' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084', totalCopies: 4, availableCopies: 2, category: 'Fiction' },
    { id: 3, title: 'Biology Textbook', author: 'Various', isbn: '978-0134743775', totalCopies: 10, availableCopies: 6, category: 'Educational' }
  ]);

  const [issuedBooks, setIssuedBooks] = useState([
    { id: 1, bookId: 1, issuedTo: 'Aaryan Singh', issuedToType: 'student', issuedDate: '2024-03-15', dueDate: '2024-03-29', returnedDate: null }
  ]);

  // Staff operations (simplified)
  const handleAddStaff = () => {
    const newStaff = {
      id: Date.now(),
      ...formData.staff,
      categoryId: parseInt(formData.staff.categoryId),
      salary: parseFloat(formData.staff.salary),
      lastPaid: null
    };
    setStaffMembers([...staffMembers, newStaff]);
    setFormData({ ...formData, staff: { name: '', email: '', phone: '', salary: '', categoryId: 1 } });
    setModals({ ...modals, addStaff: false });
  };

  const handleDeleteStaff = (id) => {
    setStaffMembers(staffMembers.filter(s => s.id !== id));
  };

  const handlePaySalary = (staffId) => {
    setStaffMembers(staffMembers.map(s => 
      s.id === staffId ? { ...s, lastPaid: new Date().toISOString().split('T')[0] } : s
    ));
    setModals({ ...modals, salaryPayment: null });
  };

  const handlePayAllSalaries = () => {
    setStaffMembers(staffMembers.map(s => ({
      ...s,
      lastPaid: new Date().toISOString().split('T')[0]
    })));
    setModals({ ...modals, payAllSalaries: false });
  };

  // Class operations
  const handleAddClass = () => {
    if (modals.editClass) {
      setClasses(classes.map(c => c.id === modals.editClass.id ? { ...c, name: formData.class.name, monthlyFee: parseFloat(formData.class.monthlyFee) } : c));
      setModals({ ...modals, editClass: null, addClass: false });
    } else {
      const newClass = {
        id: Date.now(),
        name: formData.class.name,
        monthlyFee: parseFloat(formData.class.monthlyFee) || 0,
        strength: 0
      };
      setClasses([...classes, newClass]);
      setModals({ ...modals, addClass: false });
    }
    setFormData({ ...formData, class: { name: '', monthlyFee: '' } });
  };

  const handleEditClass = (cls) => {
    setFormData({ ...formData, class: { name: cls.name, monthlyFee: cls.monthlyFee.toString() } });
    setModals({ ...modals, editClass: cls, addClass: true });
  };

  const handleDeleteClass = (id) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  // Student operations
  const handleAddStudent = () => {
    const newStudent = {
      id: Date.now(),
      ...formData.student,
      classId: parseInt(formData.student.classId),
      feePaid: false
    };
    setStudents([...students, newStudent]);
    setFormData({ ...formData, student: { name: '', parentName: '', phone1: '', phone2: '', email: '', classId: 1 } });
    setModals({ ...modals, studentForm: false });
  };

  const handleAddBook = () => {
    if (modals.editBook) {
      setBooks(books.map(b => b.id === modals.editBook.id ? { ...b, ...formData.book, totalCopies: parseInt(formData.book.totalCopies), availableCopies: parseInt(formData.book.totalCopies) } : b));
      setModals({ ...modals, editBook: null, addBook: false });
    } else {
      const newBook = {
        id: Date.now(),
        ...formData.book,
        totalCopies: parseInt(formData.book.totalCopies),
        availableCopies: parseInt(formData.book.totalCopies)
      };
      setBooks([...books, newBook]);
      setModals({ ...modals, addBook: false });
    }
    setFormData({ ...formData, book: { title: '', author: '', isbn: '', totalCopies: '', category: 'Fiction' } });
  };

  const handleIssueBook = () => {
    const newIssue = {
      id: Date.now(),
      ...formData.issueBook,
      issuedDate: new Date().toISOString().split('T')[0],
      returnedDate: null
    };
    setIssuedBooks([...issuedBooks, newIssue]);
    setBooks(books.map(b => b.id === parseInt(formData.issueBook.bookId) ? { ...b, availableCopies: b.availableCopies - 1 } : b));
    setModals({ ...modals, issueBook: false });
    setFormData({ ...formData, issueBook: { bookId: '', issuedTo: '', issuedToType: 'student', dueDate: '' } });
  };

  const handleSendMessage = () => {
    const recipientName = formData.message.recipient === 'all' 
      ? 'Everyone' 
      : staffMembers.find(s => s.email === formData.message.recipient)?.name || formData.message.recipient;

    const newMessage = {
      id: Date.now(),
      sender: 'Admin',
      recipient: recipientName,
      subject: formData.message.subject,
      content: formData.message.content,
      date: new Date().toISOString().split('T')[0],
      status: 'sent'
    };

    setMessages([newMessage, ...messages]);
    // Simulate email sending
    console.log(`Sending email to ${formData.message.recipient}: ${formData.message.subject}`);
    
    setFormData({ ...formData, message: { recipient: 'all', subject: '', content: '' } });
    setModals({ ...modals, composeMessage: false });
  };

  const handleToggleFeeStatus = (studentId) => {
    setStudents(students.map(s => 
      s.id === studentId ? { ...s, feePaid: !s.feePaid } : s
    ));
  };

  // Attendance operations
  const markStaffAttendance = (staffId, status) => {
    const key = `${selectedDate}_${staffId}`;
    setStaffAttendance({
      ...staffAttendance,
      [key]: status
    });
  };

  const getStaffAttendanceStatus = (staffId) => {
    const key = `${selectedDate}_${staffId}`;
    return staffAttendance[key];
  };

  const markStudentAttendance = (studentId, status) => {
    const key = `${selectedDate}_${studentId}`;
    setStudentAttendance({
      ...studentAttendance,
      [key]: status
    });
  };

  const getStudentAttendanceStatus = (studentId) => {
    const key = `${selectedDate}_${studentId}`;
    return studentAttendance[key];
  };

  const getMonthlyAttendanceStats = (id, type) => {
    const currentMonth = selectedDate.substring(0, 7);
    let presentCount = 0;
    let total = 0;
    Object.keys(type === 'staff' ? staffAttendance : studentAttendance).forEach(key => {
      if (key.startsWith(currentMonth) && key.endsWith(`_${id}`)) {
        total++;
        if ((type === 'staff' ? staffAttendance : studentAttendance)[key] === 'present') {
          presentCount++;
        }
      }
    });
    return { presentCount, total, percentage: total > 0 ? ((presentCount / total) * 100).toFixed(1) : 0 };
  };

  // Format functions
  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-IN') : 'Not paid';

  // Simplified sections for demo
  const StaffSection = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-sh-neutral-800 tracking-tight">Staff Management</h1>
          <p className="text-sh-neutral-500 text-sm font-medium">Manage your school faculty and support staff</p>
        </div>
        <button 
          onClick={() => setModals({ ...modals, addStaff: true })}
          className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 min-h-[56px] shadow-modern"
        >
          <Plus className="w-5 h-5" /> Add Staff
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {staffMembers.map(member => (
          <div key={member.id} className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-modern p-8 hover:shadow-modern-lg transition-all group overflow-hidden relative border-t-white/40">
            <div className="absolute top-0 right-0 w-40 h-40 bg-sh-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700"></div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-sh-neutral-800 font-bold text-2xl shrink-0 shadow-inner border border-white/40" style={{ backgroundColor: staffCategories.find(c => c.id === member.categoryId)?.color }}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-jakarta font-bold text-sh-neutral-900 truncate tracking-tight">{member.name}</h3>
                <p className="text-sh-neutral-500 font-medium truncate">{member.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-white/60 text-sh-neutral-600 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-sh-neutral-200/50 shadow-sm">
                    {staffCategories.find(c => c.id === member.categoryId)?.name}
                  </span>
                </div>
              </div>
              <div className="w-full sm:w-auto text-left sm:text-right border-t sm:border-t-0 border-sh-neutral-100/50 pt-4 sm:pt-0">
                <p className="text-3xl font-jakarta font-bold text-sh-neutral-900 tracking-tight">₹{member.salary.toLocaleString()}</p>
                <p className="text-[10px] text-sh-neutral-400 uppercase font-bold tracking-[0.2em] mt-1">Monthly Salary</p>
              </div>
            </div>
              <div className="flex gap-3 mt-8 relative">
              <button 
                onClick={() => setModals({ ...modals, editStaff: member, addStaff: true })}
                className="flex-1 bg-indigo-500 text-white hover:bg-indigo-600 p-4 rounded-2xl transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button 
                onClick={() => setModals({ ...modals, salaryPayment: member })}
                className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 p-4 rounded-2xl transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <DollarSign className="w-4 h-4" /> Pay
              </button>
              <button 
                onClick={() => handleDeleteStaff(member.id)}
                className="flex-1 bg-rose-500 text-white hover:bg-rose-600 p-4 rounded-2xl transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const StudentsSection = () => {
    const [filterClass, setFilterClass] = useState('all');

    const filteredStudents = filterClass === 'all' 
      ? [...students].sort((a, b) => a.classId - b.classId)
      : students.filter(s => s.classId === parseInt(filterClass));

    return (
      <div className="space-y-12 animate-fade-in">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-jakarta font-bold text-sh-neutral-800 tracking-tight">Classes & Fees</h1>
              <p className="text-sh-neutral-500 text-sm font-medium">Manage class-specific fee structures</p>
            </div>
            <button 
              onClick={() => setModals({ ...modals, addClass: true })}
              className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:bg-emerald-700 hover:shadow-emerald-200 hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 min-h-[56px] shadow-modern"
            >
              <Plus className="w-5 h-5" /> New Class
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map(cls => (
              <div key={cls.id} className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-modern p-8 hover:shadow-modern-lg transition-all group overflow-hidden relative border-t-white/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-jakarta font-bold text-sh-neutral-900 tracking-tight">{cls.name}</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditClass(cls)}
                      className="p-3 bg-amber-500 text-white hover:bg-amber-600 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClass(cls.id)}
                      className="p-3 bg-rose-500 text-white hover:bg-rose-600 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sh-neutral-500 font-medium">{cls.strength} Students Enrolled</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-sh-neutral-400 uppercase tracking-widest">Monthly Fee</span>
                    <span className="text-lg font-bold text-indigo-600">₹{cls.monthlyFee.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-12 border-t border-sh-neutral-100/50">
            <div>
              <h1 className="text-3xl font-jakarta font-bold text-sh-neutral-800 tracking-tight">Student Directory</h1>
              <p className="text-sh-neutral-500 text-sm font-medium">Sorted and filtered by academic class</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select 
                className="bg-white border border-sh-neutral-200 px-4 py-3 rounded-xl text-sm font-bold text-sh-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
              >
                <option value="all">All Classes</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button 
                onClick={() => setModals({ ...modals, studentForm: true })}
                className="flex-1 sm:flex-none bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 min-h-[56px] shadow-modern"
              >
                <Plus className="w-5 h-5" /> Add Student
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStudents.map((student) => {
              const studentClass = classes.find(c => c.id === student.classId);
              return (
                <div key={student.id} className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-modern p-8 hover:shadow-modern-lg transition-all group overflow-hidden relative border-t-white/40">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 font-bold text-2xl shrink-0 shadow-inner border border-indigo-200/50">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl font-jakarta font-bold text-sh-neutral-900 truncate tracking-tight">{student.name}</h3>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
                          {studentClass?.name}
                        </span>
                      </div>
                      <p className="text-sh-neutral-500 font-medium truncate">Parent: {student.parentName}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold text-sh-neutral-400 uppercase tracking-widest">Monthly Fee:</span>
                        <span className="text-sm font-bold text-sh-neutral-700">₹{studentClass?.monthlyFee.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto mt-4 sm:mt-0">
                      <button 
                        onClick={() => handleToggleFeeStatus(student.id)}
                        className={`w-full px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all border shadow-sm active:scale-95 ${
                          student.feePaid 
                          ? 'bg-emerald-100 text-emerald-600 border-emerald-200 hover:bg-emerald-600 hover:text-white' 
                          : 'bg-rose-100 text-rose-600 border-rose-200 hover:bg-rose-600 hover:text-white'
                        }`}
                      >
                        {student.feePaid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {student.feePaid ? 'Paid' : 'Pending'}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-8 pt-8 border-t border-sh-neutral-100/50">
                    <button 
                      onClick={() => setModals({ ...modals, viewStudent: student })}
                      className="flex-1 bg-cyan-500 text-white hover:bg-cyan-600 p-4 rounded-2xl transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button 
                      onClick={() => setModals({ ...modals, editStudent: student, studentForm: true })}
                      className="flex-1 bg-amber-500 text-white hover:bg-amber-600 p-4 rounded-2xl transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const AttendanceSection = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-sh-neutral-800 tracking-tight">Attendance</h1>
          <p className="text-sh-neutral-500 text-sm font-medium">Track daily attendance for staff and students</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-auto px-6 py-4 bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-modern focus:border-sh-primary focus:ring-4 focus:ring-sh-primary/10 outline-none font-bold text-sh-neutral-800 transition-all"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-modern p-8 relative overflow-hidden border-t-white/40">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sh-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-center justify-between mb-8 relative">
            <h3 className="text-2xl font-jakarta font-bold text-sh-neutral-900 flex items-center gap-3 tracking-tight">
              Faculty <Users className="w-6 h-6 text-sh-primary" />
            </h3>
            <span className="text-[10px] font-bold text-sh-neutral-400 uppercase tracking-[0.2em]">Live Tracking</span>
          </div>
          <div className="space-y-3 relative">
            {staffMembers.map(member => {
              const status = getStaffAttendanceStatus(member.id);
              return (
                <div key={member.id} className="flex items-center justify-between p-5 bg-white/60 rounded-[1.5rem] border border-white/80 group hover:border-sh-primary/30 transition-all shadow-sm">
                  <span className="font-bold text-sh-neutral-700">{member.name}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => markStaffAttendance(member.id, 'present')} 
                      className={`w-12 h-12 rounded-2xl font-bold flex items-center justify-center transition-all ${
                        status === 'present' 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-110' 
                        : 'bg-emerald-50 border border-emerald-100 text-emerald-400 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50'
                      }`}
                    >
                      ✓
                    </button>
                    <button 
                      onClick={() => markStaffAttendance(member.id, 'absent')} 
                      className={`w-12 h-12 rounded-2xl font-bold flex items-center justify-center transition-all ${
                        status === 'absent' 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 scale-110' 
                        : 'bg-rose-50 border border-rose-100 text-rose-400 hover:border-rose-500 hover:text-rose-500 hover:bg-rose-50'
                      }`}
                    >
                      ✗
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-modern p-8 relative overflow-hidden border-t-white/40">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sh-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-center justify-between mb-8 relative">
            <h3 className="text-2xl font-jakarta font-bold text-sh-neutral-900 flex items-center gap-3 tracking-tight">
              Students <GraduationCap className="w-6 h-6 text-sh-secondary" />
            </h3>
            <span className="text-[10px] font-bold text-sh-neutral-400 uppercase tracking-[0.2em]">Live Tracking</span>
          </div>
          <div className="space-y-3 relative">
            {students.map(student => {
              const status = getStudentAttendanceStatus(student.id);
              return (
                <div key={student.id} className="flex items-center justify-between p-5 bg-white/60 rounded-[1.5rem] border border-white/80 group hover:border-sh-secondary/30 transition-all shadow-sm">
                  <span className="font-bold text-sh-neutral-700">{student.name}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => markStudentAttendance(student.id, 'present')} 
                      className={`w-12 h-12 rounded-2xl font-bold flex items-center justify-center transition-all ${
                        status === 'present' 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-110' 
                        : 'bg-emerald-50 border border-emerald-100 text-emerald-400 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50'
                      }`}
                    >
                      ✓
                    </button>
                    <button 
                      onClick={() => markStudentAttendance(student.id, 'absent')} 
                      className={`w-12 h-12 rounded-2xl font-bold flex items-center justify-center transition-all ${
                        status === 'absent' 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 scale-110' 
                        : 'bg-rose-50 border border-rose-100 text-rose-400 hover:border-rose-500 hover:text-rose-500 hover:bg-rose-50'
                      }`}
                    >
                      ✗
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const LibrarySection = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-sh-neutral-800 tracking-tight">Library</h1>
          <p className="text-sh-neutral-500 text-sm font-medium">Manage books inventory and lending</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setModals({ ...modals, issueBook: true })}
            className="flex-1 sm:flex-none bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 min-h-[56px] shadow-modern"
          >
            <BookMarked className="w-5 h-5" /> Issue
          </button>
          <button 
            onClick={() => setModals({ ...modals, addBook: true })}
            className="flex-1 sm:flex-none bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:bg-emerald-700 hover:shadow-emerald-200 hover:shadow-xl shadow-modern flex items-center justify-center gap-2 min-h-[56px] active:scale-95"
          >
            <Plus className="w-5 h-5" /> Add Book
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {books.map(book => (
          <div key={book.id} className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-modern p-8 hover:shadow-modern-lg transition-all group overflow-hidden relative border-t-white/40">
            <div className="flex gap-8 relative">
              <div className="w-24 h-32 bg-sh-primary-light rounded-2xl flex items-center justify-center text-sh-primary font-bold text-2xl shadow-inner shrink-0 border border-sh-primary/10 group-hover:scale-105 transition-transform duration-500">
                {book.title.split(' ').map(w => w[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-jakarta font-bold text-sh-neutral-900 mb-1 truncate tracking-tight">{book.title}</h3>
                <p className="text-sh-neutral-500 font-bold mb-4 truncate">{book.author}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-1.5 bg-white/60 text-sh-neutral-600 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-sh-neutral-200/50 shadow-sm">{book.category}</span>
                </div>
              </div>
              <div className="text-right min-w-[100px] hidden sm:block">
                <p className="text-[10px] text-sh-neutral-400 font-bold uppercase tracking-[0.2em] mb-2">Inventory</p>
                <div className="text-4xl font-jakarta font-bold text-sh-primary">{book.availableCopies}</div>
              </div>
            </div>
            <div className="flex gap-3 mt-8 relative">
              <button 
                onClick={() => setModals({ ...modals, editBook: book, addBook: true })}
                className="flex-1 bg-amber-500 text-white hover:bg-amber-600 p-4 rounded-2xl transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button 
                onClick={() => setBooks(books.filter(b => b.id !== book.id))}
                className="flex-1 bg-rose-500 text-white hover:bg-rose-600 p-4 rounded-2xl transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const FinancesSection = () => (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-jakarta font-bold text-sh-neutral-800 tracking-tight">Finances</h1>
        <p className="text-sh-neutral-500 text-sm font-medium">Monitor revenue and operational expenses</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="bg-indigo-950 rounded-[3rem] p-10 sm:p-16 text-center relative overflow-hidden shadow-modern-xl group border border-indigo-900/50">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-indigo-500/30 transition-colors duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:bg-emerald-500/30 transition-colors duration-1000"></div>
          <div className="relative">
            <div className="w-24 h-24 bg-indigo-500 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl animate-float border-4 border-indigo-400/30">
              <DollarSign className="w-12 h-12 text-white" />
            </div>
            <p className="text-xs text-indigo-300 font-bold uppercase tracking-[0.4em] mb-4">Current Treasury Balance</p>
            <h3 className="text-6xl sm:text-8xl font-jakarta font-bold text-white mb-16 tracking-tighter drop-shadow-lg">₹{financials.balance.toLocaleString()}</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 bg-indigo-900/40 backdrop-blur-xl rounded-[2.5rem] border border-indigo-800/50 hover:bg-indigo-900/60 transition-all group/card cursor-default">
                <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest mb-3">Total Expenses</p>
                <p className="text-3xl font-jakarta font-bold text-rose-400 group-hover/card:scale-110 transition-transform tracking-tight">₹{financials.totalSalaryExpense.toLocaleString()}</p>
              </div>
              <div className="p-8 bg-indigo-900/40 backdrop-blur-xl rounded-[2.5rem] border border-indigo-800/50 hover:bg-indigo-900/60 transition-all group/card cursor-default">
                <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest mb-3">Accounts Receivable</p>
                <p className="text-3xl font-jakarta font-bold text-amber-400 group-hover/card:scale-110 transition-transform tracking-tight">₹{financials.totalFeeDue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/40 backdrop-blur-md rounded-[3rem] border border-white/20 shadow-modern p-10 relative overflow-hidden border-t-white/40">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <h3 className="text-2xl font-jakarta font-bold text-sh-neutral-900 mb-10 flex items-center gap-3 relative tracking-tight">
            Quick Actions <TrendingUp className="w-6 h-6 text-indigo-600" />
          </h3>
          <div className="grid gap-5 relative">
            <button 
              onClick={() => setModals({ ...modals, sendEmail: true })}
              className="w-full bg-indigo-600 text-white p-6 rounded-[2rem] text-xl font-bold transition-all hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-xl active:scale-95 flex items-center justify-center gap-4 min-h-[80px] shadow-modern"
            >
              <Mail className="w-7 h-7" /> Send Reminders
            </button>
            <button 
              onClick={() => setModals({ ...modals, payAllSalaries: true })}
              className="w-full bg-emerald-600 text-white p-6 rounded-[2rem] text-xl font-bold transition-all hover:bg-emerald-700 hover:shadow-emerald-200 hover:shadow-xl active:scale-95 flex items-center justify-center gap-4 min-h-[80px] shadow-modern"
            >
              <DollarSign className="w-7 h-7" /> Pay All Salaries
            </button>
            <button 
              onClick={() => setActiveSection('finances')}
              className="w-full bg-slate-800 text-white p-6 rounded-[2rem] text-xl font-bold transition-all hover:bg-slate-900 hover:shadow-slate-200 hover:shadow-xl active:scale-95 flex items-center justify-center gap-4 min-h-[80px] shadow-modern"
            >
              <TrendingUp className="w-7 h-7" /> Treasury Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const MessagesSection = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-sh-neutral-800 tracking-tight">Communication Hub</h1>
          <p className="text-sh-neutral-500 text-sm font-medium">Send and manage school-wide messages</p>
        </div>
        <button 
          onClick={() => setModals({ ...modals, composeMessage: true })}
          className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 min-h-[56px] shadow-modern"
        >
          <Send className="w-5 h-5" /> New Message
        </button>
      </div>
      <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-modern-lg overflow-hidden border-t-white/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-sh-neutral-50/50">
                <th className="px-8 py-6 text-[10px] font-bold text-sh-neutral-400 uppercase tracking-[0.2em]">Recipient</th>
                <th className="px-8 py-6 text-[10px] font-bold text-sh-neutral-400 uppercase tracking-[0.2em]">Subject</th>
                <th className="px-8 py-6 text-[10px] font-bold text-sh-neutral-400 uppercase tracking-[0.2em]">Date</th>
                <th className="px-8 py-6 text-[10px] font-bold text-sh-neutral-400 uppercase tracking-[0.2em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sh-neutral-100/50">
              {messages.map(msg => (
                <tr key={msg.id} className="hover:bg-white/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sh-primary-light flex items-center justify-center text-sh-primary font-bold shadow-sm">
                        {msg.recipient === 'Everyone' ? 'E' : msg.recipient.charAt(0)}
                      </div>
                      <span className="font-bold text-sh-neutral-700">{msg.recipient}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-sh-neutral-800 group-hover:text-sh-primary transition-colors">{msg.subject}</p>
                    <p className="text-sm text-sh-neutral-400 truncate max-w-xs">{msg.content}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-sh-neutral-500">{formatDate(msg.date)}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-sh-success-light text-sh-success rounded-full text-[10px] font-bold uppercase tracking-widest border border-sh-success/20">
                      {msg.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    const sections = {
      dashboard: <DashboardStats />,
      staff: <StaffSection />,
      students: <StudentsSection />,
      attendance: <AttendanceSection />,
      library: <LibrarySection />,
      finances: <FinancesSection />,
      messages: <MessagesSection />,
      permissions: <PermissionManagementPage localStaff={staffMembers} />
    };
    return sections[activeSection] || <DashboardStats />;
  };

  return (
    <div className="min-h-screen bg-sh-neutral-50 text-sh-neutral-900 font-inter selection:bg-sh-primary/10 selection:text-sh-primary">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-6xl font-jakarta font-bold text-sh-neutral-900 tracking-tight">
              School<span className="text-sh-primary">Hub</span>
            </h1>
            <p className="text-sm md:text-base text-sh-neutral-400 mt-2 font-medium">Next-gen Educational Operating System</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="flex-1 md:hidden rounded-2xl bg-white border border-sh-neutral-200 px-6 py-3 text-sm font-bold text-sh-neutral-600 shadow-modern active:scale-95 transition-all"
            >
              {sidebarOpen ? 'Close Menu' : 'Open Menu'}
            </button>
            <div className="hidden md:flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-[2rem] border border-sh-neutral-200 shadow-modern">
              <div className="w-10 h-10 rounded-full bg-sh-primary text-white flex items-center justify-center font-bold shadow-lg shadow-sh-primary/20">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-sh-neutral-800 leading-none">Administrator</span>
                <span className="text-[10px] font-bold text-sh-primary uppercase tracking-widest mt-1">Super User</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 lg:gap-12">
          <aside className={`${sidebarOpen ? 'block animate-slide-up' : 'hidden'} md:block sticky top-8 h-fit z-40`}>
            <nav className="space-y-2 rounded-[2.5rem] border border-sh-neutral-200/50 bg-white/80 backdrop-blur-xl p-4 shadow-modern-lg">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <TrendingUp className="w-5 h-5" /> },
                { id: 'staff', label: 'Faculty', icon: <Users className="w-5 h-5" /> },
                { id: 'students', label: 'Students', icon: <GraduationCap className="w-5 h-5" /> },
                { id: 'attendance', label: 'Attendance', icon: <Clock className="w-5 h-5" /> },
                { id: 'library', label: 'Library', icon: <BookOpen className="w-5 h-5" /> },
                { id: 'finances', label: 'Treasury', icon: <DollarSign className="w-5 h-5" /> },
                { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
                { id: 'permissions', label: 'Access Control', icon: <AlertCircle className="w-5 h-5" /> }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-left text-sm font-bold transition-all relative group ${
                    activeSection === item.id 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-[1.02]' 
                    : 'hover:bg-indigo-50 text-sh-neutral-500 hover:text-indigo-600'
                  }`}
                >
                  <span className={`${activeSection === item.id ? 'text-white' : 'text-sh-neutral-400 group-hover:text-indigo-600'} transition-colors`}>
                    {item.icon}
                  </span>
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute right-4 w-2 h-2 rounded-full bg-white shadow-glow animate-pulse"></span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          <main className="space-y-8 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Treasury', value: financials.balance, color: 'sh-primary', icon: <DollarSign className="w-5 h-5" /> },
                { label: 'Revenue', value: financials.totalFeeCollected, color: 'sh-secondary', icon: <TrendingUp className="w-5 h-5" /> },
                { label: 'Population', value: staffMembers.length + students.length, color: 'sh-accent', icon: <Users className="w-5 h-5" /> },
                { label: 'Active Modules', value: '7/8', color: 'sh-neutral-800', icon: <Check className="w-5 h-5" /> }
              ].map((stat, idx) => (
                <div key={idx} className="rounded-[2rem] border border-sh-neutral-200/50 bg-white/80 backdrop-blur-md p-6 shadow-modern hover:shadow-modern-lg transition-all group cursor-default overflow-hidden relative">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`}></div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-modern border border-sh-neutral-100 text-${stat.color}`}>
                      {stat.icon}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sh-neutral-400">{stat.label}</p>
                  </div>
                  <p className="text-2xl font-jakarta font-bold text-sh-neutral-900">
                    {typeof stat.value === 'number' && stat.label !== 'Population'
                      ? `₹${stat.value.toLocaleString()}` 
                      : stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-[2.5rem] border border-sh-neutral-200/50 bg-white/60 backdrop-blur-xl p-8 shadow-modern-lg min-h-[600px]">
              {renderSection()}
            </div>
          </main>
        </div>
      </div>

      {/* Futuristic Modals Rendering */}
      
      {/* Add/Edit Staff Modal */}
      {modals.addStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sh-neutral-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-modern-xl overflow-hidden animate-slide-up border border-white/20">
            <div className="p-8 border-b border-sh-neutral-100 flex justify-between items-center bg-sh-neutral-50/50">
              <h2 className="text-2xl font-jakarta font-bold text-sh-neutral-900">Add New Faculty</h2>
              <button onClick={() => setModals({ ...modals, addStaff: false })} className="p-3 hover:bg-sh-neutral-100 rounded-2xl transition-colors">
                <X className="w-5 h-5 text-sh-neutral-400" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                  value={formData.staff.name}
                  onChange={(e) => setFormData({ ...formData, staff: { ...formData.staff, name: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                  value={formData.staff.email}
                  onChange={(e) => setFormData({ ...formData, staff: { ...formData.staff, email: e.target.value } })}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Phone</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                    value={formData.staff.phone}
                    onChange={(e) => setFormData({ ...formData, staff: { ...formData.staff, phone: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Salary</label>
                  <input 
                    type="number" 
                    className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                    value={formData.staff.salary}
                    onChange={(e) => setFormData({ ...formData, staff: { ...formData.staff, salary: e.target.value } })}
                  />
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-sh-neutral-100 flex gap-4 bg-sh-neutral-50/50">
              <button onClick={() => setModals({ ...modals, addStaff: false })} className="flex-1 px-6 py-4 bg-white hover:bg-sh-neutral-100 text-sh-neutral-600 rounded-2xl font-bold transition-all border border-sh-neutral-200 active:scale-95">Cancel</button>
              <button onClick={handleAddStaff} className="flex-1 px-6 py-4 bg-sh-primary hover:bg-sh-primary-hover text-white rounded-2xl font-bold transition-all shadow-lg shadow-sh-primary/25 active:scale-95">Complete Faculty Onboarding</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Class Modal */}
      {modals.addClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sh-neutral-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-modern-xl overflow-hidden animate-slide-up">
            <div className="p-8 border-b border-sh-neutral-100 flex justify-between items-center">
              <h2 className="text-2xl font-jakarta font-bold text-sh-neutral-900">{modals.editClass ? 'Edit Class' : 'New Class Structure'}</h2>
              <button onClick={() => setModals({ ...modals, addClass: false, editClass: null })} className="p-3 hover:bg-sh-neutral-100 rounded-2xl transition-colors">
                <X className="w-5 h-5 text-sh-neutral-400" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Class Name / Designation</label>
                <input 
                  type="text" 
                  placeholder="e.g. Class 10 - Section A"
                  className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                  value={formData.class.name}
                  onChange={(e) => setFormData({ ...formData, class: { ...formData.class, name: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Monthly Tuition Fee (₹)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 5000"
                  className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                  value={formData.class.monthlyFee}
                  onChange={(e) => setFormData({ ...formData, class: { ...formData.class, monthlyFee: e.target.value } })}
                />
              </div>
            </div>
            <div className="p-8 border-t border-sh-neutral-100 flex gap-4">
              <button onClick={() => setModals({ ...modals, addClass: false, editClass: null })} className="flex-1 px-6 py-4 bg-sh-neutral-50 text-sh-neutral-600 rounded-2xl font-bold transition-all active:scale-95">Dismiss</button>
              <button onClick={handleAddClass} className="flex-1 px-6 py-4 bg-sh-secondary hover:bg-sh-secondary-hover text-white rounded-2xl font-bold transition-all shadow-lg shadow-sh-secondary/25 active:scale-95">Confirm Structure</button>
            </div>
          </div>
        </div>
      )}

      {/* View Student Modal - FIXED */}
      {modals.viewStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sh-neutral-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-modern-xl overflow-hidden animate-slide-up border border-white/20">
            <div className="p-8 bg-sh-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <div className="flex justify-between items-start relative z-10">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-sh-primary font-bold text-4xl shadow-modern-lg border-4 border-white/20">
                  {modals.viewStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <button onClick={() => setModals({ ...modals, viewStudent: null })} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="mt-6 relative z-10">
                <h2 className="text-3xl font-jakarta font-bold text-white">{modals.viewStudent.name}</h2>
                <p className="text-white/70 font-medium">Student ID: #STU-{modals.viewStudent.id.toString().slice(-4)}</p>
              </div>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 mb-2">Class / Section</p>
                  <p className="text-lg font-bold text-sh-neutral-800">{classes.find(c => c.id === modals.viewStudent.classId)?.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 mb-2">Guardian</p>
                  <p className="text-lg font-bold text-sh-neutral-800">{modals.viewStudent.parentName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 mb-2">Contact</p>
                  <p className="text-lg font-bold text-sh-neutral-800">{modals.viewStudent.phone1}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 mb-2">Fee Status</p>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    modals.viewStudent.feePaid 
                    ? 'bg-sh-success-light text-sh-success border-sh-success/20' 
                    : 'bg-sh-danger/10 text-sh-danger border-sh-danger/20'
                  }`}>
                    {modals.viewStudent.feePaid ? 'Cleared' : 'Payment Due'}
                  </span>
                </div>
              </div>
              <div className="p-6 bg-sh-neutral-50 rounded-3xl border border-sh-neutral-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 mb-4">Quick Statistics</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-sh-neutral-800">92%</p>
                    <p className="text-[8px] font-bold text-sh-neutral-400 uppercase tracking-widest mt-1">Attendance</p>
                  </div>
                  <div className="border-x border-sh-neutral-200">
                    <p className="text-xl font-bold text-sh-neutral-800">A+</p>
                    <p className="text-[8px] font-bold text-sh-neutral-400 uppercase tracking-widest mt-1">Grade</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-sh-neutral-800">12</p>
                    <p className="text-[8px] font-bold text-sh-neutral-400 uppercase tracking-widest mt-1">Rank</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-sh-neutral-100 flex gap-4 bg-sh-neutral-50/50">
              <button 
                onClick={() => {
                  const student = modals.viewStudent;
                  setModals({ ...modals, viewStudent: null, editStudent: student, studentForm: true });
                }}
                className="flex-1 px-6 py-4 bg-white hover:bg-sh-neutral-100 text-sh-neutral-600 rounded-2xl font-bold transition-all border border-sh-neutral-200"
              >
                Edit Profile
              </button>
              <button onClick={() => setModals({ ...modals, viewStudent: null })} className="flex-1 px-6 py-4 bg-sh-neutral-800 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95">Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* Other modals updated with new aesthetic */}
      {modals.studentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sh-neutral-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-modern-xl overflow-hidden animate-slide-up">
            <div className="p-8 border-b border-sh-neutral-100 flex justify-between items-center">
              <h2 className="text-2xl font-jakarta font-bold text-sh-neutral-900">{modals.editStudent ? 'Update Profile' : 'Student Enrollment'}</h2>
              <button onClick={() => setModals({ ...modals, studentForm: false, editStudent: null })} className="p-3 hover:bg-sh-neutral-100 rounded-2xl transition-colors">
                <X className="w-5 h-5 text-sh-neutral-400" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Full Student Name</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                  value={formData.student.name}
                  onChange={(e) => setFormData({ ...formData, student: { ...formData.student, name: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Parent / Guardian Name</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                  value={formData.student.parentName}
                  onChange={(e) => setFormData({ ...formData, student: { ...formData.student, parentName: e.target.value } })}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Contact Phone</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                    value={formData.student.phone1}
                    onChange={(e) => setFormData({ ...formData, student: { ...formData.student, phone1: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Academic Class</label>
                  <select 
                    className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                    value={formData.student.classId}
                    onChange={(e) => setFormData({ ...formData, student: { ...formData.student, classId: parseInt(e.target.value) } })}
                  >
                    {classes.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-sh-neutral-100 flex gap-4">
              <button onClick={() => setModals({ ...modals, studentForm: false, editStudent: null })} className="flex-1 px-6 py-4 bg-sh-neutral-50 text-sh-neutral-600 rounded-2xl font-bold transition-all active:scale-95">Cancel</button>
              <button onClick={handleAddStudent} className="flex-1 px-6 py-4 bg-sh-primary hover:bg-sh-primary-hover text-white rounded-2xl font-bold transition-all shadow-lg shadow-sh-primary/25 active:scale-95">
                {modals.editStudent ? 'Update Enrollment' : 'Enroll Student'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Salary Confirmation Modal */}
      {modals.salaryPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sh-neutral-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-modern-xl overflow-hidden animate-slide-up border border-white/20">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-modern border border-emerald-500/10">
                <DollarSign className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-jakarta font-bold text-sh-neutral-900 mb-2">Execute Payment</h2>
              <p className="text-sh-neutral-500 mb-8 px-4 font-medium leading-relaxed">Confirm disbursement of funds to <span className="text-sh-neutral-800 font-bold underline decoration-emerald-500/30 underline-offset-4">{modals.salaryPayment.name}</span>.</p>
              <div className="bg-sh-neutral-50 rounded-3xl p-6 border border-sh-neutral-100 mb-10 group">
                <p className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 mb-2">Disbursement Amount</p>
                <p className="text-4xl font-jakarta font-bold text-sh-neutral-900 group-hover:scale-105 transition-transform duration-300">₹{modals.salaryPayment.salary.toLocaleString()}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setModals({ ...modals, salaryPayment: null })} className="flex-1 px-6 py-4 bg-sh-neutral-50 hover:bg-sh-neutral-100 text-sh-neutral-600 rounded-2xl font-bold transition-all">Abort</button>
                <button onClick={() => handlePaySalary(modals.salaryPayment.id)} className="flex-1 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/25 active:scale-95">Authorize Funds</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pay All Salaries Modal */}
      {modals.payAllSalaries && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sh-neutral-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-modern-xl overflow-hidden animate-slide-up border border-white/20">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-modern border border-emerald-500/10">
                <DollarSign className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-jakarta font-bold text-sh-neutral-900 mb-2">Mass Disbursement</h2>
              <p className="text-sh-neutral-500 mb-8 px-4 font-medium leading-relaxed">You are about to pay salaries to all <span className="text-sh-neutral-800 font-bold underline decoration-emerald-500/30 underline-offset-4">{staffMembers.length} staff members</span>.</p>
              <div className="bg-sh-neutral-50 rounded-3xl p-6 border border-sh-neutral-100 mb-10 group">
                <p className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 mb-2">Total Treasury Outflow</p>
                <p className="text-4xl font-jakarta font-bold text-rose-600 group-hover:scale-105 transition-transform duration-300">₹{financials.totalSalaryExpense.toLocaleString()}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setModals({ ...modals, payAllSalaries: false })} className="flex-1 px-6 py-4 bg-sh-neutral-50 hover:bg-sh-neutral-100 text-sh-neutral-600 rounded-2xl font-bold transition-all">Cancel</button>
                <button onClick={handlePayAllSalaries} className="flex-1 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/25 active:scale-95">Execute Mass Payment</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compose Message Modal */}
      {modals.composeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sh-neutral-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-modern-xl overflow-hidden animate-slide-up border border-white/20">
            <div className="p-8 border-b border-sh-neutral-100 flex justify-between items-center bg-sh-neutral-50/50">
              <h2 className="text-2xl font-jakarta font-bold text-sh-neutral-900">Compose Message</h2>
              <button onClick={() => setModals({ ...modals, composeMessage: false })} className="p-3 hover:bg-sh-neutral-100 rounded-2xl transition-colors">
                <X className="w-5 h-5 text-sh-neutral-400" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Recipient</label>
                <select 
                  className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                  value={formData.message.recipient}
                  onChange={(e) => setFormData({ ...formData, message: { ...formData.message, recipient: e.target.value } })}
                >
                  <option value="all">Everyone (All Staff & Parents)</option>
                  <optgroup label="Faculty Members">
                    {staffMembers.map(staff => (
                      <option key={staff.id} value={staff.email}>{staff.name} ({staff.email})</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Subject</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                  placeholder="Enter message subject..."
                  value={formData.message.subject}
                  onChange={(e) => setFormData({ ...formData, message: { ...formData.message, subject: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Message Content</label>
                <textarea 
                  className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium min-h-[150px] resize-none"
                  placeholder="Type your message here..."
                  value={formData.message.content}
                  onChange={(e) => setFormData({ ...formData, message: { ...formData.message, content: e.target.value } })}
                ></textarea>
              </div>
            </div>
            <div className="p-8 border-t border-sh-neutral-100 flex gap-4 bg-sh-neutral-50/50">
              <button onClick={() => setModals({ ...modals, composeMessage: false })} className="flex-1 px-6 py-4 bg-white hover:bg-sh-neutral-100 text-sh-neutral-600 rounded-2xl font-bold transition-all border border-sh-neutral-200 active:scale-95">Discard</button>
              <button onClick={handleSendMessage} className="flex-1 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/25 active:scale-95 flex items-center justify-center gap-2">
                <Send className="w-5 h-5" /> Send via Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Book Modal */}
      {modals.addBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sh-neutral-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-modern-xl overflow-hidden animate-slide-up border border-white/20">
            <div className="p-8 border-b border-sh-neutral-100 flex justify-between items-center bg-sh-neutral-50/50">
              <h2 className="text-2xl font-jakarta font-bold text-sh-neutral-900">{modals.editBook ? 'Edit Book Details' : 'New Library Entry'}</h2>
              <button onClick={() => setModals({ ...modals, addBook: false, editBook: null })} className="p-3 hover:bg-sh-neutral-100 rounded-2xl transition-colors">
                <X className="w-5 h-5 text-sh-neutral-400" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Book Title</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                  value={formData.book.title}
                  onChange={(e) => setFormData({ ...formData, book: { ...formData.book, title: e.target.value } })}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Author</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                    value={formData.book.author}
                    onChange={(e) => setFormData({ ...formData, book: { ...formData.book, author: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Stock Count</label>
                  <input 
                    type="number" 
                    className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                    value={formData.book.totalCopies}
                    onChange={(e) => setFormData({ ...formData, book: { ...formData.book, totalCopies: e.target.value } })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Genre / Category</label>
                <select 
                  className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                  value={formData.book.category}
                  onChange={(e) => setFormData({ ...formData, book: { ...formData.book, category: e.target.value } })}
                >
                  <option value="Fiction">Fiction</option>
                  <option value="Educational">Educational</option>
                  <option value="Reference">Reference</option>
                  <option value="Magazine">Magazine</option>
                </select>
              </div>
            </div>
            <div className="p-8 border-t border-sh-neutral-100 flex gap-4 bg-sh-neutral-50/50">
              <button onClick={() => setModals({ ...modals, addBook: false, editBook: null })} className="flex-1 px-6 py-4 bg-white hover:bg-sh-neutral-100 text-sh-neutral-600 rounded-2xl font-bold transition-all border border-sh-neutral-200">Cancel</button>
              <button onClick={handleAddBook} className="flex-1 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95">{modals.editBook ? 'Update Inventory' : 'Add to Collection'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Book Modal */}
      {modals.issueBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sh-neutral-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-modern-xl overflow-hidden animate-slide-up border border-white/20">
            <div className="p-8 border-b border-sh-neutral-100 flex justify-between items-center bg-sh-neutral-50/50">
              <h2 className="text-2xl font-jakarta font-bold text-sh-neutral-900">Issue Library Book</h2>
              <button onClick={() => setModals({ ...modals, issueBook: false })} className="p-3 hover:bg-sh-neutral-100 rounded-2xl transition-colors">
                <X className="w-5 h-5 text-sh-neutral-400" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Select Book</label>
                <select 
                  className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                  value={formData.issueBook.bookId}
                  onChange={(e) => setFormData({ ...formData, issueBook: { ...formData.issueBook, bookId: e.target.value } })}
                >
                  <option value="">Select a book...</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id} disabled={b.availableCopies === 0}>{b.title} ({b.availableCopies} available)</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Borrower Name</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                  placeholder="Enter student or faculty name..."
                  value={formData.issueBook.issuedTo}
                  onChange={(e) => setFormData({ ...formData, issueBook: { ...formData.issueBook, issuedTo: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sh-neutral-400 ml-4">Return Due Date</label>
                <input 
                  type="date" 
                  className="w-full px-6 py-4 bg-sh-neutral-50 border border-sh-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sh-primary/10 focus:border-sh-primary transition-all font-medium"
                  value={formData.issueBook.dueDate}
                  onChange={(e) => setFormData({ ...formData, issueBook: { ...formData.issueBook, dueDate: e.target.value } })}
                />
              </div>
            </div>
            <div className="p-8 border-t border-sh-neutral-100 flex gap-4 bg-sh-neutral-50/50">
              <button onClick={() => setModals({ ...modals, issueBook: false })} className="flex-1 px-6 py-4 bg-white hover:bg-sh-neutral-100 text-sh-neutral-600 rounded-2xl font-bold transition-all border border-sh-neutral-200">Cancel</button>
              <button onClick={handleIssueBook} className="flex-1 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95">Complete Transaction</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolManagementSystem;

