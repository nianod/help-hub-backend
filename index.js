 
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai/index.js');

dotenv.config();

const app = express();


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  
});

 
const allowedOrigins = [
  'https://help-board-hub.vercel.app',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);


app.use(express.json());

 
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', 
      messages: [{ role: 'user', content: message }],
    });

    const reply = completion.choices[0]?.message?.content || 'No response';
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI error:', error.message);
    res.status(500).json({
      reply: "I'm currently overloaded or your API key might be invalid.",
    });
  }
});

 
app.get('/', (req, res) => {
  res.send('Chatbot is Live ');
});


const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
