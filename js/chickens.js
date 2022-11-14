var getChickens = function () {
    axios.get('chickens').then(res => {
        console.log(res.data.items)
        $('.chickens tbody').empty()
        res.data.items.forEach((e, i) => {
            $('.chickens tbody').append(`<tr ><td data-key=id>${e.id}</td><td data-key=name>${e.name}</td><td data-key="color" style="background-color:${e.color}">${e.color}</td><td data-key="coin_price">${e.coin_price}</td> <td data-key="usd_price">${e.usd_price}</td> <td data-key="ingame_id"> ${e.ingame_id}</td><td data-key=spawn_eggs>${e.spawn_eggs}</td><td data-key=spawn_cap>${e.spawn_cap}</td>




<td><button id="${e.id}"class="editChicken${e.id} label btn label-table label-warning">Edit</button> 
<button id="${e.id}"class="saveChicken${e.id} label btn label-table label-success hidden">Save</button> <button id="${e.id}" class="destroyChicken${e.id} label btn label-table label-danger">Destroy</button></td></tr>`)
        })
        $("[class^='destroyChicken']").on('click', (e, i) => {
            swal("Are you sure you want to destroy this chicken?", {
                buttons: true
            }).then((r) => {
                if (r) {
                    axios.delete('chickens/' + e.target.id).then(r => {
                        swal('You just deleted a Chicken', '', 'warning')
                        $(e.target).parents('tr').remove()
                    })
                }
            })
        })
        $("[class^='editChicken']").on('click', function (e, i) {
            $(e.target).toggleClass('hidden')
            $(this).parent().siblings().attr('contenteditable', true)
            $(this).siblings("[class^='saveChicken']").toggleClass('hidden')
                //console.log(e)
        })
        $("[class^='saveChicken']").click(function (e, i) {
            var o = {}
            $(this).parent().siblings().each(function (i, e) {
                var key = $(e).data('key');
                if (key != 'id') {
                    if (!isNaN(parseFloat($(e).text()))) {
                        var value = parseFloat($(e).text())
                    }
                    else {
                        var value = $(e).text()
                    }
                    o[key] = value;
                }
            })
            console.log(o)
            if (o.name) {
                axios.put('/chickens/' + e.target.id, o).then(res => {
                    alert('You Successfully Edited ' + o.name + ' Chicken')
                    location.reload()
                }).catch(err => {
                    alert(err)
                })
            }
        })
    })
}
$('body').on('user-loaded', e => {
    getChickens()
})
$('.create-chickens').submit(function (e, i) {
    e.preventDefault();
    e.stopPropagation();
    console.log(this)
    var d = $(this).serializeArray().reduce(function (acc, cur) {
        acc[cur.name] = cur.value;
        return acc
    }, {})
    axios.post('chickens', d).then(r => {
        swal('', `you succesfully created ${d.name}`, 'success')
        $('.create-chickens input').val('')
        getChickens()
    }).catch((e) => {
        let wd = function () {
            if (e.response.data.errors) {
                return JSON.stringify(e.response.data.errors)
            }
        }
        console.log(e.response)
        swal('Ops, ' + e.response.data.message, wd(), 'error')
    })
})