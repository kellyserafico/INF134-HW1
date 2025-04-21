import { G, Text, Polygon } from "@svgdotjs/svg.js";
import { Window, Widget, RoleType, EventArgs, IdleUpWidgetState, PressedWidgetState } from "../core/ui";

class StarRating extends Widget {
	private stars: Polygon[] = [];
	private labels: Text[] = [];
	private _rating: number = 0;
	private _maxStars: number;
	private _hoverIndex: number = -1;
	private _callback: (rating: number) => void;

	constructor(parent: Window, maxStars: number = 5) {
		super(parent);
		this.role = RoleType.group;
		this.selectable = false;
		this.setState(new IdleUpWidgetState());
		this._maxStars = maxStars;
		this.render();
	}

	get rating(): number {
		return this._rating;
	}

	set rating(val: number) {
		this._rating = Math.max(0, Math.min(this._maxStars, val));
		this.update();
	}

	onChange(callback: (rating: number) => void): void {
		this._callback = callback;
	}

	render(): void {
		this._group = (this.parent as Window).window.group();
		const gap = 35;
		for (let i = 0; i < this._maxStars; i++) {
			const star = this.createStar(0, 0);
			star.move(i * gap, 0);
			this._group.add(star);
			this.registerStarEvents(star, i);
			this.stars.push(star);
		}
		this.outerSvg = this._group;
		this.update();
	}

	private createStar(x: number, y: number): Polygon {
		const size = 20;
		const points = this.calculateStarPoints(x + size, y + size, size, size / 2.5, 5);
		return this._group.polygon(points).fill("#ccc").stroke({ color: "#8c9ed1", width: 2 });
	}

	private calculateStarPoints(cx: number, cy: number, outer: number, inner: number, spikes: number): string {
		const step = Math.PI / spikes;
		let path = "";
		for (let i = 0; i < spikes * 2; i++) {
			const r = i % 2 === 0 ? outer : inner;
			const angle = i * step - Math.PI / 2;
			const x = cx + r * Math.cos(angle);
			const y = cy + r * Math.sin(angle);
			path += `${x},${y} `;
		}
		return path.trim();
	}

	private registerStarEvents(star: Polygon, index: number): void {
		star.on("mouseover", () => {
			this._hoverIndex = index + 1;
			this.update();
		});
		star.on("mouseout", () => {
			this._hoverIndex = -1;
			this.update();
		});
		star.on("click", () => {
			this.rating = index + 1;
			if (this._callback) this._callback(this._rating);
		});
	}

	override update(): void {
		const highlight = this._hoverIndex >= 0 ? this._hoverIndex : this._rating;
		this.stars.forEach((star, i) => {
			star.fill(i < highlight ? "#8c9ed1" : "#fff");
		});
		super.update();
	}

	idleupState(): void {}
	idledownState(): void {}
	pressedState(): void {}
	hoverState(): void {}
	hoverPressedState(): void {}
	pressedoutState(): void {}
	moveState(): void {}
	keyupState(): void {}
	pressReleaseState(): void {}
}

export { StarRating };
