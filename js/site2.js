var colors = ['#F44336','#673AB7','#009688','#FFEB3B','#FF9800','#9E9E9E'];  
var scale_maxDate = new Date(2015, 5, 30);


var timecount_chart = dc.compositeChart("#time_count");
var timesurgery_chart = dc.compositeChart("#time_surgery");
var timebirths_chart = dc.compositeChart("#time_births");
var timestaff_chart = dc.compositeChart("#time_staff");
var org_chart = dc.rowChart("#rc_org");

    var dateFormat = d3.time.format("%Y-%m-%d");
    data.forEach(function (e) {
        e.Date = dateFormat.parse(e.Date);
        console.log(e.Date);
    });

var cf = crossfilter(data);

var dateDimension = cf.dimension(function(d){ return d.Date; });
var orgDimension = cf.dimension(function(d){ return d.RC_Org; });

var orgGroup = orgDimension.group().reduceSum(function(d) {return d.OPD+d.IPD;});
var opdGroup = dateDimension.group().reduceSum(function(d) {return d.OPD;});
var ipdGroup = dateDimension.group().reduceSum(function(d) {return d.IPD;});
var referredGroup = dateDimension.group().reduceSum(function(d) {return d.referred;});
var surgicalMinorGroup = dateDimension.group().reduceSum(function(d) {return d.Surgical_Minor;});
var surgicalMajorGroup = dateDimension.group().reduceSum(function(d) {return d.Surgical_Major;});
var birthsGroup = dateDimension.group().reduceSum(function(d) {return d.Number_of_births;});
var internationalStaffGroup = dateDimension.group().reduceSum(function(d) {return d.Number_of_international_staff;});
var nationalStaffGroup = dateDimension.group().reduceSum(function(d) {return d.Number_of_national_staff;});

var outAll = cf.groupAll().reduceSum(function(d){ return d.OPD; });
var inAll = cf.groupAll().reduceSum(function(d){ return d.IPD; });
var referredAll = cf.groupAll().reduceSum(function(d){ return d.referred; });
var minorAll = cf.groupAll().reduceSum(function(d){ return d.Surgical_Minor; });
var majorAll = cf.groupAll().reduceSum(function(d){ return d.Surgical_Major; });
var birthsAll = cf.groupAll().reduceSum(function(d){ return d.Number_of_births; });
var nationalAll = cf.groupAll().reduceSum(function(d){ return d.Number_of_international_staff; });
var internationalAll = cf.groupAll().reduceSum(function(d){ return d.Number_of_national_staff; });


timecount_chart
        .width($('#time_count').width())
        .height(150)
        .dimension(dateDimension)
        .x(d3.time.scale().domain([new Date(2015, 4, 1), scale_maxDate]))
		.rangeChart(timecount_chart)
		.elasticY(true)
		.compose([
		   dc.lineChart(timecount_chart).group(ipdGroup,'In Patients').colors(colors[0]),
           dc.lineChart(timecount_chart).group(opdGroup,'Out Patients').colors(colors[1]),
		   //dc.compositeChart(timecount_chart).group(ipdGroup,'In Patients').colors(colors[0]),
           //dc.compositeChart(timecount_chart).group(opdGroup,'Out Patients').colors(colors[1]),
		])
		.brushOn(false)
//		.mouseZoomable(true)
        .yAxisLabel("",5)
        .legend(dc.legend().x($('#time_count').width()-150).y(0).gap(5))
        .xAxis().ticks(8);
timecount_chart.yAxis().ticks(6);
 
timesurgery_chart
        .width($('#time_count').width())
        .height(150)
        .dimension(dateDimension)
		.x(d3.time.scale().domain([new Date(2015, 4, 1), scale_maxDate]))
		.rangeChart(timecount_chart)
		//.elasticY(true)
		.compose([
		   dc.lineChart(timecount_chart).group(referredGroup,'Referred').colors(colors[1]),
           dc.lineChart(timecount_chart).group(surgicalMinorGroup,'Surgical Minor').colors(colors[2]),
		   dc.lineChart(timecount_chart).group(surgicalMajorGroup,'Surgical Major').colors(colors[3])
		   //dc.compositeChartChart(timecount_chart).group(referredGroup,'Referred').colors(colors[0]),
           //dc.compositeChart(timecount_chart).group(surgicalMinorGroup,'Surgical Minor').colors(colors[1]),
		   //dc.compositeChart(timecount_chart).group(surgicalMajorGroup,'Surgical Major').colors(colors[2])
		])     
        .brushOn(false)
		//.mouseZoomable(true)
        .legend(dc.legend().x($('#time_count').width()-150).y(0).gap(5))
        .xAxis().ticks(8);

timebirths_chart
        .width($('#time_count').width())
        .height(150)
        .dimension(dateDimension)		
		.x(d3.time.scale().domain([new Date(2015, 4, 1), scale_maxDate]))
		.rangeChart(timecount_chart)
		//.elasticY(true)
		.compose([
		   dc.lineChart(timecount_chart).group(birthsGroup,'Births').colors(colors[0]),
		   //dc.compositeChart(timecount_chart).group(birthsGroup,'Births').colors(colors[0])
		])     
        .brushOn(false)
		//.mouseZoomable(true)
        .legend(dc.legend().x($('#time_count').width()-150).y(0).gap(5))
        .xAxis().ticks(8);
timebirths_chart.yAxis().ticks(5);

timestaff_chart
        .width($('#time_count').width())
        .height(150)
        .dimension(dateDimension)
		.x(d3.time.scale().domain([new Date(2015, 4, 1), scale_maxDate]))
		.rangeChart(timecount_chart)
		//.elasticY(true)
		.compose([
		   dc.lineChart(timecount_chart).group(nationalStaffGroup,'National Staff').colors(colors[4]),
           dc.lineChart(timecount_chart).group(internationalStaffGroup,'International Staff').colors(colors[5])
		   //dc.compositeChart(timecount_chart).group(nationalStaffGroup,'National Staff').colors(colors[0]),
           //dc.compositeChart(timecount_chart).group(internationalStaffGroup,'International Staff').colors(colors[1])
		])     
        .brushOn(false)
		//.mouseZoomable(true)
        .legend(dc.legend().x($('#time_count').width()-150).y(0).gap(5))
        .xAxis().ticks(8);
timestaff_chart.yAxis().ticks(6);

org_chart.width($('#rc_org').width()).height(300)
        .dimension(orgDimension)
        .group(orgGroup)
        .xAxis().ticks(5);

dc.dataCount('#outtotal')
	.dimension(cf)
	.group(outAll);

dc.dataCount('#intotal')
	.dimension(cf)
	.group(inAll);

dc.dataCount('#referredtotal')
	.dimension(cf)
	.group(referredAll);

dc.dataCount('#minortotal')
	.dimension(cf)
	.group(minorAll);

dc.dataCount('#majortotal')
	.dimension(cf)
	.group(majorAll);

dc.dataCount('#nationaltotal')
	.dimension(cf)
	.group(nationalAll);

dc.dataCount('#internationaltotal')
	.dimension(cf)
	.group(internationalAll);

dc.dataCount('#birthstotal')
	.dimension(cf)
	.group(birthsAll);

    function rangesEqual(range1, range2) {
        if (!range1 && !range2) {
            return true;
        }
        else if (!range1 || !range2) {
            return false;
        }
        else if (range1.length === 0 && range2.length === 0) {
            return true;
        }
        else if (range1[0].valueOf() === range2[0].valueOf() &&
            range1[1].valueOf() === range2[1].valueOf()) {
            return true;
        }
        return false;
    }

    timecount_chart.focusCharts = function (chartlist) {
        if (!arguments.length) {
            return this._focusCharts;
        }
        this._focusCharts = chartlist; // only needed to support the getter above
        this.on('filtered', function (range_chart) {
            if (!range_chart.filter()) {
                dc.events.trigger(function () {
                    chartlist.forEach(function(focus_chart) {
                        focus_chart.x().domain(focus_chart.xOriginalDomain());
                    });
                });
            } else chartlist.forEach(function(focus_chart) {
                if (!rangesEqual(range_chart.filter(), focus_chart.filter())) {
                    dc.events.trigger(function () {
                        focus_chart.focus(range_chart.filter());
                    });
                }
            });
        });
        return this;
    };
    timecount_chart.focusCharts([timesurgery_chart,timebirths_chart,timestaff_chart]);

dc.renderAll();
