export default function wescAstro() {
  return {
    name: "wesc/dom/astro",
    hooks: {
      "astro:config:setup": ({ addRenderer }) => {
        addRenderer({
          name: "wesc/dom/astro",
          serverEntrypoint: "wesc/dom/astro/server.js"
        });
      }
    }
  };
}
