import { Rect, G } from "@svgdotjs/svg.js";
import { Widget, Window, RoleType, IdleUpWidgetState } from "../core/ui";

type Direction = "Upwards" | "Downwards" | undefined;

class ScrollBar extends Widget {
	private group: G;
	private track: Rect;
	private thumb: Rect;
	private upButton: Rect;
	private downButton: Rect;

	private moveHandler: ((e: MouseEvent) => void) | null = null;
	private stateChangeHandler: ((e: MouseEvent) => void) | null = null;
	private onThumbMoved: ((position: number, direction: Direction) => void) | null = null;

	private heightValue: number;
	private thumbHeight: number;
	private buttonHeight = 20;

	private mouseDown = false;
	private lastY = 0;
	private direction: Direction = undefined;

	constructor(parent: Window, height: number) {
		super(parent);
		this.heightValue = height;
		this.thumbHeight = height / 3;
		this.role = RoleType.scrollbar;
		this.selectable = false;

		this.setState(new IdleUpWidgetState());
		this.render();
	}

	set scrollBarHeight(value: number) {
		this.heightValue = value;
		this.thumbHeight = value / 3;

		const x = this.group?.x() ?? 0;
		const y = this.group?.y() ?? 0;

		this.render();
		this.group.move(x, y);
	}

	get scrollBarHeight(): number {
		return this.heightValue;
	}

	get thumbPosition(): number {
		return (this.thumb.y() as number) - this.buttonHeight;
	}

	onThumbMove(handler: (pos: number, dir: Direction) => void): void {
		this.onThumbMoved = handler;
	}

	onMove(handler: (e: MouseEvent) => void): void {
		this.moveHandler = handler;
	}

	onStateChange(handler: (e: MouseEvent) => void): void {
		this.stateChangeHandler = handler;
	}

	move(x: number, y: number): void {
		this.group.move(x, y);
	}

	getScrollPosition(): string {
		return `(${this.thumb.x()}, ${this.thumb.y()})`;
	}

	getDirection(): Direction {
		return this.direction;
	}

	render(): void {
		if (this.group) {
			this.group.clear();
		} else {
			this.group = (this.parent as Window).window.group();
			this.outerSvg = this.group;
		}

		this.upButton = this.group.rect(50, this.buttonHeight).fill("#d4dfff").stroke({ color: "#000" }).move(0, 0);
		this.track = this.group.rect(50, this.heightValue).fill("#b8cbff").move(0, this.buttonHeight);
		this.downButton = this.group
			.rect(50, this.buttonHeight)
			.fill("#d4dfff")
			.stroke({ color: "#000" })
			.move(0, this.buttonHeight + this.heightValue);
		this.thumb = this.group.rect(50, this.thumbHeight).fill("#8c9ed1").move(0, this.buttonHeight);

		this.setupEvents();
		this.update();
	}

	private setupEvents(): void {
		this.upButton.click(() => {
			const newY = (this.thumb.y() as number) - 10;
			this.scrollTo(newY, "Upwards");
		});

		this.downButton.click(() => {
			const newY = (this.thumb.y() as number) + 10;
			this.scrollTo(newY, "Downwards");
		});

		this.track.click((event: MouseEvent) => this.handleTrackClick(event));

		this.thumb.mousedown((event: MouseEvent) => {
			this.mouseDown = true;
			this.lastY = event.clientY;
			this.stateChangeHandler?.(event);
		});

		window.addEventListener("mousemove", (event) => this.handleDrag(event));
		window.addEventListener("mouseup", (event) => this.handleRelease(event));
	}

	private handleTrackClick(event: MouseEvent): void {
		const svg = this.track.root().node;
		const point = svg.createSVGPoint();
		point.x = event.clientX;
		point.y = event.clientY;

		const transformed = point.matrixTransform(svg.getScreenCTM().inverse());
		const localY = transformed.y - (this.track.y() as number);
		const targetY = Math.max(0, Math.min(localY - this.thumbHeight / 2, this.heightValue - this.thumbHeight));

		const previousY = (this.thumb.y() as number) - this.buttonHeight;
		this.direction = targetY > previousY ? "Downwards" : "Upwards";

		this.thumb.y(this.buttonHeight + targetY);
		this.onThumbMoved?.(this.thumbPosition, this.direction);
		this.moveHandler?.(event);
		this.stateChangeHandler?.(event);
	}

	private handleDrag(event: MouseEvent): void {
		if (!this.mouseDown) return;

		const groupY = this.group.y() as number;
		const min = groupY + this.buttonHeight;
		const max = groupY + this.buttonHeight + this.heightValue - this.thumbHeight;

		let newY = event.clientY - this.thumbHeight / 2;
		newY = Math.max(min, Math.min(newY, max));

		this.thumb.y(newY);

		this.direction = event.clientY > this.lastY ? "Downwards" : "Upwards";
		this.lastY = event.clientY;

		this.onThumbMoved?.(this.thumbPosition, this.direction);
		this.moveHandler?.(event);
	}

	private handleRelease(event: MouseEvent): void {
		if (this.mouseDown && this.stateChangeHandler) {
			this.stateChangeHandler(event);
		}
		this.mouseDown = false;
	}

	private scrollTo(targetY: number, direction: Direction): void {
		const groupY = this.group.y() as number;
		const min = groupY + this.buttonHeight;
		const max = groupY + this.buttonHeight + this.heightValue - this.thumbHeight;

		const clampedY = Math.max(min, Math.min(targetY, max));
		this.thumb.y(clampedY);
		this.direction = direction;

		this.onThumbMoved?.(this.thumbPosition, direction);
	}

	// unused lifecycle hooks
	idleupState(): void {}
	idledownState(): void {}
	pressedState(): void {}
	pressReleaseState(): void {}
	hoverState(): void {}
	hoverPressedState(): void {}
	pressedoutState(): void {}
	moveState(): void {}
	keyupState(): void {}
}

export { ScrollBar };
