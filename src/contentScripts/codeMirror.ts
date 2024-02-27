import {
	Completion,
	acceptCompletion,
	autocompletion,
	clearSnippet,
	closeCompletion,
	completeFromList,
	moveCompletionSelection,
	nextSnippetField,
	prevSnippetField,
	snippetCompletion,
	snippetKeymap,
	startCompletion,
} from '@codemirror/autocomplete';
import { Compartment, EditorState, Prec } from '@codemirror/state';
import { Command, EditorView, KeyBinding, keymap } from '@codemirror/view';
import { PluginConfig } from '../types';
import { CodeMirrorContentScriptModule, ContentScriptContext } from 'api/types';

const keymapFromConfig = (config: PluginConfig) => {
	const commandNameToCompletionCommand: Record<string, Command> = {
		acceptCompletion,
		startCompletion,
		closeCompletion,
		nextSuggestion: moveCompletionSelection(true),
		previousSuggestion: moveCompletionSelection(false),
		nextSuggestionPage: moveCompletionSelection(true, 'page'),
		previousSuggestionPage: moveCompletionSelection(false, 'page'),
	};
	const commandNameToSnippetCommand: Record<string, Command> = {
		nextSnippetField,
		prevSnippetField,
		clearSnippet,
	};
	const defaultMapping = {
		acceptCompletion: ['Tab', 'Enter'],
		startCompletion: ['Ctrl-Space'],
		nextSuggestion: ['ArrowDown'],
		previousSuggestion: ['ArrowUp'],
		nextSuggestionPage: ['PageDown'],
		previousSuggestionPage: ['PageUp'],
		closeCompletion: ['Escape'],

		nextSnippetField: ['Tab'],
		prevSnippetField: ['Shift-Tab'],
		clearSnippet: ['Escape'],
	};

	const autocompleteBindings: KeyBinding[] = [];
	const snippetBindings: KeyBinding[] = [];

	const keymapData = { ...defaultMapping, ...config.keymap };

	for (const [commandName, mappings] of Object.entries(keymapData)) {
		if (!Array.isArray(mappings)) {
			console.warn('User snippet config: Mappings for', commandName, 'must be an array.');
			continue;
		}

		const isSnippetBinding = Object.prototype.hasOwnProperty.call(
			commandNameToSnippetCommand,
			commandName,
		);
		const isCompletionBinding = Object.prototype.hasOwnProperty.call(
			commandNameToCompletionCommand,
			commandName,
		);

		if (!isSnippetBinding && !isCompletionBinding) {
			console.warn('User snippet config: Unknown command', commandName);
			continue;
		}

		for (const key of mappings) {
			if (isSnippetBinding) {
				const run = commandNameToSnippetCommand[commandName];
				autocompleteBindings.push({ key, run });
			} else {
				const run = commandNameToCompletionCommand[commandName];
				autocompleteBindings.push({ key, run });
			}
		}
	}

	return [Prec.high(keymap.of(autocompleteBindings)), snippetKeymap.of(snippetBindings)];
};

export default (pluginContext: ContentScriptContext): CodeMirrorContentScriptModule => {
	return {
		plugin: async (codeMirror) => {
			if (!codeMirror.cm6) {
				throw new Error('Only CodeMirror 6 is supported');
			}

			const editor = codeMirror.cm6 as EditorView;

			const joplinExtensions = codeMirror.joplinExtensions ?? {
				// Mock the autocomplete extensions so we can continue supporting older versions
				// of Joplin (including the Android version, which has a lower version number than
				// desktop for the same functionality).
				completionSource: (completion: Completion) =>
					EditorState.languageData.of(() => [{ autocomplete: completion }]),
				enableLanguageDataAutocomplete: { of: () => [] },
			};

			const extensions = new Compartment();
			codeMirror.addExtension([
				joplinExtensions.enableLanguageDataAutocomplete.of(true),
				autocompletion({ defaultKeymap: false }),
				extensions.of([]),
			]);

			const loadConfig = async () => {
				const config: PluginConfig = await pluginContext.postMessage('getConfiguration');

				const snippetData = config.userSnippets;
				const snippets = snippetData.map((snippet) => {
					return snippetCompletion(snippet.snippet, { label: snippet.label, info: snippet.info });
				});

				editor.dispatch({
					effects: [
						extensions.reconfigure([
							joplinExtensions.completionSource(completeFromList(snippets)),
							keymapFromConfig(config),
						]),
					],
				});

				await pluginContext.postMessage('registerSnippetReloadCallback');
				loadConfig();
			};

			loadConfig();
		},
	};
};
