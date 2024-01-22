const keybindingsFromNoteBody = (body: string): Record<string, string> => {
	const keybindingJSON: string[] = [];
	let lastLineWasKeybindingsHeader = false;
	let inKeybindings = false;

	for (const line of body.split('\n')) {
		if (inKeybindings) {
			// Stop when we reach the end of the code block.
			if (line.startsWith('```')) {
				break;
			}

			keybindingJSON.push(line);
		}

		// Stop if we reach a header
		if (line.startsWith('#')) {
			break;
		}

		if (line.match(/^keybindings:?\s*$/i)) {
			lastLineWasKeybindingsHeader = true;
		} else if (lastLineWasKeybindingsHeader) {
			// Allow empty lines just after the keybindings header
			// before the keybindings code block.
			if (line.trim() === '') {
				continue;
			}

			// If the line after
			//   keybindings:
			// isn't a code block, stop.
			if (!line.startsWith('```')) {
				break;
			}
			lastLineWasKeybindingsHeader = false;
			inKeybindings = true;
		}
	}

	if (keybindingJSON.length === 0) {
		return {};
	}

	const parsedJSON = JSON.parse(keybindingJSON.join('\n'));

	// Validate
	for (const key in parsedJSON) {
		if (!Array.isArray(parsedJSON[key])) {
			throw new Error(
				[
					'Error in keymap JSON: Commands must map to arrays of keybindings.',
					'For example,',
					'{ "acceptCompletion": [ "Tab", "Enter", "Ctrl-2" ] }',
				].join('\n'),
			);
		}

		for (const value of parsedJSON[key]) {
			if (typeof value !== 'string') {
				throw new Error(
					[
						'Error in keymap JSON: Commands must map to arrays of **string** keybindings.',
						`Found element of type ${typeof value}`,
					].join('\n'),
				);
			}
		}
	}

	return parsedJSON;
};

export default keybindingsFromNoteBody;
