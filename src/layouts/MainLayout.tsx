import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar/Sidebar';
import Navbar from '../components/layout/Navbar/Navbar';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col">
        <Navbar />
        <main className="p-8 flex-1 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
