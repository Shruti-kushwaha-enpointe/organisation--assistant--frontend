import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, FileText, MessageSquare, LogOut } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/organizations', label: 'Organizations', icon: <Building2 size={20} /> },
    { path: '/documents', label: 'Documents', icon: <FileText size={20} /> },
    { path: '/chat', label: 'Chat', icon: <MessageSquare size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-[260px] h-screen bg-cards border-r border-border flex flex-col fixed top-0 left-0 z-40">
      <div className="h-[70px] flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary text-white rounded-md flex items-center justify-center font-bold text-sm">OA</div>
          <span className="font-semibold text-[1.1rem] text-text-main">Org Assistant</span>
        </div>
      </div>

      <nav className="px-4 py-6 flex-grow">
        <ul className="list-none flex flex-col gap-2 m-0 p-0">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-all ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-text-muted hover:bg-background hover:text-primary'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 py-6 border-t border-border">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-md text-error font-medium w-full border-none bg-transparent cursor-pointer transition-all hover:bg-error/10">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
