// This file was automatically generated from templates.soy.
// Please don't edit this file by hand.

if (typeof templates == 'undefined') { var templates = {}; }
if (typeof templates.calendar == 'undefined') { templates.calendar = {}; }


templates.calendar.calendarEntry = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<article id="', opt_data.id, '" class="item', soy.$$escapeHtml(opt_data.cssClass), (opt_data.important) ? ' important' : '', '"><div class="tags">', (opt_data.badge) ? '<span class="badge">' + soy.$$escapeHtml(opt_data.badge) + '</span>' : '');
  if (opt_data.tags) {
    var tagList19 = opt_data.tags;
    var tagListLen19 = tagList19.length;
    for (var tagIndex19 = 0; tagIndex19 < tagListLen19; tagIndex19++) {
      var tagData19 = tagList19[tagIndex19];
      output.append('<span class="tag">', soy.$$escapeHtml(tagData19), '</span>');
    }
  }
  output.append('</div><header><div class="relevance"><a href="', soy.$$escapeHtml(opt_data.cp), '/star?id=', opt_data.id, '">&bull;</a></div>', (opt_data.weekday && opt_data.monthday && opt_data.month && opt_data.time && opt_data.datetime) ? '<time title="' + soy.$$escapeHtml(opt_data.weekday) + '" datetime="' + soy.$$escapeHtml(opt_data.datetime) + '"><span class="day">' + soy.$$escapeHtml(opt_data.monthday) + '</span><span class="month">' + soy.$$escapeHtml(opt_data.month) + '</span><span class="time">' + soy.$$escapeHtml(opt_data.time) + '</span></time>' : '', '</header><p data-original="', soy.$$escapeHtml(opt_data.originalDescription), '">', opt_data.smartDescription, '</p><div class="tools"><a href="', soy.$$escapeHtml(opt_data.cp), '/?m=delete&id=', opt_data.id, '" title="remove this entry" class="remove"></a><a href="', soy.$$escapeHtml(opt_data.cp), '/?m=post&id=', opt_data.id, '&status=DONE" title="mark as done!" class="done"></a></div></article>');
  if (!opt_sb) return output.toString();
};
