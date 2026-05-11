import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/chatbot/chat/";

export const sendMessageToBot = async (message) => {
  try {
    const res = await axios.post(API_URL, { message });
    return res.data.reply;
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return "⚠️ Cannot connect to server";
  }
};