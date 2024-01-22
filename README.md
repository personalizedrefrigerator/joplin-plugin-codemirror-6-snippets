# CodeMirror 6 snippets

This plugin does two things:

1. exposes CodeMirror 6's built-in support for snippets
2. enables CodeMirror 6's built-in autocomplete support.

## Software requirements

- Requires Joplin 2.14.6 or greater.
- The beta CodeMirror 6 editor must be enabled.
  - This editor can be enabled in the "general" tab of Joplin's settings screen.

## Custom snippets

This plugin supports custom snippets using [CodeMirror's snippet syntax](https://codemirror.net/docs/ref/#autocomplete.snippet).

To specify custom snippets:

1. Create a new note
2. Copy a link to that note (right-click > copy markdown link)
3. Paste the link to that note into the settings page for this plugin

### Example snippet note

Below, headings are the text a user would type to activate the completion.

A completion can be activated by pressing <kbd>Tab</kbd> or <kbd>Enter</kbd>.

`````markdown
# what-to-type

This is a comment

```
This is what "what-to-type" will be replaced with.
```

# 2x2-table

```

| ${Column 1} | ${Column 2} |
|-------------|-------------|
| ${a       } | ${b       } |

```

# im

"im" stands for "inline math". Notice that below, a language can be specified for the snippet block. Doing so doesn't affect the snippet.

```tex
$#{math-here}$ #{}
```

# example-2

Use more than three backticks to includ tripple backticks in the snippet

````
# This is my custom snippet

```
a code block
```
````
`````
