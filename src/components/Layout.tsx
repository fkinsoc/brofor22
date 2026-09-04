import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  AlertTriangle,
  FileText,
  UploadCloud,
  Settings,
  Search,
  Bell,
  User,
  Menu,
  LogOut,
  Activity
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const content = document.getElementById('main-content');
      if (!content) {
        alert('Could not find content to export');
        return;
      }
      
      const canvas = await html2canvas(content, {
        scale: 2,
        backgroundColor: '#0A0A0A',
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('bro-foresee-report.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please check the console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Land Parcels', href: '/parcels', icon: FileText },
    { name: 'GIS Map', href: '/map', icon: MapIcon },
    { name: 'Early Warnings', href: '/alerts', icon: AlertTriangle },
    { name: 'Data Upload', href: '/upload', icon: UploadCloud },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'System Logs', href: '/logs', icon: Activity },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  if (loading || !user) {
    return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center"><div className="w-4 h-4 rounded-full border-2 border-zinc-800 border-t-white animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] flex overflow-hidden font-sans">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] border-r border-zinc-800 flex flex-col transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block transition-transform duration-300 ease-in-out`}>
        <div className="p-6 border-b border-zinc-800 flex flex-col justify-center h-24">
          <div className="text-white font-bold text-xl tracking-tight">BRO FORESEE</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-1">By Brown&apos;s Squad</div>
        </div>
        <nav className="flex-1 py-4 flex flex-col overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`px-6 py-3 text-sm flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'text-white bg-zinc-900 border-r-2 border-white font-medium'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                {isActive ? <span className="w-1.5 h-1.5 rounded-full bg-white mr-1 flex-shrink-0" /> : <item.icon className="w-4 h-4 mr-1 opacity-70 flex-shrink-0" />}
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-6 mt-auto border-t border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-white uppercase">
              {user.email ? user.email[0] : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">{user.email}</div>
              <div className="text-[10px] text-zinc-500 uppercase">{role === 'admin' ? 'Admin Authority' : 'Field Operator'}</div>
            </div>
            <button onClick={handleLogout} className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#0A0A0A] border-b border-zinc-800 z-40">
          <div className="flex items-center gap-4 lg:gap-8">
            <button
              className="lg:hidden text-zinc-400 hover:text-white mr-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-sm font-medium tracking-wide uppercase text-zinc-400 hidden sm:block">Predictive Risk Command</h1>
            <div className="h-4 w-px bg-zinc-800 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-[11px] font-bold text-red-500 tracking-wider uppercase">Critical Priority</span>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-end gap-4 lg:gap-6">
            <div className="relative max-w-sm w-full hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-zinc-500" />
              </div>
              <input
                type="text"
                placeholder="Search parcels, projects, owners..."
                className="block w-full pl-9 pr-3 py-1.5 border border-zinc-800 rounded bg-[#111111] text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 sm:text-xs"
              />
            </div>
            
            <div className="text-[11px] text-zinc-500 uppercase hidden lg:block">Sync Status: Live</div>
            <button className="relative p-1.5 text-zinc-400 hover:text-white transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 block h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-[#0A0A0A]" />
            </button>
            <button 
              onClick={handleExportPDF} 
              disabled={isExporting}
              className="px-4 py-1.5 bg-white text-black text-[11px] font-bold rounded uppercase tracking-wider hover:bg-zinc-200 transition-colors hidden sm:block disabled:opacity-50"
            >
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
        </header>

        {/* Main scrollable area */}
        <main id="main-content" className="flex-1 overflow-y-auto bg-[#0A0A0A] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
