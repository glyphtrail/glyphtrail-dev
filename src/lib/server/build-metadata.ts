import { env } from '$env/dynamic/private';

const MS_PER_MINUTE = 60_000;
const SOURCE_DATE_EPOCH_MAX_FUTURE_DRIFT_MS = 5 * MS_PER_MINUTE;
const EPOCH_MILLISECONDS_THRESHOLD = 1_000_000_000_000;

const parseSourceDateEpoch = (value: string | undefined): Date | undefined => {
  if (!value) return undefined;

  const raw = Number.parseInt(value, 10);
  if (!Number.isFinite(raw) || raw <= 0) return undefined;

  const epochMs = raw < EPOCH_MILLISECONDS_THRESHOLD ? raw * 1_000 : raw;
  const date = new Date(epochMs);
  const nowMs = Date.now();

  if (Number.isNaN(date.getTime())) return undefined;
  if (date.getTime() > nowMs + SOURCE_DATE_EPOCH_MAX_FUTURE_DRIFT_MS) return undefined;

  return date;
};

const buildDate = parseSourceDateEpoch(env.SOURCE_DATE_EPOCH) ?? new Date();

export const buildTimestampIso = buildDate.toISOString();
export const buildDateIso = buildTimestampIso.slice(0, 10);
