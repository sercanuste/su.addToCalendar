Calendar Event Creator
----------------------

### About

su.addToCalendar is a simple event creator for calendar services. It supports iCalendar(.ics) format which supports most of mail applications, Gmail and Outlook Online.

[Live Preview](https://market.sercanuste.com/SU/AddToCalendar/index.html)

### Snippet

```html
<div class="box buttons">
    <div class="button-container">
        <a class="button su-event-button"
           data-service="icalendar"
           data-title="Friday Night Party"
           data-location="Office"
           data-description="We will celebrate new year!"
           data-start-date="2016.01.01 20:00"
           data-end-date="2016.01.01 22:00">
          <img src="images/iCalendar.png" alt="iCalendar" />
          <br />
          <span>iCalendar</span>
        </a>
    </div>
    <div class="button-container">
        <a class="button su-event-button"
           data-service="google"
           data-title="Friday Night Party"
           data-location="Office"
           data-description="We will celebrate new year!"
           data-start-date="2016.01.01 20:00"
           data-end-date="2016.01.01 22:00">
          <img src="images/Gmail.png" alt="Gmail" />
          <br />
          <span>Gmail</span>
        </a>
    </div>
    <div class="button-container">
        <a class="button su-event-button"
           data-service="outlook"
           data-title="Friday Night Party"
           data-location="Office"
           data-description="We will celebrate new year!"
           data-start-date="2016.01.01 20:00"
           data-end-date="2016.01.01 22:00">
          <img src="images/Outlook.png" alt="Outlook" />
          <br />
          <span>Outlook</span>
        </a>
    </div>
</div>

<script>
    su.addToCalendar.initialize();
</script>
```            

### Data Attributes

|Name|Type / Format|Description|
|:---|:------------|:----------|
|data-service|icalendar, gmail or outlook|Type of calendar service.|
|data-title|string|Title of the event.|
|data-location|string|Location of the event.|
|data-description|string|Description of the event.|
|data-start-date|YYYY.MM.DD HH:mm|Start date and time of the event. 24h format.|
|data-end-date|YYYY.MM.DD HH:mm|End date and time of the event. 24h format.|
|data-organizer|string|Organizer of the event. _(su.addToCalendar.defaults.organizer's value if it's not specified.)_|

### Usage

su.addToCalendar works with all CSS styles and HTML elements. Just add attributes to element and add script to page.

```html
<script src="js/jquery-1.12.0.min.js" type="text/javascript"></script>
<script src="js/su.addToCalendar.min.js" type="text/javascript"></script>

<script>
    su.addToCalendar.initialize();
</script>
```            

### Options

|Name|Type|Default Value|Description|
|:---|:---|:------------|:----------|
|organizer|string|sercanuste.com|Organizer of event.|
|footer|string|Get updated with us.|Footer of event description text.|
|selector|string|.su-event-button|jQuery selector of event creator HTML element.|

```html
<script>
    su.addToCalendar.initialize({ organizer: 'yoursite.com', footer: 'From Istanbul with Love', selector: '.foo' });
</script>
```

2016 © Sercan Üste
