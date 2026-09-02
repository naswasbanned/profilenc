import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Github, Flame, Calendar, TrendingUp, Activity, ExternalLink, Loader2 } from 'lucide-react';

/**
 * Parse GitHub contribution data from the public contributions page.
 * Uses the GitHub Skyline / contributions JSON endpoint.
 */
async function fetchContributions(username) {
  if (!username) return null;

  // Use GitHub's public contributions calendar page and parse from the HTML
  // Fallback: use a CORS-friendly proxy or the GitHub GraphQL API
  try {
    // Try the github-contributions-api (public, no auth needed)
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`
    );
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = await res.json();
    return data;
  } catch {
    // Fallback: return null and show error state
    return null;
  }
}

function getContributionLevel(count, maxCount) {
  if (count === 0) return 0;
  if (maxCount === 0) return 0;
  const ratio = count / maxCount;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function computeStats(contributions) {
  if (!contributions || !contributions.length) {
    return { total: 0, currentStreak: 0, longestStreak: 0, bestDay: null };
  }

  let total = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let bestDay = null;
  let bestCount = 0;

  // contributions is array of { date, count, level }
  const sorted = [...contributions].sort((a, b) => a.date.localeCompare(b.date));

  for (const day of sorted) {
    total += day.count;
    if (day.count > bestCount) {
      bestCount = day.count;
      bestDay = day.date;
    }
    if (day.count > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  // Current streak: count from last day backwards
  currentStreak = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  return { total, currentStreak, longestStreak, bestDay, bestCount };
}

function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = useCallback((e) => {
    setPos({ x: e.clientX, y: e.clientY });
    setShow(true);
  }, []);

  return (
    <div
      className="heatmap-cell-wrapper"
      onMouseMove={handleMouse}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className="heatmap-tooltip"
          style={{
            position: 'fixed',
            left: pos.x + 12,
            top: pos.y - 32,
            pointerEvents: 'none',
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function GitHubHeatmapBlock({ data }) {
  const username = data?.username || '';
  const showStats = data?.showStats !== false;
  const [contributionData, setContributionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchContributions(username).then((result) => {
      if (cancelled) return;
      if (!result || !result.contributions) {
        setError('Could not load contribution data');
        setLoading(false);
        return;
      }
      setContributionData(result);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [username]);

  // Build grid: 53 columns (weeks) x 7 rows (days)
  const { weeks, maxCount, allDays } = useMemo(() => {
    if (!contributionData?.contributions) {
      return { weeks: [], maxCount: 0, allDays: [] };
    }

    const contribs = contributionData.contributions;

    // Flatten all days from the nested structure
    // API returns { contributions: [ { date, count, level } ] }
    const allDays = Array.isArray(contribs)
      ? contribs
      : Object.values(contribs).flat();

    let max = 0;
    for (const day of allDays) {
      if (day.count > max) max = day.count;
    }

    // Group into weeks (columns of 7)
    const weeks = [];
    let currentWeek = [];
    for (let i = 0; i < allDays.length; i++) {
      currentWeek.push(allDays[i]);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      // Pad last week
      while (currentWeek.length < 7) {
        currentWeek.push({ date: '', count: 0, level: 0, empty: true });
      }
      weeks.push(currentWeek);
    }

    return { weeks, maxCount: max, allDays };
  }, [contributionData]);

  const stats = useMemo(() => computeStats(allDays), [allDays]);

  const monthLabels = useMemo(() => {
    if (!weeks.length) return [];
    const labels = [];
    let lastMonth = -1;

    for (let w = 0; w < weeks.length; w++) {
      const firstDay = weeks[w].find((d) => d.date && !d.empty);
      if (!firstDay) continue;
      const month = new Date(firstDay.date + 'T00:00:00').getMonth();
      if (month !== lastMonth) {
        lastMonth = month;
        labels.push({
          month: new Date(firstDay.date + 'T00:00:00').toLocaleString('en-US', { month: 'short' }),
          weekIndex: w,
        });
      }
    }
    return labels;
  }, [weeks]);

  if (!username) {
    return (
      <div className="github-heatmap-empty">
        <Github size={32} />
        <p>Set your GitHub username to display contributions</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="github-heatmap-loading">
        <Loader2 size={24} className="spin" />
        <span>Loading contributions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="github-heatmap-error">
        <Github size={24} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="github-heatmap-block">
      {/* Header with GitHub link */}
      <div className="github-heatmap-header">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="github-heatmap-profile-link"
        >
          <Github size={16} />
          <span>@{username}</span>
          <ExternalLink size={12} />
        </a>
        <span className="github-heatmap-year">
          {contributionData?.total?.[Object.keys(contributionData.total || {}).pop()]
            ? `${Object.keys(contributionData.total).pop()}`
            : 'Last Year'}
        </span>
      </div>

      {/* Contribution Grid */}
      <div className="github-heatmap-scroll">
        <div className="github-heatmap-grid">
          {/* Month labels row */}
          <div className="github-heatmap-months">
            <div className="heatmap-day-label-spacer" />
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="heatmap-month-label"
                style={{ gridColumnStart: m.weekIndex + 2 }}
              >
                {m.month}
              </span>
            ))}
          </div>

          <div className="github-heatmap-body">
            {/* Day-of-week labels */}
            <div className="heatmap-day-labels">
              <span />
              <span>Mon</span>
              <span />
              <span>Wed</span>
              <span />
              <span>Fri</span>
              <span />
            </div>

            {/* Cells grid */}
            <div className="heatmap-cells">
              {weeks.map((week, wi) => (
                <div key={wi} className="heatmap-week-column">
                  {week.map((day, di) => {
                    if (day.empty) {
                      return <div key={di} className="heatmap-cell heatmap-cell-empty" />;
                    }
                    const level = getContributionLevel(day.count, maxCount);
                    return (
                      <Tooltip
                        key={di}
                        text={`${day.count} contribution${day.count !== 1 ? 's' : ''} on ${formatDate(day.date)}`}
                      >
                        <motion.div
                          className={`heatmap-cell heatmap-level-${level}`}
                          whileHover={{ scale: 1.6 }}
                          transition={{ duration: 0.15 }}
                        />
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="heatmap-legend">
            <span className="heatmap-legend-label">Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div key={level} className={`heatmap-cell heatmap-level-${level} heatmap-legend-cell`} />
            ))}
            <span className="heatmap-legend-label">More</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      {showStats && (
        <div className="github-heatmap-stats">
          <div className="heatmap-stat">
            <Activity size={14} />
            <span className="heatmap-stat-value">{stats.total.toLocaleString()}</span>
            <span className="heatmap-stat-label">Contributions</span>
          </div>
          <div className="heatmap-stat">
            <Flame size={14} />
            <span className="heatmap-stat-value">{stats.currentStreak}</span>
            <span className="heatmap-stat-label">Current Streak</span>
          </div>
          <div className="heatmap-stat">
            <TrendingUp size={14} />
            <span className="heatmap-stat-value">{stats.longestStreak}</span>
            <span className="heatmap-stat-label">Longest Streak</span>
          </div>
          {stats.bestDay && (
            <div className="heatmap-stat">
              <Calendar size={14} />
              <span className="heatmap-stat-value">{stats.bestCount}</span>
              <span className="heatmap-stat-label">Best Day</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
