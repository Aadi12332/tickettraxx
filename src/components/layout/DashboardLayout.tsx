import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#F2F2F7]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-auto scroll-hide">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
