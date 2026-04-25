import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const userDataContext = createContext();

function UserContext({ children }) {
    const serverUrl = "http://localhost:8000/api/auth"; 
    
    // Manage user data state centrally
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Assistant Customization State
    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleCurrentUser = async () => {
        try {
            const result = await axios.get(`http://localhost:8000/api/user/current`, { withCredentials: true });
            setUserData(result.data);
            console.log(result.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleCurrentUser();
    }, []);

    const value = {
        serverUrl,
        userData,
        setUserData,
        loading,
        frontendImage, setFrontendImage,
        backendImage, setBackendImage,
        selectedImage, setSelectedImage
    };

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    );
}

export default UserContext;