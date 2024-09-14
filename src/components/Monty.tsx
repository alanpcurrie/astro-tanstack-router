import p5 from "p5";
import { useEffect, useRef } from "react";

const updateBobbing = (frameCount: number): number => {
	return Math.sin(frameCount * 0.1) * 3;
};

const drawGiraffe = (p: p5, x: number, y: number, bobOffset: number): void => {
	p.push();
	p.translate(x, y + bobOffset);

	// Body
	p.fill(255, 204, 0);
	p.ellipse(0, 30, 120, 140);

	// Neck
	p.rect(-30, -80, 60, 120, 30);

	// Head
	p.ellipse(0, -100, 80, 70);
	p.ellipse(0, -90, 40, 20);

	// Ears
	p.fill(255, 220, 100);
	p.ellipse(-30, -130, 30, 40);
	p.ellipse(30, -130, 30, 40);

	// Eyes
	p.fill(255);
	p.ellipse(-20, -110, 25, 25);
	p.ellipse(20, -110, 25, 25);
	p.fill(0);
	p.ellipse(-20, -110, 15, 15);
	p.ellipse(20, -110, 15, 15);
	p.fill(255);
	p.ellipse(-23, -113, 5, 5);
	p.ellipse(17, -113, 5, 5);

	// Nose
	p.fill(200);
	p.ellipse(-10, -90, 8, 8);
	p.ellipse(10, -90, 8, 8);

	// Spots
	p.fill(204, 153, 0);
	p.ellipse(-10, 0, 10, 10);
	p.ellipse(40, 10, 15, 15);
	p.ellipse(0, 60, 20, 20);
	p.ellipse(-20, -40, 10, 10);
	p.ellipse(20, -20, 20, 20);

	// Legs
	p.fill(255, 204, 0);
	p.rect(-50, 80, 20, 40, 10);
	p.rect(30, 80, 20, 40, 10);

	p.pop();
};

const displayMessage = (
	p: p5,
	message: string,
	x: number,
	y: number,
	bobOffset: number,
): void => {
	p.fill(255);
	p.rect(x + 70, y - 140 + bobOffset, 200, 50, 10);
	p.fill(0);
	p.textSize(12);
	p.text(message, x + 80, y - 125 + bobOffset, 180, 40);
};

const Monty = () => {
	const sketchRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const sketch = (p: p5) => {
			let x: number;
			let y: number;
			let message = "Hi, I'm Monty the Motors Giraffe!";
			let showMessage = true;
			let bobOffset = 0;

			p.setup = () => {
				p.createCanvas(600, 400);
				x = p.width / 2;
				y = p.height / 2;
			};

			p.draw = () => {
				p.background(0);
				bobOffset = updateBobbing(p.frameCount);

				drawGiraffe(p, x, y, bobOffset);

				if (showMessage) {
					displayMessage(p, message, x, y, bobOffset);
				}
			};

			p.mousePressed = () => {
				message = "Ask me about vehicle market insights";
				showMessage = true;
				setTimeout(() => {
					showMessage = false;
				}, 2000);
			};
		};

		const p5Instance = new p5(sketch, sketchRef.current as HTMLElement);

		return () => {
			p5Instance.remove();
		};
	}, []);

	return <div ref={sketchRef} />;
};

export default Monty;
