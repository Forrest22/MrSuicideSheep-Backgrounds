// The grid manages tiles using ids, which you can define. For our
// examples we'll just use the tile number as the unique id.
var TILE_IDS = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

// Grid
$(function() {

    // create the grid and an event which will update the grid
    // when either tile count or window size changes
    var el = document.getElementById('image-grid'),
        grid = new Tiles.Grid(el),
        updateGrid = function(event) {
            // update the set of tiles and redraw the grid
            grid.updateTiles(TILE_IDS.slice(0, TILE_IDS.length));
            grid.redraw(true /* animate tile movements */);

            // update the tile count label
            //$('#tileCount').text('(' + ui.value + ')');
        };

    /*
    getYTData = function(id){
        var blehr;
        var url = 'https://gdata.youtube.com/feeds/api/videos?author=MrSuicideSheep&start-index='+(id+1)+'&max-results=25&v=2&alt=jsonc&orderby=published';
        console.log(url);
        
        $.getJSON(url), function (ytjson) {
            console.log(ytjson);
            data = ytjson;
        }
        
        
        console.log(blehr);
        return blehr;
    };
    */

    var dataSet = 0;

        grid.createTile = function(tileId) {
            //var i = tileId;
            var tile = new Tiles.Tile(tileId);
            var ytdata;
            if (tileId/25 > dataSet || dataSet == 0){
                dataSet++;
                console.log((dataSet-1)/25 + " Data set at: " + dataSet);
                $.getJSON('https://gdata.youtube.com/feeds/api/videos?author=MrSuicideSheep&start-index='+(dataSet*25)+'&max-results=25&v=2&alt=jsonc&orderby=published', function (json) {
                    console.log(json);
                    generateHTML(json, tileId)
                });
            };
        console.log(tile);
        return tile;
        };

        generateHTML = function(json, startIndex){
            for(var i = startIndex; i < startIndex + 25; i++){
                tile = Tiles.Tile(i);
                console.log(tile);
                var html = "<a href=\"http://img.youtube.com/vi/"+ ytdata.data.items[i].id +"/maxresdefault.jpg\" data-lightbox=\""+ ytdata.data.items[i].id +"\" title=\""+ ytdata.data.items[i].title +"\"><img class=\"thumbs\" src=\"http://img.youtube.com/vi/" + ytdata.data.items[i].id + "/maxresdefault.jpg\">";
                tile.$el.append(html);
                console.log(html);
                html =  "<h3 class=\"tile-title\"><a href=\"http://www.youtube.com/watch?v="+ ytdata.data.items[i].id +"\">" + ytdata.data.items[i].title + "<a></h3>";
                tile.$el.append(html);
                console.log(html);
            }
        }


    /*
    // use a jQuery slider to update the number of tiles
    $('#image-tiles')
        .slider({
            min: 1,
            max: 25,
            step: 1,
            create: updateGrid,
            slide: updateGrid,
            change: updateGrid
        })
        .slider('value', 8);
    */

    // testing out the use of a jQuery button
    $( "button" )
      .button({
        create: updateGrid
      })
      .click(function(event) {
        event.preventDefault();
        var oldLength = TILE_IDS.length;
        var newId;
        for(var a = 0; a < 10; a++){
            newId = TILE_IDS.length + a;
            TILE_IDS.push(newId);
            console.log(grid);
            grid.createTile(newId);
        }
        updateGrid(event);

      });

    // wait until user finishes resizing the browser
    var debouncedResize = debounce(function() {
        grid.resize();
        grid.redraw(true);
    }, 200);

    // when the window resizes, redraw the grid
    $(window).resize(debouncedResize);
});