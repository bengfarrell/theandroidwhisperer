'use strict';
var app = angular.module('AndroidWhispererApp', ['ngRoute', 'ui.bootstrap']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'logcat.html',
            controller: 'LogCatController'
        })
        .otherwise({
            redirectTo: '/'
        });
});