/* Author: 
	Johannes Henseler
	nordsueddesign.de
	
	101202_03
*/

//
//
// INIT
//
//
var isplaying = false;
var beat = 250;

$("video").hide();
$("#videolayer").hide();
$("video").removeAttr("controls");


//
//
// CONFIGURATOR
//
//
$("#beat_speed").text(beat);

// slow down
$("#beat_up").click(function(){
	beat = beat+100;
	$("#beat_speed").text(beat);
	log("new beat: "+beat);
});

// speed up
$("#beat_down").click(function(){
	if ((beat-100) > 0) {
		beat = beat-100;
		$("#beat_speed").text(beat);
		log("new beat: "+beat);
	}
});


//
//
// PLAYFIELD
//
//
$("#playfield").click(function(e){
	// but NOT if clicked on trigger element
	if (!$(e.target).is(".trigger")) {
	
	// how many triggers are there (already)?
	var trigger_count = $(".trigger").length;
	
	// calculate the mouse-click for absolute positioning the trigger element
	var mouse_x = e.pageX;
	var mouse_y = e.pageY;
	
	// calculate the sector the trigger is in for video and coloring
	var mouse_xrel = e.pageX - this.offsetLeft;
	var mouse_yrel = e.pageY - this.offsetTop;
	var box_height = $(this).height();
	var num_videos = 5;
	var sector_height = box_height / num_videos;
	
	var sector = Math.floor(mouse_yrel / sector_height)+1;
	
	// append new trigger object
	// -12px are for centered circles with 25px durchmesser
	$("#playfield").append(
		'<div class="trigger trigger'+trigger_count+' video'+sector+' sector'+sector+'" rel="v'+sector+
		'" style="top: '+(mouse_y-12)+'px; left: '+(mouse_x-12)+'px"></div>\n');
	log("trigger"+(trigger_count) + " created in sector "+sector+" at "+mouse_yrel);
	
	}
	
	// define it as draggable
	$(".trigger"+trigger_count).draggable({ 
		containment: 'parent',
		stack: ".trigger",
		opacity: 0.75,
		start: function(event, ui) { 
//			ui.helper.toggleClass("dragging");
		},
		stop: function(event, ui) { 
//			ui.helper.toggleClass("dragging");
			
			// need to manually calc pos because ui.position.left does not work relative
			dropped_top = ui.position.top+12-$('#playfield').offset().top;
			dropped_left = ui.position.left-$('#playfield').offset().left;
			var new_sector = Math.floor(dropped_top / sector_height)+1;
			log("trigger"+trigger_count+" dropped in sector "+new_sector+" at "+dropped_top);
			ui.helper.attr('class','trigger trigger'+trigger_count+' video'+new_sector+' sector'+new_sector+'');
			ui.helper.attr('rel','v'+new_sector);
		}
	});
});

$(".trigger").dblclick(function() {
	log("trying to remove trigger");
	$(this).remove();
});	


//
//
// THE MACHINE
//
//
$("#playercontrol").bind('click',function(event) {
	isplaying = !isplaying;
	if (isplaying) {
		// start machine
		$("#playercontrol").toggleClass("greenPulsate");
		log("start");

		$("#videolayer").show();
		
		// Start a polling loop with an id of 'beat' and a counter.
		var i = 0;
		$.doTimeout( 'beat', beat, function(){

			// stop all running videos
			$("video").each(function() {
				$(this)[0].pause();
				$(this).hide();
			});

			$(".trigger").removeClass("playing");
		
			// how many triggers are there?
			var trigger_count = $(".trigger").length;
		
			// find trigger
			trigger = $(".trigger:eq("+i+")");
			trigger.toggleClass("playing");
			// find video according to trigger
			
			video = $("."+trigger.attr("rel"));
			aim = $("video."+trigger.attr("rel"));
			log("now playing: "+trigger.attr("rel"));
			
			// play video
			video.show();
			video[0].currentTime = 0;
			video[0].play();
//			video.addEventListener('loadedmetadata', function() {
//				this.currentTime = 0;
//				this.play();
//			}, false);
			
			
			++i;
			if (i >= trigger_count) {
				i = 0;
			}
			return true;
		});
		
		
		
	} else {
		// stop machine
		$("#playercontrol").toggleClass("greenPulsate");

		// Cancel the polling loop with id of 'beat'.
		$.doTimeout( 'beat' );

		// stop all running videos
		$("video").each(function() {
			video = document.querySelector('.'+$(this).attr("class"));
//			$(this).hide();
			video.pause();
		});
		$(".trigger").removeClass("playing");
		$("#videolayer").hide();
		
		log("-----------ende-----------");
	}
});
