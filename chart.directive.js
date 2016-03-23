(function() {
    "use strict";
    angular.module('ddms.cdr-chart')
        .directive('ddmsCdrChart', ddmsCdrChart);
    ddmsCdrChart.$inject = ['constants', 'cdrChartDataFactory'];

    function ddmsCdrChart(constants, cdrChartDataFactory) {
        var directive = {
            link: link,
            templateUrl: "/static/js/metrics/cdr-chart.template.html",
            restrict: 'E',
            controllerAs: "vm"
        };
        return directive;

        function link(scope, element, attrs) {
            scope.$watchCollection("[vm.cdrChartData,vm.data.selectedOption.id]", function(newValue, oldValue) {
                var data = newValue[0]; //cdrChartData
                var callDirection = parseInt(newValue[1]);
                if (data === undefined) return;
                if (callDirection === undefined) return;

                Highcharts.setOptions({
                    colors: ['#DE6448', '#16ACBC']
                });
                $('#container').bind('mousemove touchmove', function(e) {
                    var chart,
                        point,
                        i;
                    for (i = 0; i < Highcharts.charts.length; i++) {
                        chart = Highcharts.charts[i];
                        e = chart.pointer.normalize(e); // Find coordinates within the chart
                        point = chart.series[0].searchPoint(e, true); // Get the hovered point

                        if (point) {
                            point.onMouseOver(); // Show the hover marker
                            chart.tooltip.refresh(point); // Show the tooltip
                            chart.xAxis[0].drawCrosshair(e, point); // Show the crosshair
                        }
                    }
                });
                Highcharts.Pointer.prototype.reset = function() {};

                function syncExtremes(e) {
                    var thisChart = this.chart;
                    if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
                        Highcharts.each(Highcharts.charts, function(chart) {
                            if (chart !== thisChart) {
                                if (chart.xAxis[0].setExtremes) { // It is null while updating
                                    chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
                                        trigger: 'syncExtremes'
                                    });
                                }
                            }
                        });
                    }
                }
                var callBeginTime = data.start_unix_ts,
                    tool_tip_time = data.sz_time;
                if (data.timestamp === undefined) {
                    var timestampLength = 0;
                    return false;
                } else {
                    var timestampLength = data.timestamp.length;
                }
                var timeStampInterval = [];
                for (var i = 0; i < timestampLength; i++) {
                    timeStampInterval.push((callBeginTime * 1000 + data.timestamp[i]));
                }
                // Call the CDR Chart Data Factory to get the data ready to plot.
                var responseObject = cdrChartDataFactory.prepareData(data, timeStampInterval);

                var fixDiagnosticReports = [];
                data.diagnostic_reports.forEach(function(item) {
                    if (item === "null") {
                        item = null;
                    } else {
                        item = item;
                    }
                    fixDiagnosticReports.push(item);
                });

                var fixDiagnosticType = [];
                data.diagnostic_type.forEach(function(item) {
                    if (item === "null") {
                        item = null;
                    } else {
                        item = item;
                    }
                    fixDiagnosticType.push(item);
                });

                var loopCount = 3;
                var currentLoopCount = 0;
                var i;
                //Begin Main Loop which will go 3 times.
                for (i = 0; i < loopCount; i++) {
                    var options = {
                        chart: {
                            spacingBottom: 10,
                            spacingTop: 300,
                            spacingLeft: 0,
                            spacingRight: 15,
                            margin: 40,
                            zoomType: 'x',
                            style: {
                                fontFamily: 'Gustan Book',
                                fontWeight: "regular",
                                fontSize: '14px'
                            },
                            resetZoomButton: {
                                position: {
                                    align: 'right', // by default
                                    x: -10,
                                    y: 5
                                },
                                relativeTo: 'chart'
                            }
                        },
                        title: {
                            text: null,
                            align: 'left',
                            margin: 2
                        },
                        credits: {
                            enabled: false
                        },
                        legend: {
                            enabled: false
                        },
                        xAxis: {
                            type: 'datetime',
                            crosshair: true,
                            events: {
                                setExtremes: syncExtremes
                            },
                            labels: {
                                enabled: false
                            },
                            tickLength: 0
                        },
                        yAxis: {
                            title: {
                                text: null
                            },
                            gridLineColor: '#CCC',
                            alternateGridColor: '#FAFAFA',
                            plotLines: [{
                                width: 3
                            }],
                            min: null,
                            max: null,
                        },
                        tooltip: {
                            formatter: function() {
                                var in_jitter = data.in_jitter,
                                    out_jitter = data.out_jitter,
                                    in_packet_loss_percent = data.in_packet_loss_percent,
                                    out_packet_loss_percent = data.out_packet_loss_percent,
                                    in_voice_level = data.in_voice_level,
                                    output_voice_level = data.output_level,
                                    diagnostic_reports = fixDiagnosticReports,
                                    diagnostic_type = fixDiagnosticType,
                                    index = this.point.index,
                                    plot_time = tool_tip_time[index],
                                    jitter_in = in_jitter[index],
                                    jitter_out = out_jitter[index],
                                    packet_in = in_packet_loss_percent[index] * 100,
                                    packet_out = out_packet_loss_percent[index] * 100,
                                    packet_in_fixed = packet_in.toFixed(2),
                                    packet_out_fixed = packet_out.toFixed(2),
                                    audio_in = in_voice_level[index],
                                    audio_out = output_voice_level[index];

                                if (diagnostic_type[index] !== null) {
                                    var audio_diagnostic = constants.CDR_CHART_MODULE.diagnostic_report + ": " + diagnostic_type[index];
                                }
                                angular.element(".tool-tip__jitter-time").html(plot_time);
                                angular.element(".tool-tip__jitter-in-value").html(jitter_in);
                                angular.element(".tool-tip__jitter-out-value").html(jitter_out);
                                angular.element(".tool-tip__packet-time").html(plot_time);
                                angular.element(".tool-tip__packet-in-value").html(packet_in_fixed);
                                angular.element(".tool-tip__packet-out-value").html(packet_out_fixed);
                                angular.element(".tool-tip__audio-time").html(plot_time);
                                angular.element(".tool-tip__audio-in-value").html(audio_in);
                                angular.element(".tool-tip__audio-out-value").html(audio_out);
                                if (audio_diagnostic !== undefined) {
                                    angular.element(".audio-diagnostic-type").html(audio_diagnostic);
                                } else {
                                    angular.element(".audio-diagnostic-type").html('');
                                }
                                return false;
                            }
                        },
                        series: [{
                            id: 1,
                            name: null,
                            data: null,
                            type: 'line',
                            unit: null,
                            lineWidth: 1,
                            fillOpacity: 0.1
                        }, {
                            id: 2,
                            name: null,
                            data: null,
                            unit: null,
                            type: 'line',
                            lineWidth: 1,
                            fillOpacity: 0.1
                        }, {
                            id: 3,
                            name: 'Report',
                            data: null,
                            unit: null,
                            type: 'line',
                            colors: null,
                            lineWidth: 1,
                            fillOpacity: 0.1,
                            color: "#e80d0d",
                            marker: {
                                radius: 5
                            }
                        }]
                    }; // end of options object
                    var timeIntervalsCount = responseObject.xData.length;
                    if (i === 0) {
                        var jitterDataSeriesOne = [];
                        var jitterDataSeriesTwo = [];
                        for (var j = 0; j < timeIntervalsCount; j++) {
                            jitterDataSeriesOne.push([responseObject.xData[j], responseObject.datasets[0].data[j]]);
                            jitterDataSeriesTwo.push([responseObject.xData[j], responseObject.datasets[1].data[j]]);
                        }
                        options.series[0].name = "In jitter";
                        options.series[1].name = "Out jitter";
                        options.series[0].unit = "ms";
                        options.series[1].unit = "ms";
                        options.yAxis.min = 0;
                        options.yAxis.max = null;
                        if (callDirection === 1) {
                            options.series[0].data = '';
                            options.series[1].data = '';
                            options.series[0].data = jitterDataSeriesOne;
                            options.series[1].data = jitterDataSeriesTwo;
                        }
                        if (callDirection === 2) {
                            options.series[0].data = '';
                            options.series[1].data = '';
                            options.series[0].data = jitterDataSeriesOne;
                            options.series[1].data = '';
                        }
                        if (callDirection === 3) {
                            options.series[0].data = '';
                            options.series[1].data = '';
                            options.series[0].data = '';
                            options.series[1].data = jitterDataSeriesTwo;
                        }
                        $('div[chart1="chart1"]').remove();
                        $('<div class="chart" chart1="chart1">').appendTo('#container').highcharts(options, function() {});
                    } // end of inner data loop
                    if (i === 1) {
                        var networkDataSeriesOne = [];
                        var networkDataSeriesTwo = [];
                        for (var j = 0; j < timeIntervalsCount; j++) {
                            networkDataSeriesOne.push([responseObject.xData[j], responseObject.datasets[2].data[j] * 100]);
                            networkDataSeriesTwo.push([responseObject.xData[j], responseObject.datasets[3].data[j] * 100]);
                        }
                        options.series[0].name = "In packet loss";
                        options.series[1].name = "Out packet loss";
                        options.series[0].data = networkDataSeriesOne;
                        options.series[1].data = networkDataSeriesTwo;
                        options.series[0].unit = "%";
                        options.series[1].unit = "%";
                        options.yAxis.min = 0;
                        options.yAxis.max = 100;
                        if (callDirection === 1) {
                            options.series[0].data = '';
                            options.series[1].data = '';
                            options.series[0].data = networkDataSeriesOne;
                            options.series[1].data = networkDataSeriesTwo;
                        } // end of call direction
                        if (callDirection === 2) {
                            options.series[0].data = '';
                            options.series[1].data = '';
                            options.series[0].data = networkDataSeriesOne;
                            options.series[1].data = '';
                        }
                        if (callDirection === 3) {
                            options.series[0].data = '';
                            options.series[1].data = '';
                            options.series[0].data = '';
                            options.series[1].data = networkDataSeriesTwo;
                        }
                        $('div[chart2="chart2"]').remove();
                        $('<div class="chart" chart2="chart2">').appendTo('#container').highcharts(options, function() {});
                    } // end of inner data loop
                    if (i === 2) {
                        var audioDataSeriesOne = [];
                        var audioDataSeriesTwo = [];
                        var audioProblemDataSeriesThree = [];
                        for (var j = 0; j < timeIntervalsCount; j++) {
                            audioDataSeriesOne.push([responseObject.xData[j], responseObject.datasets[4].data[j]]);
                            audioDataSeriesTwo.push([responseObject.xData[j], responseObject.datasets[5].data[j]]);
                            audioProblemDataSeriesThree.push([responseObject.xData[j], responseObject.datasets[6].data[j]]);
                        }
                        options.series[0].unit = "%";
                        options.series[1].unit = "%";
                        options.series[0].name = "In level";
                        options.series[1].name = "Out level";
                        options.series[0].data = audioDataSeriesOne;
                        options.series[1].data = audioDataSeriesTwo;
                        options.xAxis = {
                            type: 'datetime',
                            dateTimeLabelFormats: {
                                day: '%b' + " " + '%d' + ", " + '%Y'
                            },
                            crosshair: true,
                            events: {
                                setExtremes: syncExtremes
                            },
                            labels: {
                                type: null
                            },
                        };
                        if (callDirection === 1) {
                            options.series[0].data = '';
                            options.series[1].data = '';
                            options.series[0].data = audioDataSeriesOne;
                            options.series[1].data = audioDataSeriesTwo;
                            options.series[2].data = audioProblemDataSeriesThree;
                        }
                        if (callDirection === 2) {
                            options.series[0].data = '';
                            options.series[1].data = '';
                            options.series[0].data = '';
                            options.series[1].data = audioDataSeriesTwo;
                        }
                        if (callDirection === 3) {
                            options.series[0].data = '';
                            options.series[1].data = '';
                            options.series[0].data = audioDataSeriesOne;
                            options.series[1].data = '';
                        }
                        $('div[chart3="chart3"]').remove();
                        $('<div class="chart" chart3="chart3">').appendTo('#container').highcharts(options, function() {});
                    } // end of inner data loop
                    currentLoopCount = currentLoopCount + 1;
                } // end of main outer loop that will occur 3 times.
            }); // end scope $watch function
        } // end of link fx
    }
}());
