import React from 'react';
import AppLayout from '../components/Layout';
import { useAuth } from '../lib/auth-context';

export default function SettingsPage() {
  const { user, role } = useAuth();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-light text-white tracking-tight">System Settings</h1>
        
        <div className="bg-[#111111] border border-zinc-800 rounded-xl p-6">
          <h2 className="text-sm font-medium text-white mb-4">Account Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">Email</label>
              <div className="text-zinc-300 text-sm">{user?.email}</div>
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">System Role</label>
              <div className="inline-block px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-300">
                {role === 'admin' ? 'Administrator' : 'Standard User'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111111] border border-zinc-800 rounded-xl p-6">
          <h2 className="text-sm font-medium text-white mb-4">Legal & Compliance</h2>
          <div className="space-y-3 text-sm text-zinc-400">
             <p>All data is processed ephemerally. Predictive models are for decision support only.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
