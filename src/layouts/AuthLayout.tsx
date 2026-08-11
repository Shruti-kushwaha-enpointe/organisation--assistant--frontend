import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-[440px] p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
