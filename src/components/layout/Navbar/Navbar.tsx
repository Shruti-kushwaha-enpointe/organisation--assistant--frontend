import { Bell, Search, User } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-[70px] bg-cards border-b border-border flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="relative w-[400px]">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input 
          type="text" 
          placeholder="Search across organizations..." 
          className="w-full py-[0.6rem] pr-4 pl-10 border border-border rounded-lg bg-background text-text-main text-[0.9rem] transition-all outline-none focus:border-primary focus:bg-white focus:ring-[2px] focus:ring-primary/10"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <button className="bg-transparent text-text-muted relative flex items-center justify-center p-2 rounded-full transition-colors hover:bg-background hover:text-text-main">
          <Bell size={20} />
          <span className="absolute top-[6px] right-[8px] w-2 h-2 bg-error rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 cursor-pointer py-1 px-2 rounded-md transition-colors hover:bg-background">
          <div className="w-9 h-9 bg-accent text-white rounded-full flex items-center justify-center">
            <User size={18} />
          </div>
          <span className="font-medium text-[0.95rem] text-text-main">Shruti Kushwaha</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
