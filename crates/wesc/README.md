# WeSC

We are the Superlative Components!

A streaming web component bundler written in Rust using the [lol-html](https://github.com/cloudflare/lol-html) parser.

The idea is to create a single-file HTML component format and builder that builds 
the HTML result super fast (streaming, low memory) and is server language agnostic. 

TODO: The JS (and CSS) in the top level script and style tag are bundled up separately 
and can be output as JS and CSS files.


## Features

- [x] Streaming HTML bundler
- [x] Web component definition
- [x] Default and named slots with fallback content
- [x] Declarative Shadow DOM
- [x] CSS bundling
- [ ] JS bundling


## Example

```sh
wesc ./index.html
```


## Syntax

**index.html**

```html
<!doctype html>
<html>
  <head>
    <link rel="definition" name="w-card" href="./components/card.html">
  </head>
  <body>
    <w-card>
      <h3 slot="title">Title</h3>
      Description
    </w-card>
  </body>
</html>
```

**components/card.html**

```html
<template>
<!-- or <template shadowrootmode="open"> -->
  <style>
    @scope {
      h3 {
        color: red;
      }
    }
  </style>
  <div>
    <h3><slot name="title">Add a slotted title</slot></h3>
    <p><slot>Add default slotted content</slot></p>
  </div>
</template>

<style>
  w-card {
    display: block;
  }
</style>

<!-- TODO: bundle to a global scripts.js -->
<script>
  class WCard extends HTMLElement {
    connectedCallback() {
      console.log('w-card connected');
    }
  }
  customElements.define('w-card', WCard);
</script>
```


## Related

- [WebC](https://github.com/11ty/webc)
