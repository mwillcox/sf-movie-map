'use strict';

var app = require('../..');
import request from 'supertest';

var newFilm;

describe('Film API:', function() {
  describe('GET /api/films', function() {
    var films;

    beforeEach(function(done) {
      request(app)
        .get('/api/films')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          films = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      films.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/films', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/films')
        .send({
          name: 'New Film',
          info: 'This is the brand new film!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newFilm = res.body;
          done();
        });
    });

    it('should respond with the newly created film', function() {
      newFilm.name.should.equal('New Film');
      newFilm.info.should.equal('This is the brand new film!!!');
    });
  });

  describe('GET /api/films/:id', function() {
    var film;

    beforeEach(function(done) {
      request(app)
        .get(`/api/films/${newFilm._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          film = res.body;
          done();
        });
    });

    afterEach(function() {
      film = {};
    });

    it('should respond with the requested film', function() {
      film.name.should.equal('New Film');
      film.info.should.equal('This is the brand new film!!!');
    });
  });

  describe('PUT /api/films/:id', function() {
    var updatedFilm;

    beforeEach(function(done) {
      request(app)
        .put(`/api/films/${newFilm._id}`)
        .send({
          name: 'Updated Film',
          info: 'This is the updated film!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedFilm = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedFilm = {};
    });

    it('should respond with the original film', function() {
      updatedFilm.name.should.equal('New Film');
      updatedFilm.info.should.equal('This is the brand new film!!!');
    });

    it('should respond with the updated film on a subsequent GET', function(done) {
      request(app)
        .get(`/api/films/${newFilm._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let film = res.body;

          film.name.should.equal('Updated Film');
          film.info.should.equal('This is the updated film!!!');

          done();
        });
    });
  });

  describe('PATCH /api/films/:id', function() {
    var patchedFilm;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/films/${newFilm._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Film' },
          { op: 'replace', path: '/info', value: 'This is the patched film!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedFilm = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedFilm = {};
    });

    it('should respond with the patched film', function() {
      patchedFilm.name.should.equal('Patched Film');
      patchedFilm.info.should.equal('This is the patched film!!!');
    });
  });

  describe('DELETE /api/films/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/films/${newFilm._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when film does not exist', function(done) {
      request(app)
        .delete(`/api/films/${newFilm._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
