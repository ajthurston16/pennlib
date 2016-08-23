/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - http://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function ($, Drupal, window, document, undefined) {

  'use strict';

  /**
   * Begin Helper Functions
   **/

  /* Function to create a closure that keeps track of odd/even clicks for toggling purposes.
  Has a set method (invoked by passing increment=true) and a get method (default).
  This is needed to work with clickToggle, since otherwise there would be no way to check the index from outside that function */
  function clickIndex() {
    var toggleclicked = 0;
    return function(increment) {
      if (increment) {
        toggleclicked = (toggleclicked + 1) % 2;
        return toggleclicked;
      }
      else {
        return toggleclicked;
      }
    };
  }

  // Function for toggling a clickable, provides a behavior for odd/even clicks
  $.fn.clickToggle = function (func1, func2, clickIndex) {
    var funcs = [func1, func2];
    this.click(function () {
      var index = clickIndex();
      $.proxy(funcs[index], this)();
      clickIndex(true);
    });
    return this;
  };

  /**
   * End Helper Functions
   **/


  //Use the sample behavior pattern below
  Drupal.behaviors.pennlibSearch = {
    attach: function (context, settings) {
      context = context || document;
      settings = settings || Drupal.settings;

      //addclass to search wrapper on focus
      var $searchForm = $('#search-block-form', context);
      $searchForm
        .find('.form-search')
        .on('focus', function () {
          $(this)
            .closest('.block-search')
            .addClass('focus');
        })
        .on('blur', function () {
          $(this)
            .closest('.block-search')
            .removeClass('focus');
        });
    } //end attach
  }; //end Drupal.behaviors.pennlib


  /**
   * Build a simple responsive hamburger menu
   **/
  Drupal.behaviors.pennlibHamburger = {
    attach: function (context, settings) {
      context = context || document;
      settings = settings || Drupal.settings;

      var $nav = $('#block-mainnav-2', context);
      $nav.once().prepend('<div id="mobile-nav"><a id="mobile-button" href="javascript:;"><span></span></a></div>');
      var $mobileNav = $('#mobile-nav');
      var $mobileButton = $('#mobile-button');
      var $mobileMenu = $('ul.main-nav');
      // Define the closure that will track the mobile button's click index. Pass this to clickToggle, which adds the actual even listener
      var mobileButtonClickIndex = clickIndex();
      $mobileNav.find($mobileButton).clickToggle(function () {
        $(this).addClass('on');
        $mobileMenu.addClass('show hburgermenu');
      }, function () {
        $(this).removeClass('on');
        $mobileMenu.removeClass('show hburgermenu');
      },
      mobileButtonClickIndex);


      /*Handle window resizes. If the window width > 999 pixels, the mobile menu should always be hidden.*/
      $(window).resize(function() {
        var width = window.innerWidth;
        if (width > 999) {
            $mobileButton.removeClass('on');
            $mobileMenu.removeClass('show hburgermenu');
            // If the mobile menu is left open, the button will have the wrong index next time it is clicked. Increment it once here.
            if (mobileButtonClickIndex() === 1){
              mobileButtonClickIndex(true);
            }
        } else {
          // Do nothing if the window is resized to be in mobile view. #mobile-button handles toggling.
        }
      });
    } //end attach
  }; //end Drupal.behaviors.pennlib


  /**
   * View mode toggle for Staff Search (/library-info/staff). Uses cookies to persist on subsequent page loads.
   **/
  Drupal.behaviors.pennlibViewmode = {
    attach: function (context, settings) {
      context = context || document;
      settings = settings || Drupal.settings;

      var $staffSearchBlock = $('.block-views-blockstaff-search-block-1');
      var $normal = $('#view-mode-normal');
      var $brief = $('#view-mode-brief');
      var $viewModeToggle = $('#toggle-view-mode');

      // adding class active for the arrow icon on menu wrapper
      $('#toggle-view-mode .label', context).click(function() {
          $viewModeToggle.toggleClass('active');
      });

      // Toggle classes based on the view mode. 'mode' argument should be either 'normalview' or 'briefview'.
      function toggleViewMode(mode) {
        if (mode === 'normalview') {
          if (!($normal.hasClass('checked'))) {
            $normal.addClass('checked');
          }
          $brief.removeClass('checked');
          if ($staffSearchBlock.hasClass('briefview')) {
            $staffSearchBlock.removeClass('briefview');
          }
          $staffSearchBlock.addClass('normalview');
        } else if (mode === 'briefview') {
          if (!($brief.hasClass('checked'))) {
            $brief.addClass('checked');
          }
          $normal.removeClass('checked');
          if ($staffSearchBlock.hasClass('normalview')) {
            $staffSearchBlock.removeClass('normalview');
          }
          $staffSearchBlock.addClass('briefview');
        }
      } //end toggleViewMode()

      // Staff: Hide dropdown if you click outside of it.
      // For some reason, event.target.id keeps returning undefined values for any clicked element.
      // Checking that id would be a more direct way of doing this.
      $(document).click(function(event) {
        var eventNotInDropdown = !($(event.target).closest('#toggle-view-mode').length);
        if (eventNotInDropdown && $('#toggle-view-mode').hasClass('active')) {
          $viewModeToggle.removeClass('active');
        }
      });

      // Staff: On page load, check cookie and apply initial view mode classes.
      if (getCookie('briefview')==='true') {
        toggleViewMode('briefview');
      } else {
        toggleViewMode('normalview');
      }

      // Staff: If on the staff search page, use hidden booleans to show/hide certain fields.
      // Library is hidden by default, and division is hidden in brief view by default.
      $staffSearchBlock.find(".views-row").each(function() {
        if ($(this).find(".field--name-field-show-library .field__item").text() == "True") {
          $(this).find(".field--name-field-library").addClass("showlibrary");
        }
        if ($(this).find(".field--name-field-show-division .field__item").text() == "True") {
          $(this).find(".field--name-field-division").addClass("showdivision");
        }
      });


      // When a view mode is selected, toggle the classes and update the view mode cookie.
      $brief.click(function() {
        toggleViewMode('briefview');
        document.cookie = 'briefview=true;path=/';
        document.cookie = 'normalview=;path=/';
        // Making a selection should hide the entire dropdown menu
        $viewModeToggle.toggleClass('active');
      });
      $normal.click(function() {
        toggleViewMode('normalview');
        document.cookie = 'briefview=;path=/';
        document.cookie = 'normalview=true;path=/';
        // Making a selection should hide the entire dropdown menu
        $viewModeToggle.toggleClass('active');
      });
    } //end attach
  }; //end Drupal.behaviors.pennlib

  /**
  * Get the value of cookie corresponding to a particular cookie name (cookieName)
  * @param cookieName (name of the cookie)
  **/
  function getCookie(cookieName){
    //The string to be searched for in document.cookie's k-v pairs
    var searchString = cookieName + "=";
    var searchStringLen = searchString.length;
    //To generate an array of k-v pairs corresponding to the elements in document.cookie
    var kvPairs = document.cookie.split(';');
    var len = kvPairs.length;
    var i = 0;
    //Iterating over all the k-v pairs searching for the searchString, returning its value if it is present, else returning an empty string
    for (i=0; i<len; i++) {
      var kvPair = kvPairs[i];
      var kvPairLen = kvPair.length;
      while (kvPair.charAt(0)==' ') {
        kvPair = kvPair.substring(1,kvPairLen);
      }
      if (kvPair.indexOf(searchString) === 0){
        return kvPair.substring(searchStringLen, kvPairLen);
      }
    }
    return null;
  }

  /**
   * Menubar: top-level link stays white when you hover on dropdown panel
   **/
  Drupal.behaviors.pennlibMenubar = {
    attach: function (context, settings) {
      context = context || document;
      settings = settings || Drupal.settings;
      $(".main-nav > .main-nav__item  > ul.main-nav__sub", context)
        .on("mouseover", function () {
          $(this).parent('li').addClass('is-hovered');
        })
        .on("mouseleave", function () {
          $(this).parent('li').removeClass('is-hovered');
        });
    } //end attach
  }; //end Drupal.behaviors.pennlib

  /**
   * Top-nav: dropdowns, homepage link, and login.
   **/
  Drupal.behaviors.pennlibTopnav = {
    attach: function (context, settings) {
      context = context || document;
      settings = settings || Drupal.settings;
      // Repopulate the library home link if there is a homepage cookie.
      if (getCookie('hp')) {
        $('#chooselibrarylink a', context).attr('href', 'http://www.library.upenn.edu' + getCookie('hp'));
      }

      // Sitewide Franklin login scripts: Asynchronously load the scripts and execute them in order.
      // We're loading asynchronously so that when there is a Franklin/DLA outage, it doesn't crash the rest of the page.
      $("#top-nav-pennkey-library-account", context).prepend('<span id="helloname" class="helloname"></span><span class="hellocolon">:</span>');
      $.getScript("/themes/pennlib/js/login/loginStatusModule.js", function() {
        $.getScript("/themes/pennlib/js/login/login.js", function() {
          $.getScript("http://dla.library.upenn.edu/dla/franklin/scripts/json2.js", function() {
            $.getScript("http://dla.library.upenn.edu/dla/franklin/scripts/storage.js", function() {
              // All scripts have been loaded. Any code that needs to happen after that can go here.
              console.log("Done loading login scripts!");
            });
          });
        });
      });

      // Dropdowns
      $('.idbarbutton.clickableArrow', context).click(function() {
        // If the button isn't active, toggle dropdown the menu on, make it active, and make any other active buttons inactive
        if(!$(this).hasClass('active')){
          $(this).next().show(); // toggle the actual menu
          $(this).addClass('active'); // toggle the arrow and minus sign
          // click help, then hide acct; or click acct, then hide help
          $('.idbarbutton.clickableArrow').not(this).removeClass('active');
          $('.idbarbutton.clickableArrow').not(this).next().hide();
        }
        // If the button is already active, make it inactive and toggle the dropdown menu off
        else {
          $(this).removeClass('active');
          $(this).next().hide();
        }
      });

      /* This function makes the topnav dropdown go away if you click somewhere else, but if you click the element itself, don't hide it. */
      /* "touchstart click hover" makes sure there is no delay on a touch device */
      $(document).bind("touchstart click hover",  function(e) {
        if ($(e.target).closest('#clickacctdropdown').length !== 0 || $(e.target).closest('#acctDropdown').length !== 0 ||
          $(e.target).closest('#clickhelpdropdown').length !== 0 || $(e.target).closest('#helpDropdown').length !== 0) {
          // Don't do anything here
        } else {
          $('.idbarbutton.clickableArrow').removeClass('active');
          $('.idbarbutton.clickableArrow').next().hide();
        }
      });
    } //end attach
  }; //end Drupal.behaviors.pennlib

  /**
   * Site-wide Search Bar: switches between different searches with radio buttons.
   **/
  Drupal.behaviors.pennlibSearchbar = {
    attach: function (context, settings) {
      context = context || document;
      settings = settings || Drupal.settings;
      $('#searchholderlining input[type="radio"]', context).click(function() {
          $('#searchholderlining .searchform').hide();
          $('#'+$(this).val()).show();
      });

      // Toggle radio button active class
      $('#radiobluebuttons .holdradio', context).click(function() {
        $(this).addClass('active');
        $('#searchholderlining .holdradio').not(this).removeClass('active');
      });
    } //end attach
  }; //end Drupal.behaviors.pennlib


// Remove uneccessary links from the library-info footer menu
    Drupal.behaviors.pennlibFooterMenu = {
    attach: function (context, settings) {
      context = context || document;
      settings = settings || Drupal.settings;
      $('.block-menu-blockmain-nav ul.main-nav > li.main-nav__item > h3 > a').removeAttr('href');
    } //end attach
  }; //end Drupal.behavior.pennlib

  // Work with facets on staff page
    Drupal.behaviors.pennlibStaffFacets = {
    attach: function (context, settings) {
      context = context || document;
      settings = settings || Drupal.settings;

      // Staff: handle facet block hiding/unhiding Reuse the clickToggle and clickIndex closures to do this
      $('.block-facets h2:first-child').each(function(){
        var $this = $(this);
        var headerClickIndex = clickIndex();
        var parent = $this.parent();
        $this.clickToggle(function(){
          parent.addClass('closed');
          parent.removeClass('open');
        }, function() {
          parent.addClass('open');
          parent.removeClass('closed');
        },
        headerClickIndex);
      });


      // Create modal to expand staff facets
      // The 'Show More' buttons are rendered on the page by another Drupal js file.
      // Set a timeout to select these buttons once rendered, unbind their default event listeners, and bind the new listener
      setTimeout(function(){
        $('div.block-facets div.content a.facets-soft-limit-link')
        .unbind('click')
        .text('View all...')
        .click(function(){
          var that = $(this);
          handleModal(that);
        });
      }, 500);

      //$('div.block-facets h2').each(
      //  function(){alert('found something = ' + $(this).text());});
      // The handler that is attached to each 'Show More' button. Creates and displays the modal onclick
      // Calls a helper (toggleList) to show/hide the li elements within each facet
      function handleModal(that) {
        var listedElements = that.prev().children();
        var htmlContent = that.closest('div.content');
        var title = that.closest('div.content').siblings('h2');
        $.colorbox(
          {
            inline:true,
            href:htmlContent,
            //open:true,
            onOpen: function() {
              // When modal opens, hide the 'Show More' and expand the list of elements
              that.addClass('open');
              that.hide();
              toggleList(listedElements, true);
            },
            // Colorbox defaults to loading the title under the list. Switch them here
            onComplete: function() {
              $('#cboxTitle').insertBefore('#cboxLoadedContent');
            },
            onClosed: function() {
              // When modal closes, show the 'Show More' button and contract the list of elements
              that.removeClass('open');
              that.show();
              toggleList(listedElements, false);
            },
            title:title.html(),
            fixed:true,
            width: '60%',
            height: '90%',
            opacity: 0.55,
          }
        );
      }
      // Bind the new event, which opens a modal onclick
      /*.click(function(e) {
        alert('reached event listener...');
        var that = $(this);
        var listedElements = that.prev().children();
        var title = $(this).closest('div.block-facets > h2');
        alert(title.html());
        //var wholeContainer = $(this).closest('div.block-facets');
        var htmlContent = $(this).closest('div.block-facets > div.content');
        $(this).closest('div.block-facets')
        .colorbox(
          {
            inline:true,
            href:htmlContent,
            open:true,
            onOpen: function() {
              that.addClass('open');
              that.hide();
              toggleList(listedElements, true);
            },
            onClosed: function() {
              that.removeClass('open');
              that.show();
              toggleList(listedElements, false);
            },
            title: "TEST TITLE PLEASE IGNORE",
            fixed:true,
          }
        );
      });*/

      // If expandList === true, show all the listed elements so they can be seen when the modal is open
      // Else, hide all but the first five listed elements, so they cannot be seen when modal is closed
      function toggleList(listedElements, expandList) {
        var i = 0;
        listedElements.each(function(){
          if(expandList){
            $(this).show();
          }
          else {
            if (i > 4){
              $(this).hide();
            }
            i++;
          }
        });
      }
      


    } //end attach
  }; //end Drupal.behavior.pennlib

})(jQuery, Drupal, window, document);