import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const userDataContext = createContext();

function UserContext({ children }) {
    const serverUrl = "https://virtual-assistant-2pl0.onrender.com/api/auth";

    // Manage user data state centrally
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Assistant Customization State
    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleCurrentUser = async () => {
        try {
            const result = await axios.get(`https://virtual-assistant-2pl0.onrender.com/api/user/current`, { withCredentials: true });
            setUserData(result.data);
            console.log(result.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    const getGeminiResponse = async (command) => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, { command }, { withCredentials: true })
            return result.data
        } catch (error) {
            console.log(error)

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
        selectedImage, setSelectedImage,
        getGeminiResponse
    };

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    );
}

export default UserContext;