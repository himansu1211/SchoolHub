import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth-context'
import { ProtectedRoute } from './route-protection'
import SchoolManagementSystem from './App.jsx'
import { PermissionManagementPage } from './permission-management'
import { LoginPage, SchoolRegistrationPage } from './auth-pages'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SchoolRegistrationPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute moduleId="dashboard">
                <SchoolManagementSystem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/permissions"
            element={
              <ProtectedRoute moduleId="staff">
                <PermissionManagementPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
      <Toaster position="top-right" />
    </BrowserRouter>
  </React.StrictMode>
)

