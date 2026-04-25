import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';
import geminiResponse from '../gemini.js';
import moment from 'moment';

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { assistantName, assistantImage } = req.body;
    const userId = req.userId;

    let assistantImageUrl = assistantImage; // Default to string if provided (e.g. predefined avatar)

    // Check if there is a custom image uploaded via Multer buffer
    if (req.file) {
      // Convert buffer to Base64
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      const cloudinaryRes = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
        folder: "virtual_assistant_users"
      });

      assistantImageUrl = cloudinaryRes.secure_url;
    }

    // Build update object
    const updateData = {};
    if (assistantName) updateData.assistantName = assistantName;
    if (assistantImageUrl) updateData.assistantImage = assistantImageUrl;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { returnDocument: 'after' } // Return updated document
    ).select("-password");

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Error updating user" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body
    const user = await User.findById(req.userId)
    user.history.push(command)
    user.save()
    const userName = user.name
    const assistantName = user.assistantName
    const result = await geminiResponse(command, userName, assistantName)

    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return res.status(400).json({ response: "sorry, I can't understand" })
    }
    const gemResult = JSON.parse(jsonMatch[0])
    console.log(gemResult)
    const type = gemResult.type

    switch (type) {
      case 'get_date':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format("YYYY-MM-DD")}`
        });
      case 'get_time':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format("hh:mm A")}`
        });
      case 'get_day':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format("dddd")}`
        });
      case 'get_month':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current month is ${moment().format("MMMM")}`
        });
      case 'google_search':
      case 'youtube_search':
      case 'youtube_play':
      case 'calculator_open':
      case 'instagram_open':
      case 'facebook_open':
      case 'weather_show':
      case 'general':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response
        })

      default:
        return res.status(400).json({ response: "I didn't understand that command." })
    }

  } catch (error) {
    console.error("Error in askToAssistant:", error);
    return res.status(500).json({ response: `Server Crash: ${error.message}` })
  }
}
