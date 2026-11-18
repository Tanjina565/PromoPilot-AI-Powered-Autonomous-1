import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { VisitPage } from './pages/VisitPage';
import { BusinessesPage } from './pages/BusinessesPage';
import { ProductsPage } from './pages/ProductsPage';
import { AiContentPage } from './pages/AiContentPage';
import { MlPredictionPage } from './pages/MlPredictionPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ContentHistoryPage } from './pages/ContentHistoryPage';
import { ModelMetricsPage } from './pages/admin/ModelMetricsPage';
import { PlatformMonitorPage } from './pages/admin/PlatformMonitorPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { ConfidentialGate } from './components/common/ConfidentialGate';

// Role and Authentication Gate Guard
const ProtectedRoute = ({
  children,
  featureName = 'This Confidential Module',
  requiredRole = 'Business Owner or Admin',
  requireAdmin = false,
}) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // If not authenticated, render the Confidential Gate with sign-in guidance
  if (!isAuthenticated) {
    return (
      <ConfidentialGate
        featureName={featureName}
        requiredRole={requiredRole}
        description={`Access to ${featureName} is confidential to authenticated ${requiredRole} accounts to protect sensitive brand voice, connected social channels, and private catalog data.`}
      />
    );
  }

  // If requires Admin role and user is not admin
  if (requireAdmin && !isAdmin) {
    return (
      <ConfidentialGate
        featureName={featureName}
        requiredRole="Admin Only"
        description="This administrative section is strictly restricted to platform administrators for governance and role assignment."
      />
    );
  }

  return children;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Visit / Landing Page (No Login Required) */}
          <Route path="/visit" element={<VisitPage />} />

          {/* Public Auth Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Application Layout Shell */}
          <Route path="/" element={<AppLayout />}>
            {/* Overview Dashboard — open to visitors & authenticated users */}
            <Route index element={<DashboardPage />} />

            {/* Confidential Business & Marketing Modules */}
            <Route
              path="businesses"
              element={
                <ProtectedRoute featureName="Business Profile Management" requiredRole="Business Owner">
                  <BusinessesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="products"
              element={
                <ProtectedRoute featureName="Product Catalog Foundation" requiredRole="Business Owner">
                  <ProductsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="ai-content"
              element={
                <ProtectedRoute featureName="AI Content Generator" requiredRole="Business Owner">
                  <AiContentPage />
                </ProtectedRoute>
              }
            />

            {/* ML Best Time Prediction — Simulator is open to all visitors */}
            <Route path="ml-prediction" element={<MlPredictionPage />} />

            {/* Confidential Analytics & History */}
            <Route
              path="recommendations"
              element={
                <ProtectedRoute featureName="Proprietary Recommendations & Analytics" requiredRole="Business Owner">
                  <RecommendationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="content-history"
              element={
                <ProtectedRoute featureName="Content Campaign History" requiredRole="Business Owner">
                  <ContentHistoryPage />
                </ProtectedRoute>
              }
            />

            {/* Restricted Admin Only Modules */}
            <Route
              path="admin/users"
              element={
                <ProtectedRoute featureName="User Role Assignment & Governance" requireAdmin={true} requiredRole="Admin">
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/model-metrics"
              element={
                <ProtectedRoute featureName="Model Evaluation & Retraining" requireAdmin={true} requiredRole="Admin">
                  <ModelMetricsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/platform-monitor"
              element={
                <ProtectedRoute featureName="Platform Architecture Telemetry" requireAdmin={true} requiredRole="Admin">
                  <PlatformMonitorPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
