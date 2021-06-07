// Initiate Type Tester Tools
function initTypeTester() {
  var $typeTester = $('.type-tester');
  var $typeTesterInner = $('.type-tester-inner');
  var $para = $typeTester.find('.test-para');
  var fontFamily = $typeTester.attr('data-font');
  var svgUrl = $typeTester.attr('data-svg-url');
  
  // Initialize CSS for tester
  $typeTesterInner.css('font-family', fontFamily);
  
  // Set Up Tools
  $typeTester.prepend('<div id="typetools"><h3>Type Tools</h3><div class="typetools-container"></div></div>');
  var $tools = $('#typetools');
  var $toolsContainer = $tools.find('.typetools-container');
  
  // Font Size
  // Get min/max from data attributes
  var minSize = $typeTester.attr('data-min-size');
  var maxSize = $typeTester.attr('data-max-size');
  
  $toolsContainer.append('<div class="type-tool type-only"><label for="fontSize" id="fontSizeLabel">Size: <span id="currentFontSize"></span></label><input type="range" name="fontSize" id="fontSize" min="'+minSize+'" max="'+maxSize+'" step="6"></div>');
  var $fontSize = $('#fontSize');
  var $currentFontSize = $('#currentFontSize');
  // Set starting font size
  var startingFontSize = $typeTester.attr('data-font-size');
  $typeTesterInner.css('font-size', startingFontSize+'px');
  $fontSize.val(startingFontSize);
  $currentFontSize.html(startingFontSize+'px');
  
  // Font Styles
  if ($typeTester.attr('data-styles') !== '') {
    var dataStyles = $typeTester.attr('data-styles');
    var styles = dataStyles.split('-');
    
    if (styles.length > 1) {
      $toolsContainer.append('<div class="type-tool"><label for="fontStyle">Style</label><select name="fontStyle" id="fontStyle"></select></div>');
      var $fontStyle = $('#fontStyle');
      $.each(styles, function(i) {
        $fontStyle.append('<option value="'+this+'">'+this+'</option>');
      });
    }
    
  }
  
  // Font Weights
  //   if ($typeTester.attr('data-weights') !== '') {
  //     $toolsContainer.append('<div class="type-tool"><label for="fontWeight">Weight</label><select name="fontWeight" id="fontWeight"></select></div>');
  //     var $fontWeight = $('#fontWeight');

  //     var dataStyles = $typeTester.attr('data-weights');
  //     var weights = dataStyles.split('-');
  //     $.each(weights, function(i) {
  //       $fontWeight.append('<option value="'+this+'">'+this+'</option>');
  //     });
  //   }
  
  // Paragraph Style
  $toolsContainer.append('<div class="type-tool type-only" id="textAlignment"><label>Alignment</label><button class="-active" data-alignment="left">Left</button><button data-alignment="center">Center</button><button data-alignment="right">Right</button></div>');
  var $textAlignment = $('#textAlignment');
  
  // Color Pairs
  if ($typeTester.attr('data-color-pairs') !== 'undefined') {
    $toolsContainer.append('<div class="type-tool" id="colorPairs"><label>Color Pairs</label><div id="colorPairsContainer"></div></div>');
    var $colorPairs = $('#colorPairs');
    var colorData = $typeTester.attr('data-color-pairs');
    var colorPairs = colorData.split(' ');
    colorPairs.unshift('#000-#fff')

    $.each(colorPairs, function(i) {
      var colors = this.split('-');
      var textColor = colors[0];
      var backgroundColor = colors[1];
      
      $('#colorPairsContainer').append('<button class="color-pair" data-text-color="'+textColor+'" data-background-color="'+backgroundColor+'" style="color:'+textColor+';background-color:'+backgroundColor+';">A</button>');
    });
    
    $('#colorPairs .color-pair:first').addClass('-active');
  }
  
  // Get SVG font file if it is set and generate the glypgh chart
  if ($typeTester.attr('data-svg-url') !== 'undefined') {
    $('.type-tester-inner').append('<div id="typeTesterSvgFont" style="display:none;"></div><ul id="glyphChart" class="-active" style="font-family:'+fontFamily+';font-size:'+startingFontSize+';"></ul>');
    var $svgContainer = $('#typeTesterSvgFont');
    var $glyphChart = $('#glyphChart');
    
    // Add glyphs button to toolbar
    $toolsContainer.prepend('<div class="type-tool" id="glyphsTypeToggle"><button id="glyphsToggle" class="-active" data-target="#glyphChart">Glyphs</button><button id="typeToggle" data-target=".test-para">Type</button></div>');
    
    // Watch for glyphs/type toggle
    $(document).on('click', '#glyphsTypeToggle button', function() {
      var targetElem = $(this).attr('data-target');
      $('#glyphChart.-active, .test-para.-active, #glyphsTypeToggle button.-active').removeClass('-active');
      $(targetElem).addClass('-active');
      $(this).addClass('-active');
      
      // Add/remove -hidden class on type-only tools
      if (targetElem === '.test-para') {
        $('.type-tool.type-only').removeClass('-hidden');
      } else {
        $('.type-tool.type-only').addClass('-hidden');
      }
    });
    
    // Disable Tools Not Meant for Glyphs
    $('.type-tool.type-only').addClass('-hidden');
    
    $svgContainer.load(svgUrl, function(svgUrl) {
      // Find all glyph nodes in the SVG file
      var svg = $svgContainer.find('svg glyph[unicode]');

      // Add unicode escaping for CSS
      var unicodePrefix = '\\';
      var glyphsOutput = '';
      var glyphs = [];
      var i = 0;
      
      for (i=0; i < svg.length; i++) {
        var unicode = svg[i].getAttribute('unicode').toString();
        glyphs.push(unicode);
      }
      
      for (i=0; i < glyphs.length; i++) {
        var glyphChar = glyphs[i].charCodeAt();

        glyphChar = glyphChar.toString(16); // Convert to string format
        glyphsOutput += '<li class="glyph-' + glyphs[i] + '">' + glyphs[i] + '</li>';
      }

      $glyphChart.append(glyphsOutput);
    });
    
  }
  
    // Watch for changes on individual tools
  // Size
  $fontSize.on('input', function(e) {
    var currentSize = $(this).val();
    $para.css('font-size', currentSize+'px');
    $currentFontSize.html(currentSize+'px');
  });
  
  // Style
  $fontStyle.on('change', function(e) {
    var currentStyle = $(this).val();
    $typeTesterInner.css('font-style', currentStyle);
  });
  
  // Text Alignment
  $textAlignment.on('click', 'button', function(e) {
    $textAlignment.find('button.-active').removeClass('-active');
    $(this).addClass('-active');
    var alignment = $(this).attr('data-alignment');
    $typeTesterInner.css('text-align', alignment);
  });
  
  // Weight
  // $fontWeight.on('change', function(e) {
  //   var currentStyle = $(this).val();
  //   $typeTesterInner.css('font-weight', currentStyle);
  // });
  
  // Colors
  if ($colorPairs !== 'undefined') {
    $colorPairs.on('click', 'button', function() {
      $('.color-pair.-active').removeClass('-active');
      $(this).addClass('-active');
      var textColor = $(this).attr('data-text-color');
      var backgroundColor = $(this).attr('data-background-color');
      $('.type-tester-inner').css({
        'color': textColor,
        'background-color': backgroundColor
      });
    });
  }
  
  // Type Tester Activation
  $para.on('click', function(e) {
    $(this).find('.cursor').addClass('-hidden');
    $(this).focus();
  });
}

initTypeTester();