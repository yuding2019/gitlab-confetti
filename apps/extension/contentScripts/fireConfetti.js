import { fireworks } from './confetti';

const CACHE_KEY = 'gitlab-confetti';

let FireCache = {};

/** 初始化confetti缓存数据 */
function initFireCache() {
  const json = localStorage.getItem(CACHE_KEY);
  try {
    FireCache = JSON.parse(json) || {};
  } catch (e) {
    FireCache = {};
  }
}

initFireCache();

/** 是否已经放烟花 */
export function isFired(projectId, mergeRequestId) {
  const key = `${projectId}:${mergeRequestId}`;
  return !!FireCache[key];
}

// 放烟花
export function fire(params) {
  const { projectId, mergeRequestId, force } = params;

  if (isFired(projectId, mergeRequestId) && !force) {
    return;
  }

  fireworks();

  const key = `${projectId}:${mergeRequestId}`;
  FireCache[key] = {
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(FireCache));
}
