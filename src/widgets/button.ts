// importing local code, code we have written
import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
// importing code from SVG.js library
import { Rect, Text, Box } from "../core/ui";

class Button extends Widget {
	private _rect: Rect;
	private _text: Text;
	private _input: string;
	private _callback: () => void;
	private _fontSize: number;
	private _text_y: number;
	private _text_x: number;
	private defaultText: string = "Button";
	private defaultFontSize: number = 18;
	private defaultWidth: number = 80;
	private defaultHeight: number = 30;

	constructor(parent: Window) {
		super(parent);
		// set defaults
		this.height = this.defaultHeight;
		this.width = this.defaultWidth;
		this._input = this.defaultText;
		this._fontSize = this.defaultFontSize;
		// set Aria role
		this.role = RoleType.button;
		// render widget
		this.render();
		// set default or starting state
		this.setState(new IdleUpWidgetState());
		// prevent text selection
		this.selectable = false;
	}

	get label(): string {
		return this._input;
	}

	set label(value: string) {
		this._input = value;
		this.update();
	}

	set fontSize(size: number) {
		this._fontSize = size;
		this.update();
	}

	private positionText() {
		let box: Box = this._text.bbox();
		// in TS, the prepending with + performs a type conversion from string to number
		this._text_y = +this._rect.y() + +this._rect.height() / 2 - box.height / 2;
		this._text.x(+this._rect.x() + 4);
		if (this._text_y > 0) {
			this._text.y(this._text_y);
		}

		const rectX = Number(this._rect.x());
		const rectY = Number(this._rect.y());
		const rectW = Number(this._rect.width());
		const rectH = Number(this._rect.height());

		const textX = rectX + (rectW - box.width) / 2;
		const textY = rectY + (rectH - box.height) / 2;

		this._text.x(textX);
		this._text.y(textY);
	}

	render(): void {
		this._group = (this.parent as Window).window.group();

		this._rect = this._group
			.rect(this.width, this.height)
			.fill("#b5c8ff") // default background
			.radius(10) // rounded corners
			.stroke({ color: "#2C3E50", width: 2 })
			.attr({ filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))" }); // shadow

		this._text = this._group.text(this._input).font({
			size: this._fontSize,
			family: "Arial",
			anchor: "start",
			leading: "1.2em",
			fill: "#000000",
		});

		this.outerSvg = this._group;

		const eventrect = this._group.rect(this.width, this.height).opacity(0).attr("id", 0);

		this.registerEvent(eventrect);
		this.update();
	}

	override update(): void {
		if (this._text != null) this._text.font("size", this._fontSize);
		this._text.text(this._input);
		this.positionText();

		if (this._rect != null) this._rect.fill(this.backcolor);

		super.update();
	}

	pressReleaseState(): void {
		if (this.previousState instanceof PressedWidgetState) {
			this.raise(new EventArgs(this));
			if (this._callback) {
				this._callback();
			}
		}
	}

	//TODO: implement the onClick event using a callback passed as a parameter
	onClick(callback: () => void): void {
		this._callback = callback;
	}

	//TODO: give the states something to do! Use these methods to control the visual appearance of your
	//widget
	idleupState(): void {
		this.backcolor = "#b5c8ff";
		this.update();
	}
	idledownState(): void {
		this.backcolor = "#8c9ed1";
		this.update();
	}
	pressedState(): void {
		this.backcolor = "#8c9ed1";
		this.update();
	}
	hoverState(): void {
		this.backcolor = "#9eb1e8";
		this.update();
	}
	hoverPressedState(): void {
		this.backcolor = "#9eb1e8"; // pressed + hover
		this.update();
	}

	pressedoutState(): void {
		this.backcolor = "#b5c8ff"; // return to idle
		this.update();
	}
	moveState(): void {
		throw new Error("Method not implemented.");
	}
	keyupState(keyEvent?: KeyboardEvent): void {
		if (keyEvent?.key === "Enter" && this._callback) {
			this._callback();
		}
	}
}

export { Button };
