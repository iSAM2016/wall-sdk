/// <reference types="node" />

declare global {
  namespace Express {
    // These open interfaces may be extended in an application-specific manner via declaration merging.
    // See for example method-override.d.ts (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/method-override/index.d.ts)
    interface Request {}
    interface Response {}
    interface Application {}
  }
}

//   protected _prepareEvent(
//     event: Event,
//     scope?: Scope,
//     hint?: EventHint
//   ): PromiseLike<Event | null> {
//     event.platform = event.platform || "javascript";
//     event.sdk = {
//       ...event.sdk,
//       name: SDK_NAME,
//       packages: [
//         ...((event.sdk && event.sdk.packages) || []),
//         {
//           name: "npm:@sentry/browser",
//           version: SDK_VERSION
//         }
//       ],
//       version: SDK_VERSION
//     };

//     return super._prepareEvent(event, scope, hint);
//   }
// }
