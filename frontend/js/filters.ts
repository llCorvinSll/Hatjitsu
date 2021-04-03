import {IAngularStatic} from "angular";

declare var angular: IAngularStatic;

export const filtersModule = angular.module('pokerApp.filters', [])

filtersModule.filter('interpolate', ['version', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
}]);
