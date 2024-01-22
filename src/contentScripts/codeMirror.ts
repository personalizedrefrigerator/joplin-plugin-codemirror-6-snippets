import { acceptCompletion, autocompletion, snippetCompletion } from '@codemirror/autocomplete';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { SnippetSpec } from 'src/types';

export default (pluginContext: { contentScriptId: string; postMessage: any; onMessage: any }) => {
	return {
		plugin: async (codeMirror: any, _options: any) => {
			if (!codeMirror.cm6) {
				throw new Error('Only CodeMirror 6 is supported');
			}

			const editor = codeMirror.cm6 as EditorView;

			const extensions = new Compartment();
			codeMirror.addExtension([
				autocompletion(),
				keymap.of([{ key: 'Tab', run: acceptCompletion }]),

				extensions.of([]),
			]);

			const loadSnippets = async () => {
				const snippetData: SnippetSpec[] = await pluginContext.postMessage('getSnippets');
				const snippets = snippetData.map((snippet) => {
					return snippetCompletion(snippet.snippet, { label: snippet.label });
				});

				editor.dispatch({
					effects: [
						extensions.reconfigure([
							EditorState.languageData.of(() => [{ autocomplete: snippets }]),
						]),
					],
				});

				await pluginContext.postMessage('registerSnippetReloadCallback');
				loadSnippets();
			};

			loadSnippets();
		},
		codeMirrorResources: [],
	};
};
