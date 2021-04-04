import {LobbyCtrl, MainCtrl, RoomCtrl} from "./controllers";
// import {IAngularStatic, ILocationProvider} from "angular";
import {pokerAppServices} from "./services";
import {filtersModule} from "./filters";
import {directivesServices} from "./directives";
import * as React from "react";
import {App} from "./App";
import ReactDOM from "react-dom";

$(function () {
    $('.no-js-hide').removeClass('no-js-hide');
});


ReactDOM.render(<App />, document.getElementById("app"));



// angular
//     .module('pokerApp', ['pokerApp.filters', 'pokerApp.services', 'pokerApp.directives'])
//     .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider:ILocationProvider) {
//       $locationProvider.html5Mode(true).hashPrefix('!');
//       $routeProvider.when('/', {templateUrl: 'partials/lobby.html', controller: LobbyCtrl});
//       $routeProvider.when('/:roomId', {templateUrl: 'partials/room.html', controller: RoomCtrl});
//       $routeProvider.otherwise({redirectTo: '/'});
//     }])
//     .controller("MainCtrl", MainCtrl)
//     .service(pokerAppServices)
//     .service(filtersModule)
//     .service(directivesServices)

