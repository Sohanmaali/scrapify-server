// slugHelper.js

/**
 * Generates a slug from a given string.
 * @param {string} name - The name or string to generate a slug from.
 * @returns {string} - The generated slug.
 */
function generateSlug(name) {
    return name
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .replace(/[^\w\-]+/g, '') // Remove special characters
        .replace(/\-\-+/g, '-') // Replace multiple dashes with a single dash
        .replace(/^-+|-+$/g, ''); // Trim dashes from the start and end
}

async function ensureUniqueSlug(slug, model, count = 0) {
    const newSlug = count === 0 ? slug : `${slug}-${count}`;
    const existingEntry = await model.findOne({ slug: newSlug });

    if (existingEntry) {
        // If slug exists, increment the count and try again
        return ensureUniqueSlug(slug, model, count + 1);
    }

    return newSlug; // Return unique slug
}

export { generateSlug, ensureUniqueSlug };