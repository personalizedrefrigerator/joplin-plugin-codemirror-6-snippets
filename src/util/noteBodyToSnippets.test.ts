import noteBodyToSnippets from './noteBodyToSnippets';

describe('noteBodyToSnippets', () => {
	test.each([
		[
			['# test', '```', 'my', 'snippet', '```'],
			[{ snippet: 'my\nsnippet', label: 'test', info: '' }],
		],
		[
			[
				'# testing!',
				'some description',
				'',
				'```',
				'my',
				'snippet',
				'  ',
				'```',
				'',
				'A comment (hidden).',
				'',
				'# TeStInG',
				'````',
				'snippet-here',
				'````',
				'# test2',
				'info',
				'````',
				'test-snippet-here',
				'````',
				'comment',
			],
			[
				{ snippet: 'my\nsnippet\n  ', label: 'testing!', info: 'some description' },
				{ snippet: 'snippet-here', label: 'TeStInG', info: '' },
				{ snippet: 'test-snippet-here', label: 'test2', info: 'info' },
			],
		],
		[
			['ignore this', '```', 'test', '```', '', '# test', '```', 'snip', '```'],
			[{ snippet: 'snip', label: 'test', info: '' }],
		],
	])('should convert a note with a single snippet', (source, expected) => {
		expect(noteBodyToSnippets(source.join('\n'))).toMatchObject(expected);
	});
});
