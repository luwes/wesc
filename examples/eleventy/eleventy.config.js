module.exports = function(eleventyConfig) {

  eleventyConfig.addTransform("wesc", async function(content) {

    const { renderToString } = await import('wesc/dom/server');

    await import('media-chrome');
    await import('media-chrome/dist/media-theme-element.js');

    return renderToString(content);
  });
};
