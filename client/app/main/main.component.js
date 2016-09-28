import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';
import ngMap from 'ngMap';


export class MainController {
  /*@ngInject*/
  constructor($http, NgMap) {
    this.$http = $http;
    this.filmData = [];
    this.films = [];
    this.film = {};
    this.NgMap = NgMap;
    this.map = {}; 
  }
  $onInit() {
    var vm = this;
    this.NgMap.getMap().then((map) => {
      this.map = map;
    });
    var promise = this.getFilms();
    promise.then(
    function(value){
      angular.forEach(value, function(location){
        vm.films.push({ id:location._id, name: location.Title, position: [location.Lat, location.Long], loc: location.Locations, director: location.Director});
      });
      if(vm.films.length>0){
        vm.film = vm.films[0];
      }
    },
    function (reason) { console.log(reason) }
    );
  }

  getFilms(){
    return this.$http.get('/api/films')
    .then(response => {
        this.filmData = response.data;
        return response.data;
      });
  }

  showDetail(e, film) {
    this.film = film;
    this.map.showInfoWindow('foo-iw', film.id);
  };

  hideDetail() {
    this.map.hideInfoWindow('foo-iw');
  };

  //Only used to patch database and populate latitude and longitude fields from location string
  updateData(){
    this.filmData.forEach( function (arrayItem){
      var geocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="+ encodeURIComponent(arrayItem.Locations) +"&key=AIzaSyAsr0D-KqhecXsXdP6OHyLhcnO-x74m5PE";
      var promise = this.$http.get(geocodeUrl);
      var a = this;
      promise.then(
          function (value) { 
            var addressData = value.data.results;
            if(addressData.length > 0){
              var lat = addressData[0].geometry.location.lat;
              var lng = addressData[0].geometry.location.lng;
              a.$http.patch(`/api/films/${arrayItem._id}`, {Lat: lat, Lng: lng});
            }
          },
          function (reason) { console.log(reason) }
      );
    }, this);
  }
 } 


export default angular.module('sfMovieMapApp.main', [uiRouter, ngMap])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
