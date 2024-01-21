import joplin from 'api';
import { ContentScriptType, SettingItemType, SettingStorage } from 'api/types';
import localization from './localization';

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

	// await joplin.settings.onChange((_event) => {
	// 	void applySettings();
	// });

	// await applySettings();
};

const getSnippetNoteId = async () => {
	const snippetNoteIdOrLink = await joplin.settings.value(snippetsNoteIdKey);

	if (!snippetNoteIdOrLink) {
		return null;
	}

	const idMatch = /^\s*:\/([a-zA-Z0-9]+)\s*$/.exec(snippetNoteIdOrLink);
	if (idMatch) {
		return idMatch[1];
	}

	const markdownLinkMatch = /^\s*\[.*\]\(:\/([a-zA-Z0-9]+)\)\s*$/.exec(snippetNoteIdOrLink);
	if (markdownLinkMatch) {
		return markdownLinkMatch[1];
	}

	return snippetNoteIdOrLink;
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

		joplin.contentScripts.onMessage(codeMirrorContentScriptId, async (message: any) => {
			if (message === 'getSnippets') {
				const snippetNoteId = await getSnippetNoteId();
				if (!snippetNoteId) {
					return [];
				}

				const snippetNote = await joplin.data.get(['notes', snippetNoteId], { fields: 'body' });

				if (!snippetNote) {
					alert(
						'No snippet note found with ID ' +
							snippetNoteId +
							'. Make sure that the setting is correct.',
					);
					return [];
				}

				const noteBody: string = snippetNote?.body ?? '';
				return noteBody
					.split('\n')
					.filter((line) => !!line)
					.filter((line) => !line.startsWith('#'))
					.filter((line) => !line.startsWith('```'))
					.map((line) => {
						const match = /^([^:]*): (.+)$/.exec(line);

						if (!match) {
							return { source: line, label: 'Unlabeled' };
						}

						return {
							source: match[2],
							label: match[1],
						};
					});
			}

			return null;
		});
	},
});
