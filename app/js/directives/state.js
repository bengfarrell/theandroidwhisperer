app.directive('state', function () {
    return function (scope, element, attrs) {
        scope.$watch('state.currentState', function(actual_value) {
            if(!actual_value) {
                return;
            }
            if (actual_value.indexOf(attrs.state) != -1) {
                element.css("display", "");
            } else {
                element.css("display", "none");
            }
        });
    }
});