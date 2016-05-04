var timezonesLoaded = false;

$(document).ready(function() {

	$("#slogan").mouseover(function() { $("#slogan p").addClass("light"); }).mouseout(function() { $("#slogan p").removeClass("light"); }).click(function() { window.location.href = cp + "/"; });
	
	if ($("section#items").length) counter.refresh();
	
	$("nav#filters ul li.filter a").live("click", function() {
		var selected = $(this).parent().attr("class").replace("filter", "").trim();
		filter(selected);
		return false;
	});
	
    $("nav#filters ul li.more").live("click", function() {
    	$(this).toggleClass("selected").children("ul.sub").toggle();
    });
    
	$("div.relevance a").live("click", function() { 
		if (! $(this).closest("article").hasClass("preview")) {
			$.ajax({ 
				type: "GET", 
				url: $(this).attr("href"), 
				cache: false
			});
			toggleBulleted($(this).closest("article")); 
		}
		return false; 
	});

	$("div.tools a.remove").live("click", function() { 
		$.ajax({ 
			type: "DELETE", 
			url: $(this).attr("href"), 
			cache: false
		});
		$(this).closest("article").hide();
		counter.refresh();
		return false; 
	});

	$("div.tools a.done").live("click", function() { 
		$.ajax({ 
			type: "POST", 
			url: $(this).attr("href"), 
			cache: false
		});
		$(this).closest("article").addClass("done");
		counter.refresh();
		return false; 
	});

	$("section#items").sortable({ 
		revert: 100, 
		opacity: 0.6,
		items: "article.item",
		update: function() { 
      		var order = $("section#items").sortable("refresh").sortable("toArray");
      		$.post(cp + "/preferences", { order: $(order).get().join(",") });
      		$(".settings").css("visibility", "visible");
    	}  
    });
	
	$("section#items article.item").
		live("mouseenter mouseleave", function(event) {
			if (event.type == "mouseenter" && !$(this).hasClass("detailed")) $(this).addClass("detailed");
			else if (event.type == "mouseleave") $(this).removeClass("detailed");
		}).
		live("dblclick", function(event) {
			var idPlan = $(this).attr("id");
			editPlan(idPlan);
		});
	
	$("form.update a.cancel").live("click", function() {
		var formUpdate = $(this).closest("form");
		var idArticle = formUpdate.attr("data-id");
		$("section#items article#" + idArticle).show();
		formUpdate.remove();
		return false;
	});
	
	setupTooltips();
	
	$("#entry").autocomplete({
		source: function(req, res) {
			preview(req.term);
		},
		delay: 100,
		minLength: 0
	});
	
	var preferencesDateTimeOverlay = $("a#preferences-date-time-link[rel]").overlay({ top: 43, mask: { color: "#eee", opacity: 0.3, loadSpeed: "fast" }, close: ".cancel", speed: "fast",
		onBeforeLoad: function() {
			if (! timezonesLoaded) {
				var preferences = $("div#preferences-date-time form").html();
				$("div#preferences-date-time form").html($("<div/>").addClass("loading").html($("<img/>").attr("class", "loading").attr("src", cp + "/images/ajax-loader-5.gif")));
				$.getJSON(cp + "/api/calendar/timezones", function(timezones) {
					timezonesLoaded = true;
					$("div#preferences-date-time form").html(preferences);
					$.each(timezones, function(i, item) {
						$("select[name='timezone']").append($("<option/>").attr({value: item}).attr(item == timezone ? {selected: "selected"} : {}).text(item.replace("_", " ")));
					});
					$("select[name='timezone']").combobox();
					$("#dateFormat").buttonset();
					$("#timeFormat").buttonset();
				});
			}
		}
	}).data("overlay");
	
	var preferencesAccountOverlay = $("a#preferences-account-link[rel]").overlay({ top: 43, mask: { color: "#eee", opacity: 0.3, loadSpeed: "fast" }, close: ".cancel", speed: "fast" }).data("overlay");
	
	var preferencesDeleteAccountOverlay = $("a#preferences-delete-account-link[rel]").overlay({ top: 43, mask: { color: "#eee", opacity: 0.3, loadSpeed: "fast" }, close: ".cancel", speed: "fast" }).data("overlay");
	
	if ($("form#create input[type='text']").val() != undefined && $("form#create input[type='text']").val() != "") preview($("form#create input[type='text']").val());
	
    $("form#create input[type='text']").autofill({ value: "tomorrow 8am make sure to grab the #umbrella!", defaultTextColor: "#ccc", activeTextColor: "#505460" });
    
    $("form#create fieldset button:first-child").live("click", function() {
    	$(this).toggleClass("selected");
    	$("form#create div.help").slideToggle();
    	return false;
    });
    
    $("form#create").live("submit", function() {
        var button = $("form#create fieldset button:last-child");
        var backup = button.html();
        button.html("<img src=\"" + cp + "/images/ajax-loader-6.gif\" />");
        $.ajax({
        	type : "POST",
        	url : $(this).attr("action"), 
        	data : $(this).serialize(), 
        	cache : false,
        	success : function(data) {
        		$("nav#filters").html($(data).find("nav#filters").html());
        		$("section#items").html($(data).find("section#items").html());
        		$("article#preview").fadeOut(300);
        		counter.refresh();
        		button.html(backup);
        		setupItemsTooltips();
        		notify("Plan created!");
        	},
        	error : function() {
        		alert("Ooooops!\nThe server is doing it wrong. Please try again!");
        	}
        });
        return false;
    });
    
    $("form.update").live("submit", function() {
        $.ajax({
        	type : "POST",
        	url : $(this).attr("action"), 
        	data : $(this).serialize(), 
        	cache : false,
        	success : function(data) {
        		$("nav#filters").html($(data).find("nav#filters").html());
        		$("section#items").html($(data).find("section#items").html());
        		counter.refresh();
        		setupItemsTooltips();
        		notify("Plan updated!");
        	},
        	error : function() {
        		alert("Ooooops!\nThe server is doing it wrong. Please try again!");
        	}
        });
        return false;
    });
    
    $("header#top nav ul li.option.account").click(function(event) {
    	toggleMenu();
    	$("html").one("click", function() {
    		toggleMenu();
    	});
    	event.stopPropagation();
    });
    
    $("header#top h1").live("click", function() { window.location.href = cp + "/"; });
    
	$.address.change(function(event) {
		if ("/preferences-account" == event.value && ! preferencesAccountOverlay.isOpened()) preferencesAccountOverlay.load();
		else if ("/preferences-delete-account" == event.value && ! preferencesDeleteAccountOverlay.isOpened()) preferencesDeleteAccountOverlay.load();
		else if ("/preferences-date-time" == event.value && ! preferencesDateTimeOverlay.isOpened()) preferencesDateTimeOverlay.load();
	});
	
    $("a.tag, div.tags span.tag").live("click", function() {
    	var tag = $(this).text();
    	if (! tag.startsWith("#")) tag = "#" + tag;
    	$("nav#filters ul li.search input").val(tag);
    	livesearch(tag);
    	return false;
    });
    
    $("nav#filters ul li.search input").live("keyup change", function() {
    	livesearch($(this).val());
    });
    
    $("#notification-container").notify({ speed: 500 });
    
    document.createElement("img").src = cp + "/images/ajax-loader-5.gif";
    document.createElement("img").src = cp + "/images/ajax-loader-6.gif";
    
    $("a.help").live("click", function() { help.toggle(); return false; });

});

