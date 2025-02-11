import keybindingsFromNoteBody from './keybindingsFromNoteBody';

describe('keybindingsFromNoteBody', () => {
	test('should extract keybindings from the beginning of a note', () => {
		const note = [
			'[toc]',
			'',
			'keybindings:',
			'```json',
			'{',
			'  "testCommand": [ "Tab" ],',
			'  "foo": [ ]',
			'}',
			'```',
			'',
			'# Test',
			' should ignore:',
			'keybindings:',
			'```',
			'bad',
			'```',
		].join('\n');

		expect(keybindingsFromNoteBody(note)).toEqual({
			testCommand: ['Tab'],
			foo: [],
		});
	});

	test('should return an empty object if no keybindings are specified', () => {
		const note = [
			'[toc]',
			'',
			'# Test',
			' should ignore:',
			'keybindings:',
			'```',
			'bad',
			'```',
		].join('\n');

		expect(Object.keys(keybindingsFromNoteBody(note))).toEqual([]);
	});

	test('should allow activateOnTyping to map to a boolean', () => {
		const note = [
			'[toc]',
			'',
			'keybindings:',
			'```json',
			'{',
			'  "activateOnTyping": false',
			'}',
			'```',
			'',
		].join('\n');

		expect(keybindingsFromNoteBody(note)).toEqual({
			activateOnTyping: false,
		});
	});
});
