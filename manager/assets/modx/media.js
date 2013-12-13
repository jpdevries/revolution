$(document).ready(function(){
	//$('.flexbox').removeClass('flexbox').addClass('no-flexbox'); // force .no-flexbox for testing 
	                     /*                   __                                                       
	                    /\ \  __             /\ \      
	  ___ ___      __   \_\ \/\_\     __     \ \ \____  _ __   ___   __  __  __    ____     __   _ __  
	/' __` __`\  /'__`\ /'_` \/\ \  /'__`\    \ \ '__`\/\`'__\/ __`\/\ \/\ \/\ \  /',__\  /'__`\/\`'__\
	/\ \/\ \/\ \/\  __//\ \L\ \ \ \/\ \L\.\_   \ \ \L\ \ \ \//\ \L\ \ \ \_/ \_/ \/\__, `\/\  __/\ \ \/ 
	\ \_\ \_\ \_\ \____\ \___,_\ \_\ \__/.\_\   \ \_,__/\ \_\\ \____/\ \___x___/'\/\____/\ \____\\ \_\ 
	 \/_/\/_/\/_/\/____/\/__,_ /\/_/\/__/\/_/    \/___/  \/_/ \/___/  \/__//__/   \/___/  \/____/ \/*/ 
	          // init the media browser component, store reference to the plugin object                                                
                                                                                                   
	var _mediaBrowser = $('.mx-file-list').mediaBrowser({
		// whenver the table view is updated
		onUpdate:function(element){
			// activate the selection plugin http://nathanfirth.com/post/16027329916/selectable-table-rows-with-keyboard-navigation
			element.tableSelect({
				onClick: function(row) {
					//alert(row);
				},
				onChange: function(row) {
					//alert(row);
					var _numSelected = $('.mx-file-list tbody').find('.selected').length;
					if(_numSelected) {
						$('#modcontext').addClass((_numSelected > 1) ? 'table-multiple-selected' : 'table-single-selected');	
						if(_numSelected < 2) $('#modcontext').removeClass('table-multiple-selected'); 
					} else {
						$('#modcontext').removeClass('table-multiple-selected').removeClass('table-single-selected'); 
					}
					
				}
			});
			
			$('#modcontext').remove(); // take out the trash
			element.find('tbody tr').contextMenu('modcontext', {
			    'Copy URL': {
			        click: function(element){  // element is the jquery obj clicked on when context menu launched
			            console.log('Copy URL clicked');
			        },
			        klass: "modcontext-copyurl" // a custom css class for this menu item (usable for styling)
			    },
			    'Delete':{
			    	click: function(element){ console.log('delete clicked');},
			    	klass: "modcontext-delete"
			    },
			    'Download': {
			        click: function(element){ console.log('download clicked'); },
			        klass: "modcontext-download"
			    },
			  },
			  {
			    //delegateEventTo: 'childrenSelector',
			    disable_native_context_menu: false,
			    showMenu: function() { 
			    	//console.log("Showing menu");
			    	
			    },
			    hideMenu: function() {
			    	//console.log("Hiding menu");
			    },
			    //leftClick: true // trigger on left click instead of right click
			  }
			);
		}
	}).data('mediaBrowser');


	// examples
	//_mediaBrowser.update(dummyJSON); // add some content (will be fed by MODX) 
	//_mediaBrowser.sortBy('editedon','ASC'); // sort the content


	  /*                              ___      ___                    
	 /\ \                           /'___\ __ /\_ \                   
	 \_\ \  _ __   ___   _____     /\ \__//\_\\//\ \      __    ____  
	 /'_` \/\`'__\/ __`\/\ '__`\   \ \ ,__\/\ \ \ \ \   /'__`\ /',__\ 
	/\ \L\ \ \ \//\ \L\ \ \ \L\ \   \ \ \_/\ \ \ \_\ \_/\  __//\__, `\
	\ \___,_\ \_\\ \____/\ \ ,__/    \ \_\  \ \_\/\____\ \____\/\____/
	 \/__,_ /\/_/ \/___/  \ \ \/      \/_/   \/_/\/____/\/____/\/___/ 
	                       \ \_\                                      
	                        \/*/   

	// turn the knobs (upload progress)
	$(".knob").knob();                         

	var myDropzone = new Dropzone(".drop-area form"); 
	 myDropzone.on("sending", function(file) {
	    // Maybe display some more file information on your page
		$(".knob").val(0).trigger('change');
	    $('.browser-panel').addClass('mx-uploading');
	  }).on("totaluploadprogress",function(_totalProgress,_totalBytes,_totalBytesSent) {
	  	 // turn the knob
	  	 $(".knob").val(_totalProgress).trigger('change'); 
	  }).on("success",function(file){
	  	  console.log(file + " was uploaded succesfully");
	  }).on("complete",function(){
	  	  // close uploading state and reset
	  	  $('.browser-panel').removeClass('mx-uploading');
	  	  $(".knob").val(0).trigger('change');
	  });
	
	var _thumbs = $('.mx-file-list').find('td');
	_thumbs.click(function(){
		_thumbs.removeClass('active');
		$(this).addClass('active');
		 
		$('.mx-file-list').children('thead').find('th').eq(1).find('.val').html('A.jpg');
		$('.mx-file-list').children('thead').find('th').eq(2).find('.val').html('1kb');
		$('.mx-file-list').children('thead').find('th').eq(3).find('.val').html('300x600');
		$('.mx-file-list').children('thead').find('th').eq(4).find('.val').html('3/10/1986 02:00:00AM');
	});
	

	$.ajax({type: "POST",
	  url: '/connectors/index.php',
	  data: {action:'media/getlist',HTTP_MODAUTH:MODx.siteId},
	  dataType: 'json',
	  success: function(data, textStatus, jqXHR) {
	  	console.log(data);
	  	_mediaBrowser.update(data);
	  }
	});



}); // end document.ready
