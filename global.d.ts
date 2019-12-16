declare global {
  interface Window {
    MyNamespace: any;
  }
}
initAndBind;

import { API, BaseClient, Scope } from "@sentry/core";
import { DsnLike, Event, EventHint } from "@sentry/types";
import { getGlobalObject, logger } from "@sentry/utils";

import { BrowserBackend, BrowserOptions } from "./backend";
import { SDK_NAME, SDK_VERSION } from "./version";

/**
 * The Sentry Browser SDK Client.
 *
 * @see BrowserOptions for documentation on configuration options.
 * @see SentryClient for usage documentation.
 */
export class BrowserClient extends BaseClient<BrowserBackend, BrowserOptions> {
  /**
   * Creates a new Browser SDK instance.
   *
   * @param options Configuration options for this SDK.
   */
  public constructor(options: BrowserOptions = {}) {
    super(BrowserBackend, options);
  }

  /**
   * @inheritDoc
   */
  protected _prepareEvent(
    event: Event,
    scope?: Scope,
    hint?: EventHint
  ): PromiseLike<Event | null> {
    event.platform = event.platform || "javascript";
    event.sdk = {
      ...event.sdk,
      name: SDK_NAME,
      packages: [
        ...((event.sdk && event.sdk.packages) || []),
        {
          name: "npm:@sentry/browser",
          version: SDK_VERSION
        }
      ],
      version: SDK_VERSION
    };

    return super._prepareEvent(event, scope, hint);
  }
}
