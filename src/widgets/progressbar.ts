import { G, Rect } from "@svgdotjs/svg.js";
import { Window, Widget, RoleType, EventArgs, WidgetState, IdleUpWidgetState } from "../core/ui";

class ProgressBar extends Widget {
	private background: Rect;
	private fillBar: Rect;

	private valuePercentage: number = 0;
	private barWidth: number = 200;
	private barHeight: number = 20;
	private step: number = 10;

	private handleIncrement: (value: number) => void = () => {};
	private handleStateChange: (state: WidgetState) => void = () => {};

	constructor(parent: Window) {
		super(parent);
		this.role = RoleType.none;
		this.selectable = false;
		this.setState(new IdleUpWidgetState());
		this.render();
	}

	set progressWidth(width: number) {
		this.barWidth = width;
		this.update();
	}

	get progressWidth(): number {
		return this.barWidth;
	}

	set incrementValue(val: number) {
		this.step = val;
	}

	get incrementValue(): number {
		return this.step;
	}

	set value(val: number) {
		this.valuePercentage = Math.max(0, Math.min(val, 100));
		this.update();
		this.handleIncrement?.(this.valuePercentage);
	}

	get value(): number {
		return this.valuePercentage;
	}

	increment(amount: number = this.step): void {
		this.value = this.valuePercentage + amount;
	}

	onIncrement(callback: (val: number) => void): void {
		this.handleIncrement = callback;
	}

	onStateChange(callback: (state: WidgetState) => void): void {
		this.handleStateChange = callback;
	}

	render(): void {
		this._group = (this.parent as Window).window.group();

		this.background = this._group.rect(this.barWidth, this.barHeight).fill("#fff").stroke({ color: "#8c9ed1", width: 1 });

		this.fillBar = this._group.rect(0, this.barHeight).fill("#8c9ed1");

		this.outerSvg = this._group;
		this.registerEvent(this.background);

		this.update();
	}

	override update(): void {
		const fillWidth = (this.valuePercentage / 100) * this.barWidth;
		this.fillBar.width(fillWidth);
		this.background.width(this.barWidth);
		super.update();
	}

	private triggerStateChange(): void {
		this.handleStateChange?.(this.getState());
	}

	override idleupState(): void {
		this.triggerStateChange();
	}
	override idledownState(): void {
		this.triggerStateChange();
	}
	override pressedState(): void {
		this.triggerStateChange();
	}
	override hoverState(): void {
		this.triggerStateChange();
	}
	override hoverPressedState(): void {
		this.triggerStateChange();
	}
	override pressedoutState(): void {
		this.triggerStateChange();
	}

	override moveState(): void {}
	override keyupState(): void {}
	override pressReleaseState(): void {}
}

export { ProgressBar };
