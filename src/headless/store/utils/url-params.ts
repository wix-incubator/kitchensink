export class URLParamsUtils {
  static parseSearchParams(searchParams: URLSearchParams) {
    const params: Record<string, string | string[]> = {};

    // Parse all parameters
    for (const [key, value] of searchParams.entries()) {
      if (params[key]) {
        // Convert to array if multiple values
        if (Array.isArray(params[key])) {
          (params[key] as string[]).push(value);
        } else {
          params[key] = [params[key] as string, value];
        }
      } else {
        params[key] = value;
      }
    }

    return params;
  }

  static updateURL(params: Record<string, string | string[]>) {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams();

    // Add all parameters
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => urlParams.append(key, v));
      } else if (value) {
        urlParams.set(key, value);
      }
    });

    // Update URL without page reload
    const newURL = urlParams.toString()
      ? `${url.pathname}?${urlParams.toString()}`
      : url.pathname;

    window.history.replaceState({}, "", newURL);
  }

  static getURLParams(): Record<string, string | string[]> {
    if (typeof window === "undefined") return {};
    return this.parseSearchParams(new URLSearchParams(window.location.search));
  }
}
