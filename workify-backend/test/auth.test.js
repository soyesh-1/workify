const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const User = require('../models/userModel');

let mongo;

test.before(async () => {
    process.env.JWT_SECRET = 'test-secret';
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri(), { dbName: 'workify_test' });
});

test.after(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

test('register and login user', async () => {
    const signupRes = await request(app)
        .post('/api/auth/signup')
        .send({
            username: 'alice',
            email: 'alice@test.com',
            password: 'password123',
            role: 'seeker'
        });

    assert.equal(signupRes.statusCode, 201);
    assert.ok(signupRes.body.token);

    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alice@test.com', password: 'password123' });

    assert.equal(loginRes.statusCode, 200);
    assert.ok(loginRes.body.token);
});

test('profile requires auth', async () => {
    const res = await request(app).get('/api/auth/profile');
    assert.equal(res.statusCode, 401);
});

test('login rejects invalid credentials', async () => {
    await request(app)
        .post('/api/auth/signup')
        .send({
            username: 'bob',
            email: 'bob@test.com',
            password: 'password123',
            role: 'seeker'
        });

    const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'bob@test.com', password: 'wrongpass' });

    assert.equal(res.statusCode, 400);
});

test('update profile fields', async () => {
    const signupRes = await request(app)
        .post('/api/auth/signup')
        .send({
            username: 'carol',
            email: 'carol@test.com',
            password: 'password123',
            role: 'seeker'
        });

    const token = signupRes.body.token;

    const updateRes = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
            phone: '9800000000',
            location: 'Kathmandu',
            bio: 'Frontend developer',
            skills: 'React, Node.js',
            website: 'https://example.com'
        });

    assert.equal(updateRes.statusCode, 200);
    assert.equal(updateRes.body.user.phone, '9800000000');
    assert.equal(updateRes.body.user.location, 'Kathmandu');
});

test('change password with current password', async () => {
    const signupRes = await request(app)
        .post('/api/auth/signup')
        .send({
            username: 'dave',
            email: 'dave@test.com',
            password: 'password123',
            role: 'seeker'
        });

    const token = signupRes.body.token;

    const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
            currentPassword: 'password123',
            newPassword: 'newpass456'
        });

    assert.equal(res.statusCode, 200);
});

test('upload resume and avatar', async () => {
    const fs = require('node:fs');
    const path = require('node:path');

    const signupRes = await request(app)
        .post('/api/auth/signup')
        .send({
            username: 'erin',
            email: 'erin@test.com',
            password: 'password123',
            role: 'seeker'
        });

    const token = signupRes.body.token;

    const resumePath = path.join(__dirname, 'resume.pdf');
    const avatarPath = path.join(__dirname, 'avatar.png');
    fs.writeFileSync(resumePath, 'resume');
    fs.writeFileSync(avatarPath, 'avatar');

    const resumeRes = await request(app)
        .put('/api/auth/resume')
        .set('Authorization', `Bearer ${token}`)
        .attach('resume', resumePath);

    assert.equal(resumeRes.statusCode, 200);
    assert.ok(resumeRes.body.resume);

    const avatarRes = await request(app)
        .put('/api/auth/avatar')
        .set('Authorization', `Bearer ${token}`)
        .attach('avatar', avatarPath);

    assert.equal(avatarRes.statusCode, 200);
    assert.ok(avatarRes.body.avatar);

    fs.unlinkSync(resumePath);
    fs.unlinkSync(avatarPath);

    const user = await User.findOne({ email: 'erin@test.com' });
    assert.ok(user.resume);
    assert.ok(user.avatar);
});
