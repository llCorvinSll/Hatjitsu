import {LobbyCtrl, MainCtrl, RoomCtrl} from "./controllers";
import {IAngularStatic, ILocationProvider} from "angular";
import {pokerAppServices} from "./services";
import {filtersModule} from "./filters";
import {directivesServices} from "./directives";

$(function () {
    $('.no-js-hide').removeClass('no-js-hide');
});

declare var angular: IAngularStatic;

angular
    .module('pokerApp', ['pokerApp.filters', 'pokerApp.services', 'pokerApp.directives'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider:ILocationProvider) {
      $locationProvider.html5Mode(true).hashPrefix('!');
      $routeProvider.when('/', {templateUrl: 'partials/lobby.html', controller: LobbyCtrl});
      $routeProvider.when('/:roomId', {templateUrl: 'partials/room.html', controller: RoomCtrl});
      $routeProvider.otherwise({redirectTo: '/'});
    }])
    .controller("MainCtrl", MainCtrl)
    .service(pokerAppServices)
    .service(filtersModule)
    .service(directivesServices)

