import Icon from "@mdi/react";
import clsx from "clsx";
import * as React from "react";
import { Link } from "react-router-dom";
import type { LinkProps } from "react-router-dom";

import { Spinner } from "components/Elements";

// credits: https://dev.to/frehner/polymorphic-button-component-in-typescript-c28

const variants = {
  primary:
    "text-white border-transparent bg-indigo-600 shadow-md shadow-indigo-500/20 hover:bg-indigo-700 focus:ring-indigo-500",
  secondary:
    "text-gray-700 border-gray-300 bg-white shadow-sm hover:bg-gray-200 focus:ring-indigo-500",
  secondaryActive:
    "text-indigo-600 border-gray-300 bg-white shadow-sm hover:bg-gray-200 focus:ring-indigo-500",
  danger:
    "bg-red-600 text-white border-transparent hover:bg-red-200 hover:text-red-600 hover:border-red-600",
  "classification-label-yes":
    "text-white border-blue-500 bg-blue-500 hover:border-blue-600 hover:bg-blue-600 focus:ring-blue-500 disabled:opacity-50",
  "classification-label-no":
    "text-white border-gray-400 bg-gray-400 hover:border-gray-500 hover:bg-gray-500 focus:ring-gray-400 disabled:opacity-50",
};

const sizes = {
  xs: "px-2.5 py-1.5 text-xs",
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-base",
  lg: "px-5 py-3 text-xl",
};

const iconSizes = {
  xs: 0.6,
  sm: 0.7,
  md: 0.9,
  lg: 1,
};

type IconProps =
  | { startIcon: string; endIcon?: never }
  | { endIcon: string; startIcon?: never }
  | { endIcon?: undefined; startIcon?: undefined };

type BaseProps = {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
} & IconProps;

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    as?: "button";
  };

type ButtonAsLink = BaseProps &
  Omit<LinkProps, keyof BaseProps> & {
    as: "link";
  };

type ButtonAsExternal = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    as: "externalLink";
  };

type ButtonProps = ButtonAsButton | ButtonAsExternal | ButtonAsLink;

export const Button = React.forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      startIcon,
      endIcon,
      className = "",
      ...props
    }: ButtonProps,
    ref: any,
  ) => {
    const content = (
      <>
        {isLoading && <Spinner size="sm" className="text-current" />}
        {!isLoading && startIcon && (
          <Icon
            path={startIcon}
            size={iconSizes[size]}
            aria-hidden="true"
            className="flex-shrink-0"
          />
        )}
        <span className="mx-2 max-w-xs truncate">{props.children}</span>
        {!isLoading && endIcon && (
          <Icon
            path={endIcon}
            size={iconSizes[size]}
            aria-hidden="true"
            className="flex-shrink-0"
          />
        )}
      </>
    );

    const classNames = clsx(
      "min-w-0 inline-flex items-center justify-center font-medium rounded-md",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "border",
      "disabled:opacity-70 disabled:cursor-not-allowed",
      variants[variant],
      sizes[size],
      className,
    );

    if (props.as === "link") {
      // don't pass unnecessary props to component
      const { as, ...rest } = props;
      return (
        <Link ref={ref} className={classNames} {...rest}>
          {content}
        </Link>
      );
    } else if (props.as === "externalLink") {
      const { as, ...rest } = props;
      return (
        <a
          ref={ref}
          className={classNames}
          // provide good + secure defaults while still allowing them to be overwritten
          target="_blank"
          rel="noopener noreferrer"
          {...rest}
        >
          {content}
        </a>
      );
    } else {
      const { as, ...rest } = props;
      return (
        <button ref={ref} className={classNames} {...rest}>
          {content}
        </button>
      );
    }
  },
);

Button.displayName = "Button";
