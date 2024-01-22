import noteBodyToSnippets from './noteBodyToSnippets';

describe('noteBodyToSnippets', () => {
	test.each([
		[['# test', '```', 'my', 'snippet', '```'], [{ snippet: 'my\nsnippet', label: 'test' }]],
		[
			[
				'# testing!',
				'some comment',
				'',
				'```',
				'my',
				'snippet',
				'  ',
				'```',
				'',
				'# TeStInG',
				'````',
				'snippet-here',
				'````',
			],
			[
				{ snippet: 'my\nsnippet\n  ', label: 'testing!' },
				{ snippet: 'snippet-here', label: 'TeStInG' },
			],
		],
	])('should convert a note with a single snippet', (source, expected) => {
		expect(noteBodyToSnippets(source.join('\n'))).toMatchObject(expected);
	});
});
