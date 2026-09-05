import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, OAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Github, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSuccessfulAuth = async (user: any) => {
    // Check if user doc exists
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      // Create user doc
      await setDoc(userRef, {
        email: user.email || '',
        role: user.email === 'klassic.ig@gmail.com' ? 'admin' : 'user',
        name: user.displayName || user.email?.split('@')[0] || 'User'
      });
    }
    navigate('/');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        await handleSuccessfulAuth(credential.user);
      } else {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await handleSuccessfulAuth(credential.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: any) => {
    setError('');
    setLoading(true);
    try {
      const credential = await signInWithPopup(auth, provider);
      await handleSuccessfulAuth(credential.user);
    } catch (err: any) {
      setError(err.message || 'OAuth authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary dark:bg-[#0A0A0A] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zinc-900 dark:bg-zinc-100/20 rounded-none blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-900/10 rounded-none blur-[100px] pointer-events-none"></div>
      <div className="max-w-md w-full bg-background-secondary dark:bg-[#111111]/80 border border-border-subtle dark:border-zinc-800/50 rounded-none p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-text-primary dark:text-white mb-2 tracking-tight">BRO FORESEE</h1>
          <p className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase tracking-[0.2em]">Secure Access Required</p>
        </div>
        {error && (
          <div className="bg-zinc-900 dark:bg-zinc-100/30 border border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 text-xs p-3 rounded-none mb-6 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase text-zinc-600 dark:text-zinc-400 mb-1 font-bold tracking-wider">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-background-primary dark:bg-[#0A0A0A]/50 border border-border-subtle dark:border-zinc-800 rounded-none px-4 py-3 text-sm text-text-primary dark:text-white focus:outline-none focus:border-zinc-900 dark:border-zinc-100 focus:ring-1 focus:ring-zinc-500" required />
          </div>
          <div>
            <label className="block text-[10px] uppercase text-zinc-600 dark:text-zinc-400 mb-1 font-bold tracking-wider">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-background-primary dark:bg-[#0A0A0A]/50 border border-border-subtle dark:border-zinc-800 rounded-none px-4 py-3 text-sm text-text-primary dark:text-white focus:outline-none focus:border-zinc-900 dark:border-zinc-100 focus:ring-1 focus:ring-zinc-500" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-white text-black text-[11px] font-bold rounded-none font-semibold py-3 mt-4 hover:bg-zinc-100 dark:bg-zinc-900 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50" >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-subtle dark:border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background-secondary dark:bg-[#111111] text-zinc-600 dark:text-zinc-400 text-[10px] font-semibold">Or continue with</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => handleOAuth(new GoogleAuthProvider())} type="button" className="flex justify-center items-center py-2.5 border border-border-subtle dark:border-zinc-800 rounded-none hover:bg-zinc-800/50 transition-colors" >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </button>
          <button onClick={() => handleOAuth(new GithubAuthProvider())} type="button" className="flex justify-center items-center py-2.5 border border-border-subtle dark:border-zinc-800 rounded-none hover:bg-zinc-800/50 transition-colors" >
            <Github className="w-5 h-5 text-zinc-800 dark:text-zinc-300" />
          </button>
          <button onClick={() => { const msProvider = new OAuthProvider('microsoft.com'); handleOAuth(msProvider); }} type="button" className="flex justify-center items-center py-2.5 border border-border-subtle dark:border-zinc-800 rounded-none hover:bg-zinc-800/50 transition-colors" >
            <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
              <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
            </svg>
          </button>
        </div>
        <div className="mt-6 text-center space-y-4">
          <button onClick={() => setIsLogin(!isLogin)} className="text-[10px] text-zinc-600 dark:text-zinc-400 hover:text-text-primary dark:text-white font-semibold transition-colors" >
            {isLogin ? 'Need an account? Create one' : 'Already have an account? Sign in'}
          </button>
          <div className="text-[10px] text-zinc-600 dark:text-zinc-400">
            By continuing, you agree to <strong className="text-zinc-900 dark:text-zinc-100">Brown's Squad</strong> <br/>
            <a href="/legal" className="underline hover:text-zinc-900 dark:text-zinc-100 transition-colors">Terms of Service</a> and <a href="/legal" className="underline hover:text-zinc-900 dark:text-zinc-100 transition-colors">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}