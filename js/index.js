var date = [], 
    income = [], 
    expenditure=[];
$('body').on('user-loaded', function () {
    // axios.get('admin/me')
    //  .then(function (res) {
    //      window.user = res.data.user;
    //     $('.username').text(user.email.split('@')[0])
    // });
    axios.get('players', {
        params: {
            page_size: 1
            , page: 1
        }
    }).then(function (res) {
        $('.clients_num').text(res.data.meta.count)
    })
    axios.get('player_chickens', {
        params: {
            page_size: 1
            , page: 1
        }
    }).then(function (res) {
        $('.chickens_bought').text(res.data.meta.count)
    })
    axios.get('admin/statistics',{params: {
        from: moment().subtract(6, 'days').format('YYYY-MM-DD')
        , to: moment().format('YYYY-MM-DD')
    }}).then(res => {
        res.data.forEach((e,i)=>{
            date.push(e['date'])
            income.push(e['incomes'])
            expenditure.push(e['expenditures'])
        })
    }).then(()=>{
                         
                        var ctx = document.getElementById("myChart");
                        var myChart = new Chart(ctx, {
                            type: 'line'
                            , data: {
                                labels: date
                                , datasets: [{
                                    label:'Income',
                                    data: income
                                    , fill: false
                                    , borderWidth: 2
                                    , borderColor: '#999'
     },{
                                    label:'Expenditure',
                                    data: expenditure
                                    , fill: false
                                    , borderWidth: 2
                                    , borderColor: '#222'
     }]
                            }
                            , options: {
                                scales: {
                                    yAxes: [{
                                        gridLines: {
                                       //     display: false
                                        }
                                        , ticks: {
                                            beginAtZero: true
                                        }
            }]
                                    , xAxes: [
                                        {
                                            gridLines: {
                                    //            display: false
                                            }
                }
            ]
                                }
                                
                                ,elements:{line:{tension:0}}
                            }
                        });
        
    })
})