'use strict';
app.controller('LogCatController', function ($scope, logcat) {

    $scope.logcat = logcat;
    $scope.$parent.status = "Loading...";

    logcat.listen(function(event) {
        if (event.type == "log") {
            //$scope.$apply();
        } else {
            $scope.$parent.status = event.message;
            $scope.$apply();

        }
    })
});