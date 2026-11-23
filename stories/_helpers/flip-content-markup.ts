import { cls } from './lowcode';

const DEMO_WRAP = 'display:flex;justify-content:center;width:100%;';

export function flipContentMarkup(idAttr: string): string {
	return `<div style="${DEMO_WRAP}"><div ${idAttr} class="osui-flip-content" style="max-width:280px;width:100%;">
		<div class="osui-flip-content__container">
			<div class="osui-flip-content__container__front">
				<div class="${cls('flip-content-demo-face', 'background-cyan-lightest', 'text-cyan-darker')}">Front — click to flip</div>
			</div>
			<div class="osui-flip-content__container__back">
				<div class="${cls('flip-content-demo-face', 'background-teal-lighter', 'text-teal-darker')}">Back side</div>
			</div>
		</div>
	</div></div>`;
}
