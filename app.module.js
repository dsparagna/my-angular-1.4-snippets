(function() {
    "use strict";
    angular.module('app', [
        'constants',
        'async-data-factory',
        'chart-data-factory',
        'app.chart'
    ]).
    config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'app/components/upload-form/upload-form.template.html',
                    controllerAs: 'ul'
                })
                .when('/chart', {
                    templateUrl: 'app/components/cdr-chart/cdr-chart.view.html',
                    controllerAs: 'vm'
                })
                .otherwise({
                    redirectTo: '/'
                });           
        }
    ]);
}());
