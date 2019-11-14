let windowWidth = document.documentElement["clientWidth"];
window.onresize = function(){
    location.reload();
}
queue()
    .defer(d3.csv,"life_expectancy.csv")
    .await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);
    
    let chartWidth= 300;
    if (windowWidth <768)
    {
        chartWidth = windowWidth;
    }
    else{
        chartWidth= windowWidth / 5;
    }

let CountryDim = ndx.dimension(dc.pluck("country"));
let femaleLifePerCountry= CountryDim.group().reduceSum(dc.pluck("female"));
let femaleLifeChart = dc.barChart("#femaleLifeChart");
let countryColors =d3.scale.ordinal().range(["yellow" ,"#66ffe0","#8080ff","#b3ff66","pink","#d966ff","#ff944d","#ff66b3"]);

femaleLifeChart
    .width(1000)
    .height(400)
    .margins({top: 10, right: 20, bottom: 50, left: 40})
    .dimension(CountryDim)
    .group(femaleLifePerCountry)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .colorAccessor(function(d){
            return d.key
        })
        .colors(countryColors)
    .transitionDuration(1500)
    .xAxisLabel("Country")
    .elasticY(true)
    .yAxis().ticks(6);


// let parseDate = d3.time.format("%d/%m/%Y").parse;

// transactionsData.forEach(function(d) {
//     d.year = parseDate("01/01/" + d.year);
// });
 let Lifeyears =ndx.dimension(dc.pluck("year"));
    //let SalaryByYrsExp =yrsService.group().reduceSum(dc.pluck("salary"));
    let maleByYrs = Lifeyears.group().reduce(
       function(c,v){
           //add fun, run once for each record thats added to the group
           c.count++;
           c.total += +v.male;
           c.average= c.total / c.count;
           return c;
       },
        function(c,v){
            //remove fun, run once for each record thats removed from the group
            c.count--;
            c.total -= v.male;
            c.average = c.total/c.count;
            return c;
           
       },
        function(){
            //intialiser function.refferd to as c inthe add
            //and remove function above
         return { count:0, total:0, average:0};  
       }
       
        );
       // let YrsExpChart= 


 dc.renderAll();
}