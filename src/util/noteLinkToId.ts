const noteLinkToId = (linkOrId: string) => {
	if (!linkOrId) {
		return null;
	}

	const idMatch = /^\s*:\/([a-z0-9]+)\s*$/.exec(linkOrId);
	if (idMatch) {
		return idMatch[1];
	}

	const markdownLinkMatch = /^\s*\[.*\]\(:\/([a-z0-9]+)\)\s*$/.exec(linkOrId);
	if (markdownLinkMatch) {
		return markdownLinkMatch[1];
	}

	const externalLinkMatch = /^joplin:\/\/.*\/openNote\?id=([a-z0-9]+)$/.exec(linkOrId);
	if (externalLinkMatch) {
		return externalLinkMatch[1];
	}

	// Otherwise, assume it's an ID
	return linkOrId;
};

export default noteLinkToId;
