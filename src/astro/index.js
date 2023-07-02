export default function wescAstro() {
  return {
    name: "wesc/astro",
    hooks: {
      "astro:config:setup": ({ addRenderer }) => {
        addRenderer({
          name: "wesc/astro",
          serverEntrypoint: "wesc/astro/server.js"
        });
      }
    }
  };
}
