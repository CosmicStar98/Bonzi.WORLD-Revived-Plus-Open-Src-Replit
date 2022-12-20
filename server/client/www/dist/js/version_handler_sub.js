$(document).ready(function(){
    $.getJSON("/dist/json/version.json", function(result){
      $.each(result, function(i, field){
        $(".ver").html("BonziWORLD Revived+ v" + field + " ");
    });
  });
});
