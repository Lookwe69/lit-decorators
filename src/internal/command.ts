export interface CommandEvent extends Event {
	readonly source: EventTarget;
	readonly command: string;
}

export interface CommandOptions {
	source: EventTarget;
	command: string;
}

const commandRecordMap = new WeakMap<EventTarget, Map<string, Set<(options: CommandOptions) => void>>>();

export function command(commandType: `--${string}`) {
	return function commandDecorator<This extends EventTarget>(
		originalMethod: (this: This, options: CommandOptions) => void,
		context: ClassMethodDecoratorContext<This>,
	) {
		if (context.kind !== 'method') {
			throw new Error('The @command decorator can only be used on methods.');
		}

		context.addInitializer(function (this: This) {
			let commandMap = commandRecordMap.get(this)!;
			if (!commandMap) {
				commandRecordMap.set(this, (commandMap = new Map()));

				this.addEventListener('command', (event: Event) => {
					const { command, source } = event as CommandEvent;
					const commandMap = commandRecordMap.get(this);

					for (const handler of commandMap?.get(command) ?? []) {
						handler.call(this, { source, command });
					}
				});
			}

			let handlerSet = commandMap.get(commandType);
			if (!handlerSet) {
				commandMap.set(commandType, (handlerSet = new Set()));
			}
			handlerSet.add(originalMethod);
		});
	};
}
