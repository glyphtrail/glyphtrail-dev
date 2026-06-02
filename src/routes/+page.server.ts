import type { PageServerLoad } from './$types';
import { buildTimestampIso } from '$lib/server/build-metadata';

export const load: PageServerLoad = () => ({
  lastUpdated: buildTimestampIso
});
