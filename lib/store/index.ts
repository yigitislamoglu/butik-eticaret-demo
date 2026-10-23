import { BrowserStoreRepository } from "./browser-store";
import type { StoreRepository } from "./types";

export * from "./types";
export { STORE_UPDATED_EVENT } from "./browser-store";

export const store: StoreRepository = new BrowserStoreRepository();
