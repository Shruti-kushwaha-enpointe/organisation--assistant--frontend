import { Bell, Search, User, Menu } from 'lucide-react';

import { useAuthStore } from '../../../store/authStore';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user } = useAuthStore();
  
  return (
    <header className="h-[70px] bg-cards border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 text-text-muted hover:text-text-main hover:bg-black/5 rounded-md"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="relative w-full max-w-[400px] hidden md:block">
          {/* Search omitted for brevity */}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 cursor-pointer py-1 px-2 rounded-md transition-colors hover:bg-background">
          <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase() || <User size={18} />}
          </div>
          <span className="font-medium text-[0.95rem] text-text-main">{user?.name || user?.email || 'Guest'}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
