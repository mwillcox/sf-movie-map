/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/films              ->  index
 * POST    /api/films              ->  create
 * GET     /api/films/:id          ->  show
 * PUT     /api/films/:id          ->  upsert
 * PATCH   /api/films/:id          ->  patch
 * DELETE  /api/films/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Film from './film.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  
  return function(entity) {
    
    if(entity) {
      debugger;
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      console.log('e: ' + entity + ' p: ' + patches);
      jsonpatch.apply(entity, patches);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Films
export function index(req, res) {
  
  return Film.find().exec()
    //.then(geoCodeLocation())
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function fix(req, res) {
  
  return Film.find().exec()
    //.then(geoCodeLocation())
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Film from the DB
export function show(req, res) {
  return Film.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Film in the DB
export function create(req, res) {
  return Film.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Film in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Film.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Film in the DB with latitude and longitude fields from location string
export function patch(req, res) {
  return Film.update({_id: req.params.id}, { $set: { Lat: req.body.Lat, Long: req.body.Lng }}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
  
}

function updateCustom(res, statusCode) {
  statusCode = statusCode || 200;
  
  return function(entity) {
    
    if(entity) {
      debugger;
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

// Deletes a Film from the DB
export function destroy(req, res) {
  return Film.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

