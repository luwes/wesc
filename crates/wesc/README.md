# WeSC

We are the Superlative Components!

A streaming custom element bundler written in Rust using the lol-html parser.

The idea is to create a single-file HTML component format and builder that builds 
the HTML result super fast (streaming, low memory) and is server language agnostic. 
The JS (and CSS) in the top level script and style tag are bundled up separately 
and can be output as JS and CSS files.


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
  <div>
    <h3><slot name="title">Add a slotted title</slot></h3>
    <p><slot>Add default slotted content</slot></p>
  </div>
</template>
```
