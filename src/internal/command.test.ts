import { expect } from '@open-wc/testing';

import { command } from './command.js';

describe('command', () => {
	it("don't throw if no args", () => {
		command();
		expect(true).equal(true);
	});
});
