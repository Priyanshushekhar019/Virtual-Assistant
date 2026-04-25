import React, { useState, useContext } from 'react'
import bg from "../assets/RobotVirtualAssistant.jpg"
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { userDataContext } from '../context/userContext';
import axios from 'axios';

function SignIn() {
    const [showPassword, setShowPassword] = useState(false)
    const { serverUrl, setUserData } = useContext(userDataContext)
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [err, setErr] = useState("")

    const handleSignIn = async (e) => {
        e.preventDefault();
        console.log("Button clicked");
        setErr("")
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/signin`, {
                email, password
            }, { withCredentials: true })
            console.log("Success:", result.data);
            setUserData(result.data);
            setLoading(false)
            navigate("/")
        }
        catch (error) {
            console.log(error);
            setUserData(null)
            setLoading(false)
            if (error.response && error.response.data) {
                setErr(error.response.data.message || "An error occurred");
            } else {
                setErr("Network error. Is the backend running?");
            }
        }
    }

    return (
        <div className='w-full h-screen bg-cover flex justify-center items-center'
            style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>

            <form
                className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-blue-950 flex flex-col items-center justify-center gap-[20px] px-[20px]'
                onSubmit={handleSignIn}
            >

                <h1 className='text-white text-[30px] font-semibold mb-[30px]'>
                    Sign In to <span className='text-blue-400'>Virtual Assistant</span>
                </h1>

                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder='Email'
                    className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />

                <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder='Password'
                        className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]'
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />

                    {!showPassword && (
                        <IoIosEye
                            className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer'
                            onClick={() => setShowPassword(true)}
                        />
                    )}

                    {showPassword && (
                        <IoIosEyeOff
                            className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer'
                            onClick={() => setShowPassword(false)}
                        />
                    )}
                </div>
                {err.length > 0 && <p className='text-red-500 text-center text-[17px] '>
                    *{err}
                </p>}
                <button
                    type="submit"
                    className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px]' disabled={loading}
                >
                    {loading ? "Loading..." : "Sign In"}
                </button>

                <p
                    className='text-[white] text-[18px] cursor-pointer'
                    onClick={() => navigate("/signup")}
                >
                    Want to create a new account ?
                    <span className='text-violet-400'> Sign Up</span>
                </p>

            </form>
        </div>
    )
}

export default SignIn;