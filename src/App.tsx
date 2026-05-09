/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Activities } from './pages/Activities';
import { ActivityDetail } from './pages/ActivityDetail';
import { AdminLogin } from './pages/admin/Login';
import { AdminActivities } from './pages/admin/Activities';
import { AdminAddActivity } from './pages/admin/AddActivity';
import { AdminEditActivity } from './pages/admin/EditActivity';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminClients } from './pages/admin/Clients';
import { AdminContacts } from './pages/admin/Contacts';
import { AdminSettings } from './pages/admin/Settings';
import { AdminProfile } from './pages/admin/Profile';
import { AdminLayout } from './layouts/AdminLayout';
import { ScrollToTop } from './components/ScrollToTop';
import { NotFound } from './pages/NotFound';
import { ServerError } from './pages/ServerError';
import { ErrorBoundary } from './components/ErrorBoundary';

import { AnimatedBackground } from './components/AnimatedBackground';

function PublicLayout() {
  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <main className="flex-1 w-full relative z-10">
        <Outlet />
      </main>
      <ScrollToTop />
    </>
  );
}

function ContainerLayout() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 mt-24">
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="bg-white min-h-screen text-slate-800 font-sans selection:bg-blue-200 selection:text-slate-900 flex flex-col">
          <Routes>
          {/* Admin Routes */}
          <Route path="/kekarjaya-admin-panel" element={<AdminLogin />} />
          <Route path="/kekarjaya-admin-panel" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="kegiatan" element={<AdminActivities />} />
            <Route path="kegiatan/tambah" element={<AdminAddActivity />} />
            <Route path="kegiatan/ubah/:id" element={<AdminEditActivity />} />
            <Route path="klien" element={<AdminClients />} />
            <Route path="kontak" element={<AdminContacts />} />
            <Route path="pengaturan" element={<AdminSettings />} />
            <Route path="profil" element={<AdminProfile />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route element={<ContainerLayout />}>
              <Route path="kegiatan" element={<Activities />} />
              <Route path="kegiatan/:id" element={<ActivityDetail />} />
            </Route>
          </Route>

          {/* Error Routes */}
          <Route path="/500" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
    </ErrorBoundary>
  );
}
