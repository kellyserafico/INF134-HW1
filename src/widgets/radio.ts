import { G, Circle, Text } from "@svgdotjs/svg.js";
import { IdleUpWidgetState, PressedWidgetState, Window, Widget, RoleType, EventArgs } from "../core/ui";

class RadioButton extends Widget {
	private circle: Circle;
	private innerDot: Circle;
	private labelText: Text;
	private _label: string;
	private _checked: boolean = false;
	private _callback: () => void;
	private _index: number;

	constructor(parent: Window, label: string, index: number) {
		super(parent);
		this.role = RoleType.button;
		this.selectable = false;
		this._label = label;
		this._index = index;
		this.setState(new IdleUpWidgetState());
		this.render();
	}

	get checked(): boolean {
		return this._checked;
	}

	set checked(val: boolean) {
		this._checked = val;
		this.update();
	}

	set label(val: string) {
		this._label = val;
		this.update();
	}

	get index(): number {
		return this._index;
	}

	set onClick(callback: () => void) {
		this._callback = callback;
	}

	render(): void {
		this._group = (this.parent as Window).window.group();

		this.circle = this._group.circle(20).fill("#fff").stroke({ color: "#8c9ed1", width: 2 });

		this.innerDot = this._group.circle(10).fill("#8c9ed1").center(10, 10).hide();

		this.labelText = this._group.text(this._label).font({
			size: 16,
			family: "Arial",
			anchor: "start",
			fill: "#000",
		});
		this.labelText.move(30, 2);

		const eventRect = this._group.rect(150, 25).fill({ opacity: 0 });
		this.registerEvent(eventRect);

		this.outerSvg = this._group;
		this.update();
	}

	override update(): void {
		this.labelText.text(this._label);

		// Keep innerDot centered relative to outer circle
		if (this.circle && this.innerDot) {
			const cx = this.circle.cx();
			const cy = this.circle.cy();
			this.innerDot.cx(cx);
			this.innerDot.cy(cy);
		}

		this.innerDot[this._checked ? "show" : "hide"]();
		super.update();
	}

	override pressReleaseState(): void {
		if (this.previousState instanceof PressedWidgetState) {
			if (!this._checked) {
				this._callback?.(); // trigger callback only if changed
			}
		}
	}

	idleupState(): void {
		this.circle.fill("#fff").stroke({ color: "#8c9ed1", width: 2 }); // ← restore default
		this.update();
	}

	idledownState(): void {
		this.circle.fill("#fff").stroke({ color: "#8c9ed1", width: 2 });
		this.update();
	}
	pressedState(): void {
		this.circle.fill("#fff").stroke({ color: "#8c9ed1", width: 2 });
		this.update();
	}
	hoverState(): void {
		this.circle.fill("#f9f9f9");
		this.update();
	}
	hoverPressedState(): void {
		this.circle.fill("#fff").stroke({ color: "#8c9ed1", width: 2 });
		this.update();
	}

	pressedoutState(): void {
		this.circle.fill("#fff").stroke({ color: "#8c9ed1", width: 2 });
		this.update();
	}
	moveState(): void {}
	keyupState(keyEvent?: KeyboardEvent): void {
		if (keyEvent?.key === "Enter") {
			if (!this._checked) {
				this._callback?.();
			}
		}
	}
}

export { RadioButton };
