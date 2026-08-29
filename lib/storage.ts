'use client';

const RECENT_TOOLS_KEY = 'devtransform_recent_tools';
const FAVORITE_TOOLS_KEY = 'devtransform_favorite_tools';
const MAX_RECENT = 6;

export function getRecentToolSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_TOOLS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentToolSlug(slug: string): void {
  if (typeof window === 'undefined' || !slug) return;
  try {
    const recents = getRecentToolSlugs().filter((s) => s !== slug);
    recents.unshift(slug);
    localStorage.setItem(
      RECENT_TOOLS_KEY,
      JSON.stringify(recents.slice(0, MAX_RECENT))
    );
  } catch (err) {
    console.error('Failed to save recent tool:', err);
  }
}

export function getFavoriteToolSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITE_TOOLS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteToolSlug(slug: string): boolean {
  if (typeof window === 'undefined' || !slug) return false;
  try {
    const favorites = getFavoriteToolSlugs();
    const index = favorites.indexOf(slug);
    let isFav = false;
    if (index > -1) {
      favorites.splice(index, 1);
      isFav = false;
    } else {
      favorites.push(slug);
      isFav = true;
    }
    localStorage.setItem(FAVORITE_TOOLS_KEY, JSON.stringify(favorites));
    return isFav;
  } catch {
    return false;
  }
}
