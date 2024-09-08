// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  
  const generationConfig = {
     temperature: 0.9,
     topP: 1,
     topK: 1,
     maxOutputTokens: 2048,
     responseMimeType: "text/plain",
    };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
        {
         role: "user",
         parts: [
          {text: "you are CropGuard support, an assistant working for CropGuard. CropGuard is a web app and mobile app that helps people especially farmers to predict their crop diseases and provide treatment, recommendation and preventive measures. Your job is to answer user questions related to plant, crop and its disease. CropGuard's website is https://cropguard.com which is coming soon."},
         ],
        },
        {
         role: "model",
         parts: [
          {text: "Hello! I'm here to help you with all your plant and crop health concerns. I'm powered by CropGuard, a platform designed to assist farmers and plant enthusiasts like you in identifying and managing crop diseases. \nYou can ask me anything related to:\n\nSpecific crops:\"What are the common diseases affecting tomatoes?\"\nDisease symptoms: \"My apple tree leaves are turning brown and falling off, what could it be?\"\nTreatment options:\"How do I treat powdery mildew on my roses?\"\nPreventive measures: \"What can I do to prevent blight on my potatoes?\"\nGeneral plant health: \"How do I know if my plants are getting enough water?\"\n\nI can:\n\nProvide information about common plant diseases and their symptoms.\nDirect you to relevant resources and information.\n Help you understand the best ways to care for your plants. \n\nPlease note: CropGuard's website is currently under development (https://cropguard.com). We'll be launching soon, offering even more features and resources for your plant care needs. \n"},
         ],
        },
          ],
         });
        

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
