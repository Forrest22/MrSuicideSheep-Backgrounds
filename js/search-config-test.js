// The grid manages tiles using ids, which you can define. For our
// examples we'll just use the tile number as the unique id.
var TILE_IDS = [0];

// Grid
$(function() {

    function getJSON(clickNum){
        var i = tileId%25;
        console.log(clickNum)
        if(clickNum == null){
            clickNum = 0;
        }
        var startIndex = clickNum*25 + 1;
        console.log(startIndex);
        var query = getQueryVariable();
        var $test = $.getJSON('https://gdata.youtube.com/feeds/api/videos?author=MrSuicideSheep&q='+query+'&start-index='+startIndex+'&max-results=25&v=2&alt=jsonc&orderby=published');
        console.log($test);
        for (var i = $test.data.items.length - 1; i >= 0; i--) {
            TILE_IDS.push(i);
        };
    }
    getJSON(timesClicked);

    function getQueryVariable() {
        var query = window.location.search;
        query = query.slice(1,query.length);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == "q") {
                return decodeURIComponent(pair[1]);
            }
        }
    }

    // create the grid and an event which will update the grid
    // when either tile count or window size changes
    var el = document.getElementById('image-grid'),
    grid = new Tiles.Grid(el),
    updateGrid = function(event) {
            // update the set of tiles and redraw the grid
            grid.updateTiles(TILE_IDS.slice(0, TILE_IDS.length));
            grid.redraw(true /* animate tile movements */);
            
            // calculates the height, to set the div of the grid as
            var newHeight = grid.template.numRows * (grid.cellSize + grid.cellPadding);
            $(el).animate({
                height: newHeight+'px'
            });
        };

        grid.createTile = function(tileId, ytdata) {
            var tile = new Tiles.Tile(tileId);
            console.log(ytdata);
            return tile;
        };

    // testing out the use of a jQuery button
    var timesClicked = 0;
    $("button")
    .button({
        create: updateGrid
    })
    .click(function(event) {
        timesClicked++;
        event.preventDefault();
        var oldLength = TILE_IDS.length;
        var newId;
        for(var a = 0; a < 25; a++){
            newId = TILE_IDS.length;
            TILE_IDS.push(newId);
            console.log(newId);
            grid.addTiles(newId, false);
        }
        updateGrid(event);
        grid.animate(grid.height*2);
    })

    // wait until user finishes resizing the browser
    var debouncedResize = debounce(function() {
        grid.resize();
        grid.redraw(true);
    }, 200);

    // when the window resizes, redraw the grid
    $(window).resize(debouncedResize);
});