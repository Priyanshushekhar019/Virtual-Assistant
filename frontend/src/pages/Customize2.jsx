import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/userContext';
import axios from 'axios';
import { IoMdArrowBack } from 'react-icons/io';

function Customize2() {
    const navigate = useNavigate();
    const { userData, setUserData, backendImage, selectedImage } = useContext(userDataContext);

    // Ensure we don't crash if userData is null for a split second
    const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setLoading(true)
        if (!assistantName.trim()) {
            setError("Assistant Name is required.");
            return;
        }

        try {
            setLoading(true);
            setError('');

            const formData = new FormData();
            formData.append('assistantName', assistantName);

            // If they uploaded a custom image securely into state
            if (backendImage) {
                formData.append('assistantImage', backendImage);
            } else if (selectedImage && selectedImage !== "input") {
                // If they picked a predefined avatar (like Image1)
                formData.append('assistantImage', selectedImage);
            }

            const response = await axios.put('https://virtual-assistant-2pl0.onrender.com/api/user/update', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                setUserData(response.data);
                navigate('/');
                setLoading(false)
            }
        } catch (err) {
            setLoading(false)
            console.error("Save assistant error:", err);
            setError(err.response?.data?.message || "Failed to customize assistant. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='relative w-full h-[100vh] bg-gradient-to-t from-black to-blue-950 flex justify-center items-center flex-col p-4'>
            <IoMdArrowBack className='absolute top-[30px] left-[30px] text-white w-[35px] h-[35px] cursor-pointer hover:text-blue-400 transition-colors z-10' onClick={() => navigate('/customize')} />

            <h1 className='text-white text-[30px] font-semibold mb-[30px] text-center'>
                Enter your <span className='text-blue-400'>Assistant Name</span>
            </h1>

            {error && <div className="mb-4 text-red-500 bg-red-100 px-4 py-2 rounded-lg">{error}</div>}

            <input
                id="name"
                name="name"
                type="text"
                placeholder='e.g: Jarvis'
                className='w-full max-w-[600px] h-[60px] outline-none border-2 border-slate-500 focus:border-blue-400 bg-black/30 backdrop-blur-sm text-white placeholder-gray-400 px-[20px] py-[10px] rounded-full text-[18px] transition-colors'
                required
                onChange={(e) => setAssistantName(e.target.value)}
                value={assistantName}
            />

            {assistantName && (
                <button
                    disabled={loading}
                    className={`min-w-[300px] h-[60px] mt-[40px] font-bold rounded-full text-[19px] transition-all transform hover:-translate-y-1 ${loading ? 'bg-blue-300 text-gray-700 cursor-not-allowed' : 'bg-white text-black hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] cursor-pointer'
                        }`}
                    onClick={handleSubmit}
                >
                    {loading ? 'Saving Identity...' : 'Finally Create Your Assistant'}
                </button>
            )}
        </div>
    )
}

export default Customize2;