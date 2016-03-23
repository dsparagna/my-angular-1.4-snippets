(function() {
    "use strict";

    angular.module('ddms.cdr-grid')
        .controller('CdrGridController', CdrGridController);

    CdrGridController.$inject = ['$scope', '$filter', 'asyncDataFactory', '$location', 'userStateStorage', 'constants'];

    function CdrGridController($scope, $filter, asyncDataFactory, $location, userStateStorage, constants) {

        $scope.cdr_grid_type = constants.CDR_GRID_TYPE;
        $scope.cdr_grid_start_time = constants.CDR_GRID_START_TIME;
        $scope.cdr_grid_duration = constants.CDR_GRID_DURATION;
        $scope.cdr_grid_name = constants.CDR_GRID_NAME;
        $scope.cdr_grid_participants = constants.CDR_GRID_PARTICIPANTS;
        $scope.cdr_grid_codec = constants.CDR_GRID_CODEC;
        $scope.cdr_grid_feedback = constants.CDR_GRID_FEEDBACK;
        $scope.cdr_grid_more_info = constants.CDR_GRID_MORE_INFO;

        $scope.phone_id = DDMS.CURRENT_PHONE_PK;
        $scope.sortType = "start_datetime"; // set the default sort type
        $scope.sortReverse = true; // set the default sort order
        $scope.currentPage = 0;
        $scope.pageSize = 15;

        for (var i = 0; i < $scope.pageSize; i++) {
            $scope['unique' + i.toString()] = true;
        }

        $scope.showParticipants = function(i) {
            $scope['unique' + i.toString()] = false;
        }
        $scope.hideParticipants = function(i) {
            $scope['unique' + i.toString()] = true;
        }

        $scope.userValues = userStateStorage.getProperty();
        asyncDataFactory.getCdrGridData($scope.userValues, $scope.phone_id).then(function(data) {
            $scope.items = data;
            $scope.numberOfPages = function() {
                return Math.ceil($scope.items.cdrgrid.length / $scope.pageSize);
            }
            $scope.totalPages = $scope.numberOfPages();
            if ($scope.totalPages === 0) {
                angular.element("#next").addClass('disabled');
            }
        }).catch(function(error) {
            console.log("ERROR! Type: AJAX - Feature: CDR Grid - Return code: " + error.status);
        });


        // end of asyc data factory
        $scope.goToChart = function(cdr_id, call_type) {
            window.open("/phone/" + $scope.phone_id + "/cdr_chart/" + cdr_id + '?type=' + call_type, "_self");
        }

        $scope.$on('broadcastFormData', function(event, args) {
            $scope.criteria = {};
            $scope.criteria.range = args['form'].range;
            $scope.criteria.begin_date = args['form'].begin_date;
            $scope.criteria.end_date = args['form'].end_date;
            asyncDataFactory.getCdrGridData($scope.criteria, $scope.phone_id).then(function(data) {
                $scope.items = data;
                $scope.numberOfPages = function() {
                    return Math.ceil($scope.items.cdrgrid.length / $scope.pageSize);
                }
                $scope.totalPages = $scope.numberOfPages();
                if ($scope.totalPages === 0) {
                    angular.element("#next").addClass('disabled');
                }
            }).catch(function(error) {
                console.log("ERROR! Type: AJAX - Feature: CDR Grid - Return code: " + error.status);
            });
        }); // end of broadcast event
    } // end of controller

}());
