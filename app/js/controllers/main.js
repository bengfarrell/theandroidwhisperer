'use strict';
app.controller('MainController', function ($scope, state, logcat) {
    state.attachController($scope);

    $scope.status = "";
    $scope.logfilters = ["none", logcat.JS_CONSOLE];
    $scope.currentFilter = "none";

    $scope.$watch('status', function() {
        switch ($scope.status) {
            case "device offline":
                state.setState($scope, "offline");
                break;
        }
    });

    $scope.chooseFilter = function(filter) {
        $scope.currentFilter = filter;
        logcat.logFilters = filter;
        logcat.refreshEntries();
    }

    /**
     * start adb server
     */
    $scope.startADBServer = function() {
        logcat.startADBServer();
    }
});