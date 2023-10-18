$(function () {
    let myChart3 = document.getElementById('myChart3');

    const massPopChart3 = function (result) {
        const data = result;
        console.log(result)

        new Chart(myChart3, {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'Admin',
                    data: data,
                    parsing: {
                        yAxisKey: 'Admin'
                    }
                }, {
                    label: 'Communicator',
                    data: data,
                    parsing: {
                        yAxisKey: 'Communicator'
                    }
                }, {
                    label: 'Developer',
                    data: data,
                    parsing: {
                        yAxisKey: 'Developer'
                    }
                }, {
                    label: 'Leader',
                    data: data,
                    parsing: {
                        yAxisKey: 'Leader'
                    }
                }, {
                    label: 'Tester',
                    data: data,
                    parsing: {
                        yAxisKey: 'Tester'
                    }
                }
                ]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                height: 400,
                responsive: true,
                maintainAspectRatio: false
            },
        });
    }

    $.ajax({
        url: '/dashboard/getData',
        method: 'GET',
        success: function (result) {
            massPopChart3(result);
        },
        error: function (error) {
            console.log(error);
        }
    });

    // let chart;
    // // V2
    // let myChart4 = document.getElementById('myChart4');

    // const massPopChart4 = function (result) {
    //     const data = result;

    //     if (chart) {
    //         chart.destroy();
    //     }

    //     chart = new Chart(myChart4, {
    //         type: 'bar',
    //         data: {
    //             datasets: [{
    //                 label: 'Admin',
    //                 data: data,
    //                 parsing: {
    //                     yAxisKey: 'Admin'
    //                 }
    //             }, {
    //                 label: 'Communicator',
    //                 data: data,
    //                 parsing: {
    //                     yAxisKey: 'Communicator'
    //                 }
    //             }, {
    //                 label: 'Developer',
    //                 data: data,
    //                 parsing: {
    //                     yAxisKey: 'Developer'
    //                 }
    //             }, {
    //                 label: 'Leader',
    //                 data: data,
    //                 parsing: {
    //                     yAxisKey: 'Leader'
    //                 }
    //             }, {
    //                 label: 'Tester',
    //                 data: data,
    //                 parsing: {
    //                     yAxisKey: 'Tester'
    //                 }
    //             }
    //             ]
    //         },
    //         options: {
    //             plugins: {
    //                 legend: {
    //                     labels: {
    //                         font: {
    //                             size: 14
    //                         }
    //                     }
    //                 }
    //             },
    //             height: 400,
    //             responsive: true, maintainAspectRatio: false
    //         },
    //     });
    // }

    // $.ajax({
    //     url: '/dashboard/getData',
    //     method: 'GET',
    //     success: function (result) {
    //         massPopChart4(result);
    //     },
    //     error: function (error) {
    //         console.log(error);
    //     }
    // });

    // $(function () {

    //     var start = moment().startOf("month");
    //     var end = moment().endOf('month');


    //     function cb(start, end) {
    //         $('#reportrange span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
    //     }

    //     $('#reportrange').daterangepicker({
    //         startDate: start,
    //         endDate: end,
    //         ranges: {
    //             'Today': [moment(), moment()],
    //             'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    //             'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    //             'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    //             'This Month': [moment().startOf('month'), moment().endOf('month')],
    //             'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    //         }
    //     }, cb);

    //     cb(start, end);

    //     $('#getDataBtn').on('click', function () {
    //         let startDate = ($('#reportrange').data('daterangepicker').startDate).format('YYYY/MM/DD');
    //         let endDate = ($('#reportrange').data('daterangepicker').endDate).format('YYYY/MM/DD');

    //         let totalDate = datediff(new Date(startDate), new Date(endDate));
    //         let timeList;

    //         console.log(totalDate)

    //         if (totalDate <= 7) {
    //             timeList = getDaysArray(startDate, endDate);
    //             timeList.unshift(['GetByDate']);
    //         }

    //         if (totalDate > 7 && totalDate < 32) {
    //             timeList = getWeekList(startDate, endDate);
    //             timeList.unshift(['GetByRange']);
    //         }

    //         if (totalDate >= 32 && totalDate <= 365) {
    //             timeList = getMonthList(startDate, endDate);
    //             timeList.unshift(['GetByRange']);
    //         }

    //         if (totalDate > 365) {
    //             timeList = getYearList(startDate, endDate);
    //             timeList.unshift(['GetByRange']);
    //         }

    //         console.log(timeList);


    //         if (!timeList) return;

    //         $.ajax({
    //             url: '/dashboard/getDataByRange',
    //             method: 'POST',
    //             data: { timeList },
    //             success: function (result) {
    //                 massPopChart4(result)
    //             },
    //             error: function (error) {
    //                 alert(error);
    //             }
    //         })

    //     });

    //     $('#getDataBtn').click();
    // });

    // Function to generate day list given a start date and end date
    // var getDaysArray = function (start, end) {
    //     for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
    //         arr.push(moment((new Date(dt))).format('YYYY/MM/DD'));
    //     }
    //     return arr;
    // };

    // // Function to generate a week list given a start date and end date
    // function getWeekList(startDate, endDate) {
    //     // Array containing all weeks
    //     var weeks = [];
    //     // Array containing days of a single week
    //     var week = [];

    //     // Loop through each day within start and end dates
    //     for (var j = moment(startDate); j.isSameOrBefore(endDate); j.add(1, 'days')) {
    //         // Push the current day into the week array
    //         week.push(j.format("YYYY/MM/DD"));

    //         // When the loop reaches the end of the week or end date
    //         if (j.day() == 0 || j.isSame(endDate)) {
    //             // Store the start and end dates of the current week
    //             var start = week[0];
    //             var end = week[week.length - 1];
    //             // Push the week date range into the weeks array
    //             weeks.push([start, end]);
    //             // Reset the week array
    //             week = [];
    //         }
    //     }

    //     // Return the array of weeks
    //     return weeks;
    // }

    // function getMonthList(startDate, endDate) {
    //     var dateRanges = [];
    //     var currentDate = startDate;
    //     while (currentDate <= endDate) {
    //         var nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    //         var endOfMonth = (nextMonth > endDate) ? endDate : new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 0);
    //         dateRanges.push([
    //             moment(currentDate).format('YYYY/MM/DD'),
    //             moment(endOfMonth).format('YYYY/MM/DD')
    //         ]);
    //         currentDate = nextMonth;
    //     }

    //     return dateRanges;
    // }

    // function getYearList(startDate, endDate) {
    //     startDate = new Date(startDate);
    //     endDate = new Date(endDate);

    //     var dateRanges = [];
    //     var currentDate = startDate;

    //     while (currentDate <= endDate) {
    //         var nextYear = new Date(currentDate.getFullYear() + 1, 0, 1);
    //         var endOfYear = (nextYear > endDate) ? endDate : new Date(currentDate.getFullYear(), 11, 31);
    //         dateRanges.push([
    //             moment(currentDate).format('YYYY/MM/DD'),
    //             moment(endOfYear).format('YYYY/MM/DD')
    //         ]);
    //         currentDate = nextYear;
    //     }

    //     return dateRanges;
    // }

    // function datediff(first, second) {
    //     return Math.round((second - first) / (1000 * 60 * 60 * 24) + 1);
    // }



});