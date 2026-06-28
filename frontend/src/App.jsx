import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login       from './pages/Login';
import ResetPass   from './pages/ResetPassword';
import Home        from './pages/Home';
import Payment     from './pages/Payment';
import TopUp       from './pages/TopUp';
import Products    from './pages/Products';
import Documents   from './pages/Documents';
import Profile     from './pages/Profile';
import Navbar      from './components/Navbar';

function PrivateLayout({ children }) {
  const token = localStorage.getItem('leo_token');
  if (!token) return <Navigate to="/" replace />;
  return (
    <div className="app-shell">
      <header className="navbar">
        <span className="navbar-logo">Leo<span>Bank</span></span>
      </header>
      <main style={{ flex: 1, overflowY: 'auto' }}>{children}</main>
      <Navbar />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<Login />} />
        <Route path="/reset-password" element={<ResetPass />} />

        <Route path="/home"      element={<PrivateLayout><Home /></PrivateLayout>} />
        <Route path="/payment"   element={<PrivateLayout><Payment /></PrivateLayout>} />
        <Route path="/topup"     element={<PrivateLayout><TopUp /></PrivateLayout>} />
        <Route path="/products"  element={<PrivateLayout><Products /></PrivateLayout>} />
        <Route path="/documents" element={<PrivateLayout><Documents /></PrivateLayout>} />
        <Route path="/profile"   element={<PrivateLayout><Profile /></PrivateLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
