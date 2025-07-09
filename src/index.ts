/**
 * Zignal - Simple, persistent, and reactive global store for React using @preact/signals-react
 *
 * @packageDocumentation
 *
 * Usage:
 *   import { createSignalStore } from "zignal";
 *   export const useCounter = createSignalStore({ key: "counter", value: 0, storage: "localStorage" });
 *   // In component: const [counter, setCounter] = useCounter();
 */
import { signal, useSignalEffect, Signal } from "@preact/signals-react";
import { useEffect, useCallback, useState } from "react";

/**
 * Configuration for a signal store.
 */
export interface SignalStoreConfig<T> {
	/**
	 * Unique key for the store (used for global sharing and persistence).
	 * If omitted, a unique key is generated (not shared globally).
	 */
	key?: string;
	/**
	 * Initial value for the store.
	 */
	value: T;
	/**
	 * Storage to persist the value. Can be 'localStorage', 'sessionStorage', or a custom Storage object.
	 */
	storage?: Storage | "localStorage" | "sessionStorage";
}

function resolveStorage(storage?: SignalStoreConfig<unknown>["storage"]): Storage | undefined {
	if (typeof window === "undefined") return undefined;
	if (storage === "localStorage") return window.localStorage;
	if (storage === "sessionStorage") return window.sessionStorage;
	return storage;
}

let storeId = 0;
const globalStores = new Map<string, Signal<unknown>>();

/**
 * Reactively subscribe to a signal and trigger re-render on change.
 * @internal
 */
function useSignalValue<T>(sig: Signal<T>): T {
	const [value, setValue] = useState(sig.value);
	useEffect(() => {
		const unsubscribe = sig.subscribe(() => setValue(sig.value));
		return unsubscribe;
	}, [sig]);
	return value;
}

/**
 * React hook for a persistent, globally shared signal store.
 * Returns a tuple: [value, setValue].
 *
 * @param config - Store configuration
 * @returns [value, setValue]
 */
export function useSignalStore<T>(config: SignalStoreConfig<T>): [T, (v: T) => void] {
	const key = config.key || `store_${storeId++}`;
	let storeSignal = globalStores.get(key) as Signal<T> | undefined;
	if (!storeSignal) {
		storeSignal = signal<T>(config.value);
		globalStores.set(key, storeSignal);
	}

	const storage = resolveStorage(config.storage);

	useEffect(() => {
		if (!storage) return;
		const stored = storage.getItem(key);
		if (stored !== null) {
			try {
				storeSignal!.value = JSON.parse(stored);
			} catch {
				// fallback to initial
			}
		}
	}, [storage, key]);

	useSignalEffect(() => {
		if (storage) {
			storage.setItem(key, JSON.stringify(storeSignal!.value));
		}
	});

	const setValue = useCallback((v: T) => {
		storeSignal!.value = v;
	}, [storeSignal]);

	const value = useSignalValue(storeSignal);
	return [value, setValue];
}

/**
 * Factory to create a custom React hook for a signal store.
 *
 * @param config - Store configuration
 * @returns A custom hook: () => [value, setValue]
 */
export function createSignalStore<T>(config: SignalStoreConfig<T>) {
	return () => useSignalStore<T>(config);
}

export default createSignalStore; 