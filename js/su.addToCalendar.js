/*
  su.addToCalendar.js

  Calendar Event Creator
  Version: 1.1
  Date: 11.04.2015

  Author: Sercan Uste
  WebSite: www.sercanuste.com
*/

var su = (function () {
  function getValue(value) {
    return (typeof value === 'undefined' || value === null) ? '' : value;
  }
  function getDefaultValueIfUndefined(value, defaultValue) {
    return (typeof value === 'undefined' || value === null) ? defaultValue : value;
  }

  var contentTypes = {
    file: 'file',
    link: 'link'
  }

  var base = {
    addToCalendar: (function () {
      var settings;

      var fields = {
        organizer: '|Organizer|',
        title: '|Title|',
        location: '|Location|',
        description: '|Description|',
        startDate: '|StartDate|',
        endDate: '|EndDate|',
        today: '|Today|',
        id: '|ID|'
      }

      var calendarServices = {
        outlook: {
          event: {
            base: 'https://calendar.live.com/calendar/calendar.aspx?rru=addevent&summary=' + fields.title + '&location=' + fields.location + '&description=' + fields.description + '&dtstart=' + fields.startDate + '&dtend=' + fields.endDate,
            type: contentTypes.link
          }
        },
        google: {
          event: {
            base: 'https://calendar.google.com/calendar/render?action=TEMPLATE&dates=' + fields.startDate + '/' + fields.endDate + '&location=' + fields.location + '&text=' + fields.title + '&details=' + fields.description + '&pli=1',
            type: contentTypes.link
          }
        },
        icalendar: {
          event: {
            base: 'BEGIN:VCALENDAR'
                + '\n' + 'VERSION:2.0'
                + '\n' + 'PRODID:' + fields.organizer
                + '\n' + 'BEGIN:VEVENT'
                + '\n' + 'UID:' + fields.id
                + '\n' + 'DTSTAMP;TZID=UTC:' + fields.today
                + '\n' + 'DTSTART;TZID=UTC:' + fields.startDate
                + '\n' + 'SEQUENCE:0'
                + '\n' + 'TRANSP:OPAQUE'
                + '\n' + 'DTEND;TZID=UTC:' + fields.endDate
                + '\n' + 'LOCATION:' + fields.location
                + '\n' + 'SUMMARY:' + fields.title
                + '\n' + 'DESCRIPTION:' + fields.description
                + '\n' + 'END:VEVENT'
                + '\n' + 'END:VCALENDAR',
            type: contentTypes.file,
            mime: 'text/calendar',
            extension: '.ics'
          }
        }
      }

      function addEvent(calendarService, organizer, title, location, description, startDate, endDate, id) {
        var descriptionAffix = '%0A%0A%0A' + settings.footer;

        var _calendarServiceName = calendarService.toLowerCase();
        var _calendarService = calendarServices[_calendarServiceName];

        var _eventContent = '';

        _eventContent = _calendarService.event.base;

        if (_eventContent == '' || _calendarService.event.type == '') {
          console.log('Calendar Service not supported.');
          return 0;
        }

        description += descriptionAffix;
        description = su.helper.getSafeString(description, _calendarService.event.type);

        startDate = su.helper.getCalendarString(new Date(startDate));
        endDate = su.helper.getCalendarString(new Date(endDate));
        var today = su.helper.getCalendarString(new Date());

        _eventContent = _eventContent.replace(fields.organizer, organizer);
        _eventContent = _eventContent.replace(fields.title, title);
        _eventContent = _eventContent.replace(fields.location, location);
        _eventContent = _eventContent.replace(fields.description, description);
        _eventContent = _eventContent.replace(fields.startDate, startDate);
        _eventContent = _eventContent.replace(fields.endDate, endDate);
        _eventContent = _eventContent.replace(fields.today, today);
        _eventContent = _eventContent.replace(fields.id, id);

        if (_calendarService.event.type == contentTypes.link) {
          var popup = window.open(_eventContent, '_blank');

          if (window.focus) {
            popup.focus();
          }
        }
        if (_calendarService.event.type == contentTypes.file) {
          var fileLink = document.createElement('a');

          _eventContent = encodeURIComponent(_eventContent);

          fileLink.setAttribute('download', title + _calendarService.event.extension);
          fileLink.setAttribute('href', 'data:' + _calendarService.event.mime + ';charset=utf-8,' + _eventContent);

          fileLink.click();
        }
      }

      var sub = {
        initialize: function (options) {
          settings = $.extend({}, sub.defaults, options);

          $(settings.selector).on('click touchstart', function (e) {
            e.stopPropagation();
            e.preventDefault();

            var calendarService = getValue($(this).attr('data-service'));
            var organizer = getDefaultValueIfUndefined($(this).attr('data-organizer'), settings.organizer);
            var title = getValue($(this).attr('data-title'));
            var location = getValue($(this).attr('data-location'));
            var description = getValue($(this).attr('data-description'));
            var startDate = getValue($(this).attr('data-start-date'))
            var endDate = getValue($(this).attr('data-end-date'));
            var id = getValue($(this).attr('data-uid')) + '@' + organizer;

            addEvent(calendarService, organizer, title, location, description, startDate, endDate, id);

            return false;
          });
        },
        defaults: {
          organizer: 'sercanuste.com',
          footer: 'Get updated with us.',
          selector: '.su-event-button'
        }
      };

      return sub;
    })(),

    helper: (function () {
      function pad(number) {
        if (number < 10) {
          return '0' + number;
        }
        return number;
      }

      function _toCalendarString(value) {
        return value.getUTCFullYear().toString()
                + pad(value.getUTCMonth() + 1).toString()
                + pad(value.getUTCDate()).toString()
                + 'T' + pad(value.getUTCHours()).toString()
                + pad(value.getUTCMinutes()).toString()
                + pad(value.getUTCSeconds()).toString()
                + 'Z';
      };

      function _decodeHTML(value) {
        var map = { "gt": ">", "lt": "<", "amp": "&", "quot": "\"" };
        return value.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function ($0, $1) {
          if ($1[0] === "#") {
            return String.fromCharCode($1[1].toLowerCase() === "x" ? parseInt($1.substr(2), 16) : parseInt($1.substr(1), 10));
          } else {
            return map.hasOwnProperty($1) ? map[$1] : $0;
          }
        });
      };

      function _safeString(value, type) {
        var newLine = type == contentTypes.file ? "\\n" : (type == contentTypes.link ? "%0A" : "%0A");
        return _removeHTMLTags(value.replace(/\r?\n/g, "<br />").replace(/<br>|<br\/>|<br \/>|%0A/gi, newLine));
      }

      function _removeHTMLTags(value) {
        return value.replace(/(<([^>]+)>)/ig, "");
      }

      var sub = {
        getSafeString: function (value, type) {
          value = _decodeHTML(value);
          value = _safeString(value, type);
          return value;
        },
        getCalendarString: function (value) {
          if (toString.call(value) === '[object Date]') {
            return _toCalendarString(value);
          }
          else {
            console.log("Invalid Date!");
            return "";
          }
        }
      }

      return sub;
    })()
  };
  
  return base;
} ());