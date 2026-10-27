export const CAROUSEL_IMAGE_SLIDES = [
	{ src: '/assets/carousel/carousel-slide-3.jpg', alt: 'Abstract fluid art in pink and blue' },
	{ src: '/assets/carousel/carousel-slide-2.jpg', alt: 'Abstract fluid art in pink, purple and gold' },
	{ src: '/assets/carousel/carousel-slide-4.jpg', alt: 'Abstract fluid art in purple and white' },
	{ src: '/assets/carousel/carousel-slide-5.jpg', alt: 'Abstract watercolor art in blue and coral' },
	{ src: '/assets/carousel/carousel-slide-1.jpg', alt: 'Abstract fluid art in teal, orange and coral' },
] as const;

export function carouselImageSlidesMarkup(): string {
	return CAROUSEL_IMAGE_SLIDES.map(
		({ src, alt }) =>
			`<div class="carousel-demo-slide"><img src="${src}" alt="${alt}" loading="lazy" decoding="async" /></div>`
	).join('');
}
