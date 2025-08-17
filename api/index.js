// Tout les require dont j'ai besoin
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

// Initialisation d'Express
const app = express()

// setup de helmet
app.use(helmet());

// setup de cors, avec de la logic pour differencier les variables prod et dev
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL_PROD 
    : process.env.FRONTEND_URL_DEV,
  credentials: true
};

app.use(cors(corsOptions)) 

// Limitation de request
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite de 100 request par IP
})
app.use(limiter) // stocker dans une variable pour pouvoire la réutiliser

// Parsers
app.use(express.json({ limit: '10kb' })) // Lit les fetch ou Axios, içi bloque les JSON de plus de 10kb
app.use(express.urlencoded({ extended: true })) // Lit les form html, extended permet de lire objets nested

// Endpoint health pour regarder si l'API est vivant (besoin de le mettre en fichier a part pour vercel)
// app.get('/health', (req, res) => res.status(200).send('OK'))

// Importe les routes
app.use('/', require('./routes/pageStatsRoutes'))

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// 404
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' })
})

// Export pour vercel
module.exports = app