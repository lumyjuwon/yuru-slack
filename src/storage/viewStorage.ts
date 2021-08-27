export type View = {
  blocks: any;
  createdAt: number;
};
export type Storage = Map<string, View>;

export class ViewStorage {
  private _storage: Storage = new Map<string, View>();

  constructor() {}

  get storage() {
    return this._storage;
  }

  allocateView(id: string, blocks: any) {
    const now = new Date().getTime();
    const view: View = {
      blocks: blocks,
      createdAt: now
    };
    this._storage.set(id, view);
  }

  getView(id: string): View {
    const view = this._storage.get(id);

    if (view === undefined) {
      throw new Error(`${id} view doesn't exist`);
    }

    this._storage.delete(id);

    return view;
  }
}
