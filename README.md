Sample Implementation with JQuery

Add to header or footer

```
<script type='text/javascript' src='<?=$asset_server_base?>javascript/froogaloop.min.js<?=$cache_buster?>'></script>
<script type='text/javascript' src='<?=$asset_server_base?>javascript/video.js<?=$cache_buster?>'></script>
```

Place anywhere appropriate
```
$("#video_window").html('<a id="start_video_button" class="playvideo" data-ref="' + $(".media-thumbs").find("a:first-child").attr("data-ref") + '"></a>');

		$('.playvideo').click(function(e) {
			e.preventDefault();
			//showPrompt('Spots available 5/12');
			if(resource_video != null){
				resource_video.killVideo();
			}

			$('.playvideo').removeClass("video_selected");

			if($(this).attr("id") != "start_video_button"){
				$(this).addClass('video_selected');	
			}
			else{

				var current_data_ref = $(this).attr("data-ref");

				$(".media-thumbs").find(".playvideo").each(function(){
					if($(this).attr("data-ref")==current_data_ref){
						$(this).addClass('video_selected');
						return false;
					}
				})
			}
			
			addVimeoVideo($(this).attr("data-ref"));
		});
	}

	var resource_video  = null;

	function removeVideo(e){
		resource_video.killVideo();
	}

	function addVimeoVideo(vimeolink){

		$("#start_video_button").attr("data-ref",vimeolink);

		var vidparts = vimeolink.split(":");
		var size ={
			'w': 383,
			'h': 215
		};


		$("#video_window").addClass(vidparts[2]);
		$("#video_window").addClass("hidecontent");

		if(Browser.is("ie78")){
			resource_video = new Video(size.w,size.h,"video_window",true,vidparts[2]);
			resource_video.vimeo = vidparts[0];
			resource_video.setOverride(true);
			resource_video.attachVideo();	
		}
		else if(Browser.is("firefox")){
			resource_video = new Video(size.w,size.h,"video_window",true,vidparts[2]);
			resource_video.changeExtension = false;
			resource_video.attachVideo("https://s3.amazonaws.com/assets.yourhyphenatedlife.com/videos/" + vidparts[0] + ".webm",["webm"]);
		}
		else{
			resource_video = new Video(size.w,size.h,"video_window",true,vidparts[2]);
			resource_video.changeExtension = false;
			resource_video.attachVideo("http://player.vimeo.com/external/" + vidparts[0] + ".sd.mp4?s=" + vidparts[1],["mp4"]);
		}

		/*$("#close_video").bind("click",removeVideo);*/
	}
	//win.YourHyphenatedLife = initialize;
```