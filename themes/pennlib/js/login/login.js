jQuery(function($) {
    var module = LOGIN.module;
    module.setURL("https://dla.library.upenn.edu/ils/simple/");
    module.setCacheKey("loginStatusCache");
    module.setCallbackPrefix("statuscheck");
    //module.setLoggedOutPingIntervalSeconds(60);
    //module.setLoggedInPingIntervalSeconds(60); 
    //module.setTimeoutMillis(2000); // to determine a failed jsonp authentication request
    module.addOnLoggedIn('navbar', function(data) {
        var bar = $("#block-topnav"); //$("#navandidbar");
        if (!bar.hasClass("loggedin")) {
          bar.addClass("loggedin");
        }
        if ($("#helloname").text() != data.first_name) { //if either the current value is empty or not equal to the first name
          $("#helloname").text(data.first_name); //set the correct first name
        }
    });
    module.addOnNotLoggedIn('navbar', function() {
        var bar = $("#block-topnav"); //$("#navandidbar");
        if (bar.hasClass("loggedin")) {
            bar.removeClass("loggedin");
            $("#helloname").empty(); //clear the name
        }
    });
    module.addOnLoggedIn('faculty_express', function(data) {
      if (data.faculty_express) {
        $(".facexonly").css('display', 'inline');
      }
    });
    module.addOnLoggedIn('course_reserve', function(data) {
      if (data.course_reserve) {
         $(".reservesonly").css('display', 'inline');
      }
    });
    module.init();
    var loginLink = document.getElementById('login');
    if (window.location.host === 'franklin.library.upenn.edu') {
      var dlaHost = "next=" + encodeURIComponent('http://dla.library.upenn.edu/dla/franklin');
      var franklinHost = "next=" + encodeURIComponent('http://franklin.library.upenn.edu');
      loginLink.href = loginLink.href.replace(dlaHost, franklinHost);
    }
    loginLink.onclick = module.loginOnclick;
    document.getElementById('account').onclick = module.loginOnclick;
    document.getElementById('logout').onclick = module.logoutOnclick;
});
