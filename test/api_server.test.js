import request from 'supertest';
import _ from 'lodash';
import api_server_NO_AUTH from '../api_server_AUTH_DISABLED.js';

describe("Test Quiz Endpoints", () => {
	test('Get all quizzes', async () => {
		const res = await request(api_server_NO_AUTH).get('/quiz')
		expect(res.status).toBe(200)
		expect(_.isArray(res.body)).toBe(true)
	});
	test('Get quiz by id', async () => {
		const res = await request(api_server_NO_AUTH).get('/quiz/63e07261b68e4e29cecd05a9')
		expect(res.status).toBe(200)
		expect(_.isObject(res.body)).toBe(true)
	});
	test('Rename a quiz', async () => {
		const res = await request(api_server_NO_AUTH)
			.put('/quiz/63e07261b68e4e29cecd05a9')
			.send({"name":"new Name"})
		expect(res.status).toBe(200)
		expect(_.isObject(res.body)).toBe(true)
	});
	test('Get a flashcard from a quiz', async () => {
		const res = await request(api_server_NO_AUTH)
			.get('/quiz/63e07261b68e4e29cecd05a9/flashcard/63e07261b68e4e29cecd05b5')
		expect(res.status).toBe(200)
		expect(_.isObject(res.body)).toBe(true)
	});
	test('Crate a new flashcard for a quiz', async () => {
		const res = await request(api_server_NO_AUTH)
			.put('/quiz/63e07261b68e4e29cecd05a9/flashcard/63e07261b68e4e29cecd05b5')
			.send(
				{
					"question":"ne question",
					"answerOptions": [
						{
							"text": "test question",
							"isCorrectOption": true
						}
					],
					"takesTextInput": false
				})
		expect(res.status).toBe(200)
		expect(_.isObject(res.body)).toBe(true)
	});
})

describe("Test subject endpoints", () => {
	test('Retrieve Array of subjects', async () => {
		const res = await request(api_server_NO_AUTH)
			.get('/subject')
		expect(res.status).toBe(200)
		expect(_.isArray(res.body)).toBe(true)
	});
	test('Create a new subject', async () => {
		const res = await request(api_server_NO_AUTH)
			.post('/subject')
			.send({"name": "New Subject Name"})
		expect(res.status).toBe(201)
		expect(_.isObject(res.body)).toBe(true)
	});
	test('Retrieve a single subjects', async () => {
		const res = await request(api_server_NO_AUTH)
			.get('/subject/63e07261b68e4e29cecd05a4')
		expect(res.status).toBe(200)
		expect(_.isObject(res.body)).toBe(true)
	});
	test('Update subject name', async () => {
		const res = await request(api_server_NO_AUTH)
			.put('/subject/63e07261b68e4e29cecd05a4')
			.send({"name": "Updated Subject Name"})
		expect(res.status).toBe(200)
		expect(_.isObject(res.body)).toBe(true)
	});
	test('Create a new quiz', async () => {
		const res = await request(api_server_NO_AUTH)
			.post('/subject/63e07261b68e4e29cecd05a4/quiz')
			.send({"name": "New Quiz Name"})
		expect(res.status).toBe(201)
		expect(_.isObject(res.body)).toBe(true)
	});
});

describe("Test Login", () => {
	test('Login', async () => {
		const res = await request(api_server_NO_AUTH)
			.post('/auth/login')
			.send({"username": "user", "password": "password"})
		expect(res.status).toBe(200)
		expect(_.isObject(res.body)).toBe(true)
	});
});

