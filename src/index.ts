import { Window } from "./core/ui";
import { Button } from "./widgets/button";
import { Heading } from "./widgets/heading";
import { Checkbox } from "./widgets/checkbox";
import { RadioButtonGroup } from "./widgets/radiobuttongroup";
import { ScrollBar } from "./widgets/scrollbar";
import { ProgressBar } from "./widgets/progressbar";
import { StarRating } from "./widgets/starrating";

const win = new Window(window.innerHeight - 10, "100%");

// heading
const header = new Heading(win);
header.text = "Button Demo";
header.fontSize = 16;
header.tabindex = 1;
header.move(10, 20);

// button
const clickBtn = new Button(win);
clickBtn.label = "Click Me!";
clickBtn.fontSize = 14;
clickBtn.tabindex = 2;
clickBtn.move(12, 50);
clickBtn.onClick(() => {
	header.text = "Button was clicked!";
});

// checkbox
const checkbox = new Checkbox(win);
checkbox.label = "checkbox";
checkbox.move(10, 100);
checkbox.onChange((checked) => {
	console.log("Checkbox state changed:", checked);
});

// radio
const radio = new RadioButtonGroup(
	win,
	["Option 1", "Option 2", "Option 3"],
	(i) => console.log("Radio selected:", i + 1),
	10,
	150
);

// scrollBar
const scrollbar = new ScrollBar(win, 200);
scrollbar.move(500, 0);

const thumbDisplay = document.getElementById("thumb-position");
const scrollHeightInput = document.getElementById("scroll-height") as HTMLInputElement;

scrollbar.onThumbMove((pos, dir) => {
	console.log(`Thumb moved to Y: ${pos}, Direction: ${dir}`);
	if (thumbDisplay) {
		thumbDisplay.textContent = `Thumb Position: ${pos}`;
	}
});

scrollbar.onStateChange(() => {
	console.log("Scrollbar interaction ended. Current Y:", scrollbar.thumbPosition);
});

if (scrollHeightInput) {
	scrollHeightInput.addEventListener("input", () => {
		const val = parseInt(scrollHeightInput.value);
		if (!isNaN(val) && val > 0) {
			scrollbar.scrollBarHeight = val;
		}
	});
}

// progress Bar
const progress = new ProgressBar(win);
progress.move(10, 250);
progress.progressWidth = 300;

progress.onIncrement((val) => {
	console.log("Progress incremented to", val);
});

progress.onStateChange((state) => {
	console.log("Progress bar state changed to", state.constructor.name);
});

const widthInput = document.getElementById("progress-width") as HTMLInputElement;
const incInput = document.getElementById("increment-value") as HTMLInputElement;
const incBtn = document.getElementById("increment-btn") as HTMLButtonElement;

widthInput?.addEventListener("input", () => {
	const val = parseInt(widthInput.value);
	if (!isNaN(val)) progress.progressWidth = val;
});

incInput?.addEventListener("input", () => {
	const val = parseInt(incInput.value);
	if (!isNaN(val)) progress.incrementValue = val;
});

incBtn?.addEventListener("click", () => {
	const val = parseInt(incInput.value);
	if (!isNaN(val)) progress.increment(val);
});

// Star Rating
const rating = new StarRating(win, 5);
rating.move(10, 300);
rating.onChange((val) => {
	console.log("Selected rating:", val);
});
