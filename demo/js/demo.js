$(function(){
  $(".hh-floating-label input").on("input", function(e){
    var $target = $(this);
    var $parent = $target.closest(".hh-floating-label");
    if ($target.val() !== "" && !$parent.hasClass("hh-ph-hidden")) {
      $parent.addClass("hh-ph-hidden");
    }
    else if ($target.val() === "" && $parent.hasClass("hh-ph-hidden")){
      $parent.removeClass("hh-ph-hidden");
    }
  });

});