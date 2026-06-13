import React from 'react';
import {Outlet} from 'react-router-dom';

export default function DashboardLayout() {
  return(
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-zinc-800">
      Sidebar
      </aside>

      <main className="flex-1">
       <Outlet />
      </main>
    </div>
  );
}
