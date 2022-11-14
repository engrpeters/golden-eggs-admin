$('body').on('user-loaded', e => {
   
    axios.get('deposit_types').then(res => {
        res.data.items.forEach(function (e, i) {
            $('.deposit-types tbody').append(`<tr ><td>${e.id}</td><td><a href="deposit-type.html#${e.id}">${e.name}</a></td>`)
        })
      
    }) 
    axios.get('withdrawal_types').then(res => {
        res.data.items.forEach(function (e, i) {
            $('.withdrawal-types tbody').append(`<tr ><td>${e.id}</td><td><a href="withdrawal-type.html#${e.id}">${e.name}</a></td>`)
        })
      
    })
})