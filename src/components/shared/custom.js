jQuery.fn.extend({
	spunkySlider: function() {
		var el = $(this);
		
		//default color values
		localStorage.setItem('r','14');
		localStorage.setItem('g','194');
		localStorage.setItem('b','54');

		var config = {
			"orientation": el.data("orientation") || "horizontal",
			"step": el.data("step") || 1,
			"fix-min-value": el.data("fix-min-value") || "NA",
			"fix-max-value": el.data("fix-max-value") || "NA",
			"bound-select-id": el.data("bound-select-id") || "NA",
			"colormix-element-id": el.data("colormix-element-id") || "NA"
		};

		var spanEl = $('<span>')
			.text(el.val())
			.insertAfter(el);

		// orientation
		if(config["orientation"].toLowerCase() === "vertical"){
			el.addClass("vertical");
		}

		// step
		el.attr("step",config["step"]);

		el.change(function(){
			var value = el.val();

			if(config["fix-max-value"] != "NA"){

				if(value > config["fix-max-value"]){
					el.val(config["fix-max-value"]);
					console.log("cannot be greater than this");
				}
			}

			if(config["fix-min-value"] != "NA"){
				if(value < config["fix-min-value"]){
					el.val(config["fix-min-value"]);
					console.log("cannot be lesser than this");
				}		
			}

			if(config["bound-select-id"] != "NA"){
				$("#"+config['bound-select-id'])[0].selectedIndex = value;
			}

			if(config["colormix-element-id"] != "NA"){
				var value = el.val();

				switch(el[0].name){
					case "r": localStorage.setItem('r', value); break;
					case "g": localStorage.setItem('g', value); break;
					case "b": localStorage.setItem('b', value); break;
					default: console.log('error');
				}

				$("#"+config["colormix-element-id"]).css('background-color','rgb('+localStorage.getItem('r')+','+ localStorage.getItem('g') +','+ localStorage.getItem('b') +')');
			}

			value = el.val();
			spanEl.text(value);
		});

		$("#"+config['bound-select-id']).change(function(){
			el.val($(this).val());
			spanEl.text(el.val());
		});


	}
});
