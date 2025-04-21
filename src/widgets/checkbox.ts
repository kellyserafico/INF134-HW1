import { G, Rect, Text } from "@svgdotjs/svg.js";
import { IdleUpWidgetState, PressedWidgetState, Window, Widget, RoleType, EventArgs } from "../core/ui";

class Checkbox extends Widget {
	private boxGroup: G;
	private boxRect: Rect;
	private checkmark: import("@svgdotjs/svg.js").Path;
	private labelText: Text;
	private _label: string = "Checkbox";
	private _checked: boolean = false;
	private _callback: ((checked: boolean) => void) | null = null;

	constructor(parent: Window) {
		super(parent);
		this.role = RoleType.button;
		this.selectable = false;
		this.setState(new IdleUpWidgetState());
		this.render();
	}

	get checked(): boolean {
		return this._checked;
	}

	set checked(value: boolean) {
		this._checked = value;
		this.update();
	}

	get label(): string {
		return this._label;
	}

	set label(text: string) {
		this._label = text;
		this.update();
	}

	onChange(callback: (checked: boolean) => void): void {
		this._callback = callback;
	}

	render(): void {
		this._group = (this.parent as Window).window.group();
		this.boxGroup = this._group.group();

		this.boxRect = this.boxGroup
			.rect(20, 20)
			.fill("#ffffff")
			.stroke({ color: "#8c9ed1", width: 1 })
			.radius(4)
			.attr({ filter: "drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.2))" });

		this.checkmark = this.boxGroup
			.path("M2 6 L6 10 L12 2")
			.fill("none")
			.stroke({ color: "#8c9ed1", width: 2 })
			.translate(4, 4)
			.hide();

		this.labelText = this._group.text(this._label).font({
			size: 16,
			family: "Arial",
			anchor: "start",
			leading: "1.2em",
			fill: "#000000",
		});
		this.labelText.move(30, 2);

		const eventRect = this._group.rect(150, 25).fill({ opacity: 0 }).move(0, 0);
		this.registerEvent(eventRect);

		this.outerSvg = this._group;
		this.update();
	}

	override update(): void {
		if (this.labelText) {
			this.labelText.text(this._label);
		}

		if (this._checked) {
			this.checkmark.show().stroke({ color: "#ffffff", width: 2 });
			this.boxRect.fill("#8c9ed1");
		} else {
			this.checkmark.hide();
			this.boxRect.fill("#ffffff");
		}

		super.update();
	}

	override pressReleaseState(): void {
		if (this.previousState instanceof PressedWidgetState) {
			this._checked = !this._checked;
			this.update();
			if (this._callback) {
				this._callback(this._checked);
			}
		}
	}

	idleupState(): void {
		this.boxRect.fill("#ffffff");
		this.update();
	}

	idledownState(): void {
		this.boxRect.fill("#f0f0f0");
		this.update();
	}

	pressedState(): void {
		this.boxRect.fill("#e0e0e0");
		this.update();
	}

	hoverState(): void {
		this.boxRect.fill("#f9f9f9");
		this.update();
	}

	hoverPressedState(): void {
		this.boxRect.fill("#e0e0e0");
		this.update();
	}

	pressedoutState(): void {
		this.boxRect.fill("#ffffff");
		this.update();
	}

	moveState(): void {}

	keyupState(keyEvent?: KeyboardEvent): void {
		if (keyEvent?.key === "Enter") {
			this._checked = !this._checked;
			this.update();
			if (this._callback) {
				this._callback(this._checked);
			}
		}
	}
}

export { Checkbox };
