/*------------------------------



------------------------------*/

$(function () {


	if($("html").hasClass("pc")){
		$("#drowerMenu").height($("body").height() - 50)
	}
	



	
	$("#menuBtn").on("click",function(evt){
		evt.preventDefault();
		evt.stopPropagation();
		$("body").toggleClass("menuon");
	});

    $(window).scroll(function (evt) {
       
    });
    
    $(window).resize(function () {
        //
    });
});

