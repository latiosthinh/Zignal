import { fireEvent, render } from "@testing-library/react";
import { createSignalStore } from "../src";

describe("createSignalStore", () => {
	it("should update and persist value", () => {
		const useText = createSignalStore({ key: "test-text", value: "" });
		function Text() {
			const [text, setText] = useText();
			return (
				<>
					<input data-testid="input" type="text" value={text} onChange={e => setText(e.target.value)} />
					<span data-testid="value">{text}</span>
					<button data-testid="clear" onClick={() => setText("")}>Clear</button>
				</>
			);
		}
		const { getByTestId } = render(<Text />);
		expect(getByTestId("value").textContent).toBe("");
		fireEvent.change(getByTestId("input"), { target: { value: "Hello" } });
		expect(getByTestId("value").textContent).toBe("Hello");
		fireEvent.click(getByTestId("clear"));
		expect(getByTestId("value").textContent).toBe("");
	});
});

export default {}; 