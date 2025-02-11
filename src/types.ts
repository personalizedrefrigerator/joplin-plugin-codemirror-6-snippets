export interface SnippetSpec {
	label: string;
	snippet: string;
	info: string;
}

export interface PluginConfig {
	userSnippets: SnippetSpec[];
	keymap: Record<string, string[] | boolean>;
}
