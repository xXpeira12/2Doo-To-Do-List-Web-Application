// import calling api function from backend
import {getApts, postApts, deleteApts} from "./api.js";

function CalendarApp(date) {
    if (!(date instanceof Date)) {
      date = new Date();
    }
    this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.quotes = ['I HATE PROGRAMING I HATE PROGRAMING I HATE PROGRAMING IT WORKS I LOVE PROGRAMING', "I'm not arguing, I'm just explaining why I'm right.", "I'm on the seafood diet. I see food, and I eat it.", "I'm not lazy, I'm just on energy-saving mode.", "I'm writing a book. I've got the page numbers done.", "Why don't scientists trust atoms? Because they make up everything.",
    "I'm reading a book on anti-gravity. It's impossible to put down!",
    "I used to play piano by ear, but now I use my hands.",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "I'm writing a book. I've got the page numbers done.",
    "I'm on a seafood diet. I see food, and I eat it.",
    "If at first you don't succeed, then skydiving definitely isn't for you.",
    "I'm not arguing, I'm just explaining why I'm right.",
    "Why do we press harder on the remote control when we know the batteries are weak? The same reason we yell at our cars when they won't start.",
    "Common sense is like deodorant. The people who need it most never use it.",
    "I'm not lazy; I'm just on energy-saving mode.",
    "Behind every great man, there is a woman rolling her eyes.",
    "Do not take life too seriously. You will never get out of it alive.",
    "I'm not short; I'm concentrated awesome.",
    "I'm not clumsy. It's just the floor hates me, the tables and chairs are bullies, and the wall gets in my way.",
    "I used to be indecisive, but now I'm not so sure.",
    "I'm not a complete idiot; some parts are missing.",
    "If you think nobody cares if you're alive, try missing a couple of payments.",
    "I'm in shape. Round is a shape, isn't it?",
    "I'm not saying I'm Wonder Woman; I'm just saying no one has ever seen me and Wonder Woman in the same room together.",
    "Why do they call it rush hour when nothing moves?",
    "I'm not a vegetarian because I love animals. I'm a vegetarian because I hate plants.",
    "I'm not old; I'm just well-seasoned.",
    "A balanced diet means a cupcake in each hand.",
    "Life is too short to be taken seriously.",
    "I'm so poor, I can't even pay attention.",
    "I'm not addicted to reading. I can quit as soon as I finish one more chapter.",
    "I'm not late; everyone else is just early.",
    "I'm not a morning person. Don't talk to me until my coffee does."];
    this.apts = [
      // {
      //   name: '',
      //   endTime: new Date(),
      //   startTime: new Date(),
      //   day: new Date().toString()
    ];
    this.aptDates = [];
    this.calDaySelected = null;
    
    this.calendar = document.getElementById("calendar-app");
    
    this.calendarView = document.getElementById("dates");
    
    this.calendarMonthDiv = document.getElementById("calendar-month");
    this.calendarMonthLastDiv = document.getElementById("calendar-month-last");
    this.calendarMonthNextDiv = document.getElementById("calendar-month-next");
    
    this.dayInspirationalQuote = document.getElementById("inspirational-quote");
     
    this.todayIsSpan = document.getElementById("footer-date");
    this.dayViewEle = document.getElementById("day-view");
    this.dayViewExitEle = document.getElementById("day-view-exit");
    this.dayViewDateEle = document.getElementById("day-view-date");
    this.addDayEventEle = document.getElementById("add-event");
    this.dayEventsEle = document.getElementById("day-events");
    
    this.dayEventAddForm = {
      cancelBtn: document.getElementById("add-event-cancel"),
      addBtn: document.getElementById("add-event-save"),
      nameEvent:  document.getElementById("input-add-event-name"),
      startTime:  document.getElementById("input-add-event-start-time"),
      endTime:  document.getElementById("input-add-event-end-time"),
      startAMPM:  document.getElementById("input-add-event-start-ampm"),
      endAMPM:  document.getElementById("input-add-event-end-ampm")
    };
    this.dayEventsList = document.getElementById("day-events-list");
    this.dayEventBoxEle = document.getElementById("add-day-event-box");
    
    /* Start the app */
    this.showView(date);
    this.addEventListeners();
    this.todayIsSpan.textContent = "Today is " + this.months[date.getMonth()] + " " + date.getDate();  
  }

  // ใช้เรียกแสดง event ที่เราเรียกฟังก์ชัน
  CalendarApp.prototype.addEventListeners = function(){
    
    this.calendar.addEventListener("click", this.mainCalendarClickClose.bind(this));
    this.todayIsSpan.addEventListener("click", this.showView.bind(this));
    this.calendarMonthLastDiv.addEventListener("click", this.showNewMonth.bind(this));
    this.calendarMonthNextDiv.addEventListener("click", this.showNewMonth.bind(this));
    this.dayViewExitEle.addEventListener("click", this.closeDayWindow.bind(this));
    this.dayViewDateEle.addEventListener("click", this.showNewMonth.bind(this));
    this.addDayEventEle.addEventListener("click", this.addNewEventBox.bind(this));
    this.dayEventAddForm.cancelBtn.addEventListener("click", this.closeNewEventBox.bind(this));
    this.dayEventAddForm.cancelBtn.addEventListener("keyup", this.closeNewEventBox.bind(this));
    
    this.dayEventAddForm.startTime.addEventListener("keyup",this.inputChangeLimiter.bind(this));
    this.dayEventAddForm.startAMPM.addEventListener("keyup",this.inputChangeLimiter.bind(this));
    this.dayEventAddForm.endTime.addEventListener("keyup",this.inputChangeLimiter.bind(this));
    this.dayEventAddForm.endAMPM.addEventListener("keyup",this.inputChangeLimiter.bind(this));
    this.dayEventAddForm.addBtn.addEventListener("click",this.saveAddNewEvent.bind(this));
  
  };
  // responsible for rendering a calendar view for a specific date
  CalendarApp.prototype.showView = async function(date) {
    if ( !date || (!(date instanceof Date)) ) date = new Date();
    var now = new Date(date),
        y = now.getFullYear(),
        m = now.getMonth();
    var today = new Date();
    
    var lastDayOfM = new Date(y, m + 1, 0).getDate();
    var startingD = new Date(y, m, 1).getDay();
    var lastM = new Date(y, now.getMonth()-1, 1);
    var nextM = new Date(y, now.getMonth()+1, 1);
   
    this.calendarMonthDiv.classList.remove("cview__month-activate");
    this.calendarMonthDiv.classList.add("cview__month-reset");
    
    while(this.calendarView.firstChild) {
      this.calendarView.removeChild(this.calendarView.firstChild);
    }
    
    // Fetch events from your API using getApts
    try {
      // Update your calendar data with the fetched events
      const events = await getApts();
      this.apts = events;
      events.forEach(event => this.aptDates.push(event.day));
    } catch (error) {
      console.error("Error fetching events:", error);
    }

    // build up spacers
    for ( var x = 0; x < startingD; x++ ) {
      var spacer = document.createElement("div");
      spacer.className = "cview--spacer";
      this.calendarView.appendChild(spacer);
    }
    
    for ( var z = 1; z <= lastDayOfM; z++ ) {
     
      var _date = new Date(y, m ,z);
      var day = document.createElement("div");
      day.className = "cview--date";
      day.textContent = z;
      day.setAttribute("data-date", _date);
      day.onclick = this.showDay.bind(this);
      
      // check if todays date
      if ( z == today.getDate() && y == today.getFullYear() && m == today.getMonth() ) {
        day.classList.add("today");
      }
      
       // check if has events to show
      if ( this.aptDates.indexOf(_date.toString()) !== -1 ) {
        day.classList.add("has-events");
      }
      
      this.calendarView.appendChild(day);
    }
    
    var _that = this;
    setTimeout(function(){
      _that.calendarMonthDiv.classList.add("cview__month-activate");
    }, 50);
    
    this.calendarMonthDiv.textContent = this.months[now.getMonth()] + " " + now.getFullYear();
    this.calendarMonthDiv.setAttribute("data-date", now);
  
    
    this.calendarMonthLastDiv.textContent = "← " + this.months[lastM.getMonth()];
    this.calendarMonthLastDiv.setAttribute("data-date", lastM);
    
    this.calendarMonthNextDiv.textContent = this.months[nextM.getMonth()] + " →";
    this.calendarMonthNextDiv.setAttribute("data-date", nextM);
    
  }
  // display detailed information about a selected day in the calendar
  CalendarApp.prototype.showDay = function(e, dayEle) {
    e.stopPropagation();
    if ( !dayEle ) {
      dayEle = e.currentTarget;
    }
    var dayDate = new Date(dayEle.getAttribute('data-date'));
    
    this.calDaySelected = dayEle;
    
    this.openDayWindow(dayDate);
  };
  // responsible for populating a day view in a calendar application with information about events and relevant date-related data.
  CalendarApp.prototype.openDayWindow = function(date){
    
    var now = new Date();
    var day = new Date(date);
    this.dayViewDateEle.textContent = this.days[day.getDay()] + ", " + this.months[day.getMonth()] + " " + day.getDate() + ", " + day.getFullYear();
    this.dayViewDateEle.setAttribute('data-date', day);
    this.dayViewEle.classList.add("calendar--day-view-active");
    
    /* Contextual lang changes based on tense. Also show btn for scheduling future events */
    var _dayTopbarText = '';
    if ( day < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      _dayTopbarText = "had ";
      this.addDayEventEle.style.display = "none";
    } else {
       _dayTopbarText = "have ";
       this.addDayEventEle.style.display = "inline";
    }
    this.addDayEventEle.setAttribute("data-date", day);
    
    var eventsToday = this.showEventsByDay(day);
    if ( !eventsToday ) {
      _dayTopbarText += "no ";
      var _rand = Math.round(Math.random() * ((this.quotes.length - 1 ) - 0) + 0);
      this.dayInspirationalQuote.textContent = this.quotes[_rand];
    } else {
      _dayTopbarText += eventsToday.length + " ";
      this.dayInspirationalQuote.textContent = null;
    }
    while(this.dayEventsList.firstChild) {
      this.dayEventsList.removeChild(this.dayEventsList.firstChild);
    }
    
    this.dayEventsList.appendChild(this.showEventsCreateElesView(eventsToday));
    
    
    this.dayEventsEle.textContent = _dayTopbarText + "events on " + this.months[day.getMonth()] + " " + day.getDate() + ", " + day.getFullYear();
    
    
  };
  // responsible for generating an HTML list (ul) of events based on the provided events data
  CalendarApp.prototype.showEventsCreateElesView = function(events) {
    var ul = document.createElement("ul");
    ul.className = 'day-event-list-ul';
    events = this.sortEventsByTime(events);
    var _this = this;
    events.forEach(function(event){
      var _start = new Date(event.startTime);
      var _end = new Date(event.endTime);
      var idx = event.index;
      var li = document.createElement("li");
      li.className = "event-dates";
      // li.innerHtml
      var html = "<span class='start-time'>" + _start.toLocaleTimeString(navigator.language,{hour: '2-digit', minute:'2-digit'}) + "</span> <small>through</small> ";
      html += "<span class='end-time'>" + _end.toLocaleTimeString(navigator.language,{hour: '2-digit', minute:'2-digit'}) + ( (_end.getDate() != _start.getDate()) ? ' <small>on ' + _end.toLocaleDateString() + "</small>" : '') +"</span>";
      
  
      html += "<span class='event-name'>" + event.name + "</span>";
      
      var div = document.createElement("div");
      div.className = "event-dates";
      div.innerHTML = html;
      
      var deleteBtn = document.createElement("span");
      var deleteText = document.createTextNode("delete");
      deleteBtn.className = "event-delete";
      deleteBtn.setAttribute("data-idx", idx);
      deleteBtn.appendChild(deleteText);
      deleteBtn.onclick = _this.deleteEvent.bind(_this);
      
      div.appendChild(deleteBtn);
      
      li.appendChild(div);
      ul.appendChild(li);
    });
    return ul;
  };
  // responsible for deleting an event and performing related actions
  CalendarApp.prototype.deleteEvent = async function(e) {
    const index = e.currentTarget.getAttribute('data-idx');
    // Convert index to a number, assuming it's stored as a string
    const numericIndex = parseInt(index, 10);
    this.apts = await getApts();
    const want_to_delete = this.apts[numericIndex]._id;

    // Delete the event from your API using deleteApts
    try {
      await deleteApts(want_to_delete); // Pass the event ID or any identifier
      // Remove the event from your local calendar data
      var deleted = this.apts.splice(numericIndex, 1);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
    var deletedDate = new Date(deleted[0].day);
    console.log(deletedDate);
    var anyDatesLeft = this.showEventsByDay(deletedDate);
    console.log(anyDatesLeft);
    if ( anyDatesLeft === false ) {
      // safe to remove from array
      var idx = this.aptDates.indexOf(deletedDate.toString());
      if (idx >= 0) {
        this.aptDates.splice(idx,1);
        // remove dot from calendar view
        var ele = document.querySelector('.cview--date[data-date="'+ deletedDate.toString() +'"]');
        if ( ele ) {
          ele.classList.remove("has-events");
        }
      }
    }
    this.openDayWindow(deletedDate);
  };
  // responsible for sorting an array of events based on their start times
  CalendarApp.prototype.sortEventsByTime = function(events) {
    if (!events) return [];
    return events.sort(function compare(a, b) {
      if (new Date(a.startTime) < new Date(b.startTime)) {
        return -1;
      }
      if (new Date(a.startTime) > new Date(b.startTime)) {
        return 1;
      }
      // a must be equal to b
      return 0;
    });
  };
  // responsible for filtering and returning events that occur on a specific day (day)
  CalendarApp.prototype.showEventsByDay = function(day) {
    var _events = [];
    console.log(this.apts);
    this.apts.forEach(function(apt, idx){
      console.log(day.toString());
      console.log(apt.day.toString());
      if ( day.toString() == apt.day.toString() ) {
        apt.index = idx;
        _events.push(apt);
      }
    });
    console.log(_events.length);
    return (_events.length) ? _events : false;
  };
  // responsible for closing a day view window in a calendar application
  CalendarApp.prototype.closeDayWindow = function(){
    this.dayViewEle.classList.remove("calendar--day-view-active");
    this.closeNewEventBox();
  };
  // handle a click event on the main calendar view to close the day view window and potentially the new event creation box
  CalendarApp.prototype.mainCalendarClickClose = function(e){
    if ( e.currentTarget != e.target ) {
      return;
    }
    
    this.dayViewEle.classList.remove("calendar--day-view-active");
    this.closeNewEventBox();
  };
  // responsible for adding a new event creation box or form to the day view in a calendar application
  CalendarApp.prototype.addNewEventBox = function(e){
    var target = e.currentTarget;
    this.dayEventBoxEle.setAttribute("data-active", "true"); 
    this.dayEventBoxEle.setAttribute("data-date", target.getAttribute("data-date"));
    
  };
  // responsible for closing the new event creation box or form in a calendar application
  CalendarApp.prototype.closeNewEventBox = function(e){
    
    if (e && e.keyCode && e.keyCode != 13) return false;
    
    this.dayEventBoxEle.setAttribute("data-active", "false");
    // reset values
    this.resetAddEventBox();
    
  };
  // responsible for saving a new event after performing validation.
  CalendarApp.prototype.saveAddNewEvent = function() {
    var saveErrors = this.validateAddEventInput();
    if ( !saveErrors ) {
      this.addEvent();
    }
  };

  // Add Event Prototype Method
  // this addEvent method extracts and cleans event details, creates an event object, adds it to the list of appointments (apts), closes the new event input box, opens the day details window, marks the selected day as having events, and updates the list of dates with events (aptDates).
  CalendarApp.prototype.addEvent = async function() {
    
    var name = this.dayEventAddForm.nameEvent.value.trim();
    var dayOfDate = this.dayEventBoxEle.getAttribute("data-date");
    var dateObjectDay =  new Date(dayOfDate).toString();
    var cleanDates = this.cleanEventTimeStampDates();
    
    // Prepare the event data to send to your API
    const eventData = {
      name: name,
      day: dateObjectDay,
      startTime: cleanDates[0],
      endTime: cleanDates[1],
    };
    // Post the event to your API using postApts
    try {
      await postApts(eventData);
      // Update your local calendar data if needed
      this.apts.push(eventData);
    } catch (error) {
      console.error("Error adding event:", error);
    }
    this.closeNewEventBox();
    this.openDayWindow(dayOfDate);
    this.calDaySelected.classList.add("has-events");
    // add to aptDates
    if ( this.aptDates.indexOf(dateObjectDay.toString()) === -1 ) {
      this.aptDates.push(dateObjectDay.toString());
    }
    
  };
  // this method takes a time string in AM/PM format and converts it into a 24-hour format, returning an array with hours and minutes. It also handles cases where the input time string may or may not include minutes or may contain whitespace.
  CalendarApp.prototype.convertTo23HourTime = function(stringOfTime, AMPM) {
    // convert to 0 - 23 hour time
    var mins = stringOfTime.split(":");
    var hours = stringOfTime.trim();
    if ( mins[1] && mins[1].trim() ) {
      hours = parseInt(mins[0].trim());
      mins = parseInt(mins[1].trim());
    } else {
      hours = parseInt(hours);
      mins = 0;
    }
    hours = ( AMPM == 'am' ) ? ( (hours == 12) ? 0 : hours ) : (hours <= 11) ? parseInt(hours) + 12 : hours;
    return [hours, mins];
  };
  // responsible for processing and cleaning up user-inputted or default time and date values from a new event creation form in a calendar application
  CalendarApp.prototype.cleanEventTimeStampDates = function() {
    
    var startTime = this.dayEventAddForm.startTime.value.trim() || this.dayEventAddForm.startTime.getAttribute("placeholder") || '8';
    var startAMPM = this.dayEventAddForm.startAMPM.value.trim() || this.dayEventAddForm.startAMPM.getAttribute("placeholder") || 'am';
    startAMPM = (startAMPM == 'a') ? startAMPM + 'm' : startAMPM;
    var endTime = this.dayEventAddForm.endTime.value.trim() || this.dayEventAddForm.endTime.getAttribute("placeholder") || '9';
    var endAMPM = this.dayEventAddForm.endAMPM.value.trim() || this.dayEventAddForm.endAMPM.getAttribute("placeholder") || 'pm';
    endAMPM = (endAMPM == 'p') ? endAMPM + 'm' : endAMPM;
    var date = this.dayEventBoxEle.getAttribute("data-date");
    
    var startingTimeStamps = this.convertTo23HourTime(startTime, startAMPM);
    var endingTimeStamps = this.convertTo23HourTime(endTime, endAMPM);
    
    var dateOfEvent = new Date(date);
    var startDate = new Date(dateOfEvent.getFullYear(), dateOfEvent.getMonth(), dateOfEvent.getDate(), startingTimeStamps[0], startingTimeStamps[1]);
    var endDate = new Date(dateOfEvent.getFullYear(), dateOfEvent.getMonth(), dateOfEvent.getDate(), endingTimeStamps[0], endingTimeStamps[1]);
    
    // if end date is less than start date - set end date back another day
    if ( startDate > endDate ) endDate.setDate(endDate.getDate() + 1);
    
    return [startDate, endDate];
    
  };
  // this method validates the input fields for adding a new event. It checks if the name field is empty or null, adds error styling and focuses on the input field if there's an error, and returns true if there are errors and false if there are none.
  CalendarApp.prototype.validateAddEventInput = function() {
  
    var _errors = false;
    var name = this.dayEventAddForm.nameEvent.value.trim();
    var startTime = this.dayEventAddForm.startTime.value.trim();
    var startAMPM = this.dayEventAddForm.startAMPM.value.trim();
    var endTime = this.dayEventAddForm.endTime.value.trim();
    var endAMPM = this.dayEventAddForm.endAMPM.value.trim();
    
    if (!name || name == null) {
      _errors = true;
      this.dayEventAddForm.nameEvent.classList.add("add-event-edit--error");
      this.dayEventAddForm.nameEvent.focus();
    } else {
       this.dayEventAddForm.nameEvent.classList.remove("add-event-edit--error");
    }
    return _errors;
    
  };
  var timeOut = null;
  var activeEle = null;
  // limit or control the input of a specified HTML element
  CalendarApp.prototype.inputChangeLimiter = function(ele) {
    
    if ( ele.currentTarget ) {
      ele = ele.currentTarget;
    }
    if (timeOut && ele == activeEle){
      clearTimeout(timeOut);
    }
    
    var limiter = CalendarApp.prototype.textOptionLimiter;
  
    var _options = ele.getAttribute("data-options").split(",");
    var _format = ele.getAttribute("data-format") || 'text';
    timeOut = setTimeout(function(){
      ele.value = limiter(_options, ele.value, _format);
    }, 600);
    activeEle = ele;
    
  };
  // appears to be used for limiting and formatting user input based on provided options and a specified format
  CalendarApp.prototype.textOptionLimiter = function(options, input, format){
    if ( !input ) return '';
    
    if ( input.indexOf(":") !== -1 && format == 'datetime' ) {
   
      var _splitTime = input.split(':', 2);
      if (_splitTime.length == 2 && !_splitTime[1].trim()) return input;
      var _trailingTime = parseInt(_splitTime[1]);
      /* Probably could be coded better -- a block to clean up trailing data */
      if (options.indexOf(_splitTime[0]) === -1) {
        return options[0];
      }
      else if (_splitTime[1] == "0" ) {
        return input;
      }
      else if (_splitTime[1] == "00" ) {
        return _splitTime[0] +  ":00";
      }
      else if (_trailingTime < 10 ) {
        return _splitTime[0] + ":" + "0" + _trailingTime;
      }
      else if ( !Number.isInteger(_trailingTime) || _trailingTime < 0 || _trailingTime > 59 )  {
        return _splitTime[0];
      } 
      return _splitTime[0] + ":" + _trailingTime;
    }
    if ((input.toString().length >= 3) ) {
      var pad = (input.toString().length - 4) * -1;
      var _hour, _min;
      if (pad == 1) {
        _hour = input[0];
        _min = input[1] + input[2];
      } else {
        _hour = input[0] + input[1];
        _min = input[2] + input[3];
      }
      
      _hour = Math.max(1,Math.min(12,(_hour)));
      _min = Math.min(59,(_min));
      if ( _min < 10 ) { 
        _min = "0" + _min;
      }
      _min = (isNaN(_min)) ? '00' : _min;
      _hour = (isNaN(_hour)) ? '9' : _hour ;
  
      return _hour + ":" + _min;
      
    }
  
    if (options.indexOf(input) === -1) {
      return options[0];
    }
    
    return input;
  };
  // responsible for resetting or clearing the values and state of the new event creation form or box in a calendar application
  CalendarApp.prototype.resetAddEventBox = function(){
    this.dayEventAddForm.nameEvent.value = '';
    this.dayEventAddForm.nameEvent.classList.remove("add-event-edit--error");
    this.dayEventAddForm.endTime.value = '';
    this.dayEventAddForm.startTime.value = '';
    this.dayEventAddForm.endAMPM.value = '';
    this.dayEventAddForm.startAMPM.value = '';
  };
  // displaying a new month in the calendar when triggered by an event
  CalendarApp.prototype.showNewMonth = function(e){
    var date = e.currentTarget.dataset.date;
    var newMonthDate = new Date(date);
    this.showView(newMonthDate);
    this.closeDayWindow();
    return true;
  };
  
  var calendar = new CalendarApp();
  console.log(calendar.apts);