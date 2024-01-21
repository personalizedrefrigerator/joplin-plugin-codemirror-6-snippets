import { autocompletion, snippetCompletion } from '@codemirror/autocomplete';
import { EditorState } from '@codemirror/state';

export default (pluginContext: { contentScriptId: string; postMessage: any }) => {
	return {
		plugin: async (codeMirror: any, _options: any) => {
			if (!codeMirror.cm6) {
				throw new Error('Only CodeMirror 6 is supported');
			}

			const snippetData = await pluginContext.postMessage('getSnippets');
			const snippets = snippetData.map((snippet: any) => {
				return snippetCompletion(snippet.source, { label: snippet.label });
			});

			codeMirror.addExtension([
				autocompletion(),
				EditorState.languageData.of(() => [{ autocomplete: snippets }]),
			]);
		},
		codeMirrorResources: [],
	};
};
