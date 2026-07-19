export type MonitoringCadence = 'daily' | 'weekly' | 'monthly';

export interface MonitoringConfig {
  enabled: boolean;
  cadence: MonitoringCadence;
  browserAlerts: boolean;
  lastChecked: number | null;
  nextCheck: number | null;
  updatedAt: number;
}

const STORAGE_KEY = 'webscan-monitoring';
const CADENCE_DAYS: Record<MonitoringCadence, number> = {
  daily: 1,
  weekly: 7,
  monthly: 30,
};

const normalizeUrl = (url: string) => url.trim().toLowerCase().replace(/\/$/, '');

const defaultConfig = (): MonitoringConfig => ({
  enabled: false,
  cadence: 'weekly',
  browserAlerts: false,
  lastChecked: null,
  nextCheck: null,
  updatedAt: Date.now(),
});

const readAll = (): Record<string, MonitoringConfig> => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

export const getMonitoringConfig = (url: string): MonitoringConfig => ({
  ...defaultConfig(),
  ...(readAll()[normalizeUrl(url)] || {}),
});

export const getNextCheck = (from: number, cadence: MonitoringCadence) =>
  from + CADENCE_DAYS[cadence] * 24 * 60 * 60 * 1000;

export const saveMonitoringConfig = (
  url: string,
  config: Pick<MonitoringConfig, 'enabled' | 'cadence' | 'browserAlerts'>,
  lastChecked?: number | null,
): MonitoringConfig => {
  const key = normalizeUrl(url);
  const current = getMonitoringConfig(key);
  const checkedAt = lastChecked === undefined ? current.lastChecked : lastChecked;
  const nextCheck = config.enabled
    ? getNextCheck(checkedAt || Date.now(), config.cadence)
    : null;
  const saved: MonitoringConfig = {
    ...config,
    lastChecked: checkedAt,
    nextCheck,
    updatedAt: Date.now(),
  };
  const all = readAll();
  all[key] = saved;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return saved;
};

export const recordMonitoringScan = (url: string, checkedAt = Date.now()): MonitoringConfig => {
  const config = getMonitoringConfig(url);
  if (!config.enabled) return config;
  return saveMonitoringConfig(url, config, checkedAt);
};
