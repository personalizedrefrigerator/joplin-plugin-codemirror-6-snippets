interface AppLocalization {
	settingsPaneDescription: string;
	noteIdForSnippets: string;
}

const defaultStrings: AppLocalization = {
	settingsPaneDescription:
		'Custom snippets for the CodeMirror 6 editor. This editor is still in beta, and may need to be enabled under the "General" tab.',
	noteIdForSnippets:
		'Note ID for custom snippets. Read more about CodeMirror snippets here: https://codemirror.net/docs/ref/#autocomplete.snippet',
};

const localizations: Record<string, AppLocalization> = {
	en: defaultStrings,

	// TODO: Override the default localizations here
	es: {
		...defaultStrings,
	},
};

let localization: AppLocalization | undefined;

const languages = [...navigator.languages];
for (const language of navigator.languages) {
	const localeSep = language.indexOf('-');

	if (localeSep !== -1) {
		languages.push(language.substring(0, localeSep));
	}
}

for (const locale of languages) {
	if (locale in localizations) {
		localization = localizations[locale];
		break;
	}
}

if (!localization) {
	console.log('No supported localization found. Falling back to default.');
	localization = defaultStrings;
}

export default localization!;
