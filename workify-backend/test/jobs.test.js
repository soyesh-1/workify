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

test('recruiter can post a job and list it', async () => {
    const signupRes = await request(app)
        .post('/api/auth/signup')
        .send({
            username: 'recruiter1',
            email: 'recruiter@test.com',
            password: 'password123',
            role: 'recruiter'
        });

    assert.equal(signupRes.statusCode, 201);
    const token = signupRes.body.token;

    const postRes = await request(app)
        .post('/api/jobs/post')
        .set('Authorization', `Bearer ${token}`)
        .field('title', 'Frontend Developer')
        .field('company', 'Workify')
        .field('location', 'Kathmandu')
        .field('description', 'Build UI features')
        .field('salary', '50k-80k')
        .field('requirements', 'React, JavaScript')
        .field('jobType', 'Full-time');

    assert.equal(postRes.statusCode, 201);
    assert.ok(postRes.body.job);

    const listRes = await request(app).get('/api/jobs/all');
    assert.equal(listRes.statusCode, 200);
    assert.ok(Array.isArray(listRes.body.jobs));
    assert.equal(listRes.body.jobs.length, 1);
});

test('seeker must have resume to apply', async () => {
    const recruiterRes = await request(app)
        .post('/api/auth/signup')
        .send({
            username: 'recruiter2',
            email: 'recruiter2@test.com',
            password: 'password123',
            role: 'recruiter'
        });

    const recruiterToken = recruiterRes.body.token;

    const jobRes = await request(app)
        .post('/api/jobs/post')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .field('title', 'Backend Developer')
        .field('company', 'Workify')
        .field('location', 'Lalitpur')
        .field('description', 'Build APIs')
        .field('salary', '60k-90k')
        .field('requirements', 'Node.js')
        .field('jobType', 'Full-time');

    const jobId = jobRes.body.job._id;

    const seekerRes = await request(app)
        .post('/api/auth/signup')
        .send({
            username: 'seeker1',
            email: 'seeker1@test.com',
            password: 'password123',
            role: 'seeker'
        });

    const seekerToken = seekerRes.body.token;

    const applyRes = await request(app)
        .post(`/api/jobs/apply/${jobId}`)
        .set('Authorization', `Bearer ${seekerToken}`);

    assert.equal(applyRes.statusCode, 400);
});

test('seeker can apply with profile resume and withdraw', async () => {
    const recruiterRes = await request(app)
        .post('/api/auth/signup')
        .send({
            username: 'recruiter3',
            email: 'recruiter3@test.com',
            password: 'password123',
            role: 'recruiter'
        });

    const recruiterToken = recruiterRes.body.token;

    const jobRes = await request(app)
        .post('/api/jobs/post')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .field('title', 'UI Designer')
        .field('company', 'Workify')
        .field('location', 'Kathmandu')
        .field('description', 'Design UI')
        .field('salary', '40k-70k')
        .field('requirements', 'Figma')
        .field('jobType', 'Full-time');

    const jobId = jobRes.body.job._id;

    const seekerRes = await request(app)
        .post('/api/auth/signup')
        .send({
            username: 'seeker2',
            email: 'seeker2@test.com',
            password: 'password123',
            role: 'seeker'
        });

    const seekerToken = seekerRes.body.token;
    const seeker = await User.findOne({ email: 'seeker2@test.com' });
    seeker.resume = 'uploads/resume-test.pdf';
    await seeker.save();

    const applyRes = await request(app)
        .post(`/api/jobs/apply/${jobId}`)
        .set('Authorization', `Bearer ${seekerToken}`);

    assert.equal(applyRes.statusCode, 200);

    const withdrawRes = await request(app)
        .put(`/api/jobs/withdraw/${jobId}`)
        .set('Authorization', `Bearer ${seekerToken}`);

    assert.equal(withdrawRes.statusCode, 200);
});

test('recruiter can update applicant status', async () => {
    const recruiterRes = await request(app)
        .post('/api/auth/signup')
        .send({
            username: 'recruiter4',
            email: 'recruiter4@test.com',
            password: 'password123',
            role: 'recruiter'
        });

    const recruiterToken = recruiterRes.body.token;

    const jobRes = await request(app)
        .post('/api/jobs/post')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .field('title', 'QA Engineer')
        .field('company', 'Workify')
        .field('location', 'Bhaktapur')
        .field('description', 'Test apps')
        .field('salary', '35k-60k')
        .field('requirements', 'Testing')
        .field('jobType', 'Full-time');

    const jobId = jobRes.body.job._id;

    const seekerRes = await request(app)
        .post('/api/auth/signup')
        .send({
            username: 'seeker3',
            email: 'seeker3@test.com',
            password: 'password123',
            role: 'seeker'
        });

    const seekerToken = seekerRes.body.token;
    const seeker = await User.findOne({ email: 'seeker3@test.com' });
    seeker.resume = 'uploads/resume-test.pdf';
    await seeker.save();

    const applyRes = await request(app)
        .post(`/api/jobs/apply/${jobId}`)
        .set('Authorization', `Bearer ${seekerToken}`);

    assert.equal(applyRes.statusCode, 200);

    const applicantsRes = await request(app)
        .get(`/api/jobs/applicants/${jobId}`)
        .set('Authorization', `Bearer ${recruiterToken}`);

    const applicantId = applicantsRes.body[0].user._id;

    const statusRes = await request(app)
        .put(`/api/jobs/status/${jobId}/${applicantId}`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ status: 'shortlisted' });

    assert.equal(statusRes.statusCode, 200);
});
