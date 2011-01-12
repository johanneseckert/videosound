/* Author: 

*/

// hide all videos
//$("video").hide();

$(".trigger").click(function(event){
//$(".trigger").bind('touchstart', function(event){

	aim = $("video."+$(event.target).attr("rel"));
	video = document.querySelector('.'+$(event.target).attr("rel"));
	
	

	if (video.paused) {
	  video.currentTime = 18.5;
	  aim.show();
	  video.play();
	  $(event.target).css("background","green");
	}

	setTimeout(function(){
		  video.pause();
		  aim.hide();
		  $(event.target).css("background","red");
	},100);
});