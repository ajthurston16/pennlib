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
  Drupal.behaviors.pennlib = {
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

      /**
       * Build a simple responsive hamburger menu
       **/
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
        $mobileMenu.addClass('show');
      }, function () {
        $(this).removeClass('on');
        $mobileMenu.removeClass('show');
      });

      /**
       * View mode toggle for Staff Search (/library-info/staff). Uses cookies to persist on subsequent page loads.
       **/

      // Toggle view mode dropdown when it is clicked.
      $('#toggle-view-mode .label').click(function() {
          $('#toggle-view-mode').toggleClass('active');
      });
      var $staffSearchBlock = $('.block-views-blockstaff-search-block-1');

      // Toggle classes based on the view mode. 'mode' argument should be either 'normalview' or 'briefview'.
      function toggleViewMode(mode) {
        if (mode === 'normalview') {
          if (!($('#view-mode-normal').hasClass('checked'))) {
            $('#view-mode-normal').addClass('checked');
          }
          $('#view-mode-brief').removeClass('checked');
          if ($staffSearchBlock.hasClass('briefview')) {
            $staffSearchBlock.removeClass('briefview');
          }
          $staffSearchBlock.addClass('normalview');
        } else if (mode === 'briefview') {
          if (!($('#view-mode-brief').hasClass('checked'))) {
            $('#view-mode-brief').addClass('checked');
          }
          $('#view-mode-normal').removeClass('checked');
          if ($staffSearchBlock.hasClass('normalview')) {
            $staffSearchBlock.removeClass('normalview');
          }
          $staffSearchBlock.addClass('briefview');
        }
      } //end toggleViewMode()

      $(document).ready(function() {
        // Repopulate the library home link if there is a homepage cookie.
        if (getCookie('hp')) {
          $('#top-nav-library-home a').attr('href', 'http://www.library.upenn.edu' + getCookie('hp'));
        }

        // Hide dropdown if you click outside of it.
        $(document).click(function(event) {
          if (event.target.id!=="" && $('#toggle-view-mode').hasClass('active')) {
            $('#toggle-view-mode').removeClass('active');
          }
        });

        // On page load, check cookie and apply initial view mode classes.
        if (getCookie('briefview')==='true') {
          toggleViewMode('briefview');
        } else {
          toggleViewMode('normalview');
        }
      });

      // When a view mode is selected, toggle the classes and update the view mode cookie.
      $('#view-mode-brief').click(function() {
        toggleViewMode('briefview');
        document.cookie = 'briefview=true;path=/';
        document.cookie = 'normalview=;path=/';
      });
      $('#view-mode-normal').click(function() {
        toggleViewMode('normalview');
        document.cookie = 'briefview=;path=/';
        document.cookie = 'normalview=true;path=/';
      });
      
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
      $(".main-nav > .main-nav__item  > ul.main-nav__sub")
        .on("mouseover", function () {
          $(this).parent('li').addClass('is-hovered');
        })
        .on("mouseleave", function () {
          $(this).parent('li').removeClass('is-hovered');
        });


    } //end attach
  }; //end Drupal.behaviors.pennlib

  //
  // Polyfill things where needed
  //
  Drupal.behaviors.bearPolyfill = {
    attach: function (context, settings) {

    }
  };

})(jQuery, Drupal, window, document);
