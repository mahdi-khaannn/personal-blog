import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

export function remarkReadingTime() {
    return function (tree, { data }) {
        const textOnPage = toString(tree);
        const readingTime = getReadingTime(textOnPage);
        // Add dynamically calculated reading time to frontmatter
        data.astro.frontmatter.readingTime = Math.ceil(readingTime.minutes);
    };
}
