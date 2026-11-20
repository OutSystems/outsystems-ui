// ROU-13176 level-1 PoC: the "second OutSystems UI bundle on the same page" matrix, today vs S1 (§8.2).
import { expect, test } from '@playwright/test';

const PROLOGUE_WARNING = '[OutSystems UI]';

/**
 * Opens the harness and waits for the Home screen (Host App) to be ready.
 *
 * @param {import('@playwright/test').Page} page The Playwright page
 * @param {{mode: string, host: string, embedded: string, rerunHost?: boolean}} options Harness query parameters
 * @returns {Promise<void>}
 */
async function openHome(page, { mode, host, embedded, rerunHost = false }) {
	const errors = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto(`index.html?mode=${mode}&host=${host}&embedded=${embedded}${rerunHost ? '&rerunHost=1' : ''}`);
	await page.evaluate(() => window.__poc.ready);
	expect(errors, 'no uncaught page errors').toEqual([]);
}

const goTo = (page, screen) => page.evaluate((s) => window.__poc.goTo(s), screen);
const state = (page) => page.evaluate(() => window.__poc.state());
const disposesOf = (s, screen) => s.envelopes.filter((e) => e.screen === screen && e.fn === 'Dispose');
const createsOf = (s, screen) => s.envelopes.filter((e) => e.screen === screen && e.fn === 'Create');
const prologueWarnings = (s) => s.warnings.filter((w) => w.startsWith(PROLOGUE_WARNING));

/**
 * Host 3.0.0 → Embedded 3.2.0 → the Home screen's OnDestroy disposes. Shared by today and pristine.
 *
 * @param {string} mode today or pristine
 */
function expectTodayFailure(mode) {
	test(`${mode}: Host 3.0.0 → Embedded 3.2.0, Home's Dispose fails and body listeners leak`, async ({ page }) => {
		await openHome(page, { mode, host: '3.0.0', embedded: '3.2.0' });
		const { overlap, after } = await goTo(page, 'AccountDetail');
		const s = await state(page);

		expect(overlap.serving).toBe('3.2.0');
		// The 3.2.0 copy re-ran every namespace and recreated the registries empty: Home's instances are gone from them.
		expect(overlap.registries.Sidebar).toEqual(['AcctSidebar']);
		const disposes = disposesOf(s, 'Home');
		expect(disposes).toHaveLength(6);
		for (const d of disposes) {
			expect(d.isSuccess, `${d.api}.Dispose(${d.id})`).toBe(false);
			expect(d.message).toMatch(/was not found/);
		}
		// Body still holds Home's open-sidebar listeners plus a second copy's ButtonsEffect click listener.
		expect(after.listeners.body).toBeGreaterThan(s.baseline.body);
		expect(after.listenerTypes.body).toContain('mousedown');
		expect(s.osLibs).toBeNull();
	});
}

expectTodayFailure('today');
// The same scenario on a build of the unmodified source, to show the SharedState fallback changes nothing today.
expectTodayFailure('pristine');

test('s1: Host 3.0.0 → Embedded 3.2.0, Home Dispose succeeds and body listeners return to baseline', async ({
	page,
}) => {
	await openHome(page, { mode: 's1', host: '3.0.0', embedded: '3.2.0' });
	const { overlap, after } = await goTo(page, 'AccountDetail');
	const s = await state(page);

	// During the overlap 3.2.0 serves and the shared maps hold both screens.
	expect(overlap.serving).toBe('3.2.0');
	expect(overlap.sharedStore.majors['3'].version).toBe('3.2.0');
	expect(overlap.sharedStore.majors['3'].maps['SidebarAPI.map']).toEqual(['HomeSidebar', 'AcctSidebar']);
	expect(overlap.sharedStore.majors['3'].maps['TabsAPI.map']).toEqual(['HomeTabs', 'AcctTabs']);
	expect(overlap.sharedStore.majors['3'].stateKeys).toEqual(
		expect.arrayContaining(['GlobalListenerManager', 'SidebarAPI.map', 'TabsAPI.map'])
	);
	// 3.2.0 API functions disposed the 3.0.0 instances.
	const disposes = disposesOf(s, 'Home');
	expect(disposes).toHaveLength(6);
	for (const d of disposes) {
		expect(d.isSuccess, `${d.api}.Dispose(${d.id})`).toBe(true);
	}
	expect(after.listeners.body).toBe(s.baseline.body);
	// One shared WindowResize listener, now held by the Embedded screen's Tabs only.
	expect(after.listeners.window).toBe(1);
	expect(after.sharedStore.majors['3'].maps['SidebarAPI.map']).toEqual(['AcctSidebar']);
	expect(prologueWarnings(s)).toEqual([]);
	expect(s.infos).toEqual(['[OutSystems UI] 3.0.0 → 3.2.0']);
	// Home's instances were created by 3.0.0 code, AccountDetail's by 3.2.0 code.
	expect(s.instances.map((i) => `${i.id}@${i.codeVersion}`)).toEqual([
		'HomeSidebar@3.0.0',
		'HomeTabs@3.0.0',
		'AcctSidebar@3.2.0',
		'AcctTabs@3.2.0',
	]);
});

test('today: Back to Host, listeners keep accumulating', async ({ page }) => {
	await openHome(page, { mode: 'today', host: '3.0.0', embedded: '3.2.0' });
	const firstHome = (await state(page)).snapshots.at(-1);
	await goTo(page, 'AccountDetail');
	const { after } = await goTo(page, 'Home');
	const s = await state(page);

	// The runtime skips the Host bundle URL it already loaded, so the 3.2.0 copy serves; its Create succeeds only
	// because its own registries never saw the first Home instances.
	expect(after.serving).toBe('3.2.0');
	expect(createsOf(s, 'Home').every((c) => c.isSuccess)).toBe(true);
	expect(after.listeners.body).toBeGreaterThan(firstHome.listeners.body);
	expect(after.listeners.window).toBeGreaterThan(firstHome.listeners.window);
});

// The runtime skips a URL it already ran, so the Host bundle does not run again and 3.2.0 keeps serving.
// This is the Q11/Q12 case of §8.2: under "last loaded wins" the Host App silently runs the Embedded App's revision.
test('s1: Back to Host (Host URL skipped) keeps the shared state and creates with 3.2.0 code', async ({ page }) => {
	await openHome(page, { mode: 's1', host: '3.0.0', embedded: '3.2.0' });
	const firstHome = (await state(page)).snapshots.at(-1);
	await page.evaluate(() => {
		window.__pocStateRef = window.__osLibs.osui.majors['3'].state;
	});
	await goTo(page, 'AccountDetail');
	const { after } = await goTo(page, 'Home');
	const s = await state(page);

	expect(await page.evaluate(() => window.__pocStateRef === window.__osLibs.osui.majors['3'].state)).toBe(true);
	expect(after.serving).toBe('3.2.0');
	expect(
		s.envelopes.every((e) => e.isSuccess),
		JSON.stringify(s.envelopes.filter((e) => !e.isSuccess))
	).toBe(true);
	expect(s.instances.slice(-2).map((i) => `${i.id}@${i.codeVersion}`)).toEqual([
		'HomeSidebar@3.2.0',
		'HomeTabs@3.2.0',
	]);
	expect(after.listeners).toEqual(firstHome.listeners);
	expect(after.sharedStore.majors['3'].maps['SidebarAPI.map']).toEqual(['HomeSidebar']);
});

test('s1: Back to Host when the Host bundle executes again, 3.0.0 takes over again (last loaded wins)', async ({
	page,
}) => {
	await openHome(page, { mode: 's1', host: '3.0.0', embedded: '3.2.0', rerunHost: true });
	const firstHome = (await state(page)).snapshots.at(-1);
	await page.evaluate(() => {
		window.__pocStateRef = window.__osLibs.osui.majors['3'].state;
	});
	await goTo(page, 'AccountDetail');
	const { overlap, after } = await goTo(page, 'Home');
	const s = await state(page);

	expect(s.scripts.map((x) => x.url)).toHaveLength(3);
	expect(prologueWarnings(s)).toEqual([]);
	expect(s.infos).toEqual(['[OutSystems UI] 3.0.0 → 3.2.0', '[OutSystems UI] 3.2.0 → 3.0.0']);
	expect(await page.evaluate(() => window.__pocStateRef === window.__osLibs.osui.majors['3'].state)).toBe(true);
	// Overlap: the shared maps hold AccountDetail's 3.2.0 instances and the new Home's 3.0.0 instances.
	expect(overlap.serving).toBe('3.0.0');
	expect(overlap.sharedStore.majors['3'].maps['SidebarAPI.map']).toEqual(['AcctSidebar', 'HomeSidebar']);
	// The reverse direction: 3.0.0 API functions dispose instances built by 3.2.0 code.
	expect(
		s.envelopes.every((e) => e.isSuccess),
		JSON.stringify(s.envelopes.filter((e) => !e.isSuccess))
	).toBe(true);
	expect(disposesOf(s, 'AccountDetail')).toHaveLength(6);
	expect(s.instances.map((i) => `${i.id}@${i.codeVersion}`)).toEqual([
		'HomeSidebar@3.0.0',
		'HomeTabs@3.0.0',
		'AcctSidebar@3.2.0',
		'AcctTabs@3.2.0',
		'HomeSidebar@3.0.0',
		'HomeTabs@3.0.0',
	]);
	expect(after.serving).toBe('3.0.0');
	expect(after.listeners).toEqual(firstHome.listeners);
	expect(after.sharedStore.majors['3'].maps['SidebarAPI.map']).toEqual(['HomeSidebar']);
});

test('today: Back to Host when the Host bundle executes again, the Embedded screen cannot be disposed', async ({
	page,
}) => {
	await openHome(page, { mode: 'today', host: '3.0.0', embedded: '3.2.0', rerunHost: true });
	await goTo(page, 'AccountDetail');
	const { after } = await goTo(page, 'Home');
	const s = await state(page);

	// Code downgrades to 3.0.0 and the AccountDetail instances become unreachable in turn.
	expect(after.serving).toBe('3.0.0');
	expect(disposesOf(s, 'AccountDetail').every((d) => d.isSuccess === false)).toBe(true);
});

for (const mode of ['today', 's1']) {
	test(`${mode}: Host 3.2.0 → Embedded 3.0.0 (Host ahead, the older copy loads last)`, async ({ page }) => {
		await openHome(page, { mode, host: '3.2.0', embedded: '3.0.0' });
		const { overlap, after } = await goTo(page, 'AccountDetail');
		const s = await state(page);
		const embedded = s.instances.filter((i) => i.screen === 'AccountDetail');

		if (mode === 's1') {
			// Last loaded wins: 3.0.0 takes over in place and keeps the store, so 3.0.0 API functions dispose
			// Home's 3.2.0 instances.
			expect(prologueWarnings(s)).toEqual([]);
			expect(s.infos).toEqual(['[OutSystems UI] 3.2.0 → 3.0.0']);
			expect(overlap.serving).toBe('3.0.0');
			expect(overlap.sharedStore.majors['3'].maps['SidebarAPI.map']).toEqual(['HomeSidebar', 'AcctSidebar']);
			expect(embedded.map((i) => i.codeVersion)).toEqual(['3.0.0', '3.0.0']);
			expect(disposesOf(s, 'Home')).toHaveLength(6);
			expect(disposesOf(s, 'Home').every((d) => d.isSuccess)).toBe(true);
			expect(after.listeners.body).toBe(s.baseline.body);
			expect(after.listeners.window).toBe(1);
			expect(after.sharedStore.majors['3'].version).toBe('3.0.0');
		} else {
			// The older copy overwrites the newer one: a downgrade, and Home is lost as before.
			expect(overlap.serving).toBe('3.0.0');
			expect(embedded.map((i) => i.codeVersion)).toEqual(['3.0.0', '3.0.0']);
			expect(disposesOf(s, 'Home').every((d) => d.isSuccess === false)).toBe(true);
			expect(after.listeners.body).toBeGreaterThan(s.baseline.body);
		}
	});

	test(`${mode}: same revision twice (3.0.0 from two apps)`, async ({ page }) => {
		await openHome(page, { mode, host: '3.0.0', embedded: '3.0.0' });
		const { after } = await goTo(page, 'AccountDetail');
		const s = await state(page);

		// Two apps serve the file from different URLs, so the runtime's dedup does not apply and the bundle runs.
		expect(s.scripts).toHaveLength(2);
		if (mode === 's1') {
			expect(prologueWarnings(s)).toEqual(['[OutSystems UI] 3.0.0 not applied; 3.0.0 serves this page.']);
			expect(disposesOf(s, 'Home').every((d) => d.isSuccess)).toBe(true);
			expect(after.listeners.body).toBe(s.baseline.body);
		} else {
			expect(disposesOf(s, 'Home').every((d) => d.isSuccess === false)).toBe(true);
			expect(after.listeners.body).toBeGreaterThan(s.baseline.body);
		}
	});

	test(`${mode}: another major (3.0.0 → 4.0.0)`, async ({ page }) => {
		await openHome(page, { mode, host: '3.0.0', embedded: '4.0.0' });
		const { overlap, after } = await goTo(page, 'AccountDetail');
		const s = await state(page);

		if (mode === 's1') {
			expect(prologueWarnings(s)).toEqual(['[OutSystems UI] 4.0.0 not applied; another major serves this page.']);
			expect(overlap.serving).toBe('3.0.0');
			expect(Object.keys(after.sharedStore.majors)).toEqual(['3']);
			expect(disposesOf(s, 'Home').every((d) => d.isSuccess)).toBe(true);
			expect(after.listeners.body).toBe(s.baseline.body);
		} else {
			expect(overlap.serving).toBe('4.0.0');
			expect(disposesOf(s, 'Home').every((d) => d.isSuccess === false)).toBe(true);
		}
	});

	test(`${mode}: single bundle (the Embedded App brings none) behaves as today`, async ({ page }) => {
		await openHome(page, { mode, host: '3.0.0', embedded: 'none' });
		const firstHome = (await state(page)).snapshots.at(-1);
		const { after } = await goTo(page, 'AccountDetail');
		const back = await goTo(page, 'Home');
		const s = await state(page);

		expect(s.scripts).toHaveLength(1);
		expect(prologueWarnings(s)).toEqual([]);
		expect(s.envelopes.every((e) => e.isSuccess)).toBe(true);
		expect(after.listeners.body).toBe(s.baseline.body);
		expect(back.after.listeners).toEqual(firstHome.listeners);
		expect(after.serving).toBe('3.0.0');
		if (mode === 's1') {
			expect(Object.keys(after.sharedStore.majors)).toEqual(['3']);
		} else {
			expect(after.sharedStore).toBeNull();
		}
	});
}

// ─── Finding: a namespace-level handler that §4 does not list ──────────────────────────────────────────────
// OutSystems/OSUI/Utils/ButtonsEffect.ts registers `_bodyClick` on the BodyOnClick listener when the bundle runs.
// A second copy registers its own `_bodyClick`, so a click on a .btn renders the ripple twice. In S1 both handlers
// sit on the one shared listener; today they sit on two listeners. Expected by §8.2: one ripple in S1.
// Under "last loaded wins" every takeover re-runs the file, so the duplicates grow with each switch (rerunHost row).
for (const [mode, embedded, rerunHost, ripples] of [
	['s1', 'none', false, 1],
	['today', '3.2.0', false, 2],
	['s1', '3.2.0', false, 2],
	['s1', '3.2.0', true, 3],
]) {
	const path = rerunHost ? 'Home → AccountDetail → Home (Host bundle re-runs)' : 'Home → AccountDetail';
	test(`finding (${mode}, embedded ${embedded}, ${path}): ButtonsEffect ripple count is ${ripples}`, async ({
		page,
	}) => {
		await openHome(page, { mode, host: '3.0.0', embedded, rerunHost });
		await goTo(page, 'AccountDetail');
		if (rerunHost) {
			await goTo(page, 'Home');
		}
		await page.evaluate(() => {
			const button = document.createElement('button');
			button.className = 'btn';
			button.id = 'poc-ripple';
			button.textContent = 'Ripple';
			document.body.appendChild(button);
		});
		await page.evaluate(() => document.getElementById('poc-ripple').click());
		expect(await page.locator('#poc-ripple .btn-animation').count()).toBe(ripples);
	});
}
