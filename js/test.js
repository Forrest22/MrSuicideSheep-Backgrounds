// The grid manages tiles using ids, which you can define. For our
// examples we'll just use the tile number as the unique id.
var TILE_IDS = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24 ];

// Grid
$(function() {

    // create the grid and an event which will update the grid
    // when either tile count or window size changes
    var el = document.getElementById('image-grid'),
        grid = new Tiles.Grid(el),
        updateGrid = function(event, ui) {

            // update the set of tiles and redraw the grid
            grid.updateTiles(TILE_IDS.slice(0, ui.value));
            grid.redraw(true /* animate tile movements */);

            // update the tile count label
            $('#tileCount').text('(' + ui.value + ')');
        };

    grid.createTile = function(tileId) {
        var i = tileId;
        var tile = new Tiles.Tile(tileId);
        $(tile).addClass("container portrait");
        $.getJSON('https://gdata.youtube.com/feeds/api/videos?q=MrSuicideSheep&max-re‌​sults=5&v=2&alt=jsonc&orderby=published', function(ytdata) {
            console.log(ytdata.data.items[i]);
            var html = "<a href=\"http://img.youtube.com/vi/"+ ytdata.data.items[i].id +"/maxresdefault.jpg\" data-lightbox=\""+ ytdata.data.items[i].id +"\" title=\""+ ytdata.data.items[i].title +"\"><img class=\"thumbs\" src=\"http://img.youtube.com/vi/" + ytdata.data.items[i].id + "/maxresdefault.jpg\">";
            console.log(html);
            tile.$el.append(html);
            html =  "<h3 class=\"tile-title\"><a href=\"http://www.youtube.com/watch?v="+ ytdata.data.items[i].id +"\">" + ytdata.data.items[i].title + "<a></h3>";
            tile.$el.append(html);
            });
        return tile;
    };

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

    // wait until user finishes resizing the browser
    var debouncedResize = debounce(function() {
        grid.resize();
        grid.redraw(true);
    }, 200);

    // when the window resizes, redraw the grid
    $(window).resize(debouncedResize);
});