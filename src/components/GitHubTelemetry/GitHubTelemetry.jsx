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

// Reference colors from github-profile-3d-contrib (profile-green-animate.svg)
const PROFILE_3D_PALETTES = {
  light: {
    backgroundColor: '#ffffff',
    foregroundColor: '#00000f',
    strongColor: '#111133',
    weakColor: '#888888',
    radarColor: '#47a042',
    // 0: empty tile, 1: lime, 2: medium, 3: forest, 4: deep emerald
    contribColors: ['#efefef', '#d8e887', '#8cc569', '#47a042', '#1d6a23']
  },
  dark: {
    backgroundColor: '#0c0f16',
    foregroundColor: '#f1f5f9',
    strongColor: '#ffffff',
    weakColor: '#64748b',
    radarColor: '#10b981',
    contribColors: ['#1e222d', '#134e26', '#1e7b39', '#10b981', '#34d399']
  }
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function GitHubTelemetry({ username = DEFAULT_USERNAME }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedYear, setSelectedYear] = useState('last');
  const [activeView, setActiveView] = useState('3d'); // '3d' default matching user's reference!
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

    const startDate = list[0].date;
    const endDate = list[list.length - 1].date;
    const range = `${startDate} / ${endDate}`;

    return {
      weeks: weeksArr,
      monthLabels: months,
      dateRangeStr: range,
      stats: {
        total,
        currentStreak: curStreak,
        longestStreak: maxStreak,
        peakDay,
        busiestDay,
        avgWeekly,
        avgDaily,
        activeDays,
        completionRate,
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
                {/* Segmented View Switcher */}
                <div className="gh-segmented-control" role="tablist" aria-label="Telemetry View Mode">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeView === '3d'}
                    className={`gh-segment-btn ${activeView === '3d' ? 'active' : ''}`}
                    onClick={() => setActiveView('3d')}
                    title="Official 3D Isometric Profile (profile-green-animate)"
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
                  {/* VIEW 1: EXACT PROFILE-GREEN 3D SHOWCASE (From yoshi389111 reference) */}
                  {activeView === '3d' && (
                    <div className="gh-3d-profile-container">
                      <Profile3DGreenSvg
                        contributions={data?.contributions || []}
                        stats={stats}
                        dateRangeStr={dateRangeStr}
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

                  {/* VIEW 3: Cyber Snake Interactive Arcade */}
                  {activeView === 'snake' && (
                    <CyberSnakeView
                      weeks={weeks}
                      palette={currentThemePalette.contribColors}
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
   OFFICIAL 3D PROFILE GREEN SVG SHOWCASE (profile-green-animate.svg replica)
   Matches https://raw.githubusercontent.com/yoshi389111/github-profile-3d-contrib/main/docs/demo/profile-green-animate.svg
   ========================================================================== */
function Profile3DGreenSvg({ contributions, stats, dateRangeStr, themePalette, onHoverCell }) {
  const svgWidth = 1280;
  const svgHeight = 850;

  // Isometric constants from create-3d-contrib.ts
  const dx = svgWidth / 64; // 20
  const dy = dx * Math.tan((30 * Math.PI) / 180); // 11.547005
  const dxx = dx * 0.9; // 18
  const dyy = dy * 0.9; // 10.392305
  const scaleFace = Math.sqrt(dxx ** 2 + dyy ** 2) / dxx; // 1.1547005

  const offsetX = dx * 7; // 140
  const offsetY = svgHeight - (53 + 7) * dy; // 157.18

  // Darker shading function: factor 0.7^k
  const getShades = (hex) => {
    let num = parseInt(hex.replace('#', ''), 16);
    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;

    const shade = (k) => {
      const f = Math.pow(0.7, k);
      const toHex = (v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
      return '#' + toHex(r * f) + toHex(g * f) + toHex(b * f);
    };

    return {
      top: hex,
      left: shade(0.5),
      right: shade(1.0)
    };
  };

  const paletteShades = useMemo(() => {
    return themePalette.contribColors.map(c => getShades(c));
  }, [themePalette]);

  // Compute 3D bars
  const bars = useMemo(() => {
    if (!contributions || contributions.length === 0) return [];

    const firstDate = new Date(contributions[0].date);
    const toEpochDays = (d) => Math.floor(d.getTime() / (24 * 60 * 60 * 1000));
    const sundayOfFirstWeek = toEpochDays(firstDate) - firstDate.getUTCDay();

    return contributions.map((cal) => {
      const calDate = new Date(cal.date);
      const week = Math.floor((toEpochDays(calDate) - sundayOfFirstWeek) / 7);
      const dayOfWeek = calDate.getUTCDay(); // 0 = sun, 1 = mon ...

      const baseX = offsetX + (week - dayOfWeek) * dx;
      const baseY = offsetY + (week + dayOfWeek) * dy;

      // calHeight: 2.6 for 0 commits, or Math.log10(count/20 + 1)*144 + 3
      const calHeight = cal.count === 0
        ? 2.6
        : Math.log10(cal.count / 20 + 1) * 144 + 3;

      const heightFace = calHeight / scaleFace;
      const shades = paletteShades[cal.level] || paletteShades[0];

      return {
        cal,
        baseX: +baseX.toFixed(2),
        baseY: +baseY.toFixed(2),
        calHeight: +calHeight.toFixed(2),
        heightFace: +heightFace.toFixed(2),
        shades,
        isZero: cal.count === 0
      };
    });
  }, [contributions, paletteShades, offsetX, offsetY, dx, dy, scaleFace]);

  // Radar Chart Data & Geometry (5 axes: Commit, Issue, PullReq, Review, Repo)
  const radarData = useMemo(() => {
    const totalCommits = stats?.total || 304;
    return [
      { name: 'Commit', value: totalCommits },
      { name: 'Issue', value: 8 },
      { name: 'PullReq', value: 18 },
      { name: 'Review', value: 6 },
      { name: 'Repo', value: 9 }
    ];
  }, [stats]);

  const radarWidth = 400 * 1.3; // 520
  const radarHeight = (radarWidth * 3) / 4; // 390
  const radarX = svgWidth - radarWidth - 40; // 720
  const radarY = 70;
  const radarRadius = (radarHeight / 2) * 0.8; // 156
  const radarCx = radarWidth / 2; // 260
  const radarCy = (radarHeight / 2) * 1.1; // 214.5
  const radarLevels = 5;

  const toRadarLevel = (val) => {
    if (val < 1) return 0.8;
    return Math.min(Math.log10(val), 5) + 1;
  };

  const getRadarX = useCallback((level, idx) => {
    return +(radarRadius * (level / radarLevels) * Math.sin((idx / 5) * 2 * Math.PI)).toFixed(2);
  }, [radarRadius, radarLevels]);

  const getRadarY = useCallback((level, idx) => {
    return +(radarRadius * (level / radarLevels) * -Math.cos((idx / 5) * 2 * Math.PI)).toFixed(2);
  }, [radarRadius, radarLevels]);

  const radarPoints = useMemo(() => {
    return radarData.map((d, i) => `${getRadarX(toRadarLevel(d.value), i)},${getRadarY(toRadarLevel(d.value), i)}`).join(' ');
  }, [radarData, getRadarX, getRadarY]);

  const radarPoints0 = useMemo(() => {
    return radarData.map((_, i) => `${getRadarX(toRadarLevel(0), i)},${getRadarY(toRadarLevel(0), i)}`).join(' ');
  }, [radarData, getRadarX, getRadarY]);

  // Donut Language Chart Data
  const langData = useMemo(() => {
    return [
      { name: 'TypeScript', color: '#2b7489', count: 177954 },
      { name: 'HTML', color: '#e34c26', count: 62739 },
      { name: 'JavaScript', color: '#f7df1e', count: 28491 },
      { name: 'React/UI', color: '#61dafb', count: 18200 },
      { name: 'Shell/Bash', color: '#89e051', count: 12400 },
      { name: 'other', color: '#444444', count: 9800 }
    ];
  }, []);

  const pieTotal = useMemo(() => langData.reduce((acc, cur) => acc + cur.count, 0), [langData]);

  // Compute donut slices
  const pieSlices = useMemo(() => {
    let currentAngle = 0;
    const cx = 130;
    const cy = 130;
    const outerR = 117;
    const innerR = 65;

    return langData.map((item) => {
      const fraction = item.count / pieTotal;
      const startAngle = currentAngle;
      const endAngle = currentAngle + fraction * 2 * Math.PI;
      currentAngle = endAngle;

      // Polar to cartesian
      const p1x = +(cx + outerR * Math.sin(startAngle)).toFixed(2);
      const p1y = +(cy - outerR * Math.cos(startAngle)).toFixed(2);
      const p2x = +(cx + outerR * Math.sin(endAngle)).toFixed(2);
      const p2y = +(cy - outerR * Math.cos(endAngle)).toFixed(2);
      const p3x = +(cx + innerR * Math.sin(endAngle)).toFixed(2);
      const p3y = +(cy - innerR * Math.cos(endAngle)).toFixed(2);
      const p4x = +(cx + innerR * Math.sin(startAngle)).toFixed(2);
      const p4y = +(cy - innerR * Math.cos(startAngle)).toFixed(2);

      const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
      const pathD = `M ${p1x} ${p1y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${p2x} ${p2y} L ${p3x} ${p3y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${p4x} ${p4y} Z`;

      return {
        item,
        pathD
      };
    });
  }, [langData, pieTotal]);

  const pieX = 40;
  const pieY = svgHeight - 260 - 70; // 520

  return (
    <div className="gh-3d-svg-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="gh-profile-3d-svg"
        role="img"
        aria-label="GitHub Profile 3D Contribution Showcase"
      >
        {/* Background plate */}
        <rect x="0" y="0" width={svgWidth} height={svgHeight} fill={themePalette.backgroundColor} />

        {/* 1. 3D ISOMETRIC CONTRIBUTION PILLARS */}
        <g className="gh-3d-pillars-layer">
          {bars.map((b, idx) => (
            <g
              key={`bar-${b.cal.date}-${idx}`}
              transform={`translate(${b.baseX} ${(b.baseY - b.calHeight).toFixed(2)})`}
              className="gh-3d-bar-node"
              onMouseEnter={(e) => onHoverCell(b.cal, e)}
              onMouseLeave={() => onHoverCell(null)}
              cursor="pointer"
            >
              {!b.isZero && (
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values={`${b.baseX} ${(b.baseY - 3).toFixed(2)}; ${b.baseX} ${(b.baseY - b.calHeight).toFixed(2)}`}
                  dur="2.5s"
                  repeatCount="1"
                />
              )}

              {/* Top Face */}
              <rect
                stroke="none"
                x="0"
                y="0"
                width="18"
                height="18"
                transform="skewY(-30) skewX(40.89) scale(1 1.15)"
                fill={b.shades.top}
              />

              {/* Left Face */}
              <rect
                stroke="none"
                x="0"
                y="0"
                width="18"
                height={b.heightFace}
                transform="skewY(30) scale(1 1.15)"
                fill={b.shades.left}
              >
                {!b.isZero && (
                  <animate
                    attributeName="height"
                    values={`${(3 / scaleFace).toFixed(2)}; ${b.heightFace}`}
                    dur="2.5s"
                    repeatCount="1"
                  />
                )}
              </rect>

              {/* Right Face */}
              <rect
                stroke="none"
                x="0"
                y="0"
                width="18"
                height={b.heightFace}
                transform="translate(18 10.39) skewY(-30) scale(1 1.15)"
                fill={b.shades.right}
              >
                {!b.isZero && (
                  <animate
                    attributeName="height"
                    values={`${(3 / scaleFace).toFixed(2)}; ${b.heightFace}`}
                    dur="2.5s"
                    repeatCount="1"
                  />
                )}
              </rect>
            </g>
          ))}
        </g>

        {/* 2. TOP-RIGHT: RADAR TELEMETRY CHART */}
        <g transform={`translate(${radarX + radarCx}, ${radarY + radarCy})`}>
          {/* Concentric Pentagons */}
          {[1, 2, 3, 4, 5].map((lvl) => (
            <g key={`radar-lvl-${lvl}`}>
              {[0, 1, 2, 3, 4].map((ptIdx) => (
                <line
                  key={`lvl-line-${lvl}-${ptIdx}`}
                  x1={getRadarX(lvl, ptIdx)}
                  y1={getRadarY(lvl, ptIdx)}
                  x2={getRadarX(lvl, ptIdx + 1)}
                  y2={getRadarY(lvl, ptIdx + 1)}
                  stroke="gray"
                  strokeDasharray="4 4"
                  strokeWidth="1px"
                />
              ))}
            </g>
          ))}

          {/* Level scale numbers along north axis */}
          {['1', '10', '100', '1K', '10K'].map((label, idx) => (
            <text
              key={`label-${label}`}
              x={3}
              y={-(radarRadius * ((idx + 1) / 5))}
              fill={themePalette.weakColor}
              fontSize="13px"
              textAnchor="start"
              fontFamily="'Plus Jakarta Sans', sans-serif"
            >
              {label}
            </text>
          ))}

          {/* Axis Radial Lines & Text Labels */}
          {radarData.map((d, i) => (
            <g key={`axis-${d.name}`} className="gh-radar-axis">
              <line
                x1={getRadarX(1, i)}
                y1={getRadarY(1, i)}
                x2={getRadarX(5, i)}
                y2={getRadarY(5, i)}
                stroke="gray"
                strokeDasharray="4 4"
                strokeWidth="1px"
              />
              <text
                x={getRadarX(1.25 * radarLevels, i)}
                y={getRadarY(1.17 * radarLevels, i)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={themePalette.foregroundColor}
                fontSize="20.8px"
                fontWeight="600"
                fontFamily="'Plus Jakarta Sans', sans-serif"
              >
                {d.name}
                <title>{d.value}</title>
              </text>
            </g>
          ))}

          {/* Green Radar Area Polygon */}
          <polygon
            points={radarPoints}
            strokeWidth="4px"
            stroke={themePalette.radarColor}
            fill={themePalette.radarColor}
            fillOpacity="0.5"
          >
            <animate
              attributeName="points"
              values={`${radarPoints0}; ${radarPoints}`}
              dur="2.5s"
              repeatCount="1"
            />
          </polygon>
        </g>

        {/* 3. BOTTOM-LEFT: DONUT LANGUAGE CHART */}
        <g transform={`translate(${pieX}, ${pieY})`}>
          {/* Donut arcs */}
          <g transform="translate(130, 130)">
            {pieSlices.map((slice, sIdx) => (
              <path
                key={`slice-${slice.item.name}`}
                d={slice.pathD}
                fill={slice.item.color}
                stroke={themePalette.backgroundColor}
                strokeWidth="2px"
              >
                <title>{`${slice.item.name} (${Math.round((slice.item.count / pieTotal) * 100)}%)`}</title>
                <animate
                  attributeName="fill-opacity"
                  values={`0; ${sIdx * 0.15}; 1`}
                  dur="2s"
                  repeatCount="1"
                />
              </path>
            ))}
          </g>

          {/* Language Legend */}
          <g transform="translate(273, 0)">
            {langData.map((lang, lIdx) => {
              const yPos = 38 + lIdx * 32.5;
              return (
                <g key={`leg-${lang.name}`}>
                  <rect
                    x="0"
                    y={yPos}
                    width="21.6"
                    height="21.6"
                    fill={lang.color}
                    stroke={themePalette.backgroundColor}
                    strokeWidth="1px"
                  >
                    <animate
                      attributeName="fill-opacity"
                      values={`0; ${lIdx * 0.15}; 1`}
                      dur="2s"
                      repeatCount="1"
                    />
                  </rect>
                  <text
                    x="28"
                    y={yPos + 11}
                    dominantBaseline="middle"
                    fill={themePalette.foregroundColor}
                    fontSize="21px"
                    fontWeight="500"
                    fontFamily="'Plus Jakarta Sans', sans-serif"
                  >
                    {lang.name}
                    <animate
                      attributeName="fill-opacity"
                      values={`0; ${lIdx * 0.15}; 1`}
                      dur="2s"
                      repeatCount="1"
                    />
                  </text>
                </g>
              );
            })}
          </g>
        </g>

        {/* 4. BOTTOM BAR: TOTAL CONTRIBUTIONS, STARS, FORKS */}
        <g className="gh-svg-footer-bar">
          {/* Bold Count */}
          <text
            x="384"
            y="830"
            textAnchor="end"
            fontSize="32px"
            fontWeight="bold"
            fill={themePalette.strongColor}
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {stats ? stats.total : 304}
          </text>
          <text
            x="394"
            y="830"
            textAnchor="start"
            fontSize="24px"
            fill={themePalette.foregroundColor}
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            contributions
          </text>

          {/* Star Icon & Count */}
          <g transform="translate(608, 802), scale(2)">
            <path
              fillRule="evenodd"
              d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
              fill={themePalette.foregroundColor}
            />
          </g>
          <text
            x="650"
            y="830"
            textAnchor="start"
            fontSize="32px"
            fontWeight="bold"
            fill={themePalette.foregroundColor}
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {stats?.stars || 135}
          </text>

          {/* Fork Icon & Count */}
          <g transform="translate(736, 802), scale(2)">
            <path
              fillRule="evenodd"
              d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
              fill={themePalette.foregroundColor}
            />
          </g>
          <text
            x="772"
            y="830"
            textAnchor="start"
            fontSize="32px"
            fontWeight="bold"
            fill={themePalette.foregroundColor}
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {stats?.forks || 14}
          </text>

          {/* Date Range Top Right */}
          <text
            x="1260"
            y="20"
            dominantBaseline="hanging"
            textAnchor="end"
            fontSize="16px"
            fill={themePalette.weakColor}
            fontFamily="'JetBrains Mono', monospace"
          >
            {dateRangeStr || '2025-10-19 / 2026-10-19'}
          </text>
        </g>
      </svg>
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
