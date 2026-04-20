// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper {
	// Phase 12 — legacy-to-token lookup tables.
	// Used to append a `--token-*` fallback alongside every legacy `--space-*` / `--color-*` /
	// `--border-radius-*` reference still emitted at runtime by pattern/feature TS.
	// Additive only: the legacy var must remain first in every emitted `var()` chain.
	export abstract class LegacyTokenMap {
		public static readonly ColorTokenMap: Readonly<Record<string, string>> = {
			primary: '--token-semantics-primary-base',
			'primary-hover': '--token-semantics-primary-800',

			'neutral-0': '--token-primitives-neutral-100',
			'neutral-1': '--token-primitives-neutral-200',
			'neutral-2': '--token-primitives-neutral-300',
			'neutral-3': '--token-primitives-neutral-400',
			'neutral-4': '--token-primitives-neutral-500',
			'neutral-5': '--token-primitives-neutral-600',
			'neutral-6': '--token-primitives-neutral-700',
			'neutral-7': '--token-primitives-neutral-800',
			'neutral-8': '--token-primitives-neutral-900',
			'neutral-9': '--token-primitives-neutral-1100',
			'neutral-10': '--token-primitives-neutral-1200',

			error: '--token-semantics-danger-base',
			'error-light': '--token-semantics-danger-100',
			warning: '--token-semantics-warning-base',
			'warning-light': '--token-semantics-warning-100',
			success: '--token-semantics-success-base',
			'success-light': '--token-semantics-success-100',
			info: '--token-semantics-info-base',
			'info-light': '--token-semantics-info-100',
		};

		public static readonly ShapeTokenMap: Readonly<Record<string, string>> = {
			none: '--token-border-radius-0',
			soft: '--token-border-radius-100',
			rounded: '--token-border-radius-full',
		};

		public static readonly SpaceTokenMap: Readonly<Record<string, string>> = {
			none: '--token-scale-0',
			xs: '--token-scale-100',
			s: '--token-scale-200',
			base: '--token-scale-400',
			m: '--token-scale-600',
			l: '--token-scale-800',
			xl: '--token-scale-1000',
			xxl: '--token-scale-1200',
		};
	}
}
