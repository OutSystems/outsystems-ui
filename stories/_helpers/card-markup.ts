import { cls, backgroundClass, lightTextClass } from './lowcode';
import { demoIcon } from './demo-icons';

const CARD_IMG = '/assets/placeholder-card.svg';
const CARD_BACKGROUND_IMG = '/assets/card-background-concert.jpg';
const DEMO_WRAP = 'display:flex;justify-content:center;width:100%;';
const SECTIONED_LOFT_IMG = '/assets/card-sectioned-loft.jpg';
const SECTIONED_PROFILE_IMG = '/assets/card-sectioned-profile.jpg';
const SECTIONED_TRAVEL_IMG = '/assets/card-sectioned-travel.jpg';
const SECTIONED_AUTHOR_IMG = '/assets/card-sectioned-author.jpg';

function cardBackgroundPhotoLayer(src = CARD_BACKGROUND_IMG, alt = ''): string {
	return `<div class="card-background-image"><img src="${src}" alt="${alt}" /></div>`;
}

function cardBackgroundColorFillLayer(color: string): string {
	return `<div class="card-background-image"><div class="${cls(`background-${color}`)}" style="width:100%;height:100%;"></div></div>`;
}

function cardBackgroundColorLayer(color = 'primary'): string {
	return `<div class="${cls('card-background-color', color && `background-${color}`)}"></div>`;
}

export function basicCardMarkup(usePadding = true, extendedClass = ''): string {
	return `<div style="${DEMO_WRAP}"><div class="${cls('card', !usePadding && 'padding-none', extendedClass)}" style="max-width:320px;width:100%;">A simple card surface with border, radius, and padding.</div></div>`;
}

export function sectionedCardMarkup({
	usePadding = true,
	isVertical = true,
	imagePadding = true,
	extendedClass = '',
}: {
	usePadding?: boolean;
	isVertical?: boolean;
	imagePadding?: boolean;
	extendedClass?: string;
}): string {
	const cardStyle = `max-width:${isVertical ? 320 : 480}px;width:100%;`;

	return `<div style="${DEMO_WRAP}"><div class="${cls('card', 'card-sectioned', isVertical ? 'flex-direction-column' : 'flex-direction-row', !usePadding && 'padding-none', extendedClass)}" style="${cardStyle}">
		<div class="${cls('card-image', !imagePadding && 'padding-none')}"><img src="${CARD_IMG}" alt="Personal plan" /></div>
		<div class="card-sectioned-top flex-direction-column">
			<div class="card-title">Hire our personal plan</div>
			<div class="card-content">Take control with a plan made for you — manage everything in one place.</div>
			<div class="card-bottom"><a href="#">Simulate Loan</a></div>
		</div>
	</div></div>`;
}

export function propertySectionedCardMarkup({
	usePadding = true,
	isVertical = true,
	imagePadding = false,
	extendedClass = '',
}: {
	usePadding?: boolean;
	isVertical?: boolean;
	imagePadding?: boolean;
	extendedClass?: string;
} = {}): string {
	const activeTag = `<div class="${cls('tag', 'tag-small', 'border-radius-rounded', backgroundClass('green', true), lightTextClass('green'), 'OSInline')}">Active</div>`;
	const cardStyle = `max-width:${isVertical ? 360 : 560}px;width:100%;`;

	return `<div style="${DEMO_WRAP}"><div class="${cls('card', 'card-sectioned', isVertical ? 'flex-direction-column' : 'flex-direction-row', !usePadding && 'padding-none', 'card-sectioned-demo-property', extendedClass)}" style="${cardStyle}">
		<div class="${cls('card-image', !imagePadding && 'padding-none')}">
			<img src="${SECTIONED_LOFT_IMG}" alt="Karra Loft living room" />
			<div class="card-sectioned-demo-property__status">${activeTag}</div>
		</div>
		<div class="card-sectioned-top flex-direction-column">
			<div class="card-sectioned-demo-property__header">
				<div>
					<div class="card-title">Karra Loft</div>
					<div class="card-sectioned-demo-property__location">Canada, Vancouver</div>
				</div>
				<div class="card-sectioned-demo-property__price">
					<span class="card-sectioned-demo-property__price-label">Property price</span>
					<span class="card-sectioned-demo-property__price-value">$300,00</span>
				</div>
			</div>
			<div class="card-content">
				<div class="separator separator-horizontal card-sectioned-demo-property__divider" role="presentation"></div>
				<div class="card-sectioned-demo-property__stats" role="list">
					<span class="card-sectioned-demo-property__stat" role="listitem">${demoIcon('bed')}<span>3</span></span>
					<span class="card-sectioned-demo-property__stat" role="listitem">${demoIcon('bath', 'bathtub')}<span>2</span></span>
					<span class="card-sectioned-demo-property__stat" role="listitem">${demoIcon('square', 'bounding-box')}<span>325</span></span>
					<span class="card-sectioned-demo-property__stat" role="listitem">${demoIcon('car')}<span>1</span></span>
				</div>
			</div>
		</div>
	</div></div>`;
}

/** Profile card — UsePadding + ImagePadding so the photo sits inset. */
export function profileSectionedCardMarkup(extendedClass = ''): string {
	const cardStyle = 'max-width:320px;width:100%;';

	return `<div style="${DEMO_WRAP}"><div class="${cls('card', 'card-sectioned', 'flex-direction-column', 'card-sectioned-demo-profile', extendedClass)}" style="${cardStyle}">
		<div class="card-image">
			<img src="${SECTIONED_PROFILE_IMG}" alt="Maya Chen" />
		</div>
		<div class="card-sectioned-top flex-direction-column">
			<div class="card-title">Maya Chen</div>
			<div class="card-content">Product Designer who focuses on simplicity &amp; usability.</div>
			<div class="card-bottom">
				<div class="card-sectioned-demo-profile__meta" role="list">
					<span class="card-sectioned-demo-profile__stat" role="listitem">${demoIcon('user')}<span>312</span></span>
					<span class="card-sectioned-demo-profile__stat" role="listitem">${demoIcon('images', 'images')}<span>48</span></span>
				</div>
				<button data-button class="btn btn-small" type="button"><span>Follow</span></button>
			</div>
		</div>
	</div></div>`;
}

/** Horizontal article card — UsePadding True, ImagePadding False, IsVertical False. */
export function articleSectionedCardMarkup(extendedClass = ''): string {
	const cardStyle = 'max-width:560px;width:100%;';
	const avatar = `<div class="avatar avatar-small border-radius-circle" role="img" aria-label="Alex Rivera"><img src="${SECTIONED_AUTHOR_IMG}" alt="Alex Rivera" /></div>`;

	return `<div style="${DEMO_WRAP}"><div class="${cls('card', 'card-sectioned', 'flex-direction-row', 'card-sectioned-demo-article', extendedClass)}" style="${cardStyle}">
		<div class="card-image padding-none">
			<img src="${SECTIONED_TRAVEL_IMG}" alt="Mountain lake landscape" />
		</div>
		<div class="card-sectioned-top flex-direction-column">
			<div class="card-title">Five places worth the detour this summer</div>
			<div class="card-content">
				<div class="separator separator-horizontal" role="presentation"></div>
			</div>
			<div class="card-bottom">
				<div class="card-sectioned-demo-article__author">
					${avatar}
					<div class="card-sectioned-demo-article__author-text">
						<span class="card-sectioned-demo-article__author-name">Alex Rivera</span>
						<span class="card-sectioned-demo-article__author-date">21 Feb 2023</span>
					</div>
				</div>
				<span class="card-sectioned-demo-article__category">Travel</span>
			</div>
		</div>
	</div></div>`;
}

export function imageBackgroundCardMarkup(
	color = 'red',
	minHeight = 200,
	extendedClass = '',
	imageSrc = CARD_BACKGROUND_IMG,
): string {
	return `<div style="${DEMO_WRAP}"><div class="${cls('card-background', extendedClass)}" style="max-width:320px;width:100%;min-height:${minHeight}px;">
		<div class="card-background-content"><div style="text-align:center;"><span class="heading2 text-neutral-0">Summer Nights Live</span><p class="text-neutral-0 margin-top-s">12 Jul · Altice Arena</p></div></div>
		${cardBackgroundPhotoLayer(imageSrc, 'Crowd at an outdoor concert with stage lights')}
		${cardBackgroundColorLayer(color)}
	</div></div>`;
}

export function basicBackgroundCardMarkup(color = 'primary', extendedClass = '', imageColor = 'indigo'): string {
	return `<div style="${DEMO_WRAP}"><div class="${cls('card-background', 'card-background-demo-metrics', extendedClass)}" style="max-width:320px;width:100%;">
		<div class="card-background-content top-left">
			<div class="card-background-demo-metrics__stack text-neutral-0">
				<div class="heading5 text-neutral-0 card-background-demo-metrics__title">Total Sales</div>
				<p class="text-neutral-0 card-background-demo-metrics__subtitle">Increase compared to 6 months earlier.</p>
				<div class="font-size-display text-neutral-0 card-background-demo-metrics__value">460K</div>
				<div class="card-background-demo-metrics__trend text-neutral-0">
					<i class="icon ph ph-trend-up" aria-hidden="true"></i>
					<span>+91%</span>
					<span>+$201.687</span>
				</div>
			</div>
		</div>
		${cardBackgroundColorFillLayer(imageColor)}
		${cardBackgroundColorLayer(color)}
	</div></div>`;
}

export function composedCardMarkup(extendedClass = ''): string {
	return `<div style="${DEMO_WRAP}"><div class="${cls('card', 'card-demo-composition', extendedClass)}" style="max-width:400px;width:100%;">
		<div class="card-demo-composition__header">
			<div>
				<div class="card-demo-composition__title">Invoice</div>
				<div class="card-demo-composition__subtitle">Max Mustermann</div>
			</div>
			<button data-button class="btn btn-small card-demo-composition__icon-btn" type="button" aria-label="Add item">
				<i class="icon ph ph-plus" aria-hidden="true"></i>
			</button>
		</div>
		<div class="card-demo-composition__item">
			<div class="card-demo-composition__item-body">
				<div class="card-demo-composition__item-title">Server Installation</div>
				<div class="card-demo-composition__item-meta">Quantity 1, Unit Price 100.00$</div>
			</div>
			<div class="card-demo-composition__item-price">100.00 €</div>
		</div>
		<div class="card-demo-composition__divider" role="separator" aria-hidden="true"></div>
		<div class="card-demo-composition__row">
			<span class="card-demo-composition__label">Subtotal</span>
			<span>1 450.00 €</span>
		</div>
		<div class="card-demo-composition__row">
			<span class="card-demo-composition__label">Invoice Date</span>
			<span>11:41 PM, Feb 24</span>
		</div>
		<button data-button class="btn card-demo-composition__action" type="button"><span>+ Add Shipping</span></button>
	</div></div>`;
}

export function detailItemMarkup(extendedClass = ''): string {
	return `<div style="${DEMO_WRAP}"><div class="${cls('card', 'card-detail', extendedClass)}" style="max-width:400px;width:100%;">
		<div class="card-detail-left"><div class="avatar avatar-medium border-radius-circle background-indigo" role="img" aria-label="user initials, JD"><span class="OSFillParent">JD</span></div></div>
		<div class="card-detail-center">
			<div class="card-detail-title">Jane Doe</div>
			<div class="card-detail-text">Product designer · Design</div>
		</div>
		<div class="card-detail-right"><div class="tag tag-small border-radius-rounded background-green-lightest OSInline">Active</div></div>
	</div></div>`;
}

export function metricDetailItemMarkup(extendedClass = ''): string {
	return `<div style="${DEMO_WRAP}"><div class="${cls('card', 'card-detail', 'card-detail-demo-metric', extendedClass)}" style="max-width:400px;width:100%;">
		<div class="card-detail-left">
			<div class="card-detail-demo-metric__icon background-violet-lightest" aria-hidden="true">
				<i class="icon ph ph-ticket text-violet-darker"></i>
			</div>
		</div>
		<div class="card-detail-center">
			<div class="card-detail-title">Tickets sold</div>
			<div class="card-detail-text">Summer Nights Live</div>
		</div>
		<div class="card-detail-right">
			<div class="card-detail-demo-metric__meta">
				<span class="card-detail-demo-metric__value">1,240</span>
			</div>
		</div>
	</div></div>`;
}
