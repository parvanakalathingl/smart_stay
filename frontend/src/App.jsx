import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerDashboard from './pages/OwnerDashboard';
import AddListing from './pages/AddListing';
import AdminDashboard from './pages/AdminDashboard';
import Search from './pages/Search';
import PGDetail from './pages/PGDetail';
import MyBookings from './pages/MyBookings';
import BookingRequests from './pages/BookingRequests';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

    return children;
};

function AppRoutes() {
    return (
        <>
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/listings/:id" element={<PGDetail />} />
                    
                    <Route path="/owner-dashboard" element={
                        <ProtectedRoute roles={['owner']}>
                            <OwnerDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/add-listing" element={
                        <ProtectedRoute roles={['owner']}>
                            <AddListing />
                        </ProtectedRoute>
                    } />
                    <Route path="/booking-requests" element={
                        <ProtectedRoute roles={['owner']}>
                            <BookingRequests />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin-dashboard" element={
                        <ProtectedRoute roles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/bookings" element={
                        <ProtectedRoute roles={['user']}>
                            <MyBookings />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;
