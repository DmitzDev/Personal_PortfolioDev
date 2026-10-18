import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ExternalLink,
  Layers,
  Box,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  Star,
  GitFork
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import './GitHubTelemetry.css';

const DEFAULT_USERNAME = 'DmitzDev';
const GITHUB_PROFILE_URL = `https://github.com/${DEFAULT_USERNAME}`;
const START_YEAR = 2026; // User started using GitHub in 2026

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

  // Dynamic Year computation starting from START_YEAR (2026) up to current year
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const availableYears = useMemo(() => {
    const years = [];
    const maxYear = Math.max(START_YEAR, currentYear);
    for (let y = maxYear; y >= START_YEAR; y--) {
      years.push(y.toString());
    }
    return years;
  }, [currentYear]);

  // Primary active/latest year (e.g. '2026', or '2027' when year flips)
  const latestYear = availableYears[0];
  // Past years for dropdown (e.g. ['2026'] when in 2027+)
  const pastYears = useMemo(() => availableYears.slice(1), [availableYears]);

  const [selectedYear, setSelectedYear] = useState(latestYear);
  const [activeView, setActiveView] = useState('3d'); // '3d' | '2d'
  const [isSwitching, setIsSwitching] = useState(false);
  const [isSunk, setIsSunk] = useState(true); // Starts sunk, rises smoothly on mount
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const scrollContainerRef = useRef(null);

  const isPastYearSelected = pastYears.includes(selectedYear);

  // Close year dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsYearDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsYearDropdownOpen(false);
      }
    };
    if (isYearDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isYearDropdownOpen]);

  // Initial rising animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSunk(false);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // On mobile screens, auto-scroll to latest contributions on the right
  useEffect(() => {
    if (scrollContainerRef.current && typeof window !== 'undefined' && window.innerWidth < 768) {
      const timer = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isLoading, activeView]);

  // Smooth sinking (3D -> 2D) and rising (2D -> 3D) view switcher
  const handleSwitchView = useCallback((targetView) => {
    if (targetView === activeView || isSwitching) return;

    if (activeView === '3d' && targetView === '2d') {
      // 3D -> 2D: SINK the active 3D pillars first
      setIsSwitching(true);
      setIsSunk(true);

      setTimeout(() => {
        setActiveView('2d');
        setIsSwitching(false);
      }, 250);
    } else if (activeView === '2d' && targetView === '3d') {
      // 2D -> 3D: Switch to 3D with pillars at floor level, then smoothly RISE UP
      setIsSwitching(true);
      setIsSunk(true);
      setActiveView('3d');

      setTimeout(() => {
        setIsSunk(false);
        setTimeout(() => {
          setIsSwitching(false);
        }, 360);
      }, 100);
    }
  }, [activeView, isSwitching]);

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
  const { stats, monthLabels, dateRangeStr } = useMemo(() => {
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
        {/* Main Header (Clean, unscattered Year + View Toggle) */}
        <div className="gh-main-header">
          {/* Left: Dynamic Year Controls (2026+, No Last 12 Mos) */}
          <div className="gh-header-left">
            <div className="gh-period-controls" role="group" aria-label="Contribution Year">
              {/* Primary Year Button (e.g. 2026, or 2027 in 2027) */}
              <button
                type="button"
                className={`gh-year-btn ${selectedYear === latestYear ? 'active' : ''}`}
                onClick={() => {
                  setSelectedYear(latestYear);
                  setIsYearDropdownOpen(false);
                }}
              >
                {latestYear}
              </button>

              {/* Dynamic Past Years Dropdown (Appears when past years like 2026 exist in 2027+) */}
              {pastYears.length > 0 && (
                <div className="gh-year-dropdown-wrap" ref={dropdownRef}>
                  <button
                    type="button"
                    className={`gh-year-btn gh-dropdown-trigger ${isPastYearSelected ? 'active' : ''}`}
                    onClick={() => setIsYearDropdownOpen((prev) => !prev)}
                    aria-expanded={isYearDropdownOpen}
                    aria-haspopup="true"
                  >
                    <span>
                      {isPastYearSelected ? selectedYear : (pastYears.length === 1 ? pastYears[0] : 'Past Years')}
                    </span>
                    <ChevronDown size={13} className={`gh-chevron ${isYearDropdownOpen ? 'open' : ''}`} />
                  </button>

                  {isYearDropdownOpen && (
                    <div className="gh-year-dropdown-menu" role="menu">
                      {pastYears.map((y) => (
                        <button
                          key={y}
                          type="button"
                          role="menuitem"
                          className={`gh-year-dropdown-item ${selectedYear === y ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedYear(y);
                            setIsYearDropdownOpen(false);
                          }}
                        >
                          {y} Contributions
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Segmented View Switcher (3D Isometric and 2D Grid) */}
          <div className="gh-header-controls">
            <div className="gh-segmented-control" role="tablist" aria-label="Telemetry View Mode">
              <button
                type="button"
                role="tab"
                aria-selected={activeView === '3d'}
                className={`gh-segment-btn ${activeView === '3d' ? 'active' : ''}`}
                onClick={() => handleSwitchView('3d')}
                disabled={isSwitching}
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
                onClick={() => handleSwitchView('2d')}
                disabled={isSwitching}
                title="2D Standard Heatmap"
              >
                <Layers size={14} />
                <span>2D Grid</span>
              </button>
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
            <div className="gh-unified-telemetry-container">
              {/* Fixed Stats Summary Bar (STATIONARY while grid is swiped horizontally) */}
              <div className="gh-stats-bar">
                <div className="gh-stats-left">
                  <div className="gh-stats-count-wrap">
                    <span className="gh-stats-count">{stats ? stats.total : 0}</span>
                    <span className="gh-stats-label">contributions</span>
                  </div>

                  <div className="gh-stats-badges">
                    <span className="gh-stats-badge" title="Stars">
                      <Star size={13} className="gh-badge-icon star-icon" />
                      <span>{stats?.stars ?? 135}</span>
                    </span>
                    <span className="gh-stats-badge" title="Forks">
                      <GitFork size={13} className="gh-badge-icon fork-icon" />
                      <span>{stats?.forks ?? 14}</span>
                    </span>
                  </div>
                </div>

                <div className="gh-stats-daterange">
                  <span>{dateRangeStr || `${selectedYear}-01-01 / ${selectedYear}-12-31`}</span>
                </div>
              </div>

              {/* Horizontally Scrollable Grid Container */}
              <div className="gh-3d-profile-container" ref={scrollContainerRef}>
                <ProfileTelemetrySvg
                  contributions={data?.contributions || []}
                  monthLabels={monthLabels}
                  themePalette={currentThemePalette}
                  activeView={activeView}
                  isSunk={isSunk}
                  onHoverCell={(cell, e) => {
                    if (!cell || (activeView === '3d' && isSunk)) {
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

              {/* Footer: @DmitzDev link on the Left, Legend on the Right */}
              <div className="gh-heatmap-footer">
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
   UNIFIED TELEMETRY SHOWCASE (REALISTIC 3D ISOMETRIC PRISMS + 2D GRID)
   Solid, complete 3D boxes with mathematically aligned front, right & top faces
   ========================================================================== */
function ProfileTelemetrySvg({
  contributions,
  monthLabels,
  themePalette,
  onHoverCell,
  activeView,
  isSunk
}) {
  const svgWidth = 1160;
  const svgHeight = 180;

  // Geometry: realistic, mathematically solid isometric prisms
  const stepX = 19.5; // horizontal step between week columns
  const stepY = 15; // depth step between 3D rows
  const skewX = 4; // 3D slant
  const wCell = 15.5; // cell width
  const dDepth = 4.0; // 3D depth in X (wCell + dDepth = 19.5 exact match to stepX)
  const hDepth = 7.5; // 3D depth in Y

  const offsetX = 58;
  const offsetY = 56;

  // Shading for realistic solid 3D faces (top illuminated, front medium, right shadow)
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
        stroke: shade(0.55)
      };
    };

    return themePalette.contribColors.map((c, idx) => getShades(c, idx));
  }, [themePalette]);

  // Compute 3D and 2D bars
  const bars = useMemo(() => {
    if (!contributions || contributions.length === 0) return [];

    const firstDate = new Date(contributions[0].date);
    const toEpochDays = (d) => Math.floor(d.getTime() / (24 * 60 * 60 * 1000));
    const sundayOfFirstWeek = toEpochDays(firstDate) - firstDate.getUTCDay();

    const items = contributions.map((cal) => {
      const calDate = new Date(cal.date);
      const week = Math.floor((toEpochDays(calDate) - sundayOfFirstWeek) / 7);
      const dayOfWeek = calDate.getUTCDay(); // 0 = sun, 1 = mon ...

      // 3D coordinates
      const x3d = offsetX + week * stepX - dayOfWeek * skewX;
      const y3d = offsetY + dayOfWeek * stepY;

      // 2D coordinates (aligned horizontally to weeks)
      const x2d = offsetX + week * stepX;
      const y2d = 36 + dayOfWeek * 17.5;

      // 3D pillar height (0 commits = flat floor; >0 commits = rising solid pillar)
      const h = cal.count === 0
        ? 0
        : Math.min(48, Math.log10(cal.count / 8 + 1) * 34 + 10);

      const shades = paletteShades[cal.level] || paletteShades[0];

      return {
        cal,
        week,
        dayOfWeek,
        x: +x3d.toFixed(1),
        y: +y3d.toFixed(1),
        x2d: +x2d.toFixed(1),
        y2d: +y2d.toFixed(1),
        h: +h.toFixed(1),
        shades,
        isZero: cal.count === 0
      };
    });

    // Sort by dayOfWeek ascending (Sunday/0 at back to Saturday/6 at front), then week for 3D occlusion
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
        className={`gh-profile-3d-svg ${isSunk ? 'gh-3d-svg-sunk' : ''}`}
        role="img"
        aria-label="GitHub Profile Contribution Telemetry Showcase"
      >
        {/* Month Labels along top (Shared across 2D & 3D) */}
        <g className="gh-months-layer">
          {monthLabels.map((m, i) => (
            <text
              key={`m-${m.label}-${i}`}
              x={offsetX + m.colIndex * stepX}
              y={20}
              fontSize="12px"
              fontWeight="600"
              fill={themePalette.weakColor}
              fontFamily="'JetBrains Mono', monospace"
            >
              {m.label}
            </text>
          ))}
        </g>

        {/* 3D WEEKDAY LABELS */}
        <g className={`gh-3d-weekdays-layer ${activeView === '3d' ? 'gh-layer-active' : 'gh-layer-inactive'}`}>
          {[
            { label: 'Mon', day: 1 },
            { label: 'Wed', day: 3 },
            { label: 'Fri', day: 5 }
          ].map((w) => (
            <text
              key={`3d-${w.label}`}
              x={offsetX - w.day * skewX - 10}
              y={offsetY + w.day * stepY + 4}
              textAnchor="end"
              fontSize="11px"
              fontWeight="500"
              fill={themePalette.weakColor}
              fontFamily="'JetBrains Mono', monospace"
            >
              {w.label}
            </text>
          ))}
        </g>

        {/* 2D WEEKDAY LABELS */}
        <g className={`gh-2d-weekdays-layer ${activeView === '2d' ? 'gh-layer-active' : 'gh-layer-inactive'}`}>
          {[
            { label: 'Mon', day: 1 },
            { label: 'Wed', day: 3 },
            { label: 'Fri', day: 5 }
          ].map((w) => (
            <text
              key={`2d-${w.label}`}
              x={offsetX - 12}
              y={36 + w.day * 17.5 + 12}
              textAnchor="end"
              fontSize="11px"
              fontWeight="500"
              fill={themePalette.weakColor}
              fontFamily="'JetBrains Mono', monospace"
            >
              {w.label}
            </text>
          ))}
        </g>

        {/* LAYER 1: 3D ISOMETRIC TILES & SOLID REALISTIC PILLARS */}
        <g className={`gh-3d-pillars-layer ${activeView === '3d' ? 'gh-layer-active' : 'gh-layer-inactive'}`}>
          {bars.map((b, idx) => {
            const { x, y, h, shades, isZero } = b;

            const xRight = +(x + wCell).toFixed(1);
            const xBackLeft = +(x + dDepth).toFixed(1);
            const xBackRight = +(x + wCell + dDepth).toFixed(1);
            const yBack = +(y - hDepth).toFixed(1);

            // Ground floor isometric tile path (seamlessly aligned)
            const groundTileD = `M ${x} ${y} L ${xRight} ${y} L ${xBackRight} ${yBack} L ${xBackLeft} ${yBack} Z`;

            // Zero-commit day: render a static ground tile
            if (isZero) {
              return (
                <g
                  key={`tile-${b.cal.date}-${idx}`}
                  className="gh-3d-tile-node"
                  onMouseEnter={(e) => onHoverCell(b.cal, e)}
                  onMouseLeave={() => onHoverCell(null)}
                  cursor="pointer"
                >
                  <path d={groundTileD} fill={shades.top} stroke={shades.stroke} strokeWidth="0.8" />
                </g>
              );
            }

            // Active commit day: smoothly animated realistic 3D prism
            const delay = Math.round((b.week / 52) * 80);
            const yTop = +(y - h).toFixed(1);
            const yBackTop = +(yTop - hDepth).toFixed(1);

            // Front Face: vertical wall directly facing the camera
            const frontD = `M ${x} ${yTop} L ${xRight} ${yTop} L ${xRight} ${y} L ${x} ${y} Z`;

            // Right Face: side wall receding into depth to the right
            const rightD = `M ${xRight} ${yTop} L ${xBackRight} ${yBackTop} L ${xBackRight} ${yBack} L ${xRight} ${y} Z`;

            // Top Face at ground level (rises seamlessly via translateY)
            const topPathAtGround = groundTileD;

            return (
              <g
                key={`bar-${b.cal.date}-${idx}`}
                className="gh-3d-bar-node gh-stagger-pillar"
                style={{ '--pillar-delay': `${delay}ms` }}
                onMouseEnter={(e) => onHoverCell(b.cal, e)}
                onMouseLeave={() => onHoverCell(null)}
                cursor="pointer"
              >
                {/* Ground shadow */}
                <path d={groundTileD} fill="rgba(0, 0, 0, 0.22)" stroke="none" />

                {/* Front Face (85% tone) */}
                <path
                  d={frontD}
                  fill={shades.front}
                  stroke={shades.stroke}
                  strokeWidth="0.8"
                  className="gh-pillar-wall"
                  style={{
                    transformOrigin: `${x}px ${y}px`,
                    transform: isSunk ? 'scaleY(0)' : 'scaleY(1)'
                  }}
                />

                {/* Right Face (68% shadow tone) */}
                <path
                  d={rightD}
                  fill={shades.right}
                  stroke={shades.stroke}
                  strokeWidth="0.8"
                  className="gh-pillar-wall"
                  style={{
                    transformOrigin: `${xRight}px ${y}px`,
                    transform: isSunk ? 'scaleY(0)' : 'scaleY(1)'
                  }}
                />

                {/* Top Face (100% vibrant illuminated tone) */}
                <path
                  d={topPathAtGround}
                  fill={shades.top}
                  stroke={shades.stroke}
                  strokeWidth="0.8"
                  className="gh-pillar-top"
                  style={{
                    transform: isSunk ? 'translateY(0px)' : `translateY(-${h}px)`
                  }}
                />
              </g>
            );
          })}
        </g>

        {/* LAYER 2: 2D FLAT GRID CELLS */}
        <g className={`gh-2d-layer ${activeView === '2d' ? 'gh-layer-active' : 'gh-layer-inactive'}`}>
          {bars.map((b, idx) => {
            const { x2d, y2d, cal, shades, isZero } = b;
            return (
              <rect
                key={`cell-2d-${cal.date}-${idx}`}
                x={x2d}
                y={y2d}
                width={15.5}
                height={15.5}
                rx={3.5}
                ry={3.5}
                fill={shades.top}
                stroke={isZero ? shades.stroke : 'none'}
                strokeWidth={isZero ? '0.8' : '0'}
                className={`gh-2d-cell ${cal.level > 0 ? `level-${cal.level}` : 'level-0'}`}
                onMouseEnter={(e) => onHoverCell(cal, e)}
                onMouseLeave={() => onHoverCell(null)}
                cursor="pointer"
              />
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
