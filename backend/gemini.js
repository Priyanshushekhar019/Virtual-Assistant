import dotenv from "dotenv"
import axios from "axios"
import moment from "moment"

dotenv.config()

const geminiResponse = async (command, userName, assistantName) => {
    const apiUrl = `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`
    const prompt = `You are a virtual assistant named ${assistantName} and created by ${userName}.
    You are not Google. You will now behave like a voice-enabled assistant.
    
    Your task is to understand the user's natural language input and respond with a JSON object like this:
    
    {
    "type":"general" | "google_search" | "youtube_search" | "youtube_play" | "get_time" | "get_date" | "get_day" | "get_month"
    | "weather_show" | "open_website",
    "userInput":"<original user input>" {only remove your name from userinput if exists} and agar kisi ne google ya youtube pe kuch search karne ko bola hai to
    userInput me only bo search waala text jaaye,
    "url": "<the full HTTPS URL of the website if type is open_website, otherwise null>",
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
    - "weather_show": if user wants to know weather.
    - "get_time": if user asks for current time.
    - "get_date": if user asks for today's date.
    - "get_day": if user asks what day it is.
    - "get_month": if user asks for the current month.
    - "open_website": if the user wants to open any app, website, or online service (like calculator, instagram, facebook, swiggy, zomato, chatgpt, github, netflix, etc.). In this case, provide the official URL in the "url" key.
    
    Important:
    - Use ${userName} agar koi puche tumhe kisne banaya
    - Only respond with the JSON object, nothing else.

    now your userInput- ${command}
    `;

    let retries = 2;
    while (retries > 0) {
      try {
        const result = await axios.post(apiUrl, {
          "contents": [{
            "parts": [{ "text": prompt }]
          }],
          "generationConfig": {
            "responseMimeType": "application/json"
          }
        });
        return result.data.candidates[0].content.parts[0].text;
      } catch (error) {
        retries--;
        const status = error.response?.status;
        
        // If it's a 503 (Overloaded) or 429 (Rate Limit), wait 2 seconds and retry
        if ((status === 503 || status === 429) && retries > 0) {
          console.log(`Gemini overloaded (${status}). Retrying in 2 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          // On final failure or non-retryable error, return a graceful spoken response
          console.log("Error response from Gemini:", error.response?.data || error.message);
          return JSON.stringify({
            type: "general",
            userInput: command,
            response: "I'm sorry, my AI servers are currently experiencing heavy traffic. Please give me a moment and try again."
          });
        }
      }
    }
}

export default geminiResponse
