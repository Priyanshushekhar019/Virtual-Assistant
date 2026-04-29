import React, { useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { userDataContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import aiGif from '../assets/AI.gif';
import userGif from '../assets/User.gif';

function Home() {
    const { userData, setUserData, serverUrl, getGeminiResponse } = useContext(userDataContext);
    const navigate = useNavigate();
    const [command, setCommand] = useState('');
    const [response, setResponse] = useState('');
    const [listening, setListening] = useState(false)
    const [userText, setUserText] = useState("")
    const [aiText, setAiText] = useState("")
    const isSpeakingRef = useRef(false)
    const recognitionRef = useRef(null)
    const isRecognizingRef = useRef(false)
    const synth = window.speechSynthesis

    const handleLogout = async () => {
        try {
            await axios.post(`${serverUrl}/logout`, {}, { withCredentials: true });
            setUserData(null);
            navigate('/signIn');
        } catch (error) {
            console.error(error);
        }
    }
    const startRecognition = () => {
        try {
            recognitionRef.current?.start()
            setListening(true)
        }
        catch (error) {
            if (!error.message.includes("start")) {
                console.error("Recognition error:", error)
            }
        }
    }

    const speak = (text) => {
        synth.cancel(); // Clear any stuck utterances
        const utterence = new SpeechSynthesisUtterance(text)
        
        // Use a default English voice or system default
        const voices = synth.getVoices()
        const englishVoice = voices.find(v => v?.lang?.startsWith('en-'))
        if (englishVoice) {
            utterence.voice = englishVoice
        }

        isSpeakingRef.current = true
        utterence.onend = () => {
            isSpeakingRef.current = false
            startRecognition()
        }
        synth.speak(utterence)
    }

    const handleCommand = (data) => {
        const { type, userInput, response } = data
        setResponse(response); // Show textual response
        speak(response)
        if (type === 'google_search') {
            const query = encodeURIComponent(userInput)
            window.open(`https://www.google.com/search?q=${query}`, '_blank')
        }
        if (type === 'calculator_open') {
            window.open(`https://www.google.com/search?q=calculator`, '_blank')
        }
        if (type === 'instagram_open') {
            window.open(`https://www.instagram.com`, '_blank')
        }
        if (type === 'facebook_open') {
            window.open(`https://www.facebook.com`, '_blank')
        }
        if (type === 'weather_show') {
            window.open(`https://www.google.com/search?q=weather`, '_blank')
        }
        if (type === 'youtube_search' || type === 'youtube_play') {
            const query = encodeURIComponent(userInput)
            window.open(`https://www.youtube.com/search?q=${query}`, '_blank')
        }
    }

    useEffect(() => {

        const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionApi) {
            console.warn("Speech recognition is not supported in this browser");
            return;
        }
        const recognition = new SpeechRecognitionApi();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'

        recognitionRef.current = recognition
        let silenceTimer = null;

        const safeRecognition = () => {
            if (!isSpeakingRef.current && !isRecognizingRef.current) {
                try {
                    recognition.start()
                    console.log("Recognition requested to start")
                } catch (err) {
                    if (err.name !== "InvalidStateError") {
                        console.log("Recognition error : ", err)
                    }
                }
            }
        }
        recognition.onstart = () => {
            console.log("Recognition started")
            isRecognizingRef.current = true
            setListening(true)
        }

        recognition.onend = () => {
            console.log("Recognition endes")
            isRecognizingRef.current = false
            setListening(false)

            if (!isSpeakingRef.current) {
                setTimeout(() => {
                    safeRecognition()
                }, 1000)
            }
        }

        recognition.onerror = (event) => {
            console.warn("Recognition error:", event.error)
            isRecognizingRef.current = false
            setListening(false)
            if (event.error !== "aborted" && event.error !== "not-allowed" && !isSpeakingRef.current) {
                setTimeout(() => {
                    safeRecognition()
                }, 1000)
            }
        }

        recognition.onresult = async (e) => {
            const transcript = Array.from(e.results)
                .map(result => result[0].transcript)
                .join(' ').trim()
            console.log("heard : " + transcript)
            setCommand(transcript); // Visual feedback
            
            // Wait for 2 seconds of silence before auto-submitting
            if (silenceTimer) clearTimeout(silenceTimer);
            
            silenceTimer = setTimeout(async () => {
                isSpeakingRef.current = true; // Lock mic to prevent capturing its own voice or background noise while fetching
                recognition.stop()
                isRecognizingRef.current = false
                setListening(false)

                try {
                    setUserText(transcript);
                    setResponse('Thinking...');
                    const res = await axios.post(`http://localhost:8000/api/user/ask`, { command: transcript }, { withCredentials: true });
                    if (res.data) {
                        handleCommand(res.data);
                        setCommand(''); // Clear the input box after successful command
                    }
                } catch (error) {
                    console.error("Assistant API Error:", error);
                    isSpeakingRef.current = false; // Release lock on error
                    startRecognition(); // Turn mic back on
                }
            }, 1500);
        }
        const fallback = setInterval(() => {
            if (!isSpeakingRef.current && !isRecognizingRef.current) {
                safeRecognition()
            }
        }, 10000)
        safeRecognition()

        return () => {
            recognition.stop()
            setListening(false)
            if (isRecognizingRef) isRecognizingRef.current = false;
            clearInterval(fallback)
        }



    }, [])

    const askAssistant = async () => {
        if (!command.trim()) return;
        try {
            isSpeakingRef.current = true; // Lock mic
            recognitionRef.current?.stop(); // Force stop mic
            setListening(false);

            setUserText(command);
            setResponse('Thinking...');
            const res = await axios.post(`http://localhost:8000/api/user/ask`, { command }, { withCredentials: true });
            console.log("Assistant responded:", res.data);
            if (res.data) {
                handleCommand(res.data);
            }
            setCommand('');
        } catch (error) {
            console.error(error);
            const errorText = error.response?.data?.response || error.response?.data?.message || error.message;
            setResponse(`Error: ${errorText}`);
            isSpeakingRef.current = false; // Release lock on error
            startRecognition(); // Turn mic back on
        }
    }

    return (
        <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black flex justify-center items-center flex-col overflow-hidden">

            {/* Glowing Background Orbs */}
            <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-40 animate-pulse"></div>
            <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Glassmorphism Card */}
            <div className="relative z-10 w-[90%] max-w-[800px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[40px] p-10 flex flex-col items-center">

                {userData?.assistantImage && (
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-blue-500 rounded-full blur-[20px] opacity-50 animate-pulse"></div>
                        <img src={userData.assistantImage} alt="assistant" className="relative w-[160px] h-[160px] object-cover rounded-full shadow-2xl border-4 border-white/20" />
                    </div>
                )}

                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2 text-center tracking-tight">
                    {userData?.assistantName || "Virtual Assistant"}
                </h1>
                <p className="text-lg text-gray-300 mb-10 font-medium tracking-wide">
                    Awaiting your command...
                </p>



                <div className="flex gap-4 w-full mb-8 relative">
                    <input
                        type="text"
                        value={command}
                        onChange={e => setCommand(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && askAssistant()}
                        placeholder="Type or say a command..."
                        className="flex-1 p-5 rounded-2xl border border-white/10 bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner text-lg transition-all"
                    />
                    <button
                        onClick={askAssistant}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-10 py-5 rounded-2xl font-bold tracking-wide shadow-lg hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all transform hover:-translate-y-1"
                    >
                        Send
                    </button>
                </div>

                <div className="h-[120px] flex items-center justify-center w-full mb-8">
                    {listening && (
                        <div className="flex flex-col items-center gap-3 w-full">
                            <img src={userGif} alt="Listening" className="w-[80px] rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] border-2 border-green-500/40" />
                            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-1.5 rounded-full">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                                <p className="text-xs text-green-400 font-bold tracking-widest uppercase">Listening to you...</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full flex justify-between gap-6 mb-10 text-left min-h-[300px]">
                    {/* Left Column: User Input */}
                    <div className="flex-1 flex flex-col items-start gap-4">
                        {userText && (
                            <>
                                <img src={userGif} alt="User" className="w-[120px] rounded-2xl shadow-lg border-2 border-white/10" />
                                <div className="bg-white/10 border border-white/20 p-5 rounded-2xl text-white shadow-inner w-full backdrop-blur-md">
                                    <span className="font-bold text-sm text-blue-300 block mb-2 tracking-wider">USER COMMAND</span>
                                    {userText}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Column: Gemini Response */}
                    <div className="flex-1 flex flex-col items-start gap-4">
                        {response && (
                            <>
                                <img src={aiGif} alt="AI" className="w-[120px] rounded-2xl shadow-lg border-2 border-blue-500/30" />
                                <div className="w-full bg-blue-900/20 border border-blue-500/30 p-5 rounded-2xl shadow-inner text-blue-100 text-lg leading-relaxed backdrop-blur-md">
                                    <span className="font-bold text-sm text-purple-300 block mb-2 tracking-wider">GEMINI RESPONSE</span>
                                    {response}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex gap-6 w-full justify-center mt-auto border-t border-white/10 pt-8">
                    <button
                        onClick={() => navigate("/customize")}
                        className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    >
                        Customize Interface
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-8 py-3 bg-red-500/20 hover:bg-red-500/40 text-red-300 font-semibold rounded-xl transition-all border border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    >
                        LogOut
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Home;