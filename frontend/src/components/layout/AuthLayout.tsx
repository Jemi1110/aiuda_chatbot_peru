import { Link } from 'react-router-dom';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
     
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
