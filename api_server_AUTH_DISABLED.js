import express from 'express'
import quizRoutes from './src/routes/quiz.js'
import subjectRoutes from './src/routes/subject.js'
import flashcardRoutes from './src/routes/flashcard.js'
import authRoutes from './src/routes/auth.js'
import jwt from 'jsonwebtoken'

import cors from 'cors'

const api_server_NO_AUTH = express()

api_server_NO_AUTH.use(cors())

api_server_NO_AUTH.use(express.json())

api_server_NO_AUTH.use('/auth', authRoutes)

api_server_NO_AUTH.use(function(req, res, next) {
    if (req.headers.authorization) {
        req.jwtToken = req.headers.authorization.split(' ')[1]
    }
    next()
});

api_server_NO_AUTH.use((req, res, next) => {
    jwt.verify(req.jwtToken, 'secret', (err, payload) => {
        if (err) {
            req.userId = '63e07261b68e4e29cecd05a2'
            next()
        } else {
            req.userId = payload.userId
            next()
        }
    })
})


api_server_NO_AUTH.get('/', (request, response) => response.send({ info: 'CA QUIZ' }))

api_server_NO_AUTH.use('/', quizRoutes)

api_server_NO_AUTH.use('/subject', subjectRoutes)


api_server_NO_AUTH.use('/quiz/', flashcardRoutes)


const port = process.env.PORT || 4001

api_server_NO_AUTH.listen(port, () => console.log(`App running at http://localhost:${port}/`))

export default api_server_NO_AUTH