"use client";

import { Loader2, LogIn, LogOut } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Size = "icon" | "sm" | "default" | "lg";
type Variant = "solid" | "outline" | "ghost";
type IconPosition = "left" | "right";

type BaseProps = {
	className?: string;
	size?: Size;
	variant?: Variant;
	iconPosition?: IconPosition;
	isLoading?: boolean;
	label?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function sizeClasses(size: Size | undefined) {
	switch (size) {
		case "icon":
			return "px-0 w-10 h-10";
		case "sm":
			return "h-9 px-3";
		case "lg":
			return "h-11 px-5 text-base";
		default:
			return "h-10 px-4";
	}
}

function spinnerSize(size: Size | undefined) {
	switch (size) {
		case "icon":
			return "size-5";
		case "sm":
			return "size-4";
		case "lg":
			return "size-5";
		default:
			return "size-5";
	}
}

function iconSize(size: Size | undefined) {
	switch (size) {
		case "icon":
			return "size-5";
		case "sm":
			return "size-4";
		case "lg":
			return "size-5";
		default:
			return "size-5";
	}
}

function signInPalette(variant: Variant | undefined) {
	if (variant === "outline") {
		return "text-emerald-700 border-emerald-300 hover:bg-emerald-50 focus-visible:ring-emerald-500";
	}
	if (variant === "ghost") {
		return "text-emerald-700 hover:bg-emerald-50 focus-visible:ring-emerald-500";
	}
	// solid
	return "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500";
}

function signOutPalette(variant: Variant | undefined) {
	if (variant === "outline") {
		return "text-rose-700 border-rose-300 hover:bg-rose-50 focus-visible:ring-rose-500";
	}
	if (variant === "ghost") {
		return "text-rose-700 hover:bg-rose-50 focus-visible:ring-rose-500";
	}
	// solid
	return "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500";
}

export function SignInButton({
	className,
	size = "default",
	variant = "solid",
	iconPosition = "left",
	isLoading = false,
	label = "サインイン",
	children,
	disabled,
	...props
}: BaseProps) {
	const onlyIcon = size === "icon";
	return (
		<Button
			type="button"
			aria-label={onlyIcon ? "サインイン" : undefined}
			disabled={disabled || isLoading}
			className={cn(
				// override base to ensure strong palette
				"gap-2 rounded-full font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2",
				sizeClasses(size),
				signInPalette(variant),
				// remove default shadcn border for solid/ghost
				variant !== "outline" ? "border-0" : "",
				className,
			)}
			{...props}
		>
			{/* Left icon or spinner */}
			{iconPosition === "left" && (
				// biome-ignore lint/complexity/noUselessFragments: <explanation>
				<>
					{isLoading ? (
						<Loader2
							className={cn(spinnerSize(size), "animate-spin")}
							aria-hidden="true"
						/>
					) : (
						<LogIn className={cn(iconSize(size))} aria-hidden="true" />
					)}
				</>
			)}

			{/* Label */}
			{!onlyIcon && <span>{children ?? label}</span>}
			{onlyIcon && <span className="sr-only">{label}</span>}

			{/* Right icon or spinner */}
			{iconPosition === "right" && (
				<>
					{!onlyIcon &&
						(isLoading ? (
							<Loader2
								className={cn(spinnerSize(size), "animate-spin")}
								aria-hidden="true"
							/>
						) : (
							<LogIn className={cn(iconSize(size))} aria-hidden="true" />
						))}
					{onlyIcon &&
						(isLoading ? (
							<Loader2
								className={cn(spinnerSize(size), "animate-spin")}
								aria-hidden="true"
							/>
						) : (
							<LogIn className={cn(iconSize(size))} aria-hidden="true" />
						))}
				</>
			)}
		</Button>
	);
}
SignInButton.displayName = "SignInButton";

export function SignOutButton({
	className,
	size = "default",
	variant = "solid",
	iconPosition = "left",
	isLoading = false,
	label = "サインアウト",
	children,
	disabled,
	...props
}: BaseProps) {
	const onlyIcon = size === "icon";
	return (
		<Button
			type="button"
			aria-label={onlyIcon ? "サインアウト" : undefined}
			disabled={disabled || isLoading}
			className={cn(
				"gap-2 rounded-full font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2",
				sizeClasses(size),
				signOutPalette(variant),
				variant !== "outline" ? "border-0" : "",
				className,
			)}
			{...props}
		>
			{/* Left icon or spinner */}
			{iconPosition === "left" && (
				<>
					{isLoading ? (
						<Loader2
							className={cn(spinnerSize(size), "animate-spin")}
							aria-hidden="true"
						/>
					) : (
						<LogOut className={cn(iconSize(size))} aria-hidden="true" />
					)}
				</>
			)}

			{/* Label */}
			{!onlyIcon && <span>{children ?? label}</span>}
			{onlyIcon && <span className="sr-only">{label}</span>}

			{/* Right icon or spinner */}
			{iconPosition === "right" && (
				<>
					{!onlyIcon &&
						(isLoading ? (
							<Loader2
								className={cn(spinnerSize(size), "animate-spin")}
								aria-hidden="true"
							/>
						) : (
							<LogOut className={cn(iconSize(size))} aria-hidden="true" />
						))}
					{onlyIcon &&
						(isLoading ? (
							<Loader2
								className={cn(spinnerSize(size), "animate-spin")}
								aria-hidden="true"
							/>
						) : (
							<LogOut className={cn(iconSize(size))} aria-hidden="true" />
						))}
				</>
			)}
		</Button>
	);
}
SignOutButton.displayName = "SignOutButton";
