(function() {
  var tags,
    urls,
    currentTab;

  /**
   * Get the current URL.
   * Via https://developer.chrome.com/extensions/getstarted
   *
   * @param {function(string)} callback - called when the URL of the current tab
   *   is found.
   **/
  function getCurrentTabInfo(callback) {
    var queryInfo = {
      active: true,
      currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
      // chrome.tabs.query invokes the callback with a list of tabs that match the
      // query. When the popup is opened, there is certainly a window and at least
      // one tab, so we can safely assume that |tabs| is a non-empty array.
      // A window can only have one active tab at a time, so the array consists of
      // exactly one tab.
      var tab = tabs[0];

      // See https://developer.chrome.com/extensions/tabs#type-Tab
      callback(tab);
    });
  }

  /**
   * Save the current page to sidemark list. Uses synced Chrome storage
   * See https://developer.chrome.com/extensions/storage
   *
   * TODO - minify the url (try bit.ly?)
   * TODO - maybe don't duplicate tag data???
   */
  function save() {
    /**
     * Data structure for storage:
     * { "https://www.urlA.com": { title: "A URL", tags: ['read', 'long'] } },
     * { "https://www.urlB.com": { title: "Things on internet", tags: ['watch', 'js'] } },
     * ...,
     * { tags: { 'read': true, 'long': true, 'watch': true, 'js': true } }
     */
    var taggedWith = document.getElementById("tags").textContent.split(" ");
    if (taggedWith.length === 1 && taggedWith[0] === "") {
      taggedWith.pop();
    }
    each(taggedWith, function(tag) {
      if (typeof(tags[tag]) == 'undefined') {
        createTag(tag);
      }
    });

    var toSave = {};
    toSave[currentTab.url] = { title: currentTab.title, tags: taggedWith };
    chrome.storage.sync.set(toSave, afterSave);
  }

  /**
   * Anything and everything to do after saving the current URL
   */
  function afterSave() {
    closePopup();
  }

  /**
   * Create a tag
   *
   * @param {string} tagName - the name of the tag to create
   */
  function createTag(tagName) {
    if (typeof(tags[tagName]) == 'undefined') {
      tags[tagName] = true;
      chrome.storage.sync.set({ tags: tags });
    }
  }

  /**
   * Retrieve all previously saved urls & tags.
   * Assigns results of query to global (w/in IIFE, at least) `urls` & `tags`
   *   variables.
   */
  function getAll() {
    chrome.storage.sync.get(null, function(items) {
      tags = items.tags || {};
      urls = items;
      delete urls.tags;
    });
  }

  /**
   * Display a list of all previously saved urls, filterable by tags and
   *   searchable (indexed)
   */
  function viewAll() {
    debugger
    console.log(urls);
    console.log("tags: ", tags);
  }

  /**
   * Closes the pop-up window
   */
  function closePopup() {
    // TODO - how to not close when clicking outside popup space?
    window.close();
  }

  /**
   * Iterates over a collection, applying callback to each element
   *
   * @param {Array} items - items to apply callback to
   * @param {function(string)} callback - called for each item in items
   */
  function each(items, callback) {
    var length = items.length;
    for (i = 0; i < length; i++) {
      callback.call(null, items[i], i, items);
    }
  }

  /**
   * Attach handlers, retrieve data
   */
  document.addEventListener('DOMContentLoaded', function() {
    getAll();

    getCurrentTabInfo(function(tab) {
      currentTab = tab;
      document.getElementById('tabTitle').textContent = currentTab.title;
    });

    document.getElementById("save").addEventListener("click", save);
    document.getElementById("viewAll").addEventListener("click", viewAll);
    document.getElementById("closeSidebar").addEventListener("click", closePopup);
  });

})();
