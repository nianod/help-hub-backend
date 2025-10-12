const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { OpenAI } = require('openai')


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const allowedOrigins = [
    'https://help-board-hub.vercel.app',
    'http://localhost:5173'
]

app.use(cors({
    origin: function(origin, callback) {
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
 
}))

 app.use(express.json())

app.post('/api/chat', async (req, res) => {
    const { message } = req.body

    //Demo    
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {role :"user", content: message }
            ]
        })
        const reply = completion.choices[0].message.content
        res.json({ reply })
    } catch (error) {
        console.error("OpenAI error", error)
        res.status(429).json({
            reply: "Am overloaded at the moment. I've hit maximum quota"
        })
    }
 
})

app.get('/', (req, res) => {
    res.send("Chatbot is Live")
})
const PORT = process.env.PORT 
app.listen(PORT, () => {console.log(`Server runnig on port: ${PORT}`)})