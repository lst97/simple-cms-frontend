/**
 * Extracts the slug from a URL and returns the slug along with the modified URL without the slug.
 * @param url - The URL from which to extract the slug.
 * @returns An object containing the extracted slug and the modified URL.
 */
export const extractSlug = (url: string) => {
	if (url.endsWith('/')) {
		url = url.substring(0, url.length - 1);
	}
	const parts = url.split('/'); // Split the URL into parts

	if (parts.length > 1) {
		const slug = parts.pop(); // Remove the last part (slug) and store it
		const modifiedUrl = parts.join('/') + '/'; // Reconstruct the URL without the slug

		return { slug, modifiedUrl };
	} else {
		// Handle cases where the URL has no slashes or only one part
		return { slug: url, modifiedUrl: '' };
	}
};
