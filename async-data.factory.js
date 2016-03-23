(function() {
    "use strict";  

    angular.module('async-data-factory', [])
        .factory('asyncDataFactory', asyncDataFactory);

    asyncDataFactory.$inject = ['$http'];

    function asyncDataFactory($http) {
        var factory = {
            getCdrChartData: getCdrChartData,
        };
        return factory;

        function getCdrChartData() {
    
            var urlBase = 'http://localhost/dcc_analysis_tool/app/data/chart.json';

             return $http.get(urlBase).then(function(response) {
                return response.data;
            });
        }
    } // end of asyncDataFactory function
}());
