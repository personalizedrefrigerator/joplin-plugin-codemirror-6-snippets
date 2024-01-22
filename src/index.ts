import joplin from 'api';
import { ContentScriptType, MenuItemLocation, SettingItemType, SettingStorage } from 'api/types';
import localization from './localization';
import noteLinkToId from './util/noteLinkToId';
import noteBodyToSnippets from './util/noteBodyToSnippets';
import keybindingsFromNoteBody from './util/keybindingsFromNoteBody';
import { PluginConfig, SnippetSpec } from './types';

const snippetsNoteIdKey = 'snippets-note-id';

const registerAndApplySettings = async () => {
	const sectionName = 'Snippets';
	await joplin.settings.registerSection(sectionName, {
		label: 'Snippets',
		iconName: 'fas fa-code',
		description: localization.settingsPaneDescription,
	});

	// Editor fullscreen setting
	await joplin.settings.registerSettings({
		[snippetsNoteIdKey]: {
			public: true,
			section: sectionName,

			label: localization.noteIdForSnippets,

			type: SettingItemType.String,
			value: '',

			storage: SettingStorage.File,
		},
	});
};

joplin.plugins.register({
	onStart: async function () {
		await registerAndApplySettings();

		const codeMirrorContentScriptId = 'snippets--contentScript';
		await joplin.contentScripts.register(
			ContentScriptType.CodeMirrorPlugin,
			codeMirrorContentScriptId,
			'./contentScripts/codeMirror.js',
		);

		let reloadSnippets = () => {};

		joplin.contentScripts.onMessage(codeMirrorContentScriptId, async (message: any) => {
			if (message === 'registerSnippetReloadCallback') {
				await new Promise<void>((resolve) => {
					reloadSnippets = resolve;
				});
			} else if (message === 'getConfiguration') {
				const configNoteId = noteLinkToId(await joplin.settings.value(snippetsNoteIdKey));

				const defaultConfig: PluginConfig = {
					keymap: {},
					userSnippets: [],
				};

				if (!configNoteId) {
					return defaultConfig;
				}

				const configNote = await joplin.data.get(['notes', configNoteId], { fields: 'body' });

				if (!configNote) {
					alert(
						`No snippet note found with ID ${configNoteId}. Make sure that the setting is correct.`,
					);
					return defaultConfig;
				}

				const noteBody: string = configNote?.body ?? '';

				let snippets: SnippetSpec[] = [];
				let keybindings: Record<string, string> = {};

				try {
					keybindings = keybindingsFromNoteBody(noteBody);
				} catch (error) {
					alert('Error loading keybindings: \n' + error);
				}

				try {
					snippets = noteBodyToSnippets(noteBody);
				} catch (error) {
					alert('Error loading snippets: \n' + error);
				}

				const config: PluginConfig = {
					keymap: keybindings,
					userSnippets: snippets,
				};
				return config;
			}

			return null;
		});

		await joplin.commands.register({
			name: 'reloadSnippets',
			label: 'Reload snippets',
			execute: async () => {
				reloadSnippets();
			},
		});

		await joplin.views.menuItems.create(
			'reloadSnippetsMenuItem',
			'reloadSnippets',
			MenuItemLocation.Edit,
		);
	},
});
