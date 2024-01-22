import {
	acceptCompletion,
	autocompletion,
	closeCompletion,
	moveCompletionSelection,
	snippetCompletion,
	startCompletion,
} from '@codemirror/autocomplete';
import { EditorState, Compartment, Prec } from '@codemirror/state';
import { Command, EditorView, KeyBinding, keymap } from '@codemirror/view';
import { PluginConfig } from '../types';

const keymapFromConfig = (config: PluginConfig) => {
	const commandNameToCommand: Record<string, Command> = {
		acceptCompletion: acceptCompletion,
		startCompletion: startCompletion,
		closeCompletion: closeCompletion,
		nextSuggestion: moveCompletionSelection(true),
		previousSuggestion: moveCompletionSelection(false),
		nextSuggestionPage: moveCompletionSelection(true, 'page'),
		previousSuggestionPage: moveCompletionSelection(false, 'page'),
	};
	const defaultMapping = {
		acceptCompletion: ['Tab', 'Enter'],
		startCompletion: ['Ctrl-Space'],
		nextSuggestion: ['ArrowDown'],
		previousSuggestion: ['ArrowUp'],
		nextSuggestionPage: ['PageDown'],
		previousSuggestionPage: ['PageUp'],
		closeCompletion: ['Escape'],
	};

	const bindings: KeyBinding[] = [];

	const keymapData = { ...defaultMapping, ...config.keymap };

	for (const [commandName, mappings] of Object.entries(keymapData)) {
		if (!Array.isArray(mappings)) {
			console.warn('User snippet config: Mappings for', commandName, 'must be an array.');
			continue;
		}

		if (!Object.prototype.hasOwnProperty.call(commandNameToCommand, commandName)) {
			console.warn('User snippet config: Unknown command', commandName);
			continue;
		}

		for (const key of mappings) {
			const run = commandNameToCommand[commandName];
			bindings.push({ key, run });
		}
	}

	return [Prec.high(keymap.of(bindings))];
};

export default (pluginContext: { contentScriptId: string; postMessage: any; onMessage: any }) => {
	return {
		plugin: async (codeMirror: any, _options: any) => {
			if (!codeMirror.cm6) {
				throw new Error('Only CodeMirror 6 is supported');
			}

			const editor = codeMirror.cm6 as EditorView;

			const extensions = new Compartment();
			codeMirror.addExtension([autocompletion({ defaultKeymap: false }), extensions.of([])]);

			const loadConfig = async () => {
				const config: PluginConfig = await pluginContext.postMessage('getConfiguration');

				const snippetData = config.userSnippets;
				const snippets = snippetData.map((snippet) => {
					return snippetCompletion(snippet.snippet, { label: snippet.label, info: snippet.info });
				});

				editor.dispatch({
					effects: [
						extensions.reconfigure([
							keymapFromConfig(config),
							EditorState.languageData.of(() => [{ autocomplete: snippets }]),
						]),
					],
				});

				await pluginContext.postMessage('registerSnippetReloadCallback');
				loadConfig();
			};

			loadConfig();
		},
		codeMirrorResources: [],
	};
};
