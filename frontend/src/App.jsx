import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Customize from './pages/Customize';
import Customize2 from './pages/Customize2';
import { userDataContext } from './context/userContext';

function App() {
    const { userData, loading } = useContext(userDataContext);

    if (loading) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-xl font-semibold">Loading...</div>;
    }

    return (
        <Routes>
            <Route path="/" element={
                !userData ? <Navigate to="/signIn" /> :
                    (userData.assistantImage && userData.assistantName) ? <Home /> : <Navigate to="/customize" />
            } />
            <Route path="/signUp" element={!userData ? <SignUp /> : <Navigate to="/" />} />
            <Route path="/signIn" element={!userData ? <SignIn /> : <Navigate to="/" />} />
            <Route path="/customize" element={userData ? <Customize /> : <Navigate to="/signUp" />} />
            <Route path="/customize2" element={userData ? <Customize2 /> : <Navigate to="/signUp" />} />
        </Routes>
    )
}

export default App;