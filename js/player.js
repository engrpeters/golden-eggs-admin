var pChickens, pCells;
var currentPlayer;
var chickens = [];
var te;
axios.get('chickens').then(res => {
    $('.chickens tbody').empty()
    res.data.items.forEach((e, i) => {
        chickens.push(e)
        $('.chicken-types tbody').append(`<tr><td>${e.name} </td> <td style='background-color:${e.color}'></td></tr>`)
    })
})
if (window.location.hash === '') {
    window.location.pathname = '/players.html'
}
var tileVariation = {
    x: 48
    , y: 24
}
var start = {
    x: 240
    , y: 0
}
var Tile = function (x, y, z, id) {
    this.x = x;
    this.y = y;
    this.z = z;
    if (id) {
        this.id = id;
    }
    this.posX = Math.floor((this.x - 240) / 96 + this.y / 48)
    this.posY = Math.floor(-((this.x - 240) / 96) + this.y / 48)
}
Tile.prototype.render = function (u) {
    var c = document.getElementById("playerField");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + tileVariation.x, this.y + tileVariation.y);
    ctx.lineTo(this.x, this.y + tileVariation.x);
    ctx.lineTo(this.x - tileVariation.x, this.y + tileVariation.y);
    ctx.lineTo(this.x, this.y);
    if (!u) {
        ctx.fillStyle = '#595959';
        ctx.fill()
    }
    else {
        ctx.fillStyle = "#888";
        ctx.fill()
        ctx.stroke();
    }
    // this.ctx = console.l
}
Tile.prototype.fill = function (co) {
    var c = document.getElementById("playerField");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + tileVariation.x, this.y + tileVariation.y);
    ctx.lineTo(this.x, this.y + tileVariation.x);
    ctx.lineTo(this.x - tileVariation.x, this.y + tileVariation.y);
    ctx.lineTo(this.x, this.y);
    ctx.fillStyle = co;
    ctx.fill()
}
var fillChicken = function (type, cell_id, id) {
        var chickenType = chickens.find(function (e, i) {
            return e.id == type
        })
        var tile = unlockedTiles.find(function (e, i) {
            return e.id == cell_id
        })
        tile.chicken = id
        tile.fill(chickenType.name)
    }
    //for(var i = 0 , i < 25 , i++){
var tiles = [];
var unlockedTiles = [];
for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
        // if (i == 2){break;}
        tiles.push(new Tile(start.x + j * tileVariation.x - i * tileVariation.x, start.y + j * tileVariation.y + i * tileVariation.y, i + j))
    }
}
tiles.sort(function (a, b) {
    return a.z - b.z;
});

function renderTiles() {
    for (var i = 0; i < tiles.length; i++) {
        tiles[i].render();
    }
}
renderTiles();
$('body').on('user-loaded', function () {
    let hash = window.location.hash.substring(1)
    let id = hash
    currentPlayer = id;
    axios.get('players/' + id).then(res => {
        $('.user_info').text('ID ' + res.data.id + ' (' + res.data.email + ')')
        $('.created_at').text(moment(res.data.created_at).format('DD.MM.YY HH:mm:ss'))
        axios.get('cells', {
            params: {
                player_id: id
            }
        }).then(cells => {
            // [ { id: 65, ... }. { id: 66, ... } ]
            pCells = cells.data.items;
            pCells.forEach(function (e, i) {
                unlockedTiles.push(new Tile(start.x + tileVariation.x * e.pos_x - tileVariation.x * e.pos_y, tileVariation.y * e.pos_x + tileVariation.y * e.pos_y, e.pos_x + e.pos_y, e.id));
                unlockedTiles[i].render(true)
            })
            $('.pCells').text(pCells.length);
            return Promise.map(cells.data.items, cell => axios.get('player_chickens', {
                params: {
                    cell_id: cell.id
                }
            }).then((res) => (res.data.items)));
        }).then(r => {
            return r.reduce((arr, item) => {
                if (item[0]) {
                    arr.push(item[0]);
                }
                return arr;
            }, []);
        }).then(r => {
            pChickens = r;
            $('.pChickens').text(pChickens.length)
            pChickens.forEach(function (e, i) {
                fillChicken(e.chicken_id, e.cell_id, e)
            })
            var canvas = $('#playerField');
            // calculate position of the canvas DOM element on the page
            var canvasPosition = {
                x: canvas.offset().left
                , y: canvas.offset().top
            };
            canvas.on('mousemove',function (e) {
                if (te){
                    clearTimeout(te); 
                }
                te = setTimeout(function(){$(canvas).trigger('mousemoveend')}, 2000); 
                       
                // use pageX and pageY to get the mouse position
                // relative to the browser window
                var mouse = {
                        x: e.pageX - canvasPosition.x
                        , y: e.pageY - canvasPosition.y
                    }
                    //   console.log(mouse.x,mouse.y)
                    // now you have local coordinates,
                    // which consider a (0,0) origin at the
                    // top-left of canvas element
                var re = (unlockedTiles.find(function (e, i) {
                    return e.posX == Math.floor((mouse.x - 240) / 96 + mouse.y / 48) && e.posY == Math.floor(-((mouse.x - 240) / 96) + mouse.y / 48)
                }))
                
                var lo = tiles.find(function(e,i){
                     return e.posX == Math.floor((mouse.x - 240) / 96 + mouse.y / 48) && e.posY ==  Math.floor(-((mouse.x - 240) / 96) + mouse.y / 48)
                    })
                
                if(re){
                var ru = "";
                    //   console.log(re)
                for (var key in re) {
                    if (re.hasOwnProperty(key) && typeof re[key] != 'object') {
                       console.log(typeof (re[key]))
                        ru += "&nbsp;" + key + ' :' + re[key] + '<br>'
                            // console.log(ru)
                    }
                    if (typeof re[key] == 'object') {
                        ru += '&nbsp;&nbsp; Chicken : { <br>'
                        for (var shi in re[key]) {
                     if (Object.keys(re[key]).indexOf(shi) == Object.keys(re[key]).length - 1) {
                            
                                ru += "&nbsp&nbsp;&nbsp;" + shi + ' :' + re[key][shi] + ' } <br>'
                            }
                            else {
                                ru += "&nbsp;&nbsp;&nbsp;" + shi + ' :' + re[key][shi] + '<br>'
                            }
                        }
                    }
                    addElement('wrapper', 'div', 'grid-info', ru, {
                        x: e.pageX
                        , y: e.pageY
                    })
                }
                }else if(lo){
                    
                    
                   
                        addElement('wrapper', 'div', 'grid-info', 'Locked', {
                        x: e.pageX
                        , y: e.pageY
               
                })}
            });
            canvas.on('mousemoveend', function (e) {
                
          //      console.log('yh')
                     $('#grid-info').remove();
            })
        })
        axios.get('deposit_requests', {
            params: {
                player_id: id
            }
        }).then(r => {
            if (r.data.items.length) {
                
                
        
                
                r.data.items.forEach(function (e, i) {
                    $('.transactions tbody').append(`<tr><td>${moment(e.created_at).format('DD.MM.YY HH:mm:ss')}</td><td class="debit"></td> <td class="credit">${e.amount}</td><td>${JSON.stringify(e.data.op)}</td></tr>`)
                })
            }
        })
    }).catch(function (e) {})
})

function addElement(parentId, elementTag, elementId, html, position) {
    // Adds an element to the document
    var p = document.getElementById(parentId);
    $('#grid-info').remove();
    var newElement = document.createElement(elementTag);
    newElement.setAttribute('id', elementId);
    newElement.innerHTML = html;
    $(newElement).css('left', position.x)
    $(newElement).css('top', position.y)
    p.appendChild(newElement);
}