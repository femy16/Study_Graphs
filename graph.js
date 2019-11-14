// let transactionsData = [
//             { "name": "Tom", "store": "ACME", "state": "NY", "spend": 100 },
//             { "name": "Tom", "store": "Big Co", "state": "NY", "spend": 200 },
//             { "name": "Bob", "store": "ACME", "state": "FL", "spend": 150 },
//             { "name": "Bob", "store": "ACME", "state": "NY", "spend": 200 },
//             { "name": "Bob", "store": "Big Co", "state": "FL", "spend": 75 },
//             { "name": "Bob", "store": "Big Co", "state": "NY", "spend": 50 },
//             { "name": "Alice", "store": "ACME", "state": "FL", "spend": 200 },
//             { "name": "Alice", "store": "Big Co", "state": "NY", "spend": 350 },
//         ];
queue()
.defer(d3.json, "transaction.json")
.await(makeCharts);

function makeCharts(error,transactionsData){
        let ndx = crossfilter(transactionsData);//to manipulate the data 
        let makeMyDay= d3.time.format("%d/%m/%Y").parse;
        //console.log(makeMyDay("26/09/2018"));
        transactionsData.forEach(function(d){
            d.date=makeMyDay(d.date);
        })
        // let nameDim= ndx.dimension(function (d) {
        //   return d.name
        // })
        //make name as x axis
        let nameDim= ndx.dimension(dc.pluck("name"));
        //group
        let totalSpendPerPerson = nameDim.group().reduceSum(dc.pluck("spend"));
        let spendChart = dc.barChart("#chart-goes-here");
        let personColors =d3.scale.ordinal().range(["red" ,"blue","green"]);
 
spendChart
        .width(300)
        .height(150)
        .colorAccessor(function(d){
            return d.key
        })
        .colors(personColors)
        .dimension(nameDim) 
        .group(totalSpendPerPerson)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("person")
        .elasticY(true)
        .yAxis().ticks(6)
        
        
        let storeDim= ndx.dimension(dc.pluck("store"));
        let totalSpendPerStore = storeDim.group().reduceSum(dc.pluck("spend"));
        let storeChart =dc.barChart("#store-chart");
        
    storeChart
        .width(300)
        .height(150)
        .dimension(storeDim)
        .group(totalSpendPerStore)
        .transitionDuration(1500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Store")
        .elasticY(true)
        .yAxis().ticks(6)
        
        
        let stateDim= ndx.dimension(dc.pluck("state"));
        let totalSpendPerState =stateDim.group().reduceSum(dc.pluck("spend"));
        let stateChart = dc.pieChart("#state-chart");
        
    stateChart
        .width(300)
        .radius(150)
        .dimension(stateDim)
        .group(totalSpendPerState)
        .transitionDuration(1500)
        // .x(d3.scale.ordinal())
        // .xUnits(dc.units.ordinal)
        // .xAxisLabel("state")
        // .yAxis().ticks(6)


let dateDim = ndx.dimension(dc.pluck("date"));
let totalSpendPerDate= dateDim.group().reduceSum(dc.pluck("spend"));
let minDate= dateDim.bottom(1)[0].date; // bottom and top are crossfilter methods, it returns arry of objects
let maxDate= dateDim.top(1)[0].date;


// console.log(dateDim.top(1));
// console.log(dateDim.top(1)[0]);
// console.log(dateDim.top(1)[0].date);
//console.log(dateDim.bottom(1)[0].date);

// let dateChart= dc.barChart("date-chart");
let lineSpend = dc.lineChart("#line-chart");
lineSpend

 .width(1000)
 .height(300)
 .dimension(dateDim)
 .group(totalSpendPerDate)
 .x(d3.time.scale().domain([minDate, maxDate]))
 .xAxisLabel("Months")
 .renderHorizontalGridLines(true)
 .renderVerticalGridLines(true)
 .yAxis().ticks(8)

 dc.renderAll();
 
}