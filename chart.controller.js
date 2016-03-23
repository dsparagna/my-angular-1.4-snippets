(function() {
    "use strict";
    angular.module('app.cdr-chart')
        .controller('CdrChartController', CdrChartController);

    CdrChartController.$inject = ['$scope', 'asyncDataFactory','constants'];

    function CdrChartController($scope, asyncDataFactory,constants) {
        var vm = this;
            vm.cdrChartStrings = constants.CDR_CHART_MODULE;
            vm.callConf = false;
            vm.callIn = false;
            vm.callOut = false;
            vm.callMissed = false;
            vm.meetingStarted = false;
            vm.callStarted = false;
            vm.callDetails = false;
            vm.callStatsAvailable = false;
            vm.callMissedTitle = false;
            vm.phoneDirectionSelectBox = true;
            vm.chartContainer = true;
   
            asyncDataFactory.getCdrChartData().then(function(data) {
                vm.cdrChartData = data.stats;        
            }).catch(function(error) {
                console.log("ERROR! Type: AJAX - Feature: CDR Chart - Return code: " + error.status);
            });

        function displayCallDetails() {
                 if (vm.cdrChartData.call_stats_avail === false) {
                    vm.meetingStarted = true;
                    vm.callDetails = true;               
                    vm.chartContainer = false;
                    vm.callStatsAvailable = true;                                
                    return false;
                }               
                if (vm.cdrChartData.call_type === "conf") {
                    vm.phoneDirectionSelectBox = true;
                    vm.callStatsAvailable = false;
                    vm.callConf = true;
                    vm.meetingStarted = true;
                    vm.callDetails = true;
                }
                if (vm.cdrChartData.call_type === "in") {
                    vm.callStatsAvailable = false;
                    vm.callConf = false;
                    vm.callIn = true;
                    vm.meetingStarted = false;
                    vm.callStarted = true;
                    vm.callDetails = true;
                }
                if (vm.cdrChartData.call_type === "out") {
                    vm.callStatsAvailable = false;
                    vm.callConf = false;
                    vm.callIn = false;
                    vm.callOut = true;
                    vm.meetingStarted = false;
                    vm.callStarted = true;
                    vm.callDetails = true;
                }
                if (vm.cdrChartData.call_type === "missed" || vm.cdrChartData.call_type === "missed_new") {
                    vm.callStatsAvailable = false;
                    vm.callConf = false;
                    vm.callIn = false;
                    vm.callOut = false;
                    vm.callMissed = true;
                    vm.meetingStarted = false;
                    vm.callMissedTitle = true;
                    vm.callDetails = true;
                }              
        }
        vm.phoneChangeEvent = function(data) {
            vm.currentValue = data.id;
        };
        vm.data = {
            availableOptions: [{
                id: 1,
                name: vm.cdrChartStrings.to_and_from_the_phone
            }, {
                id: 2,
                name: vm.cdrChartStrings.to_the_phone
            }, {
                id: 3,
                name: vm.cdrChartStrings.from_the_phone
            }],
            selectedOption: {
                id: '1',
                name: vm.cdrChartStrings.to_and_from_the_phone
            }
        };
    } // end of controller fx
}());
