/* Author: 
	Johannes Henseler
	nordsueddesign.de
	
	101202_03
*/

// hide all videos on start
$("video").hide();
$("#videolayer").hide();

/*
$(".trigger").live('click',function(event){
//$(".trigger").bind('click touchstart', function(event){

	aim = $("video."+$(event.target).attr("rel"));
	video = document.querySelector('.'+$(event.target).attr("rel"));

	if (video.paused) {
	  video.currentTime = 0;
	  aim.show();
	  video.play();
	  $(event.target).css("background","green");
	}

	setTimeout(function(){
		  video.pause();
		  aim.hide();
		  $(event.target).css("background","red");
	},500);
});
*/


$("#main").click(function(e){
	log("clicked here: "+e.pageX +','+ e.pageY);
	
	// how many triggers are there?
	var trigger_count = $(".trigger").length;
	
	// asign random video number
	var random_video=(Math.floor(Math.random()*4))+1
	
	// append new trigger object
	$("#main").append('<div class="trigger trigger'+random_video+' video'+random_video+'" rel="v'+random_video+'" style="top: '+e.pageY+'px; left: '+e.pageX+'px">'+random_video+'</div>\n');
	log("trigger "+(trigger_count+1) + " created");
});



// THE MACHINE

var isplaying = false;
var beat = 500;

$("#playercontrol").bind('click',function(event) {
	isplaying = !isplaying;
	if (isplaying) {
		// start machine
		$("#playercontrol").text("hold");
		$("#playercontrol").toggleClass("greenPulsate");
		log("start");

		$("#videolayer").show();
		
		// Start a polling loop with an id of 'beat' and a counter.
		var i = 0;
		$.doTimeout( 'beat', 1500, function(){
			// stop all running videos
			$("video").each(function() {
				video = document.querySelector('.'+$(this).attr("class"));
				video.pause();
				$(this).hide();
			});
			$(".trigger").removeClass("playing");
		

			// how many triggers are there?
			var trigger_count = $(".trigger").length;
		
			// find trigger
			trigger = $(".trigger:eq("+i+")");
			trigger.toggleClass("playing");
			// find video according to trigger
			video = document.querySelector('.'+trigger.attr("rel"));
			aim = $("video."+trigger.attr("rel"));
			log("now playing: "+trigger.attr("rel"));
			
			// play video
			aim.show();
//			video.currentTime = 0;
//			video.play();
			video.addEventListener('loadedmetadata', function() {
				this.currentTime = 0;
				this.play();
			}, false);
			
			
			++i;
			if (i >= trigger_count) {
				i = 0;
			}
			return true;
		});
		
		
		
	} else {
		// stop machine
		$("#playercontrol").text("play");
		$("#playercontrol").toggleClass("greenPulsate");

		// Cancel the polling loop with id of 'beat'.
		$.doTimeout( 'beat' );

		// stop all running videos
		$("video").each(function() {
			video = document.querySelector('.'+$(this).attr("class"));
			$(this).hide();
			video.pause();
		});
		$(".trigger").removeClass("playing");
		$("#videolayer").hide();

		log("-----------ende-----------");
	}
});

function log(message) {
	if (window.console) console.log(message);
};