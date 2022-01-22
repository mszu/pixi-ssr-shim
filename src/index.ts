if (typeof window === 'undefined') {
  globalThis.window = {} as any;
}
if (typeof self === 'undefined') {
  globalThis.self = globalThis.window;
}
if (typeof document === 'undefined') {
  if (window.document) {
    globalThis.document = window.document;
  } else {
    // @ts-expect-error - window.document is read-only
    globalThis.document = window.document = {
      createElement: (elementName: string) => {
          switch (elementName) {
            case 'canvas':
              return {
                getContext: (contextName: string) => {
                  switch (contextName) {
                    case 'webgl':
                      return {
                        getExtension: () => {},
                      };
                    case '2d':
                      return {
                        fillRect: () => {},
                        drawImage: () => {},
                        getImageData: () => {},
                      };
                  }
                },
              };
          }
        },
    } as any;
  }
}

if (typeof CanvasRenderingContext2D === 'undefined') {
  // @ts-expect-error - we're not providing many properties required by the type definitions here
  globalThis.CanvasRenderingContext2D = { prototype: {} };
}

export {};
