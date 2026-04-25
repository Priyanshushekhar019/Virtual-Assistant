import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/userContext';
import Card from '../components/Card';
import { RiImageAddLine } from "react-icons/ri";

import Image1 from '../assets/Image1.jpeg';
import Image2 from '../assets/Image3.jpg';
import Image3 from '../assets/Image5.jpg';
import Image4 from '../assets/Image6.jpg';
import Image5 from '../assets/Image7.jpg';
import Image6 from '../assets/Image8.jpg';
import Image7 from '../assets/Image9.jpg';
import Image8 from '../assets/Image10.jpg';
import { IoMdArrowBack } from 'react-icons/io';


function Customize() {
    const {
        frontendImage, setFrontendImage,
        setBackendImage,
        selectedImage, setSelectedImage
    } = useContext(userDataContext);
    const navigate = useNavigate();
    const inputImage = useRef();

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackendImage(file);
            setFrontendImage(URL.createObjectURL(file));
            setSelectedImage("input");
        }
    };

    return (
        <div className='relative w-full min-h-[100vh] bg-gradient-to-t from-black to-blue-950 flex justify-center items-center flex-col py-10'>
            <IoMdArrowBack className='absolute top-[30px] left-[30px] text-white w-[35px] h-[35px] cursor-pointer hover:text-blue-400 transition-colors z-10' onClick={() => navigate('/')} />
            <h1 className='text-white text-[30px] font-semibold mb-[30px] text-center'>
                Select Your <span className='text-blue-400'>Assistant Image</span>
            </h1>

            <div className='w-[90%] max-w-[60%] flex justify-center items-center flex-wrap gap-[20px]'>
                <Card image={Image1} />
                <Card image={Image2} />
                <Card image={Image3} />
                <Card image={Image4} />
                <Card image={Image5} />
                <Card image={Image6} />
                <Card image={Image7} />
                <Card image={Image8} />

                <div
                    className={`w-32 h-32 md:w-40 md:h-40 bg-white rounded-xl shadow-lg m-4 cursor-pointer hover:scale-105 transition-transform overflow-hidden border-4 ${selectedImage === "input" ? "border-blue-500" : "border-transparent"} hover:border-blue-500 flex items-center justify-center flex-col`}
                    onClick={() => inputImage.current.click()}
                >
                    {!frontendImage && <RiImageAddLine className='text-blue-500 w-[40px] h-[40px] mb-2' />}
                    {!frontendImage && <span className="text-gray-600 font-semibold text-sm">Upload</span>}
                    {frontendImage && <img src={frontendImage} alt="custom" className='w-full h-full object-cover' />}
                </div>

                <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage} />
            </div>

            {selectedImage && (
                <button
                    className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer bg-white rounded-full text-[19px] hover:bg-gray-200 transition-colors'
                    onClick={() => navigate("/customize2")}
                >
                    Next
                </button>
            )}
        </div>
    )
}

export default Customize;