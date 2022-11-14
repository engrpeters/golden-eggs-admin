$('body').on('user-loaded', e => {
    if (location.pathname == '/deposit-reports.html') {
        axios.get('deposit_requests').then(res => {
            $('.deposites').pagination({
                dataSource: res.data.items
                , pageSize: 10
                , callback: function (e, pagination) {
                    // template method of yourself
                    $('.deposits tbody').empty()
                    e.forEach(function (e, i) {
                        $('.deposits tbody').append(`<tr ><td>${moment(e.created_at).format('lll')}</td><td id=deposit${e.id}>${e.player_id}</td><td class="">${e.currency}</td><td class="">${e.amount}</td> <td class="comments">${JSON.stringify(e.data.op)}</td></tr>`)
                    })
                }
            })
            return Promise.map(res.data.items, deposit => axios.get('players/' + deposit.player_id).then(r => {
                return {
                    deposit_id: deposit.id
                    , email: r.data.email
                    , player_id: deposit.player_id
                }
            }));
        }).then(r => {
            r.forEach(function (e, i) {
                $('#deposit' + e.deposit_id).text(e.player_id + '(' + e.email + ')')
            })
        })
    }
    else {
        axios.get('withdrawal_requests').then(res => {
            $('.withdrawee').pagination({
                dataSource: res.data.items
                , pageSize: 10
                , callback: function (e, pagination) {
                    // template method of yourself
                    $('.withdrawals tbody').empty()
                    e.forEach(function (e, i) {
                        $('.withdrawals tbody').append(`<tr ><td>${moment(e.created_at).format('lll')}</td><td id=withdrawal${e.id}>${e.player_id}</td><td class="">${e.currency}</td><td class="">${e.amount}</td> <td class="comments">${JSON.stringify(e.data)}</td></tr>`)
                    })
                }
            })
            return Promise.map(res.data.items, withdrawal => axios.get('players/' + withdrawal.player_id).then(r => {
                return {
                    withdrawal_id: withdrawal.id
                    , email: r.data.email
                    , player_id: withdrawal.player_id
                }
            }));
        }).then(r => {
            r.forEach(function (e, i) {
                $('#withdrawal' + e.withdrawal_id).text(e.player_id + '(' + e.email + ')')
            })
        })
    }
})