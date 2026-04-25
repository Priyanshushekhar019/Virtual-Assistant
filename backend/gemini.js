import dotenv from "dotenv"
import axios from "axios"
import moment from "moment"

dotenv.config()

const geminiResponse = async (command, userName, assistantName) => {
  try {
    const apiUrl = `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`
    const prompt = `You are a virtual assistant named ${assistantName} and created by ${userName}.
    You are not Google. You will now behave like a voice-enabled assistant.
    
    Your task is to understand the user's natural language input and respond with a JSON object like this:
    
    {
    "type":"general" | "google_search" | "youtube_search" | "Youtube_play" | "get_time" | "get_date" | "get_day" | "get_month"
    | "calculator_open" | "instagram_open" | "facebook_open" | "weather_show",
    "userInput":"<original user input>" {only remove your name from userinput if exists} and agar kisi ne google ya youtube pe kuch search karne ko bola hai to
    userInput me only bo search waala text jaaye,
    "response": "<a short spoken response to read out loud to the users>"}
    
    Instructions:
    - "type":determine the intent of the user.
    - "userInput": original sentence the userspoke.
    - "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found",
     "Today is Tuesday", etc.

    Type meanings:
    - "general": if it's a factual or information question.aur agar koi aisa question puchta hai jiska answer tumhe pata hai usko bhi general ki category me rakho bs short answer dena 
    - "google_search": if user wants to search something on Google.
    - "youtube_search": if user wants to search something on Youtube.
    - "youtube_play": if user wants to play something on Youtube.
    - "calculator_open": if user wants to open calculator.
    - "instagram_open": if user wants to open instagram.
    - "facebook_open": if user wants to open facebook.
    - "weather_show": if user wants to know weather.
    - "get_time": if user asks for current time.
    - "get_date": if user asks for today's date.
    - "get_day": if user asks what day it is.
    - "get_month": if user asks for the current month.
    
    Important:
    - Use ${userName} agar koi puche tumhe kisne banaya
    - Only respond with the JSON object, nothing else.

    now your userInput- ${command}
    `;

    const result = await axios.post(apiUrl, {
      "contents": [{
        "parts": [{ "text": prompt }]
      }],
      "generationConfig": {
        "responseMimeType": "application/json"
      }
    })
    return result.data.candidates[0].content.parts[0].text
  } catch (error) {
    const msg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
    console.log("Error response from Gemini:", msg);
    throw new Error(msg);
  }
}

export default geminiResponse
