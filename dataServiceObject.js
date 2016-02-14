// service

var callUsageDataObject = {

    requestData: function(){
        return $http({ 
            method: 'GET', 
            url: 'api/books'
            })
             .then(sendResponse).catch(catchError);
    },
    sendResponse: function(response){
        return response.data;
    },
    catchError: function(response){
        return $q.reject('Error:' + response.status);
    }
}

// controller

callUsageDataObject.sendResponse(function(response){
          $scope.data = response.data;
          // build chart inside this call back
          buildChart(data);
});

callUsageDataObject.catchError(function(error){
    console.log("Error Message: " + error);
});


 
function buildChart(data){

      // create chart configuration options
        var chartConfig = {

        };


     // final data formatting specific for this chart
     var a=[],b = [], c=[];

     data.forEach(function(item){

     });

     options.dataset[0] = a;

     // create new instance of this chart
     var chart = new Highcharts.Chart(options);
}


   // broadcast from the calendar will run the ajax call again to rebuild the chart.












  