'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var filmCtrlStub = {
  index: 'filmCtrl.index',
  show: 'filmCtrl.show',
  create: 'filmCtrl.create',
  upsert: 'filmCtrl.upsert',
  patch: 'filmCtrl.patch',
  destroy: 'filmCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var filmIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './film.controller': filmCtrlStub
});

describe('Film API Router:', function() {
  it('should return an express router instance', function() {
    filmIndex.should.equal(routerStub);
  });

  describe('GET /api/films', function() {
    it('should route to film.controller.index', function() {
      routerStub.get
        .withArgs('/', 'filmCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/films/:id', function() {
    it('should route to film.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'filmCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/films', function() {
    it('should route to film.controller.create', function() {
      routerStub.post
        .withArgs('/', 'filmCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/films/:id', function() {
    it('should route to film.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'filmCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/films/:id', function() {
    it('should route to film.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'filmCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/films/:id', function() {
    it('should route to film.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'filmCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
