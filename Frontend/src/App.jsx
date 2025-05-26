import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookDetails from './pages/BookDetails';
import Profile from './pages/Profile';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container py-8">
            <div className="max-w-4xl mx-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/books/:id" element={<BookDetails />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </main>
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="container py-6">
              <p className="text-center text-gray-600 text-sm">
                © {new Date().getFullYear()} Book Review App. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
