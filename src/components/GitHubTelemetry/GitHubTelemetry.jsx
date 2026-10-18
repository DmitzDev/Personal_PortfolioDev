import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ExternalLink,
  Layers,
  Box,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import './GitHubTelemetry.css';

const DEFAULT_USERNAME = 'DmitzDev';
const GITHUB_PROFILE_URL = `https://github.com/${DEFAULT_USERNAME}`;

// Reference colors for 3D Isometric Contributions
const PROFILE_3D_PALETTES = {
  light: {
    backgroundColor: '#ffffff',
    foregroundColor: '#0f172a',
    strongColor: '#0f172a',
    weakColor: '#64748b',
    // 0: pure white box, 1: lime, 2: medium green, 3: forest, 4: deep emerald
    contribColors: ['#ffffff', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    level0Front: '#e2e8f0',
    level0Right: '#cbd5e1',
    level0Stroke: '#94a3b8'
  },
  dark: {
    backgroundColor: '#0c0f16',
    foregroundColor: '#f1f5f9',
    strongColor: '#ffffff',
    weakColor: '#94a3b8',
    contribColors: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    level0Front: '#0f141c',
    level0Right: '#0a0e14',
    level0Stroke: '#30363d'
  }
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function GitHubTelemetry({ username = DEFAULT_USERNAME }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedYear, setSelectedYear] = useState('last');
  const [activeView, setActiveView] = useState('3d'); // '3d' | '2d'
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Cache data across years
  const cacheRef = useRef({});

  const fetchData = useCallback(async (year) => {
    if (cacheRef.current[year]) {
      setData(cacheRef.current[year]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch activity (${res.status})`);
      }
      const json = await res.json();
      cacheRef.current[year] = json;
      setData(json);
    } catch (err) {
      console.error('GitHub telemetry fetch error:', err);
      setError(err.message || 'Unable to load telemetry data');
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear, fetchData]);

  // Compute 52/53-week matrix and stats
  const { weeks, stats, monthLabels, dateRangeStr } = useMemo(() => {
    if (!data || !data.contributions || data.contributions.length === 0) {
      return { weeks: [], stats: null, monthLabels: [], dateRangeStr: '' };
    }

    const list = data.contributions;
    const total = list.reduce((acc, cur) => acc + cur.count, 0);

    let maxStreak = 0;
    let curStreak = 0;
    let peakDay = { date: '', count: 0 };
    const dayTotals = [0, 0, 0, 0, 0, 0, 0];

    list.forEach((item) => {
      if (item.count > 0) {
        curStreak += 1;
        if (curStreak > maxStreak) maxStreak = curStreak;
      } else {
        curStreak = 0;
      }

      if (item.count > peakDay.count) {
        peakDay = { date: item.date, count: item.count };
      }

      const d = new Date(item.date);
      const dayIndex = d.getUTCDay();
      dayTotals[dayIndex] += item.count;
    });

    let busiestDayIdx = 0;
    let maxDayCount = -1;
    dayTotals.forEach((cnt, idx) => {
      if (cnt > maxDayCount) {
        maxDayCount = cnt;
        busiestDayIdx = idx;
      }
    });

    const weeksCols = [];
    let currentWeek = [];

    const firstDate = new Date(list[0].date);
    const startDayOfWeek = firstDate.getUTCDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null);
    }

    list.forEach((item) => {
      currentWeek.push(item);
      if (currentWeek.length === 7) {
        weeksCols.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksCols.push(currentWeek);
    }

    const labels = [];
    let lastMonth = -1;
    weeksCols.forEach((week, colIdx) => {
      const firstValid = week.find((d) => d !== null);
      if (firstValid) {
        const d = new Date(firstValid.date);
        const m = d.getUTCMonth();
        if (m !== lastMonth) {
          labels.push({ colIndex: colIdx, label: MONTH_NAMES[m] });
          lastMonth = m;
        }
      }
    });

    const firstD = list[0].date;
    const lastD = list[list.length - 1].date;
    const dateRange = `${firstD} / ${lastD}`;

    return {
      weeks: weeksCols,
      monthLabels: labels,
      dateRangeStr: dateRange,
      stats: {
        total,
        currentStreak: curStreak,
        maxStreak,
        peakDay,
        busiestDayName: DAY_NAMES[busiestDayIdx],
        velocityAvg: (total / Math.max(1, weeksCols.length)).toFixed(1),
        stars: 135,
        forks: 14
      }
    };
  }, [data]);

  // Format date for tooltip
  const formatTooltipDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    const d = new Date(year, parseInt(month, 10) - 1, day);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const currentThemePalette = isDark ? PROFILE_3D_PALETTES.dark : PROFILE_3D_PALETTES.light;

  return (
    <section id="github-telemetry" className="gh-telemetry-section">
      {/* Ambient background glow */}
      <div className="gh-telemetry-ambient-glow" aria-hidden="true" />

      <div className="gh-telemetry-container">
        {/* Main Header */}
        <div className="gh-main-header">
          <div className="gh-header-left">
            <div className="gh-live-badge">
              <span className="gh-pulse-dot" />
              <span className="gh-badge-text">Live GitHub Activity</span>
            </div>
            <div className="gh-title-group">
              <h3 className="gh-card-title">GitHub 3D Profile Telemetry</h3>
              <a
                href={GITHUB_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="gh-username-link"
                title="Open GitHub Profile"
              >
                <span>@{username}</span>
                <ExternalLink size={12} className="gh-external-icon" />
              </a>
            </div>
          </div>

          {/* View & Year Switchers */}
          <div className="gh-header-controls">
            {/* Segmented View Switcher (3D Isometric and 2D Grid) */}
            <div className="gh-segmented-control" role="tablist" aria-label="Telemetry View Mode">
              <button
                type="button"
                role="tab"
                aria-selected={activeView === '3d'}
                className={`gh-segment-btn ${activeView === '3d' ? 'active' : ''}`}
                onClick={() => setActiveView('3d')}
                title="3D Isometric Contribution Graph"
              >
                <Box size={14} />
                <span>3D Isometric</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeView === '2d'}
                className={`gh-segment-btn ${activeView === '2d' ? 'active' : ''}`}
                onClick={() => setActiveView('2d')}
                title="2D Standard Heatmap"
              >
                <Layers size={14} />
                <span>2D Grid</span>
              </button>
            </div>

            {/* Year Selector */}
            <div className="gh-year-selector" role="group" aria-label="Contribution Period">
              {[
                { id: 'last', label: 'Last 12 Mos' },
                { id: '2026', label: '2026' },
                { id: '2025', label: '2025' }
              ].map((y) => (
                <button
                  key={y.id}
                  type="button"
                  className={`gh-year-btn ${selectedYear === y.id ? 'active' : ''}`}
                  onClick={() => setSelectedYear(y.id)}
                >
                  {y.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Viewport Content */}
        <div className="gh-viewport-wrapper">
          {isLoading && <BentoSkeleton />}

          {error && !isLoading && (
            <div className="gh-error-state">
              <AlertCircle size={28} className="gh-error-icon" />
              <p className="gh-error-text">Failed to fetch telemetry data: {error}</p>
              <button
                type="button"
                onClick={() => fetchData(selectedYear)}
                className="gh-retry-btn"
              >
                <RefreshCw size={14} />
                <span>Retry Request</span>
              </button>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {/* VIEW 1: HORIZONTAL 3D ISOMETRIC SHOWCASE */}
              {activeView === '3d' && (
                <div className="gh-3d-profile-container">
                  <Profile3DGreenSvg
                    contributions={data?.contributions || []}
                    stats={stats}
                    dateRangeStr={dateRangeStr}
                    monthLabels={monthLabels}
                    themePalette={currentThemePalette}
                    onHoverCell={(cell, e) => {
                      if (!cell) {
                        setHoveredCell(null);
                        return;
                      }
                      const rect = e?.currentTarget?.getBoundingClientRect();
                      if (rect) {
                        setTooltipPos({
                          x: rect.left + rect.width / 2,
                          y: rect.top
                        });
                      }
                      setHoveredCell(cell);
                    }}
                  />
                </div>
              )}

              {/* VIEW 2: 2D Grid Heatmap */}
              {activeView === '2d' && (
                <div className="gh-heatmap-view">
                  <div className="gh-heatmap-scroll">
                    <div className="gh-heatmap-inner">
                      {/* Month Labels Bar */}
                      <div className="gh-month-labels">
                        <span className="gh-weekday-spacer" />
                        <div className="gh-months-track">
                          {monthLabels.map((m, i) => (
                            <span
                              key={`${m.label}-${i}`}
                              className="gh-month-label"
                              style={{ left: `${m.colIndex * 17}px` }}
                            >
                              {m.label}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Days + Grid Matrix */}
                      <div className="gh-grid-body">
                        {/* Weekday indicators */}
                        <div className="gh-weekday-labels">
                          <span></span>
                          <span>Mon</span>
                          <span></span>
                          <span>Wed</span>
                          <span></span>
                          <span>Fri</span>
                          <span></span>
                        </div>

                        {/* 52-Week Columns */}
                        <div className="gh-weeks-container">
                          {weeks.map((week, wIdx) => (
                            <div key={`week-${wIdx}`} className="gh-week-column">
                              {week.map((day, dIdx) => {
                                if (!day) {
                                  return <div key={`empty-${dIdx}`} className="gh-cell gh-cell-pad" />;
                                }

                                const cellColor = currentThemePalette.contribColors[day.level] || currentThemePalette.contribColors[0];
                                const isPeak = stats?.peakDay?.date === day.date && day.count > 0;

                                return (
                                  <div
                                    key={day.date}
                                    className={`gh-cell ${day.level > 0 ? `level-${day.level}` : 'level-0'} ${isPeak ? 'is-peak-cell' : ''}`}
                                    style={{ backgroundColor: cellColor }}
                                    onMouseEnter={(e) => {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setTooltipPos({
                                        x: rect.left + rect.width / 2,
                                        y: rect.top
                                      });
                                      setHoveredCell(day);
                                    }}
                                    onMouseLeave={() => setHoveredCell(null)}
                                    aria-label={`${day.count} contributions on ${day.date}`}
                                  />
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legend and Summary Footer */}
                  <div className="gh-heatmap-footer">
                    <span className="gh-footer-hint">
                      Hover on any cell for detailed timestamp and commit breakdown.
                    </span>
                    <div className="gh-legend-group">
                      <span className="gh-legend-label">Less</span>
                      <div className="gh-legend-cells">
                        {currentThemePalette.contribColors.map((color, idx) => (
                          <span
                            key={`legend-${idx}`}
                            className={`gh-legend-cell level-${idx}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="gh-legend-label">More</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Interactive Tooltip */}
      {hoveredCell && (
        <div
          className="gh-floating-tooltip"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y - 12}px`
          }}
        >
          <div className="gh-tooltip-header">
            <span className="gh-tooltip-count">
              {hoveredCell.count === 0 ? 'No contributions' : `${hoveredCell.count} contribution${hoveredCell.count > 1 ? 's' : ''}`}
            </span>
          </div>
          <span className="gh-tooltip-date">{formatTooltipDate(hoveredCell.date)}</span>
        </div>
      )}
    </section>
  );
}

/* ==========================================================================
   HORIZONTAL 3D ISOMETRIC SHOWCASE (NAKA-PAHABA / WIDE 3D BANNER)
   Clean isometric ground plane with crisp 3D extruded pillars
   ========================================================================== */
function Profile3DGreenSvg({ contributions, stats, dateRangeStr, monthLabels, themePalette, onHoverCell }) {
  const svgWidth = 1080;
  const svgHeight = 210;

  // Horizontal 3D Projection geometry
  const stepX = 18; // horizontal step between week columns
  const stepY = 12.5; // depth step between day rows
  const skewX = 3.5; // subtle isometric slant for depth
  const wCell = 13.5; // cell width
  const dDepth = 3.5; // 3D depth in X
  const hDepth = 6.5; // 3D depth in Y

  const offsetX = 58;
  const offsetY = 78;

  // Shading for 3D faces (top, front, right, stroke)
  const paletteShades = useMemo(() => {
    const getShades = (hex, idx) => {
      if (idx === 0) {
        return {
          top: themePalette.contribColors[0],
          front: themePalette.level0Front,
          right: themePalette.level0Right,
          stroke: themePalette.level0Stroke
        };
      }

      let num = parseInt(hex.replace('#', ''), 16);
      let r = (num >> 16) & 255;
      let g = (num >> 8) & 255;
      let b = num & 255;

      const shade = (f) => {
        const toHex = (v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
        return '#' + toHex(r * f) + toHex(g * f) + toHex(b * f);
      };

      return {
        top: hex,
        front: shade(0.85),
        right: shade(0.68),
        stroke: shade(0.60)
      };
    };

    return themePalette.contribColors.map((c, idx) => getShades(c, idx));
  }, [themePalette]);

  // Compute 3D bars and sort back-to-front (by dayOfWeek, then week)
  const bars = useMemo(() => {
    if (!contributions || contributions.length === 0) return [];

    const firstDate = new Date(contributions[0].date);
    const toEpochDays = (d) => Math.floor(d.getTime() / (24 * 60 * 60 * 1000));
    const sundayOfFirstWeek = toEpochDays(firstDate) - firstDate.getUTCDay();

    const items = contributions.map((cal) => {
      const calDate = new Date(cal.date);
      const week = Math.floor((toEpochDays(calDate) - sundayOfFirstWeek) / 7);
      const dayOfWeek = calDate.getUTCDay(); // 0 = sun, 1 = mon ...

      const x = offsetX + week * stepX - dayOfWeek * skewX;
      const y = offsetY + dayOfWeek * stepY;

      // 3D pillar height (0 commits = 2.5px elevated white 3D box; >0 commits = rising pillar)
      const h = cal.count === 0
        ? 2.5
        : Math.min(48, Math.log10(cal.count / 8 + 1) * 36 + 8);

      const shades = paletteShades[cal.level] || paletteShades[0];

      return {
        cal,
        week,
        dayOfWeek,
        x: +x.toFixed(1),
        y: +y.toFixed(1),
        h: +h.toFixed(1),
        shades,
        isZero: cal.count === 0
      };
    });

    // Sort by dayOfWeek ascending (Sunday/0 at back to Saturday/6 at front), then week
    items.sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) {
        return a.dayOfWeek - b.dayOfWeek;
      }
      return a.week - b.week;
    });

    return items;
  }, [contributions, paletteShades, offsetX, offsetY, stepX, stepY, skewX]);

  return (
    <div className="gh-3d-svg-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="gh-profile-3d-svg"
        role="img"
        aria-label="GitHub Profile Horizontal 3D Contribution Showcase"
      >

        {/* TOP TELEMETRY INFO BAR */}
        <g className="gh-svg-top-bar">
          <text
            x="45"
            y="30"
            fontSize="20px"
            fontWeight="bold"
            fill={themePalette.strongColor}
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {stats ? stats.total : 0}
            <tspan dx="8" fontSize="14px" fontWeight="normal" fill={themePalette.foregroundColor}>
              contributions
            </tspan>
          </text>

          {/* Star Icon & Count */}
          <g transform="translate(280, 15), scale(1.35)">
            <path
              fillRule="evenodd"
              d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
              fill={themePalette.foregroundColor}
            />
          </g>
          <text
            x="310"
            y="30"
            fontSize="17px"
            fontWeight="bold"
            fill={themePalette.foregroundColor}
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {stats?.stars ?? 135}
          </text>

          {/* Fork Icon & Count */}
          <g transform="translate(375, 15), scale(1.35)">
            <path
              fillRule="evenodd"
              d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
              fill={themePalette.foregroundColor}
            />
          </g>
          <text
            x="405"
            y="30"
            fontSize="17px"
            fontWeight="bold"
            fill={themePalette.foregroundColor}
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {stats?.forks ?? 14}
          </text>

          {/* Date Range Top Right */}
          <text
            x="1035"
            y="30"
            textAnchor="end"
            fontSize="13px"
            fill={themePalette.weakColor}
            fontFamily="'JetBrains Mono', monospace"
          >
            {dateRangeStr || '2025-10-19 / 2026-10-19'}
          </text>
        </g>

        {/* Month Labels along top */}
        <g className="gh-3d-months-layer">
          {monthLabels.map((m, i) => (
            <text
              key={`m-${m.label}-${i}`}
              x={offsetX + m.colIndex * stepX}
              y={offsetY - 16}
              fontSize="11px"
              fontWeight="600"
              fill={themePalette.weakColor}
              fontFamily="'JetBrains Mono', monospace"
            >
              {m.label}
            </text>
          ))}
        </g>

        {/* Weekday indicators on the left */}
        <g className="gh-3d-weekdays-layer">
          {[
            { label: 'Mon', day: 1 },
            { label: 'Wed', day: 3 },
            { label: 'Fri', day: 5 }
          ].map((w) => (
            <text
              key={w.label}
              x={offsetX - w.day * skewX - 8}
              y={offsetY + w.day * stepY + 3}
              textAnchor="end"
              fontSize="10px"
              fontWeight="500"
              fill={themePalette.weakColor}
              fontFamily="'JetBrains Mono', monospace"
            >
              {w.label}
            </text>
          ))}
        </g>

        {/* HORIZONTAL 3D TILES & PILLARS (Rendered back-to-front) */}
        <g className="gh-3d-pillars-layer">
          {bars.map((b, idx) => {
            const { x, y, h, shades, isZero } = b;

            // Ground floor isometric tile path
            const groundTileD = `M ${x} ${y} L ${x + wCell} ${y} L ${x + wCell - dDepth} ${y - hDepth} L ${x - dDepth} ${y - hDepth} Z`;
            const yTop = +(y - h).toFixed(1);
            const frontD = `M ${x} ${yTop} L ${x + wCell} ${yTop} L ${x + wCell} ${y} L ${x} ${y} Z`;
            const rightD = `M ${x + wCell} ${yTop} L ${x + wCell - dDepth} ${yTop - hDepth} L ${x + wCell - dDepth} ${y - hDepth} L ${x + wCell} ${y} Z`;
            const topD = `M ${x} ${yTop} L ${x + wCell} ${yTop} L ${x + wCell - dDepth} ${yTop - hDepth} L ${x - dDepth} ${yTop - hDepth} Z`;

            // Zero-commit day: render a clean, distinct elevated white 3D box
            if (isZero) {
              return (
                <g
                  key={`tile-${b.cal.date}-${idx}`}
                  className="gh-3d-tile-node"
                  onMouseEnter={(e) => onHoverCell(b.cal, e)}
                  onMouseLeave={() => onHoverCell(null)}
                  cursor="pointer"
                >
                  {/* Front Face of white 3D box */}
                  <path d={frontD} fill={shades.front} stroke={shades.stroke} strokeWidth="0.8" />
                  {/* Right Face of white 3D box */}
                  <path d={rightD} fill={shades.right} stroke={shades.stroke} strokeWidth="0.8" />
                  {/* Top Face of white 3D box */}
                  <path d={topD} fill={shades.top} stroke={shades.stroke} strokeWidth="0.8" />
                </g>
              );
            }

            // Active commit day: render a distinct 3D extruded pillar rising from the grid
            return (
              <g
                key={`bar-${b.cal.date}-${idx}`}
                className="gh-3d-bar-node"
                onMouseEnter={(e) => onHoverCell(b.cal, e)}
                onMouseLeave={() => onHoverCell(null)}
                cursor="pointer"
              >
                {/* Ground contact shadow */}
                <path d={groundTileD} fill="rgba(0, 0, 0, 0.14)" stroke="none" />

                {/* Front Face */}
                <path d={frontD} fill={shades.front} stroke={shades.stroke} strokeWidth="0.8" />
                {/* Right Face (Depth Shadow) */}
                <path d={rightD} fill={shades.right} stroke={shades.stroke} strokeWidth="0.8" />
                {/* Top Face */}
                <path d={topD} fill={shades.top} stroke={shades.stroke} strokeWidth="0.8" />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

// Skeleton Loader
function BentoSkeleton() {
  return (
    <div className="gh-skeleton-container" aria-hidden="true">
      <div className="gh-skeleton-header animate-pulse">
        <div className="gh-skeleton-line short" />
        <div className="gh-skeleton-line medium" />
      </div>
      <div className="gh-skeleton-grid animate-pulse">
        {Array.from({ length: 42 }).map((_, i) => (
          <div key={i} className="gh-skeleton-col">
            {Array.from({ length: 7 }).map((_, j) => (
              <div key={j} className="gh-skeleton-cell" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
