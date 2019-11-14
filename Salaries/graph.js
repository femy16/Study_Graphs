let windowWidth = document.documentElement["clientWidth"];
window.onresize = function(){
    location.reload();
}
queue()
    .defer(d3.csv,"salary.csv")
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

    // let parseDate = d3.time.format("%d/%m/%Y").parse;

    // transactionsData.forEach(function(d) {
    //     d.date = parseDate(d.date);
    // });

    // let dateDim = ndx.dimension(dc.pluck("date"));

    // let minDate = dateDim.bottom(1)[0].date;
    // let maxDate = dateDim.top(1)[0].date;
    let genderDim= ndx.dimension(dc.pluck("sex"));
    //will have three arguments reduce(add,remove,init) each of this three have 2 arguments(c,v) c is object created at initialisation, vis current recort

    let salaryByGender = genderDim.group().reduce(
       function(c,v){
           //add fun, run once for each record thats added to the group
           c.count++;
           c.total += +v.salary;
           c.average= c.total / c.count;
           return c;
       },
        function(c,v){
            //remove fun, run once for each record thats removed from the group
            c.count--;
            c.total -= v.salary;
            c.average = c.total/c.count;
            return c;
           
       },
        function(){
            //intialiser function.refferd to as c inthe add
            //and remove function above
         return { count:0, total:0, average:0};  
       }
       
        );
    
    let salaryChart = dc.barChart("#salaryByGender");
    
    salaryChart
        .width(chartWidth)
        .height(150)
        .margins({top:10, right:20, bottom:50, left:50})
        .dimension(genderDim)
        .group(salaryByGender)
        .valueAccessor(function(c){
            return c.value.average;
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Gender")
        .yAxis().ticks(6);
        
    let yrsService =ndx.dimension(dc.pluck("rank"));
    //let SalaryByYrsExp =yrsService.group().reduceSum(dc.pluck("salary"));
    let SalaryByYrsExp = yrsService.group().reduce(
       function(c,v){
           //add fun, run once for each record thats added to the group
           c.count++;
           c.total += +v.salary;
           c.average= c.total / c.count;
           return c;
       },
        function(c,v){
            //remove fun, run once for each record thats removed from the group
            c.count--;
            c.total -= v.salary;
            c.average = c.total/c.count;
            return c;
           
       },
        function(){
            //intialiser function.refferd to as c inthe add
            //and remove function above
         return { count:0, total:0, average:0};  
       }
       
        );
    let YrsExpChart = dc.pieChart("#YrsExpChart");
    
        YrsExpChart
            .width(chartWidth)
            .radius(150)
            .dimension(yrsService)
            .group(SalaryByYrsExp)
            .valueAccessor(function(c){
            return c.value.average;
        })
            .transitionDuration(1500)
            
            
    let rankCompDim = ndx.dimension(dc.pluck("rank"));

    let rankByFemale = rankCompDim.group().reduce(
        function(c, v) {
            // Add function, run once for each record
            // that's added to the group
            if (v.sex == "Female") {
                c.count++;
                c.total += +v.salary;
                c.average = c.total / c.count;
            }
            return c;
        },
        function(c, v) {
            // Remove function, run once for each record
            // that's removed from the group
            if (v.sex == "Female") {
                c.count--;
                c.total -= +v.salary;
                c.average = c.total / c.count;
            }
            return c;
        },
        function() {
            // Initialiser function. Referred to as c
            // in the add and remove functions above
            return { count: 0, total: 0, average: 0 };
        });

    let rankByMale = rankCompDim.group().reduce(
        function(c, v) {
            // Add function, run once for each record
            // that's added to the group
            if (v.sex == "Male") {
                c.count++;
                c.total += +v.salary;
                c.average = c.total / c.count;
            }
            return c;
        },
        function(c, v) {
            // Remove function, run once for each record
            // that's removed from the group
            if (v.sex == "Male") {
                c.count--;
                c.total -= +v.salary;
                c.average = c.total / c.count;
            }
            return c;
        },
        function() {
            // Initialiser function. Referred to as c
            // in the add and remove functions above
            return { count: 0, total: 0, average: 0 };
        });

    let compSalaryChart = dc.compositeChart("#salaryByGenderRank");
    
    compSalaryChart
        .width(500)
        .height(200)
        .margins({top: 10, right: 20, bottom: 50, left: 20})
        .dimension(rankCompDim)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .group(rankByFemale)
        .yAxisLabel("Salary")
        .legend(dc.legend().x(40).y(40).itemHeight(13).gap(5))
        .compose([
            dc.barChart(compSalaryChart)
            .colors("green")
            .group(rankByMale, "Male")
            .valueAccessor(function(c) {
                return c.value.average;
            }),
            dc.barChart(compSalaryChart)
            .colors("red")
            .group(rankByFemale, "Female")
            .valueAccessor(function(c) {
                return c.value.average;
            })
        ])
        .render()
        .yAxis().ticks(4);
            
    dc.renderAll();

}
