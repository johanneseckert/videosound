/* Author: 
	Johannes Henseler
	nordsueddesign.de
	
	110113_05
*/

//
//
// INIT
//
//
$("video").hide();
$("#videolayer").hide();
$("video").removeAttr("controls");

var vsm = new videosoundmachine();
var canvas = new canvastool();


//
//
//
// OOP here
// http://articles.sitepoint.com/article/oriented-programming-2
//
//
//

// the dot-Object is the circle that represents a video
function dot(x,y) {
	this.position = new Object();
	this.position.x = x;
	this.position.y = y;

	// calculate the sector the dot is in
	var playfield = $("#playfield");
	var mouse_xrel = this.position.x - playfield.offset().left;
	var mouse_yrel = this.position.y - playfield.offset().top;
	var box_height = playfield.height();
	var sector_height = box_height / vsm.num_videos;
	var sector = Math.floor(mouse_yrel / sector_height)+1;

	// append dot to DOM
	// -12px are for centered circles with 25px durchmesser
	$("#playfield").append(
		'<div class="trigger trigger'+vsm.dots.length+' video'+sector+' sector'+sector+'" rel="v'+sector+
		'" style="top: '+(this.position.y-12)+'px; left: '+(this.position.x-12)+'px"></div>\n');
	log("trigger"+(vsm.dots.length) + " created in sector "+sector+" at x="+mouse_xrel+", y="+mouse_yrel);
	
	// define dot as draggable
	$(".trigger"+vsm.dots.length).draggable({ 
		containment: 'parent',
		stack: ".trigger",
		opacity: 0.75,
		start: function(event, ui) { 
		},
		stop: function(event, ui) { 
			// need to manually calc pos because ui.position.left does not work relative
			dropped_top = ui.position.top+12-$('#playfield').offset().top;
			dropped_left = ui.position.left-$('#playfield').offset().left;
			var new_sector = Math.floor(dropped_top / sector_height)+1;
			log("trigger"+vsm.dots.length+" dropped in sector "+new_sector+" at x="+dropped_top+", y="+dropped_left);
			ui.helper.attr('class','trigger trigger'+vsm.dots.length+' video'+new_sector+' sector'+new_sector+'');
			ui.helper.attr('rel','v'+new_sector);
			
//			canvas.draw();
		}
	});
	
	// evoke draw on canvas
//	canvas.draw();
}

// the machine object handling all the playing dots
// can be constructed with dot-Objects via parameter
// or filled with addDot
function videosoundmachine() {

	this.speed = 250;
	this.num_videos = 5;
	this.playing = false;

	// constructor
	// fill the new Array() with all dot-Objects from the parameter
	this.dots = new Array(arguments.length);
	for(i=0;i<arguments.length;i++) {
		this.dots[i] = arguments[i];
	}
	
	// push a new dot into the dots array
	this.addDot = new Function("dot", "this.dots.push(dot)");
	
	// start the machine!
	this.play = function() {

		this.playing = true;
		log("-------machine-kicked------");
		$("#playercontrol").toggleClass("greenPulsate");
		
		$("#videolayer").show();

		// Start a polling loop with an id of 'beat' and a counter.
		var i = 0;
		$.doTimeout( 'beat', this.speed, function(){

			// stop all running videos
			$("video").each(function() {
				$(this)[0].pause();
				$(this).hide();
			});

			$(".trigger").removeClass("playing");
		
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

			++i;
			if (i >= vsm.dots.length)
				i = 0;
			return true;
		});
	}
		
	// stop it!
	this.stop = function() {
	
		this.playing = false;
		log("-------machine-stopped------");
		$("#playercontrol").toggleClass("greenPulsate");
		// Cancel the polling loop with id of 'beat'
		$.doTimeout( 'beat' );

		// stop all running videos
		$("video").each(function() {
			video = document.querySelector('.'+$(this).attr("class"));
			video.pause();
		});
		$(".trigger").removeClass("playing");
		$("#videolayer").hide();
		
	}
	
	// beat down
	this.beat_down = function() {
		if ((this.speed-100) > 0) {
			this.speed = this.speed-100;
			$("#beat_speed").text(this.speed);
			log("new beat: "+this.speed);
		}
	}
	
	// beat up
	this.beat_up = function() {
		this.speed = this.speed+100;
		$("#beat_speed").text(this.speed);
		log("new beat: "+this.speed);
	}

}

// my canvasobject
function canvastool() {
	// get canvas
	var b_canvas = document.getElementById("canvas");
	var context = b_canvas.getContext("2d"); 

		
	this.draw = function(x,y) {
		// clear canvas
		b_canvas.width = b_canvas.width;

		context.strokeStyle = "#abc";
		context.lineWidth = "2.0";
		context.lineCap = "round";
		
		// go through all dots and connect them
		for(i=0;i<vsm.dots.length;i++) {
			// re-calc dot-position from absolute to relative
			dotpos_x = vsm.dots[i].position.x - $("#canvas").offset().left;
			dotpos_y = vsm.dots[i].position.y - $("#canvas").offset().top;
			log("dot[i].position.x: "+vsm.dots[i].position.x);
			
//			if (i==0)
				context.moveTo(0,0);
//			else
				context.lineTo(vsm.dots[i].position.x,vsm.dots[i].position.y);
			log("line to: "+vsm.dots[i].position.x+","+dotpos_y)
		}
		
		context.stroke();
	}
}

//
//
// TIMELINE
//
//
$("#canvas").click(function(e){
	// only if clicked NOT on dot element
	if (!$(e.target).is(".trigger")) {
	
		// add a new dot below mouseclick
		vsm.addDot(new dot(e.pageX,e.pageY));
	}
});




//
//
// THE CONTROLLER
//
//
$("#beat_speed").text(vsm.speed);

$("#playercontrol").click(function(e) {
	if (vsm.playing)
		vsm.stop();
	else
		vsm.play();
});

$("#beat_up").click(function(){
	vsm.beat_up();
});

$("#beat_down").click(function(){
	vsm.beat_down();
});

