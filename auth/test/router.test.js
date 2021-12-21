/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { forgotPassword } = require('../src/service');

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Service', () => {
  const login = 'valeriiiad';
  const password = 'valeriiiad';
  const user_number = 1;
  const app = `http://${process.env.HOST}:${process.env.APP_PORT}`;

  it('should return log document from db by user number', async () => {
    const res = await chai.request(app)
      .get(`/auth/log?user_number=${user_number}`);
    const { body } = res;
    expect(res.statusCode).to.equal(200);

    expect(body).not.to.be.null;
    expect(body).to.have.property('_id');
    expect(body).to.have.property('user_number');
    expect(body).to.have.property('entrances');
    expect(body).to.have.property('createdAt');
    expect(body).to.have.property('updatedAt');

    expect(body.entrances.length).not.to.equal(0);
    expect(body.entrances[0]).to.have.property('time');
    expect(body.entrances[0]).to.have.property('geo');
  });

  describe('Reset password', async () => {
    const email = 'ekaterina.shakiryanova@gmail.com';
    const notExistedEmail = 'faik@gmail.com';

    const newPassword = '12345678';
    const newPasswordAgain = '12345678';
    const anotherNewPassword = 'qwerty';

    let link;
    beforeEach(async () => {
      link = await forgotPassword(email);
      expect(link).not.to.be.null;
    });

    it('should return a link to reset password', async () => {
      const link = await forgotPassword(email);
      const token = link.split('token=')[1];
      const decryptedToken = jwt.verify(token, process.env.JWTSECRETKEY);

      expect(link).not.to.be.null;
      expect(decryptedToken).to.have.property('email');
      expect(decryptedToken).to.have.property('exp');
      expect(decryptedToken.email).to.be.equal(email);
    });

    it('should throw an error when user with such email doesn`t exist', async () => {
      const res = await chai.request(app)
        .post('/auth/forgotpass')
        .send({ email: notExistedEmail });

      expect(res.statusCode).to.equal(400);
      expect(res.text).to.equal('User with such email doesn`t exist');
    });

    it('should reset password when the link is right', async () => {
      const res = await chai.request(link)
        .post('')
        .send({ newPassword, newPasswordAgain });

      expect(res.statusCode).to.equal(200);
      expect(res.text).to.equal('Password was successfully changed');

      const resUser = await chai.request(process.env.USER_URL)
        .get(`/user?email=${email}`);
      expect(resUser.statusCode).to.equal(200);

      const match = await bcrypt.compare(newPassword, resUser.body.password);
      expect(match).be.true;
    });

    it('should not reset password when passwords mismatch', async () => {
      const res = await chai.request(link)
        .post('')
        .send({ newPassword, anotherNewPassword });

      expect(res.statusCode).to.equal(404);

      const resUser = await chai.request(process.env.USER_URL)
        .get(`/user?email=${email}`);
      expect(resUser.statusCode).to.equal(200);

      const match = await bcrypt.compare(anotherNewPassword, resUser.body.password);
      expect(match).be.false;
    });

    it('should not reset password when the link isn`t correct', async () => {
      const res = await chai.request(app)
        .post('/resetpass?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJmYWlrQGdtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.0QbKvR7qTW2kLF573vYDyK9GFje59-SBUbCKJ4K7qe4')
        .send({ newPassword, newPasswordAgain });

      expect(res.statusCode).to.equal(404);
    });
  });

  describe('Login', () => {
    const notCorrectLogin = 'valeriad';
    const notCorrectPassword = 'mvogbrmtb123';

    it('should return jwt token when user exists', async () => {
      const res = await chai.request(app)
        .post('/auth/login')
        .send({ login, password });
      expect(res.statusCode).to.equal(200);

      const decryptedToken = jwt.verify(res.text, process.env.JWTSECRETKEY);
      expect(decryptedToken).to.have.property('user_id');
      expect(decryptedToken).to.have.property('user_number');
      expect(decryptedToken).to.have.property('email');
      expect(decryptedToken).to.have.property('login');
      expect(decryptedToken).to.have.property('birthday');
      expect(decryptedToken).to.have.property('photo_id');
      expect(decryptedToken).to.have.property('created_at');
      expect(decryptedToken.login).to.be.equal(login);
    });

    it('should throw 404 error when password isn`t correct', async () => {
      const res = await chai.request(app)
        .post('/auth/login')
        .send({ login, password: notCorrectPassword });

      expect(res.statusCode).to.equal(404);
      expect(res.text).to.equal('Password is incorrect');
    });

    it('should throw 404 error when login isn`t correct', async () => {
      const res = await chai.request(app)
        .post('/auth/login')
        .send({ login: notCorrectLogin, password });

      expect(res.statusCode).to.equal(404);
      expect(res.text).to.equal('Login is incorrect');
    });
  });

  describe('Invite / Registration', () => {
    const newUser = {
      name: 'Vasya',
      login: 'vasya000',
      password: 'vasya000',
      passwordAgain: 'vasya000',
      birthday: '2000-09-14T21:00:00.000Z',
      photo_link: './photos/56',
      interests: [1, 2],
    };
    const newEmail = 'test@gmail.com';
    let accessToken;

    before(async () => {
      const res = await chai.request(app)
        .post('/auth/login')
        .send({ login, password });
      expect(res.statusCode).to.equal(200);
      accessToken = res.text;
    });

    it('should throw 400 error user with such email exists', async () => {
      const res = await chai.request(process.env.USER_URL)
        .post('/user/invite')
        .set('x-auth-token', accessToken)
        .send({ email: newEmail });

      expect(res.statusCode).to.equal(400);
      expect(res.text).to.equal('User with such email already exists');
    });
  });
});
