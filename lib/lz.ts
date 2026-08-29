import LZString from 'lz-string';
import { FormatId } from './matrix';

export interface SharedWorkspaceState {
  input: string;
  from: FormatId;
  to: FormatId;
  options?: Record<string, any>;
  v?: number;
}

/**
 * Compresses workspace state into URL-safe encoded string.
 */
export function encodeWorkspaceState(state: SharedWorkspaceState): string {
  try {
    const payload = JSON.stringify({
      ...state,
      v: 1,
    });
    return LZString.compressToEncodedURIComponent(payload);
  } catch (err) {
    console.error('Failed to compress workspace state:', err);
    return '';
  }
}

/**
 * Decompresses encoded string back into workspace state.
 */
export function decodeWorkspaceState(hash: string): SharedWorkspaceState | null {
  try {
    if (!hash) return null;
    const cleanHash = hash.startsWith('#data=')
      ? hash.slice(6)
      : hash.startsWith('#')
      ? hash.slice(1)
      : hash;

    if (!cleanHash) return null;

    const decompressed = LZString.decompressFromEncodedURIComponent(cleanHash);
    if (!decompressed) return null;

    const parsed = JSON.parse(decompressed);
    if (parsed && typeof parsed === 'object' && typeof parsed.input === 'string') {
      return parsed as SharedWorkspaceState;
    }
    return null;
  } catch (err) {
    console.error('Failed to decompress workspace state:', err);
    return null;
  }
}

/**
 * Generates full shareable URL with compressed hash.
 */
export function generateShareUrl(state: SharedWorkspaceState): string {
  if (typeof window === 'undefined') return '';
  const compressed = encodeWorkspaceState(state);
  const origin = window.location.origin;
  const path = `/${state.from}-to-${state.to}/`;
  return `${origin}${path}#data=${compressed}`;
}
