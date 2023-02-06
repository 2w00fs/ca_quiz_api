import express from 'express'
import quizRoutes from './src/routes/quiz.js'
import subjectRoutes from './src/routes/subject.js'
import flashcardRoutes from './src/routes/flashcard.js'
import authRoutes from './src/routes/auth.js'
import jwt from 'jsonwebtoken'
import swaggerUi from 'swagger-ui-express';
import cors from 'cors'
import swaggerDocument from './api-docs/endpoints.json' assert { type: "json" };

const api_server = express()

api_server.use(cors())

api_server.use(express.json())

api_server.use('/auth', authRoutes)

api_server.use(function(req, res, next) {
    if (req.headers.authorization) {
        req.jwtToken = req.headers.authorization.split(' ')[1]
    }
    next()
});

api_server.use((req, res, next) => {
    jwt.verify(req.jwtToken, 'secret', (err, payload) => {
        if (err) {
            if (req.url.match(/(api-docs)/)){ // insecure hack to get docs page to show without auth
                next()
            } else {
                res.status(401).send({err: 'User is not authenticated'})
            }
        } else {
            req.userId = payload.userId
            next()
        }
    })
});


api_server.get('/', (request, response) => response.send({ info: 'CA QUIZ' }))

api_server.use('/', quizRoutes)

api_server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

api_server.use('/subject', subjectRoutes)


api_server.use('/quiz/', flashcardRoutes)


const port = process.env.PORT || 4001

api_server.listen(port, () => console.log(`App running at http://localhost:${port}/`))

export default api_server