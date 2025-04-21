import { Window } from "../core/ui";
import { RadioButton } from "./radio";

class RadioButtonGroup {
	private _buttons: RadioButton[] = [];
	private _selectedIndex: number = -1;

	constructor(
		private parent: Window,
		labels: string[],
		private onChange: (index: number) => void,
		private x: number = 10,
		private y: number = 10
	) {
		labels.forEach((label, i) => {
			const btn = new RadioButton(parent, label, i);
			btn.move(this.x, this.y + i * 35); // now dynamic position
			btn.onClick = () => this.select(i);
			this._buttons.push(btn);
		});
	}

	select(index: number) {
		if (this._selectedIndex !== index) {
			this._buttons.forEach((b, i) => (b.checked = i === index));
			this._selectedIndex = index;
			this.onChange(index);
		}
	}

	get selectedIndex(): number {
		return this._selectedIndex;
	}
}

export { RadioButtonGroup };
