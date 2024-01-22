import { SnippetSpec } from '../types';

const noteBodyToSnippets = (noteBody: string) => {
	let currentSnippetBody: string[] = [];
	let currentSnippetOpening: string | null = null; // e.g. ```

	// The content of the header corresponding to the current snippet.
	// For example, "foo" if the header above the current snippet was
	//  ## foo
	//
	let snippetHeader: string | null = null;

	const snippets: SnippetSpec[] = [];
	const lines = noteBody.split('\n');

	const addSnippet = () => {
		if (!snippetHeader) {
			return;
		}

		snippets.push({
			label: snippetHeader,
			snippet: currentSnippetBody.join('\n'),
		});
		currentSnippetBody = [];
		currentSnippetOpening = null;
	};

	for (const line of lines) {
		if (currentSnippetOpening) {
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
		} else if (snippetStartMatch) {
			currentSnippetOpening = snippetStartMatch[0];
		}
	}

	if (currentSnippetOpening) {
		addSnippet();
	}

	return snippets;
};

export default noteBodyToSnippets;
