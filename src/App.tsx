import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context';

import Dashboard from './pages/Dashboard';
import ParcelsPage from './pages/Parcels';
import ParcelDetails from './pages/ParcelDetails';
import GISMapPage from './pages/GISMap';
import AlertsPage from './pages/Alerts';
import DataUploadPage from './pages/Upload';
import ReportsPage from './pages/Reports';
import LogsPage from './pages/Logs';
import SettingsPage from './pages/Settings';
import LoginPage from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/parcels" element={<ParcelsPage />} />
          <Route path="/parcels/:id" element={<ParcelDetails />} />
          <Route path="/map" element={<GISMapPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/upload" element={<DataUploadPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
