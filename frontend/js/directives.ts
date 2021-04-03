import {IAngularStatic} from "angular";

declare var angular: IAngularStatic;


export const directivesServices = angular.module('pokerApp.directives', []);

directivesServices.
  directive('appVersion', ['version', function (version) {
    return function (scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('cardvalue', function () {
    return function (scope, elm, attrs) {
      var value = scope.card || scope.vote.vote,
        code = isNaN(parseInt(value, 10)) ? value.charCodeAt() : value;
      elm.addClass('card--' + code);
    };
  }).
  directive('selectedvote', function () {
    return function (scope, elm) {
      if (scope.vote.sessionId === scope.sessionId) {
        elm.addClass('card--selected');
      }
    };
  });
