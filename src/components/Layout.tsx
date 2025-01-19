import React from 'react';
import { Outlet } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Building2 className="h-8 w-8 text-indigo-600" />
          <h1 className="ml-3 text-2xl font-semibold text-gray-900">
            ChatFull for eMail
          </h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}