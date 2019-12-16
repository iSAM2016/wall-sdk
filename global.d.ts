declare global {
    interface Window {
        MyNamespace: any;
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
