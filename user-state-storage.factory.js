 angular.module('user-state-storage', [])
        .factory('userStateStorage', userStateStorage);

    userStateStorage.$inject = ['$filter'];

    function userStateStorage($filter) {
        var factory = {
            getProperty: function() {
                var userValues = {
                    "range": localStorage.getItem('set_range'),
                    "begin_date": localStorage.getItem('set_begin_date'),
                    "end_date": localStorage.getItem('set_end_date')
                };
                return userValues;
            },
            setProperty: function(value) {  

                if (value.range === 1 ) {
                    
                    var temp = new Date();            
                    var days = 1;
                    var begin_date_temp = temp.setDate(temp.getDate() - 1);
                        begin_date = $filter('date')(begin_date_temp, "yyyy-MM-dd");
                    var end_date = $filter('date')(new Date(), "yyyy-MM-dd");
                        localStorage.setItem('set_range', days);
                        localStorage.setItem('set_begin_date', begin_date);
                        localStorage.setItem('set_end_date', end_date);
                }

                if ( value.range !== 1 ) {

                    var selectedRange = value.range;
                    var begin_date = value.begin_date;
                    var end_date = value.end_date;

                        localStorage.setItem('set_range', selectedRange);
                        localStorage.setItem('set_begin_date', begin_date);
                        localStorage.setItem('set_end_date', end_date);
                    }
            }
        };
        return factory;
    }
}());
