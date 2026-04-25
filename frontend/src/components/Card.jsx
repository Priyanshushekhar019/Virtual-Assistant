import React, { useContext } from 'react';
import { userDataContext } from '../context/userContext';

function Card({ image }) {
    const { selectedImage, setSelectedImage } = useContext(userDataContext);
    
    return (
        <div 
            className={`w-32 h-32 md:w-40 md:h-40 bg-white rounded-xl shadow-lg m-4 cursor-pointer hover:scale-105 transition-transform overflow-hidden border-4 ${selectedImage === image ? "border-blue-500" : "border-transparent"} hover:border-blue-500`} 
            onClick={() => setSelectedImage(image)}
        >
            <img src={image} alt="Avatar" className='w-full h-full object-cover' />
        </div>
    );
}

export default Card;