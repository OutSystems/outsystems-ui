// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper {
	// Phase 12 — legacy-to-token lookup tables.
	// Every legacy `--space-*` / `--color-*` / `--border-radius-*` reference still
	// emitted at runtime by pattern/feature TS is wrapped in a three-tier fallback
	// chain that mirrors what $token-* SCSS variables compile to:
	//
	//   var(--legacy-*, var(--token-*, <hardcoded-literal>))
	//
	// The literal is the same hex / pixel value baked into _variables.scss by
	// `outsystems-design-tokens`, so the chain still resolves when neither the
	// legacy var nor the --token-* var is defined at :root (the post-Phase-10
	// reality — token vars only appear in :root when a DTE or runtime theme
	// writes them).
	//
	// Additive only: the legacy var must remain first in every emitted chain.
	export interface ITokenFallback {
		readonly fallback: string;
		readonly token: string;
	}

	export abstract class LegacyTokenMap {
		public static readonly ColorTokenMap: Readonly<Record<string, ITokenFallback>> = {
			primary: { token: '--token-semantics-primary-base', fallback: '#105cef' },
			'primary-hover': { token: '--token-semantics-primary-800', fallback: '#0f54da' },

			'neutral-0': { token: '--token-primitives-neutral-100', fallback: '#f3f3f3' },
			'neutral-1': { token: '--token-primitives-neutral-200', fallback: '#eae9e9' },
			'neutral-2': { token: '--token-primitives-neutral-300', fallback: '#e0e0e0' },
			'neutral-3': { token: '--token-primitives-neutral-400', fallback: '#d5d5d5' },
			'neutral-4': { token: '--token-primitives-neutral-500', fallback: '#a2a2a2' },
			'neutral-5': { token: '--token-primitives-neutral-600', fallback: '#8c8c8c' },
			'neutral-6': { token: '--token-primitives-neutral-700', fallback: '#777777' },
			'neutral-7': { token: '--token-primitives-neutral-800', fallback: '#626262' },
			'neutral-8': { token: '--token-primitives-neutral-900', fallback: '#4e4e4e' },
			'neutral-9': { token: '--token-primitives-neutral-1100', fallback: '#292929' },
			'neutral-10': { token: '--token-primitives-neutral-1200', fallback: '#242424' },

			error: { token: '--token-semantics-danger-base', fallback: '#e52929' },
			'error-light': { token: '--token-semantics-danger-100', fallback: '#fde1e1' },
			warning: { token: '--token-semantics-warning-base', fallback: '#ffd600' },
			'warning-light': { token: '--token-semantics-warning-100', fallback: '#fff3d5' },
			success: { token: '--token-semantics-success-base', fallback: '#1ba433' },
			'success-light': { token: '--token-semantics-success-100', fallback: '#e2f9e4' },
			info: { token: '--token-semantics-info-base', fallback: '#105cef' },
			'info-light': { token: '--token-semantics-info-100', fallback: '#e9ecfc' },
		};

		public static readonly ShapeTokenMap: Readonly<Record<string, ITokenFallback>> = {
			none: { token: '--token-border-radius-0', fallback: '0' },
			soft: { token: '--token-border-radius-100', fallback: '4px' },
			rounded: { token: '--token-border-radius-full', fallback: '999px' },
		};

		public static readonly SpaceTokenMap: Readonly<Record<string, ITokenFallback>> = {
			none: { token: '--token-scale-0', fallback: '0' },
			xs: { token: '--token-scale-100', fallback: '4px' },
			s: { token: '--token-scale-200', fallback: '8px' },
			base: { token: '--token-scale-400', fallback: '16px' },
			m: { token: '--token-scale-600', fallback: '24px' },
			l: { token: '--token-scale-800', fallback: '32px' },
			xl: { token: '--token-scale-1000', fallback: '40px' },
			xxl: { token: '--token-scale-1200', fallback: '48px' },
		};

		/**
		 * Build the full `var(<legacy>, var(<token>, <literal>))` chain for a legacy
		 * CSS custom property. If the key isn't in the map, emits just `var(<legacy>)`
		 * — preserves pre-Phase-12 behaviour for unknown keys.
		 *
		 * @param legacyVar e.g. `--border-radius-rounded`
		 * @param entry the matching ITokenFallback from one of the maps above, or undefined
		 */
		public static BuildFallbackChain(legacyVar: string, entry: ITokenFallback | undefined): string {
			if (entry === undefined) {
				return `var(${legacyVar})`;
			}
			return `var(${legacyVar}, var(${entry.token}, ${entry.fallback}))`;
		}

		/**
		 * Read a CSS custom property's computed value, walking the same three-tier
		 * fallback: legacy var → token var → hardcoded literal. Used by Case B
		 * helpers that need the resolved string (not a `var()` expression).
		 *
		 * @param style the CSSStyleDeclaration to read from (typically
		 *              `getComputedStyle(document.documentElement)`)
		 * @param legacyVar e.g. `--color-primary`
		 * @param entry the matching ITokenFallback, or undefined
		 */
		public static ResolveComputedValue(
			style: CSSStyleDeclaration,
			legacyVar: string,
			entry: ITokenFallback | undefined
		): string {
			const legacy = style.getPropertyValue(legacyVar);
			if (legacy !== '') {
				return legacy;
			}
			if (entry === undefined) {
				return '';
			}
			const token = style.getPropertyValue(entry.token);
			return token !== '' ? token : entry.fallback;
		}
	}
}
