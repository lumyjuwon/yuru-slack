import { Storage } from './viewStorage';

export type ViewCollectorOptions = { viewExpiredTime?: number; collectIntervalTime?: number };

export class ViewCollector {
  private static VIEW_EXPIRED_TIME = 60 * 60 * 1000;
  private static COLLECT_INTERVAL_TIME = 60 * 1000;
  private collectInterval: NodeJS.Timeout | undefined;
  private storage: Storage;

  constructor(storage: Storage, options?: ViewCollectorOptions) {
    this.storage = storage;

    if (options) {
      if (options.viewExpiredTime) {
        ViewCollector.VIEW_EXPIRED_TIME = options.viewExpiredTime;
      }
      if (options.collectIntervalTime) {
        ViewCollector.COLLECT_INTERVAL_TIME = options.collectIntervalTime;
      }
    }
  }

  private collectExpiredView() {
    const now = new Date().getTime();
    const viewIds = this.storage.keys();

    while (!viewIds.next().done) {
      const id = viewIds.next().value as string;
      const view = this.storage.get(id);

      if (view === undefined) {
        throw new Error(`Collecting expired view error: ${id} view is undefined`);
      }

      if (now - view.createdAt <= ViewCollector.VIEW_EXPIRED_TIME) {
        this.storage.delete(id);
      }
    }
  }

  startCollecting() {
    if (this.collectInterval !== undefined) {
      throw new Error('CollectInterval is already running');
    }

    this.collectInterval = setInterval(() => {
      this.collectExpiredView();
    }, ViewCollector.COLLECT_INTERVAL_TIME);
  }

  stopCollecting() {
    if (this.collectInterval === undefined) {
      throw new Error(`Firstly should call startCollecting before calling stopCollecting`);
    }

    clearInterval(this.collectInterval);
    this.collectInterval = undefined;
  }
}
