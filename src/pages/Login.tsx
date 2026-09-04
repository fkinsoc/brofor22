import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // By default, make the first users admins for testing if we want, or just 'user'
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          role: email.includes('admin') ? 'admin' : 'user', // simple test condition
          name: email.split('@')[0]
        });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#111111] border border-zinc-800 rounded-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light text-white mb-2">BRO FORESEE</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">Secure Access Required</p>
        </div>
        
        {error && (
          <div className="bg-red-950/30 border border-red-900/50 text-red-500 text-xs p-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase text-zinc-500 mb-1 font-bold tracking-wider">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-zinc-800 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase text-zinc-500 mb-1 font-bold tracking-wider">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-zinc-800 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black text-[11px] font-bold rounded uppercase tracking-wider py-3 mt-4 hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-wider"
          >
            {isLogin ? 'Need an account? Create one' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
