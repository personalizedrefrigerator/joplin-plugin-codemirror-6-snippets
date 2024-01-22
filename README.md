# CodeMirror 6 snippets

This plugin does two things:

1. Exposes CodeMirror 6's built-in support for snippets.
2. Enables CodeMirror 6's built-in autocomplete support.

## Version requirements

- Requires Joplin 2.14.6 or greater.
- The beta CodeMirror 6 editor must be enabled.
  - This editor can be enabled in the "general" tab of Joplin's settings screen.

## Custom snippets

This plugin supports custom snippets using [CodeMirror's snippet syntax](https://codemirror.net/docs/ref/#autocomplete.snippet).

To specify custom snippets:

1. Create a new note
2. Copy a link to that note (right-click > copy markdown link)
   - ![Screenshot: Copy markdown link in right click menu](https://github.com/personalizedrefrigerator/joplin-plugin-codemirror-6-snippets/assets/46334387/0f1fddef-9094-4549-a982-39a08077b1c8)
3. Paste the link to that note into the settings page for this plugin
   - ![Screenshot: The settings page for the plugin has a single input, labeled "Link to note with custom snippets"](https://github.com/personalizedrefrigerator/joplin-plugin-codemirror-6-snippets/assets/46334387/bf2815d9-b50e-411f-934d-b8f3cc68735f)

### Example snippet note

Below, headings are the text a user would type to activate the completion.

A completion can be activated by pressing <kbd>Tab</kbd> or <kbd>Enter</kbd>.

`````markdown
# original-text

```
This is what "original-text" will be replaced with.
```

This is a comment.

# 2x2-table

```

| ${Column 1} | ${Column 2} |
|-------------|-------------|
| ${a       } | ${b       } |

```

# im

"im" stands for "inline math". Notice that below, a language ("tex" in this case) can be specified for the snippet block. Doing so doesn't affect the snippet.

```tex
$#{math-here}$ #{}
```

# example-2

Use more than three backticks to include triple backticks in the snippet

````
# Example custom snippet

This snippet is registered as an autocompletion for the text "example-2". Because its snippet uses four backticks,
it can inculde triple-backtick code blocks:

```
a code block
```
````
`````

After editing a snippet note, snippets can be reloaded by clicking `Edit`, then `Reload snippets`.

## Customizing keyboard shortcuts

It's possible to override the default CodeMirror 6 snippet shortcuts by adding a `keybindings:` line, then a code block, to the beginning of the snippets note.

For example,

````markdown
Keybinding overrides go at the beginning of the note.

keybindings:

```json
{
	"acceptCompletion": ["Tab"],
	"startCompletion": ["Ctrl-Space"],
	"nextSuggestion": ["ArrowDown"],
	"previousSuggestion": ["ArrowUp"],
	"nextSuggestionPage": ["PageDown"],
	"previousSuggestionPage": ["PageUp"],
	"closeCompletion": ["Escape"]
}
```

# Snippet

Snippets go here.

```
Example snippet
```
````

Above, the keybindings configuration omits `"Enter"` from the list of keybindings associated with `acceptCompletion`.

To disable a command, map it to the empty array:

````markdown
keybindings:

```json
{
	"closeCompletion": []
}
```
````
