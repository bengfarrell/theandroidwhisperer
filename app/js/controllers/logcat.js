'use strict';
app.controller('LogCatController', function ($scope, logcat) {

    $scope.logentries = [];
    $scope.$parent.status = "Loading...";

    logcat.listen(function(event) {
        if (event.type == "log") {
            $scope.logentries.push(event);

            // limit entries
            if ($scope.logentries.length > 100) {
                $scope.logentries.splice($scope.logentries.length-100, $scope.logentries.length)
            }
            $scope.$apply();
        } else {
            $scope.$parent.status = event.message;
            $scope.$apply();

        }
    })
});