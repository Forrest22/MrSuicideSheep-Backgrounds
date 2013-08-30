// The grid manages tiles using ids, which you can define. For our
// examples we'll just use the tile number as the unique id.
var TILE_IDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

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
        };

    grid.createTile = function(tileId) {
        var i = tileId%25;
        var tile = new Tiles.Tile(tileId);
        console.log(tileId);
        var startIndex = timesClicked*25 + 1;
        $.getJSON('https://gdata.youtube.com/feeds/api/videos?author=MrSuicideSheep&start-index='+startIndex+'&max-results=25&v=2&alt=jsonc&orderby=published', function(ytdata) {
            console.log(ytdata);
            var html = "<a href=\"http://img.youtube.com/vi/"+ ytdata.data.items[i].id +"/maxresdefault.jpg\"><img class=\"thumbs\" src=\"http://img.youtube.com/vi/" + ytdata.data.items[i].id + "/maxresdefault.jpg\">";
            tile.$el.append(html);
            html =  "<h3 class=\"tile-title\"><a href=\"http://www.youtube.com/watch?v="+ ytdata.data.items[i].id +"\">" + ytdata.data.items[i].title + "<a></h3>";
            tile.$el.append(html);
            });
        return tile;
    };

    // testing out the use of a jQuery button
    var timesClicked = 0;
    $( "button" )
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
      });

    // wait until user finishes resizing the browser
    var debouncedResize = debounce(function() {
        grid.resize();
        grid.redraw(true);
    }, 200);

    // when the window resizes, redraw the grid
    $(window).resize(debouncedResize);
});