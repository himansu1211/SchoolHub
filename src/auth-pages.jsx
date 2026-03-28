import React, { useState } from 'react';
import { useAuth } from './auth-context';
import { db } from './firebase-config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { loginWithGoogle, loginWithEmail } = useAuth();

  const getErrorMessage = (error) => {
    if (!error) return null;
    const code = error.code || error.message;
    if (code.includes('auth/invalid-credential') || code.includes('auth/wrong-password') || code.includes('auth/user-not-found')) {
      return "Invalid email or password. Please try again.";
    }
    if (code.includes('auth/too-many-requests')) {
      return "Too many failed attempts. Your account has been temporarily locked. Please try again later or reset your password.";
    }
    if (code.includes('auth/network-request-failed')) {
      return "Network error. Please check your internet connection.";
    }
    return "An error occurred: " + (error.message || code);
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
    } catch (err) {
      setError(err);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await loginWithEmail(email, password);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-inter">
      <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm w-full max-w-md">
        <h1 className="text-5xl font-jakarta font-bold text-center text-slate-800 mb-2">SchoolHub</h1>
        <p className="text-center text-slate-500 mb-10 text-lg">Complete School Management System</p>
        
        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl mb-6 text-sm font-bold border border-rose-100 animate-shake">
            {getErrorMessage(error)}
          </div>
        )}

        <div className="space-y-6">
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 py-4 px-6 rounded-xl font-bold hover:bg-slate-50 transition-all min-h-11 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Admin: Sign In with Google
          </button>

          <div className="relative flex items-center justify-center py-6">
            <span className="absolute bg-white px-4 text-slate-400 text-xs font-bold uppercase tracking-widest">OR</span>
            <div className="w-full h-px bg-slate-100"></div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Teacher Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold"
                placeholder="teacher@school.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95 min-h-11"
            >
              Staff: Email Login
            </button>
          </form>
        </div>
        
        <p className="mt-10 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">
          Secure authentication powered by Firebase
        </p>
      </div>
    </div>
  );
}

export function SchoolRegistrationPage() {
  const [schoolInfo, setSchoolInfo] = useState({
    schoolName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    principalName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, setUserData, setSchoolData } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const schoolId = user.uid; // Admin's UID is the school's ID

      // 1. Create School Document
      const schoolDoc = {
        ...schoolInfo,
        adminId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(doc(db, "schools", schoolId), schoolDoc);

      // 2. Update User Document
      const userDoc = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: 'admin',
        schoolId: schoolId,
        status: 'active',
        createdAt: serverTimestamp()
      };
      await setDoc(doc(db, "users", user.uid), userDoc);

      // 3. Update context immediately
      setUserData(userDoc);
      setSchoolData(schoolDoc);

      // 4. Optional redirect to main app
      window.location.href = '/';
    } catch (err) {
      setError("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-inter">
      <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm w-full max-w-2xl">
        <h1 className="text-4xl font-jakarta font-bold text-slate-800 mb-2">Register Your School</h1>
        <p className="text-slate-500 mb-10">Complete your school profile to get started.</p>

        {error && <div className="bg-sh-pink/20 text-slate-800 p-4 rounded-xl mb-6 text-sm font-bold border border-sh-pink/30">{error}</div>}

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">School Name</label>
            <input 
              type="text" 
              required
              value={schoolInfo.schoolName}
              onChange={(e) => setSchoolInfo({...schoolInfo, schoolName: e.target.value})}
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-sh-blue focus:ring-2 focus:ring-sh-blue/20 outline-none transition-all font-semibold"
              placeholder="e.g. Central High School"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Address</label>
            <textarea 
              required
              rows="2"
              value={schoolInfo.address}
              onChange={(e) => setSchoolInfo({...schoolInfo, address: e.target.value})}
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-sh-blue focus:ring-2 focus:ring-sh-blue/20 outline-none transition-all font-semibold"
              placeholder="123 Main Street..."
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">City</label>
            <input 
              type="text" 
              required
              value={schoolInfo.city}
              onChange={(e) => setSchoolInfo({...schoolInfo, city: e.target.value})}
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-sh-blue focus:ring-2 focus:ring-sh-blue/20 outline-none transition-all font-semibold"
              placeholder="Mumbai"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">State</label>
            <input 
              type="text" 
              required
              value={schoolInfo.state}
              onChange={(e) => setSchoolInfo({...schoolInfo, state: e.target.value})}
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-sh-blue focus:ring-2 focus:ring-sh-blue/20 outline-none transition-all font-semibold"
              placeholder="Maharashtra"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pincode</label>
            <input 
              type="text" 
              required
              value={schoolInfo.pincode}
              onChange={(e) => setSchoolInfo({...schoolInfo, pincode: e.target.value})}
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-sh-blue focus:ring-2 focus:ring-sh-blue/20 outline-none transition-all font-semibold"
              placeholder="400001"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">School Phone</label>
            <input 
              type="tel" 
              required
              value={schoolInfo.phone}
              onChange={(e) => setSchoolInfo({...schoolInfo, phone: e.target.value})}
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-sh-blue focus:ring-2 focus:ring-sh-blue/20 outline-none transition-all font-semibold"
              placeholder="9876543210"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">School Email</label>
            <input 
              type="email" 
              required
              value={schoolInfo.email}
              onChange={(e) => setSchoolInfo({...schoolInfo, email: e.target.value})}
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-sh-blue focus:ring-2 focus:ring-sh-blue/20 outline-none transition-all font-semibold"
              placeholder="school@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Principal's Name</label>
            <input 
              type="text" 
              required
              value={schoolInfo.principalName}
              onChange={(e) => setSchoolInfo({...schoolInfo, principalName: e.target.value})}
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-sh-blue focus:ring-2 focus:ring-sh-blue/20 outline-none transition-all font-semibold"
              placeholder="Dr. Jane Doe"
            />
          </div>

          <div className="md:col-span-2 pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-sh-blue hover:bg-sh-blue-hover text-slate-800 py-4 px-6 rounded-xl font-bold transition-all shadow-sm min-h-11 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Complete Registration 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
