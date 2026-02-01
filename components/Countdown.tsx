"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownProps = {
	targetUtc: string;
	className?: string;
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const getTimeParts = (ms: number) => {
	const clamped = Math.max(0, ms);
	const days = Math.floor(clamped / DAY);
	const hours = Math.floor((clamped % DAY) / HOUR);
	const minutes = Math.floor((clamped % HOUR) / MINUTE);
	const seconds = Math.floor((clamped % MINUTE) / SECOND);

	return { days, hours, minutes, seconds };
};

const formatTimeParts = (ms: number) => {
	const { days, hours, minutes, seconds } = getTimeParts(ms);
	const parts: string[] = [];

	if (days > 0) {
		parts.push(`${days}d`);
	}

	parts.push(`${hours.toString().padStart(2, "0")}h`);
	parts.push(`${minutes.toString().padStart(2, "0")}m`);
	parts.push(`${seconds.toString().padStart(2, "0")}s`);

	return parts.join(" ");
};

export default function Countdown({ targetUtc, className }: CountdownProps) {
	const targetDate = new Date(targetUtc);
	const isValidTarget = !Number.isNaN(targetDate.getTime());
	const [remainingMs, setRemainingMs] = useState(() =>
		isValidTarget ? targetDate.getTime() - Date.now() : 0
	);

	useEffect(() => {
		if (!isValidTarget) {
			setRemainingMs(0);
			return undefined;
		}

		const updateRemaining = () => {
			setRemainingMs(targetDate.getTime() - Date.now());
		};

		updateRemaining();
		const intervalId = window.setInterval(updateRemaining, 1000);

		return () => window.clearInterval(intervalId);
	}, [isValidTarget, targetUtc]);

	if (!isValidTarget || remainingMs <= 0) {
		return <span className={`${className} text-red-700`}>Registration Closed</span>;
	}

	return (
		<span className={`${className}`}>
			Registration closes in {formatTimeParts(remainingMs)}
		</span>
	);
}
