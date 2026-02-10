import { type ButtonHTMLAttributes, type ReactNode } from "react";
import "./Button.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const Button = ({
  variant = "primary",
  size = "medium",
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = "left",
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  const buttonClasses = [
    "button",
    `button--${variant}`,
    `button--${size}`,
    fullWidth && "button--full-width",
    loading && "button--loading",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const renderIcon = () => {
    if (loading) {
      return (
        <span className="button__spinner" aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="32"
              strokeDashoffset="32"
              className="button__spinner-circle"
            >
              <animate
                attributeName="stroke-dasharray"
                dur="2s"
                values="0 32;16 16;0 32;0 32"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dashoffset"
                dur="2s"
                values="0;-16;-32;-32"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </span>
      );
    }

    if (icon) {
      return <span className="button__icon">{icon}</span>;
    }

    return null;
  };

  return (
    <button
      className={buttonClasses}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {iconPosition === "left" && renderIcon()}
      {children && <span className="button__text">{children}</span>}
      {iconPosition === "right" && renderIcon()}
    </button>
  );
};

export default Button;
