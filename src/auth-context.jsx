import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase-config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [schoolData, setSchoolData] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign in with Google (Admins)
  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      throw error;
    }
  }

  // Sign in with Email (Teachers/Staff)
  async function loginWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      throw error;
    }
  }

  // Logout
  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  }

  // Check module permission
  function hasPermission(moduleId) {
    if (!userData) return false;
    if (userData.role === 'admin') return true;
    if (!permissions || !permissions.allowedModules) return false;
    return permissions.allowedModules.includes(moduleId);
  }

  useEffect(() => {
    let unsubscribePerms = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (!currentUser) {
        if (unsubscribePerms) {
          unsubscribePerms();
          unsubscribePerms = null;
        }
        setUser(null);
        setUserData(null);
        setSchoolData(null);
        setPermissions(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);

        if (data.schoolId) {
          const schoolDocRef = doc(db, "schools", data.schoolId);
          const schoolDoc = await getDoc(schoolDocRef);
          if (schoolDoc.exists()) {
            setSchoolData(schoolDoc.data());
          }
        }

        if (unsubscribePerms) {
          unsubscribePerms();
        }

        // For teachers/staff, check permissions by email
        // For admins, it doesn't matter much as they have full access, but we'll try UID first, then email
        const permDocRef = doc(db, "permissions", currentUser.uid);
        const emailPermDocRef = doc(db, "permissions", currentUser.email);

        unsubscribePerms = onSnapshot(emailPermDocRef, (emailDoc) => {
          if (emailDoc.exists()) {
            setPermissions(emailDoc.data());
          } else {
            // Fallback to UID for backward compatibility
            const unsubUid = onSnapshot(permDocRef, (uidDoc) => {
              if (uidDoc.exists()) {
                setPermissions(uidDoc.data());
              } else {
                setPermissions({ allowedModules: [] });
              }
            });
            // Overwrite with UID unsubscribe if needed
          }
        });

        setLoading(false);
        return;
      }

      // New user (likely first-time admin)
      setUserData({
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        role: 'admin',
        status: 'pending_registration'
      });
      setPermissions({ allowedModules: [] });
      setLoading(false);
    });

    return () => {
      if (unsubscribePerms) {
        unsubscribePerms();
      }
      unsubscribeAuth();
    };
  }, []);

  const value = {
    user,
    userData,
    schoolData,
    permissions,
    userRole: userData?.role,
    setUserData,
    setSchoolData,
    setPermissions,
    loginWithGoogle,
    loginWithEmail,
    logout,
    hasPermission,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
