import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const prompt = `You are a virtual assistant named Jarvis and created by User.
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

    now your userInput- DPTM what is the time`;

  try {
    const url = process.env.GEMINI_API_URL + '?key=' + process.env.GEMINI_API_KEY;
    const res = await axios.post(url, {
      "contents": [{ "parts": [{ "text": prompt }] }],
      "generationConfig": { "responseMimeType": "application/json" }
    });
    console.log(res.data.candidates[0].content.parts[0].text);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
test();
