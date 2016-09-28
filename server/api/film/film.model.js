'use strict';

import mongoose from 'mongoose';
var Float = require('mongoose-float').loadType(mongoose);

var FilmSchema = new mongoose.Schema({
  Title: String,
  Locations: String,
  Director: String,
  Lat: Float,
  Long: Float
   
});


export default mongoose.model('Film', FilmSchema);
