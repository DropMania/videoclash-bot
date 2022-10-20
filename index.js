const express = require('express')
const cors = require('cors')
require('dotenv').config()
const tmi = require('tmi.js')
const axios = require('axios')
const app = express()

const port = process.env.PORT || 3000
const client = new tmi.Client({
    options: { debug: true },
    identity: {
        username: 'videoclash',
        password: async () => {
            let token = await axios.post('https://id.twitch.tv/oauth2/token', {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: process.env.REFRESH_TOKEN
            })
            return 'oauth:' + token.data.access_token
        }
    },
    connection: {
        port: 80
    },
    channels: []
})
client.connect()
let BASE_URL = ''
if (process.env.NODE_ENV === 'production') {
    BASE_URL = 'https://videoclash.vercel.app'
} else {
    BASE_URL = 'http://127.0.0.1:5173'
}
const corsOptions = {
    origin: BASE_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsOptions))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Nothing to see here')
})

app.post('/send_link', (req, res) => {
    const { channel, id } = req.body
    client.say(channel, `Submit your video here: ${BASE_URL}/#/submit/${id}`)
    res.json({ message: 'success' })
})

app.post('/start_vote', (req, res) => {
    const { channel } = req.body
    client.say(channel, `-------START VOTING-------`)
    res.json({ message: 'success' })
})

app.post('/end_vote', (req, res) => {
    const { channel } = req.body
    client.say(channel, `--------END VOTING--------`)
    res.json({ message: 'success' })
})

app.listen(port, () => {
    console.log(`Example app listening at ${port}`)
})
