$('body').on('user-loaded',function(e){
  
    axios.get('admin/settings').then(res=>{
        for(key in  res.data){
            $('.settings tbody').append(`<tr><td>${key}</td> <td class="value" contenteditable data-key=${key}>${res.data[key]}</td></tr>`)
        }
    })
    
})

$('.apply-settings').click(()=>{
    var ob = {}
    
    $('.settings tbody tr td.value').each(function(i,e){
        var key = $(e).data('key');
        var value = $(e).text()
        ob[key] = value;
    })
  //  console.log(ob);
    
    axios.put('admin/settings',ob).then(res=>{
        alert("Your changes have been saved, please reload the servers to make the new settings work")
        location.reload();
    })
    
})

$('.cancel-settings').click((e)=>{
    e.preventDefault();
    location.reload();
    
})