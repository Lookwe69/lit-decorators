# lit-decorators

A collection of standard TC39 decorators designed to simplify event handling and boilerplate in Lit-based applications. These decorators leverage the latest JavaScript standards to provide high-performance, declarative APIs.

## Installation

You can install the library via npm:

```bash
npm i @lookwe/lit-decorators

```

### @command

The `@command` decorator automatically attaches a single `'command'` event listener to your element and routes specific commands to decorated methods. It uses a `WeakMap` internally to ensure that even if you have multiple methods decorated, only **one** event listener is added to the DOM element.

#### Example

```typescript
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { command, type CommandOptions } from '@lookwe/lit-decorators/command';

@customElement('my-element')
class MyElement extends LitElement {
	@command('--save')
	handleSave({ source }: CommandOptions) {
		console.log('Save command received from:', source);
	}

	// You can have multiple commands; they share a single event listener.
	@command('--delete')
	handleDelete() {
		console.log('Delete command triggered');
	}

	render() {
		return html`<slot></slot>`;
	}
}
```

#### Parameters:

- **commandType**: A string following the `--${string}` pattern (e.g., `--rotate`, `--close`).
