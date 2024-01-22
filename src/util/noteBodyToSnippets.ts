import { SnippetSpec } from '../types';

const noteBodyToSnippets = (noteBody: string) => {
	let currentSnippetBody: string[] = [];
	let currentSnippetInfo: string[] = [];
	let currentSnippetOpening: string | null = null; // e.g. ```
	let foundSnippetForHeader = false;

	// The content of the header corresponding to the current snippet.
	// For example, "foo" if the header above the current snippet was
	//  ## foo
	//
	let snippetHeader: string | null = null;

	const snippets: SnippetSpec[] = [];
	const lines = noteBody.split('\n');

	const addSnippet = () => {
		// Only add if there's a corresponding header, otherwise,
		// the snippet could be other configuration (e.g. keybindings)
		if (snippetHeader) {
			snippets.push({
				label: snippetHeader,
				snippet: currentSnippetBody.join('\n'),
				info: currentSnippetInfo.join('\n').trim(),
			});
		}

		currentSnippetBody = [];
		currentSnippetInfo = [];
		currentSnippetOpening = null;
		foundSnippetForHeader = true;
	};

	for (const line of lines) {
		if (currentSnippetOpening) {
			// # Header
			// ```
			// snippet
			// ``` <---- This line
			if (currentSnippetOpening === line) {
				addSnippet();
				continue;
			} else {
				currentSnippetBody.push(line);
			}
			continue;
		}

		const headerMatch = /[#]+ (.*)$/.exec(line);
		const snippetStartMatch = /^[`]{3,}/.exec(line);

		if (headerMatch) {
			snippetHeader = headerMatch[1];
			currentSnippetInfo = [];
			currentSnippetBody = [];
			foundSnippetForHeader = false;
		} else if (foundSnippetForHeader) {
			// All lines after the snippet (but before the next snippet)
			// are comments.
		} else if (snippetStartMatch) {
			currentSnippetOpening = snippetStartMatch[0];
			foundSnippetForHeader = true;
		} else {
			// Lines before the snippet are information comments
			currentSnippetInfo.push(line);
		}
	}

	if (currentSnippetOpening) {
		addSnippet();
	}

	return snippets;
};

export default noteBodyToSnippets;
