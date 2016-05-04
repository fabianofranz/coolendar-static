counter = {
	all : 0, past : 0, future : 0, important : 0, today : 0, tomorrow : 0, month : 0, week : 0, almost : 0, done : 0,
	load : function() {
		counter.all = $("section#items article.item").length,
		counter.future = $("section#items article.item:not(.done)").length,
		counter.important = $("section#items article.important:not(.done)").length,
		counter.today = $("section#items article.item.today:not(.done)").length,
		counter.tomorrow = $("section#items article.item.tomorrow:not(.done)").length,
		counter.week = $("section#items article.week:not(.done)").length,
		counter.month = $("section#items article.month:not(.done)").length,
		counter.past = $("section#items article.past:not(.done)").length,
		counter.almost = $("section#items article.almost:not(.done)").length
		//counter.done = $("section#items article.item.done").length
	},
	set : function(listItem, quantity) {
		var current = listItem.find("span.quantity");
		if (current == undefined || current == null || current.html() == null && quantity > 0)
			$("<span class=\"quantity\">" + quantity + "</span>").appendTo(listItem);
		else if (quantity > 0) current.html(quantity);
	},
	increase : function(listItem) {
		var quantity = listItem.find("span.quantity");
		if (quantity == undefined || quantity.html() == null)
			$("<span class=\"quantity\">1</span>").appendTo(listItem);
		else quantity.html(parseInt(quantity.html()) + 1);
	}, 
	decrease : function(listItem) {
		var quantity = listItem.find("span.quantity");
		if (quantity != undefined) {
			if (parseInt(quantity.html()) == 1)
				quantity.remove();
			else quantity.html(parseInt(quantity.html()) - 1);
		}
	},
	clear : function() {
		$("nav#filters ul li span.quantity").remove();
	},
	refresh : function() {
		counter.load();
		counter.set($("nav#filters ul li.all"), counter.future);
		counter.set($("nav#filters ul li.future"), counter.future);
		counter.set($("nav#filters ul li.important"), counter.important);
		counter.set($("nav#filters ul li.today"), counter.today);
		counter.set($("nav#filters ul li.tomorrow"), counter.tomorrow);
		counter.set($("nav#filters ul li.week"), counter.week);
		counter.set($("nav#filters ul li.month"), counter.month);
		counter.set($("nav#filters ul li.past"), counter.past);
		counter.set($("nav#filters ul li.almost"), counter.almost);
		counter.set($("nav#filters ul li.done"), counter.done);
		titlefy(counter.past + counter.almost);
	}
}

clock = {
	started : false,
	server : new Date(),
	delay : 0,
	step : 1000, 
	format : "HH:mm",
	tick : function() {
		setTimeout("clock.tick()", clock.step);
		clock.server.setTime(clock.server.getTime() + clock.step);
		if (new Date().getTime() - clock.server.getTime() > (clock.delay + 60 * 10 * 1000))
			clock.synchronize();
		clock.show();
	},
	show : function() {
		$("header#top time span.time").html(new Date(clock.server).format(clock.format));
	},
	synchronize : function(tick) {
		$.getJSON(cp + "/api/calendar/clock", function(data) {
			clock.server = new Date(parseInt(data.timezonedYear, 10), parseInt(data.timezonedMonth, 10), parseInt(data.timezonedDay, 10), parseInt(data.timezonedHours24, 10), parseInt(data.timezonedMinutes, 10), parseInt(data.timezonedSeconds, 10));
			clock.delay = new Date().getTime() - clock.server.getTime(); 
			if (! clock.started) {
				clock.started = true;
				clock.tick();
			}
		});
	},
	start : function() { 
		if (! clock.started) {
			clock.synchronize();
		}
	}
}

help = {
	shown : false,
	createExampleItem : function() {
		return templates.calendar.calendarEntry({id: "help", tags: ["help"], smartDescription: "make sure to get the <a href=\"#\" class=\"tag\">#umbrella</a>!", cssClass: " all important open", weekday: "sunday", monthday: "31", month: "december", time: "08:00", datetime: "31/12 08:00"});
	},
	show : function() {
		$("section#items").prepend(help.createExampleItem());
		$("header h1, ul.options li.account, nav#filters li.filter, nav#filters li.search, form#create, section#items article:first-child, a.help").expose({ color: "#eee", opacity: 0.8, loadSpeed: "fast",
			onBeforeLoad: function() {
				counter.clear();
				$("section#items article:first-child").addClass("detailed");
				$("a.help").html("close help");
				help.shown = true;
			},
			onClose: function() {
				help.shown = false;
				$("section#items article#help").remove();
				$("section#items article").removeClass("detailed");
				counter.refresh();
				$("a.help").html("help");
			}
		});
	},
	hide : function() {
	},
	toggle : function() {
		if (help.shown) help.hide(); else help.show();
	}
}


