import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import JobApplicants from './pages/JobApplicants';
import EditJob from './pages/EditJob';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound'; // <--- 1. IMPORT THIS
import SavedJobs from './pages/SavedJobs';


// The Security Guard: Prevents unauthorized access
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/dashboard" />;

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes - No Navbar here */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Secure Private Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* 2. PROTECT THE PROFILE ROUTE */}
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          
          {/* Secure Recruiter Only Routes */}
          <Route path="/post-job" element={<ProtectedRoute allowedRole="recruiter"><PostJob /></ProtectedRoute>} />
          <Route path="/job-applicants/:jobId" element={<ProtectedRoute allowedRole="recruiter"><JobApplicants /></ProtectedRoute>} />
          <Route path="/edit-job/:jobId" element={<ProtectedRoute allowedRole="recruiter"><EditJob /></ProtectedRoute>} />
          <Route path="/saved-jobs" element={<SavedJobs />} />

          {/* 3. CATCH-ALL 404 ROUTE (Must be at the bottom) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;