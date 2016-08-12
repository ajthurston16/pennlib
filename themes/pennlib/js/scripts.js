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

      $.fn.clickToggle = function (func1, func2) {
        var funcs = [func1, func2];
        this.data('toggleclicked', 0);
        this.click(function () {
          var data = $(this).data();
          var tc = data.toggleclicked;
          $.proxy(funcs[tc], this)();
          data.toggleclicked = (tc + 1) % 2;
        });
        return this;
      };
      var $nav = $('#block-mainnav-2', context);
      $nav.once().prepend('<div id="mobile-nav"><a id="mobile-button" href="javascript:;"><span></span></a></div>');
      var $mobileNav = $('#mobile-nav');
      var $mobileButton = $('#mobile-button');
      var $mobileMenu = $('ul.main-nav');
      $mobileNav.find($mobileButton).clickToggle(function () {
        $(this).addClass('on');
        $mobileMenu.addClass('show hburgermenu');
      }, function () {
        $(this).removeClass('on');
        $mobileMenu.removeClass('show hburgermenu');
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

    //  $(document).ready(function() {
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
          toggleViewMode('  ');
        }

        // Staff: If on the staff search page, use hidden booleans to show/hide certain fields.
        // Library is hidden by default, and division is hidden in brief view by default.
        $staffSearchBlock.find(".views-row").each(function() {
          if ($(this).find(".field--name-field-show-library .field__item").text() == "True") {
            $(this).find(".field--name-field-library").addClass("showlibrary");
          }
          if ($(this).find(".field--name-field-show-division .field__item").text() == "True") {
            $(this).find(".field--name-field-division").addClass("showinbrief");
          }
        });
   //   }); //end document.ready

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

})(jQuery, Drupal, window, document);
