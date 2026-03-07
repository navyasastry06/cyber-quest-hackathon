import { useTheme } from './ThemeContext';

/**
 * Returns a palette of color values based on current dark/light mode.
 * Use these in `style={{ ... }}` props or conditional classNames.
 */
export const useColors = () => {
  const { isDark } = useTheme();

  return {
    isDark,
    // ── Backgrounds ───────────────────────────────────────────────────
    bgPage:     isDark ? '#05060b'              : '#f1f5f9',
    bgCard:     isDark ? '#0d1117'              : '#ffffff',
    bgElevated: isDark ? '#161b22'              : '#f8fafc',
    bgHover:    isDark ? 'rgba(255,255,255,0.04)': 'rgba(0,0,0,0.04)',
    bgInput:    isDark ? '#0d1117'              : '#ffffff',

    // ── Text ──────────────────────────────────────────────────────────
    textPrimary:   isDark ? '#f1f5f9'  : '#0f172a',
    textSecondary: isDark ? '#94a3b8'  : '#475569',
    textMuted:     isDark ? '#475569'  : '#94a3b8',
    textLabel:     isDark ? '#64748b'  : '#64748b',

    // ── Borders ───────────────────────────────────────────────────────
    border:        isDark ? 'rgba(255,255,255,0.07)': 'rgba(0,0,0,0.08)',
    borderStrong:  isDark ? 'rgba(255,255,255,0.12)': 'rgba(0,0,0,0.14)',

    // ── Accents (unchanged between modes) ─────────────────────────────
    blue:    '#3b82f6',
    indigo:  '#6366f1',
    cyan:    '#06b6d4',
    green:   '#10b981',
    yellow:  '#f59e0b',
    red:     '#ef4444',
    purple:  '#a855f7',

    // ── Sidebar ───────────────────────────────────────────────────────
    sidebarBg:     isDark ? '#0a0b10' : '#ffffff',
    sidebarBorder: isDark ? 'rgba(255,255,255,0.06)': 'rgba(0,0,0,0.08)',
    sidebarActive: isDark ? 'rgba(99,102,241,0.15)'  : 'rgba(99,102,241,0.1)',
    sidebarText:   isDark ? '#64748b' : '#6b7280',

    // ── Chart colors (Chart.js) ───────────────────────────────────────
    chartGrid:   isDark ? '#1e293b' : '#e2e8f0',
    chartTick:   isDark ? '#475569' : '#94a3b8',
  };
};
