import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  GitCommit,
  ExternalLink,
  Flame,
  Zap,
  TrendingUp,
  Layers,
  Box,
  Gamepad2,
  RefreshCw,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import './GitHubTelemetry.css';

const DEFAULT_USERNAME = 'DmitzDev';
const GITHUB_PROFILE_URL = `https://github.com/${DEFAULT_USERNAME}`;

// 5-level neon gradient color palettes matching portfolio
const COLOR_PALETTES = {
  dark: [
    'rgba(255, 255, 255, 0.05)', // Level 0: empty
    '#064e3b',                    // Level 1: deep emerald
    '#059669',                    // Level 2: medium emerald
    '#10b981',                    // Level 3: bright neon mint
    '#34d399'                     // Level 4: radiant neon cyan-emerald
  ],
  light: [
    '#e2e8f0',                    // Level 0: subtle slate
    '#a7f3d0',                    // Level 1: light mint
    '#34d399',                    // Level 2: vibrant mint
    '#059669',                    // Level 3: deep emerald
    '#047857'                     // Level 4: high-contrast forest emerald
  ]
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function GitHubTelemetry({ username = DEFAULT_USERNAME }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedYear, setSelectedYear] = useState('last');
  const [activeView, setActiveView] = useState('2d'); // '2d' | '3d' | 'snake'
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
  const { weeks, stats, monthLabels } = useMemo(() => {
    if (!data || !data.contributions || data.contributions.length === 0) {
      return { weeks: [], stats: null, monthLabels: [] };
    }

    const list = data.contributions;
    const total = list.reduce((acc, cur) => acc + cur.count, 0);

    let maxStreak = 0;
    let curStreak = 0;
    let tempStreak = 0;
    let peakDay = { count: 0, date: '', level: 0 };
    const dayOfWeekSums = [0, 0, 0, 0, 0, 0, 0];
    let activeDays = 0;

    list.forEach((item) => {
      const d = new Date(item.date);
      const dayIdx = d.getDay();
      dayOfWeekSums[dayIdx] += item.count;

      if (item.count > 0) {
        activeDays++;
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        tempStreak = 0;
      }

      if (item.count > peakDay.count) {
        peakDay = item;
      }
    });

    // Current streak working backwards from today
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].count > 0) {
        curStreak++;
      } else if (i === list.length - 1) {
        // Today may not have commits yet, allow checking yesterday
        continue;
      } else {
        break;
      }
    }

    const maxDayIdx = dayOfWeekSums.indexOf(Math.max(...dayOfWeekSums));
    const busiestDay = DAY_NAMES[maxDayIdx];
    const avgWeekly = ((total / list.length) * 7).toFixed(1);
    const avgDaily = (total / list.length).toFixed(2);
    const completionRate = Math.round((activeDays / list.length) * 100);

    // Group into 7-day columns (Sunday = row 0, Saturday = row 6)
    const weeksArr = [];
    let currentWeek = [];

    // Pre-pad first week if first contribution day is not Sunday
    const firstDate = new Date(list[0].date);
    const firstDayOfWeek = firstDate.getDay();
    for (let p = 0; p < firstDayOfWeek; p++) {
      currentWeek.push(null);
    }

    const months = [];
    let lastMonth = -1;

    list.forEach((item) => {
      const d = new Date(item.date);
      const m = d.getMonth();

      if (m !== lastMonth && currentWeek.length === 0) {
        months.push({
          label: MONTH_NAMES[m],
          colIndex: weeksArr.length
        });
        lastMonth = m;
      }

      currentWeek.push(item);

      if (currentWeek.length === 7) {
        weeksArr.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksArr.push(currentWeek);
    }

    return {
      weeks: weeksArr,
      monthLabels: months,
      stats: {
        total,
        currentStreak: curStreak,
        longestStreak: maxStreak,
        peakDay,
        busiestDay,
        avgWeekly,
        avgDaily,
        activeDays,
        completionRate
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

  const palette = isDark ? COLOR_PALETTES.dark : COLOR_PALETTES.light;

  return (
    <section id="github-telemetry" className="gh-telemetry-section">
      {/* Ambient background glow */}
      <div className="gh-telemetry-ambient-glow" aria-hidden="true" />

      <div className="gh-telemetry-container">
        {/* Bento Grid Layout (12 Columns) */}
        <div className="gh-bento-grid">
          {/* Main Bento Card: Interactive Heatmap / 3D / Snake */}
          <div className="gh-bento-card gh-bento-main">
            {/* Card Header */}
            <div className="gh-main-header">
              <div className="gh-header-left">
                <div className="gh-live-badge">
                  <span className="gh-pulse-dot" />
                  <span className="gh-badge-text">Live GitHub Activity</span>
                </div>
                <div className="gh-title-group">
                  <h3 className="gh-card-title">Contribution Telemetry</h3>
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
                {/* Segmented View Switcher */}
                <div className="gh-segmented-control" role="tablist" aria-label="Telemetry View Mode">
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
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeView === '3d'}
                    className={`gh-segment-btn ${activeView === '3d' ? 'active' : ''}`}
                    onClick={() => setActiveView('3d')}
                    title="3D Isometric Bar Projection"
                  >
                    <Box size={14} />
                    <span>3D Isometric</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeView === 'snake'}
                    className={`gh-segment-btn ${activeView === 'snake' ? 'active' : ''}`}
                    onClick={() => setActiveView('snake')}
                    title="Interactive Cyber Snake"
                  >
                    <Gamepad2 size={14} />
                    <span>Snake</span>
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
                  {/* VIEW 1: 2D Grid Heatmap */}
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

                                    const cellColor = palette[day.level] || palette[0];
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
                            {palette.map((color, idx) => (
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

                  {/* VIEW 2: 3D Isometric Bar Projection */}
                  {activeView === '3d' && (
                    <IsometricCanvasView
                      weeks={weeks}
                      palette={palette}
                      isDark={isDark}
                    />
                  )}

                  {/* VIEW 3: Cyber Snake Interactive Arcade */}
                  {activeView === 'snake' && (
                    <CyberSnakeView
                      weeks={weeks}
                      palette={palette}
                      isDark={isDark}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Side Bento Card: Live Commit Telemetry Stats */}
          <div className="gh-bento-card gh-bento-side">
            <div className="gh-side-header">
              <div className="gh-side-badge">
                <Sparkles size={13} className="gh-sparkle-icon" />
                <span>Live Metrics</span>
              </div>
              <span className="gh-period-tag">
                {selectedYear === 'last' ? 'Past 365 Days' : selectedYear}
              </span>
            </div>

            {/* Stat Item 1: Total Contributions */}
            <div className="gh-stat-block gh-stat-primary">
              <div className="gh-stat-icon-wrap primary">
                <GitCommit size={20} />
              </div>
              <div className="gh-stat-info">
                <span className="gh-stat-label">Total Contributions</span>
                <div className="gh-stat-value-group">
                  <span className="gh-stat-number">
                    {stats ? stats.total.toLocaleString() : '—'}
                  </span>
                  <span className="gh-stat-unit">commits</span>
                </div>
              </div>
            </div>

            {/* Sub-grid: Streaks */}
            <div className="gh-side-subgrid">
              <div className="gh-stat-card">
                <div className="gh-stat-card-header">
                  <Flame size={16} className="gh-flame-icon" />
                  <span className="gh-stat-sublabel">Current Streak</span>
                </div>
                <div className="gh-stat-card-value">
                  <span className="gh-card-num">{stats ? stats.currentStreak : 0}</span>
                  <span className="gh-card-unit">days</span>
                </div>
              </div>

              <div className="gh-stat-card">
                <div className="gh-stat-card-header">
                  <Zap size={16} className="gh-zap-icon" />
                  <span className="gh-stat-sublabel">Best Streak</span>
                </div>
                <div className="gh-stat-card-value">
                  <span className="gh-card-num">{stats ? stats.longestStreak : 0}</span>
                  <span className="gh-card-unit">days</span>
                </div>
              </div>
            </div>

            {/* Stat Item 3: Velocity & Peak Velocity */}
            <div className="gh-stat-block">
              <div className="gh-stat-icon-wrap velocity">
                <TrendingUp size={18} />
              </div>
              <div className="gh-stat-info">
                <span className="gh-stat-label">Busiest Day & Velocity</span>
                <div className="gh-stat-velocity-details">
                  <span className="gh-velocity-day">{stats ? stats.busiestDay : '—'}</span>
                  <span className="gh-velocity-divider">•</span>
                  <span className="gh-velocity-avg">{stats ? stats.avgWeekly : 0} commits/wk</span>
                </div>
              </div>
            </div>

            {/* Stat Item 4: Peak Single Day */}
            <div className="gh-stat-block">
              <div className="gh-stat-icon-wrap peak">
                <Award size={18} />
              </div>
              <div className="gh-stat-info">
                <span className="gh-stat-label">Single Day Record</span>
                <div className="gh-stat-velocity-details">
                  <span className="gh-velocity-day">
                    {stats?.peakDay?.count ? `${stats.peakDay.count} commits` : '—'}
                  </span>
                  {stats?.peakDay?.date && (
                    <>
                      <span className="gh-velocity-divider">•</span>
                      <span className="gh-velocity-avg">{formatTooltipDate(stats.peakDay.date)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Profile CTA */}
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="gh-profile-cta"
            >
              <span>View Full GitHub Profile</span>
              <ExternalLink size={14} />
            </a>
          </div>
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
   VIEW 2: 3D ISOMETRIC BAR PROJECTION (HTML5 Canvas)
   ========================================================================== */
function IsometricCanvasView({ weeks, palette, isDark }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !weeks || weeks.length === 0) return;
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const width = 860;
    const height = 300;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = '100%';
    canvas.style.height = '300px';

    ctx.scale(dpr, dpr);

    // Isometric projection constants
    const originX = 140;
    const originY = 160;
    const tileW = 12.5;
    const tileH = 6.8;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw ambient grid plane shadow
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(width / 2, originY + 40, 360, 80, 0, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(15, 23, 42, 0.06)';
    ctx.filter = 'blur(16px)';
    ctx.fill();
    ctx.restore();

    // Render columns from back to front (wIdx: 0..weeks.length, row: 0..6)
    weeks.forEach((week, wIdx) => {
      week.forEach((day, rIdx) => {
        if (!day) return;

        // Isometric coordinates
        const x = originX + (wIdx - rIdx * 0.5) * tileW;
        const y = originY + (wIdx * 0.35 + rIdx * 1.05) * tileH;

        // Pillar height
        const barHeight = day.count === 0
          ? 3
          : 6 + Math.min(day.count * 2.8, 38);

        const baseColor = palette[day.level] || palette[0];

        // Draw Left Face
        ctx.beginPath();
        ctx.moveTo(x - tileW * 0.5, y);
        ctx.lineTo(x, y + tileH * 0.5);
        ctx.lineTo(x, y + tileH * 0.5 - barHeight);
        ctx.lineTo(x - tileW * 0.5, y - barHeight);
        ctx.closePath();
        ctx.fillStyle = isDark ? shadeColor(baseColor, -35) : shadeColor(baseColor, -25);
        ctx.fill();

        // Draw Right Face
        ctx.beginPath();
        ctx.moveTo(x, y + tileH * 0.5);
        ctx.lineTo(x + tileW * 0.5, y);
        ctx.lineTo(x + tileW * 0.5, y - barHeight);
        ctx.lineTo(x, y + tileH * 0.5 - barHeight);
        ctx.closePath();
        ctx.fillStyle = isDark ? shadeColor(baseColor, -20) : shadeColor(baseColor, -12);
        ctx.fill();

        // Draw Top Face
        ctx.beginPath();
        ctx.moveTo(x, y - tileH * 0.5 - barHeight);
        ctx.lineTo(x + tileW * 0.5, y - barHeight);
        ctx.lineTo(x, y + tileH * 0.5 - barHeight);
        ctx.lineTo(x - tileW * 0.5, y - barHeight);
        ctx.closePath();
        ctx.fillStyle = baseColor;
        ctx.fill();

        // Top face outline highlight
        ctx.strokeStyle = day.level > 0
          ? (isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.8)')
          : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)');
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Add glow for peak level 4
        if (day.level === 4) {
          ctx.save();
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.restore();
        }
      });
    });
  }, [weeks, palette, isDark]);

  return (
    <div
      ref={containerRef}
      className="gh-3d-viewport"
      onMouseMove={(e) => {
        const rect = containerRef.current.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: normX * 8, y: -normY * 8 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div
        className="gh-3d-stage"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
        }}
      >
        <canvas ref={canvasRef} className="gh-3d-canvas" />
      </div>
      <div className="gh-3d-caption">
        <Box size={14} className="gh-caption-icon" />
        <span>3D Isometric Projection • Elevation maps directly to commit volume</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   VIEW 3: CYBER SNAKE ARCADE VIEW (HTML5 Canvas)
   ========================================================================== */
function CyberSnakeView({ weeks, palette, isDark }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(1);
  const gameStateRef = useRef({
    snake: [
      { c: 5, r: 3 },
      { c: 4, r: 3 },
      { c: 3, r: 3 }
    ],
    direction: { dc: 1, dr: 0 },
    foodIndex: 0,
    particles: []
  });

  const totalCols = weeks.length || 52;
  const totalRows = 7;

  // Flatten active commit coordinates
  const activeTargets = useMemo(() => {
    const targets = [];
    weeks.forEach((week, c) => {
      week.forEach((day, r) => {
        if (day && day.count > 0) {
          targets.push({ c, r, count: day.count, level: day.level });
        }
      });
    });
    return targets;
  }, [weeks]);

  // Restart snake
  const handleRestart = () => {
    gameStateRef.current.snake = [
      { c: 5, r: 3 },
      { c: 4, r: 3 },
      { c: 3, r: 3 }
    ];
    gameStateRef.current.direction = { dc: 1, dr: 0 };
    gameStateRef.current.particles = [];
    setScore(0);
  };

  useEffect(() => {
    let animId;
    let lastTick = 0;
    const interval = 120 / speed;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const width = 860;
    const height = 240;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = '100%';
    canvas.style.height = '240px';

    ctx.scale(dpr, dpr);

    const cellW = (width - 40) / totalCols;
    const cellH = 14;
    const startX = 20;
    const startY = 40;

    const gameLoop = (timestamp) => {
      if (timestamp - lastTick > interval && isPlaying) {
        lastTick = timestamp;

        const state = gameStateRef.current;
        const head = state.snake[0];

        // Autonomous pathfinding toward nearest active commit target
        let bestDir = state.direction;
        if (activeTargets.length > 0) {
          // Find closest target
          let closest = null;
          let minDist = 9999;
          activeTargets.forEach((t) => {
            const dist = Math.abs(t.c - head.c) + Math.abs(t.r - head.r);
            if (dist < minDist && dist > 0) {
              minDist = dist;
              closest = t;
            }
          });

          if (closest) {
            const dc = Math.sign(closest.c - head.c);
            const dr = Math.sign(closest.r - head.r);

            // Favor horizontal or vertical
            if (dc !== 0 && (state.direction.dc === 0 || Math.random() > 0.4)) {
              bestDir = { dc, dr: 0 };
            } else if (dr !== 0) {
              bestDir = { dc: 0, dr };
            }
          }
        }

        // Avoid reversing directly into self
        if (state.snake.length > 1) {
          const nextC = (head.c + bestDir.dc + totalCols) % totalCols;
          const nextR = (head.r + bestDir.dr + totalRows) % totalRows;
          if (nextC === state.snake[1].c && nextR === state.snake[1].r) {
            bestDir = { dc: -bestDir.dr, dr: bestDir.dc };
          }
        }

        state.direction = bestDir;

        const newHead = {
          c: (head.c + state.direction.dc + totalCols) % totalCols,
          r: (head.r + state.direction.dr + totalRows) % totalRows
        };

        // Check if head hit a target
        const hitTarget = activeTargets.find(t => t.c === newHead.c && t.r === newHead.r);
        if (hitTarget) {
          setScore(s => s + hitTarget.count);
          // Spawn neon particles
          for (let p = 0; p < 8; p++) {
            state.particles.push({
              x: startX + newHead.c * cellW + cellW / 2,
              y: startY + newHead.r * (cellH + 4) + cellH / 2,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              life: 1,
              color: palette[hitTarget.level] || '#10b981'
            });
          }
        }

        state.snake.unshift(newHead);
        if (!hitTarget && state.snake.length > 7) {
          state.snake.pop();
        }
      }

      // Render Frame
      ctx.clearRect(0, 0, width, height);

      // Subtle background grid tint
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw static contribution tiles
      weeks.forEach((week, c) => {
        week.forEach((day, r) => {
          if (!day) return;
          const x = startX + c * cellW;
          const y = startY + r * (cellH + 4);

          ctx.fillStyle = palette[day.level] || palette[0];
          drawRoundRect(ctx, x, y, cellW - 2.5, cellH, 3);
          ctx.fill();
        });
      });

      const state = gameStateRef.current;

      // 2. Draw Snake
      state.snake.forEach((segment, idx) => {
        const x = startX + segment.c * cellW;
        const y = startY + segment.r * (cellH + 4);

        if (idx === 0) {
          // Head
          ctx.fillStyle = '#34d399';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 12;
          drawRoundRect(ctx, x - 1, y - 1, cellW + 0.5, cellH + 2, 4);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Cyber Eyes
          ctx.fillStyle = '#064e3b';
          ctx.beginPath();
          ctx.arc(x + cellW * 0.35, y + cellH * 0.45, 1.5, 0, Math.PI * 2);
          ctx.arc(x + cellW * 0.75, y + cellH * 0.45, 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Body segment
          const progress = 1 - idx / state.snake.length;
          ctx.fillStyle = `rgba(16, 185, 129, ${0.4 + progress * 0.5})`;
          drawRoundRect(ctx, x, y, cellW - 2, cellH, 3);
          ctx.fill();
        }
      });

      // 3. Draw & update particles
      state.particles = state.particles.filter(p => p.life > 0);
      state.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [weeks, activeTargets, isPlaying, speed, palette, totalCols, isDark]);

  return (
    <div className="gh-snake-wrapper">
      <div className="gh-snake-controls-bar">
        <div className="gh-snake-score-pill">
          <Gamepad2 size={15} />
          <span>Commits Harvested: <strong>{score}</strong></span>
        </div>

        <div className="gh-snake-actions">
          <button
            type="button"
            className="gh-snake-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause Snake' : 'Play Snake'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            type="button"
            className="gh-snake-btn"
            onClick={handleRestart}
            title="Restart Path"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <div className="gh-speed-selector">
            <button
              type="button"
              className={`gh-speed-tag ${speed === 1 ? 'active' : ''}`}
              onClick={() => setSpeed(1)}
            >
              1x
            </button>
            <button
              type="button"
              className={`gh-speed-tag ${speed === 2 ? 'active' : ''}`}
              onClick={() => setSpeed(2)}
            >
              2x
            </button>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="gh-snake-canvas" />

      <div className="gh-3d-caption">
        <Sparkles size={14} className="gh-caption-icon" />
        <span>Cyber Snake harvests repository commits in real time across the 52-week telemetry grid</span>
      </div>
    </div>
  );
}

// Rounded rectangle helper
function drawRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Lighten/darken hex color helper
function shadeColor(color, percent) {
  if (color.startsWith('rgba')) return color;
  let num = parseInt(color.replace('#', ''), 16);
  let amt = Math.round(2.55 * percent);
  let R = (num >> 16) + amt;
  let B = ((num >> 8) & 0x00FF) + amt;
  let G = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 + (G < 255 ? (G < 1 ? 0 : G) : 255)).toString(16).slice(1);
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
