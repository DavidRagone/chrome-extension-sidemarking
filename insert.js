(function() {
  function activate() {
    console.log('activating insert.js');
    var innerHTML = buildUrlList();
    var styles = mainStyles();
    var div = buildTag("div", { style: styles }, innerHTML);
    document.body.appendChild(div);
  }
  activate();

  /**
   * Build HTML ordered list of saved URLs
   * @return {String} - HTML-compliant ol
   **/
  function buildUrlList() {
    var url,
      title,
      tags,
      urlMarkup,
      allMarkup = "";

    var urls = Object.keys(sideMarking.urls);
    for (var i = 0; i < urls.length; i++) {
      url = urls[i];
      title = sideMarking.urls[url].title;
      tags =  sideMarking.urls[url].tags;

      urlMarkup = buildTag(
        "a",
        { href: url, "style": aStyles() },
        title
      );

      allMarkup = allMarkup + buildTag(
        "li",
        { "data-tags": tags, "style": liStyles() },
        urlMarkup
      ).outerHTML;

    }

    return buildTag("ol", { "style": olStyles() }, allMarkup).outerHTML;
  }

  /**
   * @return {String} - CSS
   **/
  function mainStyles() {
    var styles = "";
    styles = styles + "position: fixed;";
    styles = styles + "top: 10px;";
    styles = styles + "left: 10px;";
    styles = styles + "width: 300px;";
    styles = styles + "height: 800px;";
    // http://www.google.com/design/spec/style/color.html#color-color-palette
    // 'Blue Grey'
    styles = styles + "background-color: #607D8B;";
    styles = styles + "box-shadow: 6px 7px 12px #37474F;";
    styles = styles + "color: #ECEFF1;";
    styles = styles + "";
    //styles = styles + "";
    return styles;
  }

  /**
   * @return {String} - CSS
   **/
  function olStyles() {
    var styles = "";
    styles = styles + "list-style: none;";
    styles = styles + "margin: 0;";
    styles = styles + "padding: 0;";
    return styles;
  }

  /**
   * @return {String} - CSS
   **/
  function liStyles() {
    var styles = "";
    styles = styles + "margin: 10px 5px;";
    styles = styles + "padding: 0 5px;";
    return styles;
  }

  /**
   * @return {String} - CSS
   **/
  function aStyles() {
    var styles = "";
    styles = styles + "color: #ECEFF1;";
    styles = styles + "text-decoration: none;";
    styles = styles + "font-family: arial, sans-serif;";
    styles = styles + "font-size: small;";
    return styles;
  }

  /**
   * Create an arbitrary tag with the given properties and innerHTML
   *
   * @param {String} type - type of html element to create
   * @param {Object} properties - properties to place on the html element
   * @param {String} innerHTML - markup to insert in the created element
   * @return {Element}
   **/
  function buildTag(type, properties, innerHTML) {
    var prop, element;

    element = document.createElement(type);
    for (prop in properties) {
      element.setAttribute(prop, properties[prop]);
    }
    element.innerHTML = innerHTML.outerHTML || innerHTML;

    return element;
  }
})();
