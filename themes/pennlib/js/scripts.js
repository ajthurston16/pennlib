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

  //
  //Use the sample behavior pattern below


  Drupal.behaviors.pennlib = {
    attach: function (context, settings) {
      context = context || document;
      settings = settings || Drupal.settings;
      //
      //$(window).on('load scroll', function () {
      //  var $top = $(window).scrollTop();
      //  if ($top >= 50) {
      //    $('.wrapper--header').addClass('compressed');
      //  }
      //  else {
      //    $('.wrapper--header').removeClass('compressed');
      //  }
      //});

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

      // Build a simple responsive hamburger menu
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
      $(window).on('load resize', function () {
        if ($(window).width() < 800) {
          $nav.addClass('mobile');
        }
        else {
          $nav.removeClass('mobile');
        }
      });
      $mobileNav.find($mobileButton).clickToggle(function () {
        $(this).addClass('on');
        $mobileMenu.addClass('show');
      }, function () {
        $(this).removeClass('on');
        $mobileMenu.removeClass('show');
      });

      /* to generate the dropdown from the view button when it is clicked - so adding a class 'active' to it
      The class 'active' will take care of the dropdown visibility in CSS*/
      $('#toggle-view-mode .label').click(function(){
          $('#toggle-view-mode').toggleClass('active');
      });

      $(document).ready(function() {
        $(document).click(function(event){
          if(event.target.id!="" && $('#toggle-view-mode').hasClass('active')){
            $('#toggle-view-mode').removeClass('active'); 
          }
        });
        if((getCookie('briefview')==='null' && getCookie('normalview')==='null')|| (getCookie('briefview')==='null' && getCookie('normalview')==='true')){
          // should evaluate to 'null'
          console.log('Brief view: '+ getCookie('briefview'));
          // should evaluate to 'null'
          console.log('Normal view: '+ getCookie('normalview'));
          if(!($('.block-views-blockstaff-search-block-1').hasClass('normalview'))){
           $('.block-views-blockstaff-search-block-1').addClass('normalview');
          }
        }
        if(getCookie('briefview')==='true'){
          if(!($('#view-mode-brief').hasClass('checked'))){
            $('#view-mode-brief').addClass('checked');
          } 
          $('#view-mode-normal').removeClass('checked');
          if($('.block-views-blockstaff-search-block-1').hasClass('normalview')){
            $('.block-views-blockstaff-search-block-1').removeClass('normalview');
            $('.block-views-blockstaff-search-block-1').addClass('briefview');
          }
          else{
            $('.block-views-blockstaff-search-block-1').addClass('briefview');
          }
        }
        else{
          if(!($('#view-mode-normal').hasClass('checked'))){
            $('#view-mode-normal').addClass('checked');
          }
          $('#view-mode-brief').removeClass('checked');
          if($('.block-views-blockstaff-search-block-1').hasClass('briefview')){
            $('.block-views-blockstaff-search-block-1').removeClass('briefview');
            $('.block-views-blockstaff-search-block-1').addClass('normalview');
          }
          else{
            $('.block-view-views-blockstaff-search-block1').addClass('normalview');
          }
        }
      });

      /* When the mode is brief, we add a class 'checked' to it so that it has a checkbox, remove that of the normal mode by removing the class
      If the staff search block has a normal view, change it to brief */
      $('#view-mode-brief').click(function(){
        if(!($(this).hasClass('checked'))){
          $(this).addClass('checked');
        }
        $('#view-mode-normal').removeClass('checked');
        if($('.block-views-blockstaff-search-block-1').hasClass('normalview')){
          $('.block-views-blockstaff-search-block-1').removeClass('normalview');
          $('.block-views-blockstaff-search-block-1').addClass('briefview');
        }
        else{
          $('.block-views-blockstaff-search-block-1').addClass('briefview');
        }
        
        if(getCookie('briefview')==='null' || getCookie('briefview')==='true'){
          //$.cookie('normalview',null,{path: '/'});
          //$.cookie('briefview','true',{path: '/'});
          document.cookie = 'normalview=null;path=/';
          document.cookie = 'briefview=true;path=/';
          // should evaluate to "true"
          //console.log('Brief view: '+ getCookie('briefview'));
          // should evaluate to "false"
          //console.log('Normal view: '+ getCookie('normalview'));
        }

      });

      /* When the mode is normal, we add a class 'checked' to it so that it has a checkbox, remove that of the brief mode by removing the class
      If the staff search block has a brief view, change it to normal */
      $('#view-mode-normal').click(function(){
        if(!($(this).hasClass('checked'))){
          $(this).addClass('checked');
        }
        $('#view-mode-brief').removeClass('checked');
        if($('.block-views-blockstaff-search-block-1').hasClass('briefview')){
          $('.block-views-blockstaff-search-block-1').removeClass('briefview');
          $('.block-views-blockstaff-search-block-1').addClass('normalview');
        }
        else{
          $('.block-view-views-blockstaff-search-block1').addClass('normalview');
        }
        
        if(getCookie('normalview')==='null' || getCookie('normalview')==='true'){
          document.cookie = 'briefview=null;path=/';
          document.cookie = 'normalview=true;path=/';
          // should evaluate to "false"
          //console.log('Brief view: '+getCookie('briefview'));
          // should evaluate to to "true"
          //console.log('Normal view: '+ getCookie('normalview'));
        }
      });

      
      /* 
      *  get the value of cookie corresponding to a particular cookie name (cookieName)
      *  @param cookieName (name of the cookie)
      */
      function getCookie(cookieName){
        //The string to be searched for in document.cookie's k-v pairs
        var searchString = cookieName + "=";
        var searchStringLen = searchString.length;
        //To generate an array of k-v pairs corresponding to the elements in document.cookie 
        var kvPairs = document.cookie.split(';');
        var len = kvPairs.length;
        var i = 0;
        //Iterating over all the k-v pairs searching for the searchString, returning its value if it is present , else returning an empty string
        for(i=0; i<len; i++){
          var kvPair = kvPairs[i];
          var kvPairLen = kvPair.length; 
          while(kvPair.charAt(0)==' '){
            kvPair = kvPair.substring(1,kvPairLen);
          }
          if(kvPair.indexOf(searchString) == 0){
            return kvPair.substring(searchStringLen, kvPairLen);
          }
        }
        return 'null';
      }

    }
  };

  //
  // Polyfill things where needed
  //
  Drupal.behaviors.bearPolyfill = {
    attach: function (context, settings) {

    }
  };

})(jQuery, Drupal, window, document);
