
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>MrSuicideSheep Backgrounds</title>
    <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/themes/ui-lightness/jquery-ui.css" type="text/css" media="all" />
    <link rel="stylesheet" href="css/default.css"/>
    <link rel="stylesheet" href="css/lightbox.css"/>

    <script type="text/javascript">
      // debounce utility from underscorejs.org
      var debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
          var context = this, args = arguments;
          var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
          if (immediate && !timeout) func.apply(context, args);
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      };
    </script>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script>
    <script src="js/tiles.js"></script>
    <script src="js/search-config-test-3.js"></script>
    <script type="text/javascript">
        // fallback to version hosted on thinkpixellab.com if local version doesn't exist
        if (typeof Tiles == 'undefined') {
            var url = 'http://thinkpixellab.com/tilesjs/tiles.js';
            document.write('<' + 'script src="' + url + '"></' + 'script' + '>');
        }
    </script>
</head> 
<body>
  <a href="/MrSuicideSheep-Backgrounds"><img src="img/sheepy.png" class="sheepy"></a>
  <h1 class="font-effect-shadow-multiple">MrSuicideSheep Backgrounds</h1>
  <h3>A bunch of backgrounds generated from <a class="underlined-link" href="http://www.youtube.com/user/MrSuicideSheep?feature=watch">MrSuicideSheep's</a> music videos.</h3>
  <form action="search.php" method="get">
    <input type="text" name="q"/>
  </form>
  <?php echo $_GET["q"]; ?>


    <div id="image-grid" class="grid"></div>
    <div style="text-align: center;">
      <button class="more-button">Load More</button>
    </div>
    <h3>Created by <a href="">Forrest D.</a></h3>
  </body>
  </html>