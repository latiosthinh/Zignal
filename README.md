# @zignal/core

Simple, persistent, and reactive global store for React using @preact/signals-react.

## Installation

```bash
npm install @zignal/core
# or
yarn add @zignal/core
```

## Usage

```js
import { createSignalStore } from "@zignal/core";

// Create a custom hook for your store
export const useCounter = createSignalStore({ key: "counter", value: 0, storage: "localStorage" });

// In your React component
const [counter, setCounter] = useCounter();
```

## API

### createSignalStore(config)
- `key` (optional): Unique string for global/persistent store
- `value`: Initial value
- `storage` (optional): `localStorage`, `sessionStorage` (currently support only `localStorage` and `sessionStorage`)

Returns a React hook: `() => [value, setValue]`

### useSignalStore(config)
Directly use a store in a component (advanced usage).

## Testing

Add your tests in the `test/` directory. Use your preferred test runner (Playwright, Vitest, etc).

## License
MIT 