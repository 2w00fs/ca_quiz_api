import express from 'express';
import _ from 'lodash';
import {QuizModel} from '../db.js';
import {validateAllCards} from '../validation.js';

const router = express.Router()

// Returns all the Quizzes, but just their names and id numbers
function selectAll(){
    return QuizModel.find()
}

// Returns full detail about one quiz
function selectOneQuiz(quizId) {
    return QuizModel.findById(quizId);
}

/*
- Validates card input before performing any CRUD operations
- Majority of functionality comes from validation.js, quizCRUD is just the final stage that validation.js couldn't handle
- TODO: validate other input
 */
async function quizCRUD( { subjectId, quizId, quizName, flashcards } ) {
    // Checks the flashcards array for validity
    // returns true for valid, false for empty, and string error message for invalid data
    const validateCards = await validateAllCards(flashcards)

    if (_.isString(validateCards)) {
        return { code: 500, body: { error: validateCards } }
    }

    if (validateCards) {
        return { subjectId, quizId, quizName, flashcards }
    } else { // if validateCards is false the flashcards array must be empty
        return  { subjectId, quizId, quizName, flashcards: [] }
    }
}


// List the available quizzes, name used for display, _id used for selection
router.get('/quiz/', async (req, res) => {
    res.send(await selectAll())
})

// Select card by _id to return flashcards
router.get('/quiz/:quizId', async (req, res) => {
    const quizId = req.params.quizId
    res.send(await selectOneQuiz(quizId))
})


// Create quiz
router.post('/subject/:subjectId/quiz', async (req, res) => {
    try {
        // if no userId is entered this default one will be provided
        const { name } = req.body
        const newQuiz = { name: name, subjectId: req.params.subjectId, flashcards: [] }

        const result = await QuizModel.create(newQuiz)
        // 3. Send the new entry with 201 status
        res.status(201).send(result)
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

router.put('/quiz/:quizId', async (req, res) => {
    try {
        const { quizId } = req.params
        const { name } = req.body
        const quiz = { name: name }
        const result = await QuizModel.findByIdAndUpdate(quizId, quiz, { returnDocument: 'after' })
        if (result) {
            res.status(200).send(result)
        } else {
            res.status(404).send({ error: 'Quiz not found' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})


// Delete
router.delete('/quiz/:quizId', async (req, res) => {
    try {
        let quizResult = await QuizModel.deleteOne({ _id: req.params.quizId })
        console.log(quizResult)
        if (quizResult && quizResult.deletedCount > 0) {
            res.sendStatus(204)
        } else {
            res.status(404).send({ error: 'Quiz not found' })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

export default router