import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ExternalLink,
  Plus,
  Radio,
  CheckCircle2,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  List,
  Grid,
  Sparkles,
  Video,
  Users,
} from 'lucide-react';
import { safeUrl } from '../../lib/safeUrl';

// Helper to generate Google Calendar Add-to-Calendar URL
function getGoogleCalendarUrl(event) {
  const title = encodeURIComponent(event.title || 'Event');
  const details = encodeURIComponent(`${event.description || ''}\n\nLink: ${event.linkUrl || ''}`);
  const location = encodeURIComponent(event.location || event.platform || 'Online');

  let dateParam = '';
  if (event.date) {
    // Format YYYYMMDD
    const cleanDate = event.date.replace(/-/g, '');
    const startTime = (event.startTime || '18:00').replace(/:/g, '') + '00';
    const endTime = (event.endTime || '20:00').replace(/:/g, '') + '00';
    dateParam = `&dates=${cleanDate}T${startTime}/${cleanDate}T${endTime}`;
  }

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}${dateParam}`;
}

// Helper to download .ICS calendar file
function downloadIcsFile(event) {
  const cleanDate = (event.date || new Date().toISOString().split('T')[0]).replace(/-/g, '');
  const startTime = (event.startTime || '18:00').replace(/:/g, '') + '00';
  const endTime = (event.endTime || '20:00').replace(/:/g, '') + '00';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nas Profile//Events Engine//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${event.title || 'Event'}`,
    `DESCRIPTION:${event.description || ''}`,
    `LOCATION:${event.location || event.platform || 'Online'}`,
    `DTSTART:${cleanDate}T${startTime}Z`,
    `DTEND:${cleanDate}T${endTime}Z`,
    `URL:${event.linkUrl || ''}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${(event.title || 'event').toLowerCase().replace(/\s+/g, '-')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function parseEventDate(dateStr) {
  if (!dateStr) return { month: 'TBA', day: '—', dayOfWeek: '', isPast: false };

  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      const parts = dateStr.split('-');
      return { month: parts[1] || 'EVT', day: parts[2] || '—', dayOfWeek: '', isPast: false };
    }

    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      month: months[d.getMonth()],
      day: String(d.getDate()).padStart(2, '0'),
      dayOfWeek: days[d.getDay()],
      isPast: d < today,
    };
  } catch {
    return { month: 'EVT', day: '—', dayOfWeek: '', isPast: false };
  }
}

export default function EventsBlock({ data = {} }) {
  const {
    items = [],
    defaultView = 'list', // 'list' | 'calendar'
    showFilters = true,
  } = data;

  const eventList = Array.isArray(items) ? items : [];

  const [viewMode, setViewMode] = useState(defaultView || 'list');
  const [filter, setFilter] = useState('all'); // 'all' | 'upcoming' | 'live' | 'past'
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);

  // Month navigation for Calendar View
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  const filteredEvents = useMemo(() => {
    return eventList.filter((evt) => {
      const { isPast } = parseEventDate(evt.date);
      const isLive = evt.status?.toLowerCase().includes('live');

      if (filter === 'live') return isLive;
      if (filter === 'upcoming') return !isPast || isLive;
      if (filter === 'past') return isPast && !isLive;
      return true;
    });
  }, [eventList, filter]);

  if (eventList.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '36px', color: '#888', fontSize: '0.85rem' }}>
        No events scheduled yet. Click Edit to create your first event or stream.
      </div>
    );
  }

  // Mini Calendar generation
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  const eventsByDay = useMemo(() => {
    const map = {};
    eventList.forEach((evt) => {
      if (!evt.date) return;
      const d = new Date(evt.date);
      if (!isNaN(d.getTime()) && d.getFullYear() === year && d.getMonth() === month) {
        const dayNum = d.getDate();
        if (!map[dayNum]) map[dayNum] = [];
        map[dayNum].push(evt);
      }
    });
    return map;
  }, [eventList, year, month]);

  return (
    <div className="events-block-container">
      {/* Top Toolbar: View switcher & Filter tabs */}
      <div className="events-toolbar">
        {showFilters && (
          <div className="events-filter-pills">
            <button
              type="button"
              className={`events-filter-pill ${filter === 'all' ? 'active' : ''}`}
              onClick={() => { setFilter('all'); setSelectedCalendarDate(null); }}
            >
              All Events ({eventList.length})
            </button>
            <button
              type="button"
              className={`events-filter-pill ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => { setFilter('upcoming'); setSelectedCalendarDate(null); }}
            >
              Upcoming
            </button>
            <button
              type="button"
              className={`events-filter-pill ${filter === 'live' ? 'active' : ''}`}
              onClick={() => { setFilter('live'); setSelectedCalendarDate(null); }}
            >
              <span className="live-dot" /> Live / Streams
            </button>
            <button
              type="button"
              className={`events-filter-pill ${filter === 'past' ? 'active' : ''}`}
              onClick={() => { setFilter('past'); setSelectedCalendarDate(null); }}
            >
              Recaps & Past
            </button>
          </div>
        )}

        <div className="events-view-switcher">
          <button
            type="button"
            className={`events-view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Schedule Feed View"
          >
            <List size={14} /> <span>Schedule</span>
          </button>
          <button
            type="button"
            className={`events-view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
            title="Monthly Calendar View"
          >
            <CalendarIcon size={14} /> <span>Calendar</span>
          </button>
        </div>
      </div>

      {/* MONTH CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="events-calendar-view">
          <div className="events-month-header">
            <button
              type="button"
              className="events-month-nav-btn"
              onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
            >
              <ChevronLeft size={16} />
            </button>
            <h3 className="events-month-title">
              {monthNames[month]} {year}
            </h3>
            <button
              type="button"
              className="events-month-nav-btn"
              onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="events-calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dw) => (
              <div key={dw} className="events-cal-weekday">
                {dw}
              </div>
            ))}
            {daysArray.map((dayNum, dIdx) => {
              if (dayNum === null) {
                return <div key={`empty-${dIdx}`} className="events-cal-day empty" />;
              }
              const hasEvents = Boolean(eventsByDay[dayNum]);
              const isSelected = selectedCalendarDate === dayNum;

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`events-cal-day ${hasEvents ? 'has-events' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => hasEvents && setSelectedCalendarDate(isSelected ? null : dayNum)}
                >
                  <span className="cal-day-num">{dayNum}</span>
                  {hasEvents && (
                    <div className="cal-event-dots">
                      {eventsByDay[dayNum].slice(0, 3).map((e, eIdx) => (
                        <span
                          key={eIdx}
                          className={`cal-dot ${e.status?.toLowerCase().includes('live') ? 'live' : ''}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedCalendarDate && eventsByDay[selectedCalendarDate] && (
            <div className="events-selected-date-feed">
              <h4 className="events-selected-date-title">
                Events on {monthNames[month]} {selectedCalendarDate}, {year}
              </h4>
              <div className="events-schedule-list">
                {eventsByDay[selectedCalendarDate].map((evt, idx) => (
                  <EventCardItem key={evt.id || idx} event={evt} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SCHEDULE FEED LIST VIEW */}
      {viewMode === 'list' && (
        <div className="events-schedule-list">
          {filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#888', fontSize: '0.85rem' }}>
              No events found for this filter.
            </div>
          ) : (
            filteredEvents.map((event, idx) => (
              <EventCardItem key={event.id || idx} event={event} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function EventCardItem({ event }) {
  const dateInfo = parseEventDate(event.date);
  const isLive = event.status?.toLowerCase().includes('live');
  const [showSyncDropdown, setShowSyncDropdown] = useState(false);

  return (
    <div className={`event-card ${isLive ? 'is-live' : ''} ${dateInfo.isPast ? 'is-past' : ''}`}>
      {/* Left Date Column */}
      <div className="event-date-badge">
        <span className="event-date-month">{dateInfo.month}</span>
        <span className="event-date-day">{dateInfo.day}</span>
        {dateInfo.dayOfWeek && <span className="event-date-dow">{dateInfo.dayOfWeek}</span>}
      </div>

      {/* Center Details Column */}
      <div className="event-content">
        <div className="event-meta-top">
          {event.status && (
            <span className={`event-status-badge ${isLive ? 'live' : dateInfo.isPast ? 'past' : 'upcoming'}`}>
              {isLive && <span className="live-dot" />}
              {event.status}
            </span>
          )}

          {event.type && (
            <span className="event-type-badge">
              {event.type === 'Stream' ? <Video size={11} /> : <Users size={11} />}
              {event.type}
            </span>
          )}

          {event.time && (
            <span className="event-time-pill">
              <Clock size={11} /> {event.time}
            </span>
          )}

          {(event.location || event.platform) && (
            <span className="event-location-pill">
              <MapPin size={11} /> {event.location || event.platform}
            </span>
          )}
        </div>

        <h3 className="event-title">{event.title || 'Untitled Event'}</h3>

        {event.description && <p className="event-description">{event.description}</p>}

        {event.topics && event.topics.length > 0 && (
          <div className="event-topics">
            {(Array.isArray(event.topics) ? event.topics : event.topics.split(',')).map((top, tIdx) => (
              <span key={tIdx} className="event-topic-pill">
                #{typeof top === 'string' ? top.trim() : top}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right Action & Calendar Sync Column */}
      <div className="event-actions">
        {/* RSVP / Join CTA Button */}
        {safeUrl(event.linkUrl) && (
          <a
            href={safeUrl(event.linkUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className={`event-btn-cta ${isLive ? 'live' : 'primary'}`}
          >
            <span>{event.linkLabel || (isLive ? 'Join Stream' : 'RSVP / Info')}</span>
            <ExternalLink size={13} />
          </a>
        )}

        {/* 1-Click Calendar Sync */}
        <div className="event-sync-wrap">
          <button
            type="button"
            className="event-btn-sync"
            onClick={() => setShowSyncDropdown(!showSyncDropdown)}
            title="Add to your personal calendar"
          >
            <CalendarPlus size={13} />
            <span>Add to Calendar</span>
          </button>

          <AnimatePresence>
            {showSyncDropdown && (
              <motion.div
                className="event-sync-dropdown"
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
              >
                <a
                  href={getGoogleCalendarUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="event-sync-opt"
                  onClick={() => setShowSyncDropdown(false)}
                >
                  <Sparkles size={13} color="#4285f4" /> Google Calendar
                </a>
                <button
                  type="button"
                  className="event-sync-opt"
                  onClick={() => {
                    downloadIcsFile(event);
                    setShowSyncDropdown(false);
                  }}
                >
                  <CalendarIcon size={13} color="#00f0aa" /> Apple / Outlook (.ics)
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
