# AI Virtual Assistant (MERN + Gemini API)

A full-stack, intelligent Virtual Assistant application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and powered by Google's Gemini AI. The application allows users to interact with the assistant via both voice and text inputs, featuring a modern, premium glassmorphic UI.

## 🚀 Features

- **Voice & Text Interaction**: Seamlessly talk to the assistant or type your queries.
- **Powered by Gemini AI**: Integrates Google's Gemini 2.5 Flash API for fast and highly accurate responses.
- **Text-to-Speech (TTS)**: The assistant reads out its responses naturally.
- **Premium User Interface**: Features a beautiful, responsive, glassmorphic design with dynamic micro-animations.
- **Authentication**: Secure user sign-up and sign-in functionality using JWT.
- **User Sessions**: Persistent conversational context across sessions.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), CSS3 (Glassmorphism), SpeechRecognition Web API, Web Speech API (Synthesis)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI Integration**: Google Generative AI (Gemini SDK)
- **Image/Media Handling**: Cloudinary
- **Authentication**: JSON Web Tokens (JWT), bcrypt

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- A Google Cloud project with the [Gemini API](https://aistudio.google.com/) enabled
- A [Cloudinary](https://cloudinary.com/) account for image uploads

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/virtual-assistant.git
cd virtualAssistant
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on the `.env.example` file:
```env
PORT=8000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```

Start the backend server:
```bash
npm run dev
# or
node index.js
```

### 3. Setup the Frontend

```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```

### 4. Open the App
Open `http://localhost:5173` (or the port specified by Vite) in your browser.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
