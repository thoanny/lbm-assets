import MarkdownIt from 'markdown-it';
import markdownItShortcodeTag from 'markdown-it-shortcode-tag';

export const markdown = new MarkdownIt({ html: true, breaks: true });

// https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
// Ouvrir les liens dans une target _blank
const defaultRender =
    markdown.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

markdown.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    tokens[idx].attrSet('target', '_blank');
    return defaultRender(tokens, idx, options, env, self);
};

// Shortcodes
const shortcodes = {
    lightbox: {
        render: function (attrs, env) {
            console.log('lightbox attrs', attrs);
            const imageUrl = attrs.fx ? `${attrs.url}?fx=${attrs.fx}` : attrs.url;
            return `<a href="${attrs.url}" data-toggle="lightbox" data-type="image"><img src="${imageUrl}" loading="lazy" alt="" /></a>`;
        },
        inline: true,
    },
};

markdown.use(markdownItShortcodeTag, shortcodes);
