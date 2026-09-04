import React, { useState, useEffect } from 'react';
import AppLayout from '../components/Layout';
import { useAuth } from '../lib/auth-context';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Shield, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function SettingsPage() {
  const { user, role } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    if (role === 'admin') {
      fetchUsers();
    }
  }, [role]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      const usersData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string, userName: string, userEmail: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        name: userName || userEmail.split('@')[0],
        email: userEmail
      });
      setUpdateMessage('Role updated successfully.');
      setTimeout(() => setUpdateMessage(''), 3000);
      fetchUsers();
    } catch (err: any) {
      console.error('Error updating role:', err);
      alert('Failed to update role. Check console for details.');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight">System Settings</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your account and administrative preferences.</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" /> Account Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">Email</label>
              <div className="text-zinc-300 text-sm">{user?.email}</div>
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">System Role</label>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-zinc-300 font-medium">
                {role === 'admin' ? <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> : <Shield className="w-3.5 h-3.5 text-blue-400" />}
                {role === 'admin' ? 'Administrator' : 'Standard User'}
              </div>
            </div>
          </div>
        </motion.div>

        {role === 'admin' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-medium text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" /> Access Control (Admin Only)
              </h2>
              {updateMessage && (
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {updateMessage}
                </span>
              )}
            </div>
            
            {loadingUsers ? (
              <div className="text-sm text-zinc-500 py-4 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /> Fetching users...
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-white/5">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-black/50 border-b border-white/5">
                    <tr>
                      <th className="px-4 py-3">User Email</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-white">{u.email}</td>
                        <td className="px-4 py-3 text-zinc-400">{u.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border shadow-sm ${u.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <select 
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value, u.name, u.email)}
                            disabled={u.email === user?.email}
                            className="bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-sm font-medium text-white mb-4">Legal & Compliance</h2>
          <div className="space-y-3 text-sm text-zinc-400">
             <p>All data is processed ephemerally. Predictive models are for decision support only.</p>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
