// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { PublicLandingPage } from './pages/PublicLandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProblemLibraryPage } from './pages/ProblemLibraryPage';
import { ProblemDetailPage } from './pages/ProblemDetailPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { FeedbackPage } from './pages/FeedbackPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProgressPage } from './pages/ProgressPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* PART A — Public Landing Page */}
        <Route path="/" element={<PublicLandingPage />} />

        {/* PART B — Logged-In Engineering Workspace App Shell */}
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />
        <Route
          path="/problems"
          element={
            <AppLayout>
              <ProblemLibraryPage />
            </AppLayout>
          }
        />
        <Route
          path="/problems/:slug"
          element={
            <AppLayout>
              <ProblemDetailPage />
            </AppLayout>
          }
        />
        <Route
          path="/practice/:slug"
          element={
            <AppLayout>
              <WorkspacePage />
            </AppLayout>
          }
        />
        <Route
          path="/attempts/:attemptId"
          element={
            <AppLayout>
              <FeedbackPage />
            </AppLayout>
          }
        />
        <Route
          path="/history"
          element={
            <AppLayout>
              <HistoryPage />
            </AppLayout>
          }
        />
        <Route
          path="/progress"
          element={
            <AppLayout>
              <ProgressPage />
            </AppLayout>
          }
        />
        <Route
          path="/resources"
          element={
            <AppLayout>
              <ResourcesPage />
            </AppLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
