import React from 'react';
import { useAuth } from './auth-context';
import { LoginPage, SchoolRegistrationPage } from './auth-pages';

export function ProtectedRoute({ children, moduleId }) {
  const { user, userData, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-inter">
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="animate-spin rounded-xl h-12 w-12 border-4 border-sh-blue border-t-transparent mx-auto mb-6"></div>
          <p className="text-xl text-slate-800 font-bold font-jakarta">Loading SchoolHub...</p>
          <p className="text-slate-400 mt-2">Preparing your workspace</p>
        </div>
      </div>
    );
  }

  // 1. Not logged in
  if (!user) {
    return <LoginPage />;
  }

  // 2. Logged in but school not registered (Admins only)
  if (userData?.role === 'admin' && userData?.status === 'pending_registration') {
    return <SchoolRegistrationPage />;
  }

  // 3. Logged in but no permission for specific module
  if (moduleId && !hasPermission(moduleId)) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8 font-inter">
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center max-w-md">
          <div className="text-6xl mb-6">🚫</div>
          <h2 className="text-3xl font-jakarta font-bold text-slate-800 mb-4">Access Restricted</h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            You do not have permission to access the <span className="font-bold text-slate-800">"{moduleId}"</span> module.
          </p>
          <p className="text-slate-400 mt-4 text-sm font-bold uppercase tracking-wider">Please contact your administrator ✨</p>
        </div>
      </div>
    );
  }

  return children;
}

export function ReadOnlyOverlay({ moduleId }) {
  const { hasPermission, userData } = useAuth();

  // Admins always have full access
  if (userData?.role === 'admin') return null;

  // Check if teacher has edit permission
  if (hasPermission(moduleId)) return null;

  return (
    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-[50] flex items-center justify-center cursor-not-allowed group transition-all">
      <div className="bg-sh-orange text-slate-800 px-6 py-3 rounded-xl shadow-sm font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
        <span>👁️</span> View Only Mode
      </div>
    </div>
  );
}

export function ModuleAccessBadge({ moduleId }) {
  const { hasPermission, userData } = useAuth();

  if (userData?.role === 'admin') {
    return (
      <span className="text-[10px] font-bold px-3 py-1 bg-sh-green text-slate-800 rounded-lg uppercase tracking-wider shadow-sm">
        Full Access ✨
      </span>
    );
  }

  const canEdit = hasPermission(moduleId);

  return (
    <span className={`text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm ${canEdit ? 'bg-sh-blue text-slate-800' : 'bg-sh-orange text-slate-800'}`}>
      {canEdit ? 'Can Edit ✨' : 'View Only 👁️'}
    </span>
  );
}

export function AuthenticatedSidebar({ modules, currentModule, onModuleChange }) {
  const { logout, userData, hasPermission } = useAuth();

  return (
<div className="w-72 bg-gradient-to-b from-pastel-rose/20 to-pastel-lavender/10 backdrop-blur-xl border-r border-pastel-aqua/30 h-screen flex flex-col shadow-glow-lg">
      <div className="p-6 border-b border-gray-100">
<h1 className="text-3xl font-black bg-gradient-to-r from-pastel-pink via-pastel-peach to-pastel-mint bg-clip-text text-transparent drop-shadow-lg mb-1">SchoolHub 🎓 ✨</h1>
        <p className="text-sm bg-pastel-lavender/50 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-pastel-lavender-dark badge-glow">
          {userData?.role === 'admin' ? 'Administrator' : 'Staff Member'}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {modules.map(module => {
          const isActive = currentModule === module.id;
          const canEdit = hasPermission(module.id);
          
          return (
            <button
              key={module.id}
              onClick={() => onModuleChange(module.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group hover:shadow-glow-mint hover:scale-[1.02] active:scale-95 ${isActive ? 'btn-primary shadow-glow-lg' : 'card-glow bg-white/70 hover:bg-pastel-rose/20 text-slate-700'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{module.icon}</span>
                <span className="font-medium">{module.label}</span>
              </div>
              <ModuleAccessBadge moduleId={module.id} />
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3 mb-4 p-2">
<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pastel-pink to-pastel-lavender flex items-center justify-center text-pastel-lavender-dark font-black text-xl shadow-glow animate-glow-pulse">
            {userData?.displayName?.charAt(0) || userData?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">{userData?.displayName || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 btn-secondary shadow-glow hover:shadow-glow-peach hover:scale-105 text-slate-700 font-bold py-3 rounded-2xl animate-float"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
}
