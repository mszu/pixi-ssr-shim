# @mszu/pixi-ssr-shim

## What is this?

A basic shim that stubs out enough browser context (`window`, `document`, etc.)
to allow the [PixiJS library](https://pixijs.com/) to be imported in Node without
errors.

**Note that this does not let you USE Pixi from Node (e.g. to render images on the
server), just to import it.**

## Why would I want this?

You're trying to use PixiJS with a framework like [SvelteKit](https://kit.svelte.dev/)
that does server-side rendering, but you're getting errors like
`ReferenceError: self is not defined` during the build or starting the preview server.

## How do I use this?

> See [https://github.com/mszu/svelte-kit-pixi-sample](https://github.com/mszu/svelte-kit-pixi-sample) for a complete example.

1. Add this library as a dependency (`npm i @mszu/pixi-ssr-shim`)
2. Import it before your first Pixi import

```javascript
// Sample SvelteKit script block
//
<script>
  import '@mszu/pixi-ssr-shim'; // <----------------- IMPORTANT
  import { Application, Sprite, Texture } from 'pixi.js';
  import { onMount } from 'svelte';
  
  let app;
  
  onMount(async () => {
    app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: 1,
      backgroundColor: 0x1099bb,
    });

    document.body.appendChild(app.view);

    const sprite = new Sprite(Texture.WHITE);
    sprite.tint = 0xff0000;
    sprite.width = sprite.height = 100;
    sprite.x = sprite.y = 100;

    app.stage.addChild(sprite);
  });
</script>
```

## Important Notes

This is kind of a hacky work-around since it depends on the framework (like SvelteKit)
generating output code which imports the shim before `pixi.js` or any of the `@pixi/...`
modules. Putting it before the Pixi imports in your own code is important, but even then
the SvelteKit/Vite/rollup/esbuild configuration might decide to hoist things around, or
inline them -- it's a bit of a black box.

For SvelteKit specifically:
* Make sure not to call or instantiate anything from Pixi outside of an `onMount(...)` handler.
* Don't import this shim (or the Pixi modules) in a `<script context="module">` but then use
Pixi in a separate `<script>` tag -- this reliably outputs imports in the wrong order.
* To debug, look at the top of the file `.svelte-kit/output/server/app.js` after running
`svelte-kit build`. The imports are near the top -- make sure the shim comes before anything
Pixi.
