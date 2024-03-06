export type CanonLogAttrs = Record<string, string | number | boolean | undefined>;
export type LogtailLogAttrs = Record<string, string | number | boolean>;

const format = (str: string) =>
  str
    // replace space followed by a capital letter with an underscore and the lower case letter
    .replace(/\s([A-Z])/g, (_, p1) => `_${p1.toLowerCase()}`)
    // to lower case
    .replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
    // replace spaces with underscores
    .replace(/ /g, '_')
    //replace dashes with underscores
    .replace(/-/g, '_');

/**
 * A simple logger that logs to the console in the canon format.
 */
export class CanonLog {
  action: string;
  attrs: CanonLogAttrs;
  metrics: Map<string, { start: number; end?: number }> = new Map();

  constructor(action: string, attrs?: CanonLogAttrs) {
    this.action = action;
    this.attrs = attrs ?? {};
  }

  set(attrs: CanonLogAttrs) {
    this.attrs = { ...this.attrs, ...attrs };
  }

  fail(e: Error) {
    this.set({ failed: true, failReason: e.message });
  }

  // increments a key
  increment(key: string) {
    this.attrs[key] = ((this.attrs[key] as number) ?? 0) + 1;
  }

  // starts a metric
  start(action?: string) {
    this.metrics.set(action ?? '', { start: performance.now() });
  }

  // ends a metric
  end(action: string) {
    const metric = this.metrics.get(action);

    if (metric) {
      metric.end = performance.now();
    } else {
      throw new Error(`Metric ${action} does not exist but was ended`);
    }
  }

  // ends all metrics
  endAll() {
    this.metrics.forEach((metric, key) => {
      if (!metric.end) {
        metric.end = performance.now();
      }
    });
  }

  log() {
    this.endAll();

    const metricAttrs = Object.fromEntries(
      Array.from(this.metrics.entries()).map(([key, { start, end }]) => [key + (key ? ' Duration' : 'duration'), end! - start]),
    );

    return CanonLogger.log(this.action, {
      ...this.attrs,
      ...metricAttrs,
    });
  }
}

export class CanonLogger {
  static async log(action: string, attrs: CanonLogAttrs, level: 'info' | 'warn' | 'error' = 'info') {
    const keys = Object.keys(attrs)
      .sort()
      .filter((q) => attrs[q] !== undefined);

    const context: LogtailLogAttrs = keys.reduce((curr, k) => Object.assign(curr, { [format(k)]: attrs[k] }), {});

    const toAttributeValue = (x: CanonLogAttrs[string]) => (typeof x === 'string' && !x.startsWith('"') ? `"${x}"` : x);

    const sorted = keys.sort((a, b) => {
      const x = format(a);
      const y = format(b);

      if (x.endsWith('_duration') && !y.endsWith('_duration')) {
        return 1;
      } else if (!x.endsWith('_duration') && y.endsWith('_duration')) {
        return -1;
      } else {
        return x.localeCompare(y);
      }
    });

    const message = `${action} | ${sorted.map((k) => `${format(k)}=${toAttributeValue(attrs[k])}`).join(' ')}`;

    console.log(message);
  }

  static error(action: string, error: Error | undefined, attrs: CanonLogAttrs = {}) {
    // Log with stack for debugging
    CanonLogger.log(
      `Encountered Error Stack | ${action}`,
      {
        type: error ? error.name : undefined,
        message: error ? error.message : undefined,
        stack: error ? error.stack?.toString() : undefined,
        ...attrs,
      },
      'error',
    );
  }
}
