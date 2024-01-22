import noteLinkToId from './noteLinkToId';

describe('noteLinkToId', () => {
	test.each([
		[
			'joplin://x-callback-url/openNote?id=a34fd126bed94bf3bb923169b57695f0',
			'a34fd126bed94bf3bb923169b57695f0',
		],
		[':/a34fd126bed94bf3bb923169b57695f0', 'a34fd126bed94bf3bb923169b57695f0'],
		['[Some note here](:/a34fd126bed94bf3bb923169b57695f0)', 'a34fd126bed94bf3bb923169b57695f0'],
	])('should convert links to IDs', (link, id) => {
		expect(noteLinkToId(link)).toBe(id);
	});
});
