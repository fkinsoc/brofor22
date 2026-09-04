import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  AlertTriangle,
  FileText,
  UploadCloud,
  Settings,
  Search,
  Bell,
  Menu,
  LogOut,
  Activity,
  CheckCircle2,
  X
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'motion/react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const content = document.getElementById('main-content');
      if (!content) {
        alert('Could not find content to export');
        return;
      }
      
      // Store original styles to restore later
      const originalHeight = content.style.height;
      const originalOverflow = content.style.overflow;
      
      // Temporarily expand the container to show all content for html2canvas
      content.style.height = 'max-content';
      content.style.overflow = 'visible';

      const canvas = await html2canvas(content, {
        scale: 2,
        backgroundColor: '#0A0A0A',
        logging: false,
        useCORS: true,
        windowHeight: content.scrollHeight // Ensure full height is captured
      });
      
      // Restore original styles
      content.style.height = originalHeight;
      content.style.overflow = originalOverflow;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add pages if content exceeds one page
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
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

  const notifications = [
    { id: 1, text: "High risk parcel identified in Village A", time: "5m ago", type: "alert" },
    { id: 2, text: "AI Report successfully generated", time: "1h ago", type: "success" },
    { id: 3, text: "New legal dispute flagged on Parcel #1042", time: "3h ago", type: "alert" },
  ];

  if (loading || !user) {
    return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-black text-[#E0E0E0] flex overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Background ambient effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-amber-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A]/80 backdrop-blur-2xl border-r border-white/5 flex flex-col transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl`}>
        <div className="p-6 border-b border-white/5 flex flex-col justify-center h-20">
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 font-bold text-xl tracking-tight">BRO FORESEE</div>
          <div className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.25em] mt-1">Predictive AI Engine</div>
        </div>
        <nav className="flex-1 py-4 flex flex-col overflow-y-auto px-3 gap-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`relative px-4 py-2.5 text-sm flex items-center gap-3 rounded-lg transition-all duration-300 group overflow-hidden ${
                  isActive
                    ? 'text-white font-medium bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent pointer-events-none"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-4 h-4 flex-shrink-0 relative z-10 transition-colors ${isActive ? 'text-blue-400' : 'group-hover:text-zinc-200'}`} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 mt-auto border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              {user.email ? user.email[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">{user.email}</div>
              <div className="text-[10px] text-zinc-500 uppercase font-semibold">{role === 'admin' ? 'Admin Authority' : 'Field Operator'}</div>
            </div>
            <button onClick={handleLogout} className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 shadow-sm">
          <div className="flex items-center gap-4 lg:gap-8">
            <button
              className="lg:hidden text-zinc-400 hover:text-white mr-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xs font-bold tracking-widest uppercase text-zinc-500 hidden sm:block">Predictive Risk Command</h1>
            <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
            <div className="flex items-center gap-2 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-red-500 tracking-wider uppercase">Live Threat Vector</span>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-end gap-3 lg:gap-5">
            <div className="relative max-w-sm w-full hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-500" />
              </div>
              <input
                type="text"
                placeholder="Search command center..."
                className="block w-full pl-9 pr-3 py-1.5 border border-white/10 rounded-full bg-white/5 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 sm:text-xs transition-all"
              />
            </div>
            
            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider hidden lg:block mr-2">Sync: <span className="text-emerald-400">Stable</span></div>
            
            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all group"
              >
                <Bell className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-[#0A0A0A]" />
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute right-0 mt-2 w-80 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                  >
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h3>
                      <button onClick={() => setShowNotifications(false)} className="text-zinc-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3 group cursor-pointer">
                          <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${notif.type === 'alert' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                          <div>
                            <p className="text-xs text-zinc-300 group-hover:text-white transition-colors leading-relaxed">{notif.text}</p>
                            <p className="text-[10px] text-zinc-500 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-white/10 bg-white/5 text-center">
                      <button className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider">View All Updates</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={handleExportPDF} 
              disabled={isExporting}
              className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-bold rounded-lg uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] hidden sm:block disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? 'Compiling PDF...' : 'Export PDF'}
            </button>
          </div>
        </header>

        {/* Main scrollable area */}
        <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
