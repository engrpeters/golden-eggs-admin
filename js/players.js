$('body').on('user-loaded', function () {
    axios.get('players', {
            params: {
                page: 1
            , }
        }).then(function (res) {
            //  res.data.items.forEach(function(e,i){
            $('.players-list').pagination({
                dataSource: res.data.items
                , pageSize: 10
                , callback: function (e, pagination) {
                    // template method of yourself
                    $('.players-list tbody').empty()
                    e.forEach(function (e, i) {
                        $('.players-list tbody').append(`<tr><td>${e.id}</td><td>${e.email}</td><td>${e.balance_eggs}</td> <td>${moment(e.created_at).format('lll')}</td><td><a href="player.html#${e.id}">Details</a></td></tr>`)
                    })
                }
            })
        })
        // })
})