/** Storybook-only illustrations for Blank Slate demos — live in the Icon placeholder. */

export const BLANK_SLATE_EMPTY_PROJECTS_IMG = '/assets/blank-slate-empty-projects.png';
export const BLANK_SLATE_EMPTY_FILES_IMG = '/assets/blank-slate-empty-files.png';

function blankSlateImageIllustration(src: string): string {
	return `<img class="sb-bs-illust-img" src="${src}" alt="" aria-hidden="true" />`;
}

/** Empty-projects illustration (Image widget in the Icon placeholder). */
export function blankSlateEmptyProjectsIllustration(): string {
	return blankSlateImageIllustration(BLANK_SLATE_EMPTY_PROJECTS_IMG);
}

/** Empty-files / no-results illustration (Image widget in the Icon placeholder). */
export function blankSlateEmptyFilesIllustration(): string {
	return blankSlateImageIllustration(BLANK_SLATE_EMPTY_FILES_IMG);
}
