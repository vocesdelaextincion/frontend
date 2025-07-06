import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes/router';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

export default App;
