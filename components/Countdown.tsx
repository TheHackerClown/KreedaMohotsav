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
	const [targetDate, setTargetDate] = useState<Date>(new Date(targetUtc));

	useEffect(() => {
		const date = new Date(targetUtc);
		if (!Number.isNaN(date.getTime())) {
			setTargetDate(date);
		}
	}, [targetUtc]);
	
	const [remainingMs, setRemainingMs] = useState(() =>
		targetDate ? targetDate.getTime() - Date.now() : 0
	);

	useEffect(() => {
		if (!targetDate) {
			setRemainingMs(0);
			return undefined;
		}

		const updateRemaining = () => {
			setRemainingMs(targetDate.getTime() - Date.now());
		};

		updateRemaining();
		const intervalId = window.setInterval(updateRemaining, 1000);

		return () => window.clearInterval(intervalId);
	}, [targetUtc]);

	return (
		<span className={`${className} ${!targetDate || remainingMs <= 0 ? 'text-red-700' : ''}`}>
		{!targetDate || remainingMs <= 0 ? 'Registration Closed' : `Registration closes in ${formatTimeParts(remainingMs)}`}
		</span>
	);
}
