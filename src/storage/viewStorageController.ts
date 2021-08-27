import { ViewCollector, ViewCollectorOptions } from './viewCollector';
import { ViewStorage } from './viewStorage';

export class ViewStorageController {
  private viewStorage: ViewStorage;
  private viewCollector: ViewCollector;

  constructor(options?: ViewCollectorOptions) {
    this.viewStorage = new ViewStorage();
    this.viewCollector = new ViewCollector(this.viewStorage.storage, options);
  }

  allocateView(id: string, blocks: any) {
    this.viewStorage.allocateView(id, blocks);
  }

  getView(id: string) {
    return this.viewStorage.getView(id);
  }

  startCollectingExpiredView() {
    this.viewCollector.startCollecting();
  }

  stopCollectingExpiredView() {
    this.viewCollector.stopCollecting();
  }
}
