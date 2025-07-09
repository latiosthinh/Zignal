import { fireEvent, render } from "@testing-library/react";
import { createSignalStore } from "../src";

describe("createSignalStore", () => {
	it("should update and persist value", () => {
		const useCounter = createSignalStore({ key: "test-counter", value: 0 });
		function Counter() {
			const [count, setCount] = useCounter();
			return (
				<>
					<span data-testid="value">{count}</span>
					<button onClick={() => setCount(count + 1)}>+</button>
				</>
			);
		}
		const { getByTestId, getByText } = render(<Counter />);
		expect(getByTestId("value").textContent).toBe("0");
		fireEvent.click(getByText("+"));
		expect(getByTestId("value").textContent).toBe("1");
	});
});

export default {}; 