if (window.location.hash === '') {
    window.location.pathname = '/deposit-types.html'
    
}
 var hash = window.location.hash.substring(1)
 var id = hash
$('body').on('user-loaded', e => {
   
   
    axios.get('withdrawal_types/' + id).then(res => {
        var e = res.data;
        $('.withdrawal-type tbody').append(`<tr><td>${e.id}</td><td>${e.name}</td> <td><textarea class="wo" style=
""rows="5" cols="50">${JSON.stringify(e.settings,null,3)}</textarea></td> </tr>
`)
    })
})




$('.so').on('click', function (e) {
    console.log(JSON.parse($('textarea').text()))
  
    
    
axios.put('withdrawal_types/' + id,JSON.parse($('textarea').text())).then(res=>{
        alert("Your changes have been saved")
        location.reload();
    
    
    })
    
})