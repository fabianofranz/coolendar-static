var lastPreviewRequestProcessed = new Date().getTime();
var originalTitle = document.title;

String.prototype.startsWith = function(str) { return (this.match("^"+str)==str); }
String.prototype.endsWith = function(str) { return (this.match(str+"$")==str); }

preview = function(term) {
	$.getJSON(cp + "/api/entry/preview?s=" + encodeURIComponent(term) + "&tz=" + encodeURIComponent(timezone) + "&dateFormat=" + preferencesDateFormat + "&timeFormat=" + preferencesTimeFormat + "&proxy=" + new Date().getTime(), "", 
		function(data, status, xhr) {
			if (! (parseInt(data.proxy) < lastPreviewRequestProcessed)) {
				lastPreviewRequestProcessed = parseInt(data.proxy);
				$("article#preview").css("display", "inline-block");
				$("article#preview").replaceWith(
					data.type == "CALENDAR_EVENT" ? 
					templates.calendar.calendarEntry({cp: cp, id: "preview", cssClass: " preview " + data.systemTags.join(" "), badge: "preview", tags: data.tags != undefined ? data.tags : "", weekday: data.dueWeekDayTimezoned.toLowerCase(), monthday: data.dueDayTimezoned, month: data.dueMonthNameTimezoned.toLowerCase(), time: data.dueTimezonedFormattedTime, datetime: data.dueTimezonedFormattedDate + " " + data.dueTimezonedFormattedTime, originalDescription: data.description, smartDescription: data.descriptionFormatted, important: data.important}) :  
					templates.calendar.calendarEntry({cp: cp, id: "preview", cssClass: " preview " + data.systemTags.join(" "), badge: "preview", tags: data.tags != undefined ? data.tags : "", originalDescription: data.description, smartDescription: data.descriptionFormatted, important: data.important})
				);
			}
		}
	);
}

livesearch = function(s) {
	if (s.trim() == "") {
		$("section#items article.item").removeClass("hidden");
	} else {
		$("section#items article.item:not(:contains(" + s + "))").addClass("hidden");
		$("section#items article.item:contains(" + s + ")").removeClass("hidden");
	}
}

notify = function(title, text) {
	if (text == undefined) {
		$("#notification-container").notify("create", "basic-template", {
	    	title: title
		}, {
			click: function(e,instance) {
	      		instance.close();
   			}
		});
	} else {
		$("#notification-container").notify("create", "advanced-template", {
	    	title: title,
	    	text: text
		}, {
			click: function(e,instance) {
	      		instance.close();
   			}
		});
	}
}

filter = function(f) {
	if (f.indexOf("active") == -1) {
		$("nav#filters ul li.filter").removeClass("active");
		$("section#items").removeClass().addClass(f);
		$("nav#filters ul li.filter." + f).addClass("active");
	}
	return false;
}

toggleBulleted = function(article) {
	if (article.hasClass("important")) {
		article.removeClass("important");
		if (!article.hasClass("past"))
			counter.decrease($("nav#filters ul li.important"));
	} else {
		article.addClass("important");
		if (!article.hasClass("past"))
			counter.increase($("nav#filters ul li.important"));
	}
}

editPlan = function(idPlan) {
	var article = $("article#" + idPlan);
	var datetime = article.children("header").children("time").attr("datetime");
	var description = article.children("p").attr("data-original");
	var original = (datetime == undefined ? "" : datetime + " ") + description;
	var formUpdate = $("form#update").clone().removeAttr("id").attr("id", "formUpdate" + idPlan).attr("data-id", idPlan);
	formUpdate.children("fieldset").children("input[name='entry']").val(original);
	formUpdate.children("fieldset").children("input[name='id']").val(idPlan);
	article.before(formUpdate).hide();
	formUpdate.children("fieldset").children("input[name='entry']").trigger("focus");
}

scrollToPlan = function(idPlan) {
	$("html, body").animate({
		scrollTop: $("#" + idPlan).offset().top - 30
	}, 1000);
}

setupTooltips = function() {
	$("header#top [title]").tipTip({delay: 200, fadeIn: 100, fadeOut: 100, maxWidth: "250px", edgeOffset: 5});
	$("form#create [title]").tipTip({delay: 200, fadeIn: 100, fadeOut: 100, defaultPosition: "right"});
	setupItemsTooltips();
}

setupItemsTooltips = function() {
	$("section#items article header [title]").tipTip({delay: 200, fadeIn: 100, fadeOut: 100, defaultPosition: "right", edgeOffset: -35});
	$("section#items article p [title]").tipTip({delay: 200, fadeIn: 100, fadeOut: 100, defaultPosition: "top"});
	$("section#items article div.tools [title]").tipTip({delay: 200, fadeIn: 100, fadeOut: 100, defaultPosition: "left", edgeOffset: 10});
}

titlefy = function(size) {
	if (size != undefined && parseInt(size) > 0) document.title = originalTitle + " (" + size + ")";
	else document.title = originalTitle;
}

adjustLoginLink = function() {
	$("a.login").each(function() {
		$(this).attr("href", $(this).attr("href") + ($(this).attr("href").indexOf("?") == -1 ? "?" : "&") + "st=" + jsk.tz.stToString().replace("+", "%2B") + "&dst=" + jsk.tz.hasDst() + "&now=" + new Date().format("HH:mm").replace(":", "%3A"));
	});
}

toggleMenu = function() {
	$("header#top nav ul li.option.account").toggleClass("selected");
	$("div#preferences-menu").toggle();
}
