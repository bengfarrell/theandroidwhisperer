'use strict';
app.controller('LogCatController', function ($scope, logcat) {

    $scope.logentries = [];
    $scope.logfilters = [logcat.JS_CONSOLE, "none"];

    logcat.listen(logcat.JS_CONSOLE, function(event) {
        if (event.type == "log") {
            $scope.logentries.push(event);

            // limit entries
            if ($scope.logentries.length > 100) {
                $scope.logentries.splice($scope.logentries.length-100, $scope.logentries.length)
            }
            $scope.$apply();
        } else {
            $scope.status = event;
            $scope.$apply();

        }
    })
});