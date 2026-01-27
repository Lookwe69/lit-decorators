import { expect, fixture, html } from '@open-wc/testing';

import { command } from './command.js';

class TestElement extends HTMLElement {
	receivedSource: EventTarget | null = null;
	callCount = 0;

	@command('--test-cmd')
	handleTest({ source }: { source: EventTarget }) {
		this.receivedSource = source;
		this.callCount++;
	}

	@command('--other-cmd')
	handleOther() {
		this.callCount++;
	}
}
customElements.define('test-element', TestElement);

describe('command decorator', () => {
	it('should initialize without throwing when used correctly', async () => {
		const el = await fixture<TestElement>(html`<test-element></test-element>`);
		expect(el).to.be.instanceOf(TestElement);
	});

	it('should call the decorated method when the correct command is dispatched', async () => {
		const el = await fixture<TestElement>(html`<test-element></test-element>`);
		const sourceObj = document.createElement('div');

		const cmdEvent = new Event('command') as any;
		cmdEvent.command = '--test-cmd';
		cmdEvent.source = sourceObj;

		el.dispatchEvent(cmdEvent);

		expect(el.callCount).to.equal(1);
		expect(el.receivedSource).to.equal(sourceObj);
	});

	it('should filter out commands that do not match the commandType', async () => {
		const el = await fixture<TestElement>(html`<test-element></test-element>`);

		const cmdEvent = new Event('command') as any;
		cmdEvent.command = '--unknown-cmd';
		cmdEvent.source = el;

		el.dispatchEvent(cmdEvent);

		expect(el.callCount).to.equal(0);
	});
});
