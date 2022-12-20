$(document).ready(function(){
    $.getJSON("/dist/json/version.json", function(result){
      $.each(result, function(i, field){
        $("#login_version").html("Version " + field + "");
    });
  });
});
