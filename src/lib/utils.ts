import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;

	const scaleConversion = (
		valueA: number,
		scaleA: [number, number],
		scaleB: [number, number]
	) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (
		style: Record<string, number | string | undefined>
	): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, "");
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export const WindowTitles: {[key: string]: string} = {
	'': '',
	'/v1/orders': 'Pedidos',
	'/v1/storage': 'Estoque',
	'/v1/reports': 'Relatórios',
	'/v1/settings': 'Configurações',
}

export function toBRLCurrency(value: number) {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
		minimumFractionDigits: 2,
	}).format(value);
}

export function getCurrentTime() {
	return new Intl.DateTimeFormat("en-US", {
		timeZone: "America/Sao_Paulo",
		hour12: false,
		timeStyle: "medium",
	}).format(new Date());
}

export function formatHHMMSS(startTime: string, endTime?: string) {
	let relativeTime;

	if (endTime) {
		(relativeTime = new Date(`2024-01-01T${ endTime }`)), 1000;
	} else {
		(relativeTime = new Date(`2024-01-01T${ getCurrentTime() }`)), 1000;
	}


	let seconds = ((relativeTime as any) - (new Date(`2024-01-01T${startTime}`) as any)) / 1000;
	// console.log(startTime, seconds);
	
	const hours = Math.floor(seconds / 3600).toString(); // Get the number of whole hours
	
	// In case the order time is later than possible, inverts only the hours, and not minutes and seconds.
	// Leaving so, makes possible for the client to "book" or "schedule" a order later in the day.
	if (seconds < 0) { seconds *= -1 }

	const minutes = Math.floor((seconds % 3600) / 60).toString(); // Get the remaining minutes
	const remainingSeconds = (seconds % 60).toString(); // Get the remaining seconds
	return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${remainingSeconds.padStart(2, "0")}`;
}