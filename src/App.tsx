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
import { ScrollToTop } from './components/ScrollToTop';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-white">
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
    <BrowserRouter>
      <div className="bg-white min-h-screen text-slate-800 font-sans selection:bg-blue-200 selection:text-slate-900 flex flex-col">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/kegiatan" element={<AdminActivities />} />
          <Route path="/admin/kegiatan/tambah" element={<AdminAddActivity />} />
          <Route path="/admin/kegiatan/ubah/:id" element={<AdminEditActivity />} />

          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route element={<ContainerLayout />}>
              <Route path="kegiatan" element={<Activities />} />
              <Route path="kegiatan/:id" element={<ActivityDetail />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
