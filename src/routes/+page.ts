import type { PageLoad } from './$types';

const buildTimestamp = new Date().toISOString();

export const load: PageLoad = () => ({
  lastUpdated: buildTimestamp
});
