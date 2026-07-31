import { mdiMessage, mdiMessageBadge } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";

import { Badge, Spinner } from "components/Elements";
import { formatNumber } from "utils/formatNumber";

const variants = {
  total: {
    icon: mdiMessage,
    description: "Messages",
  },
  unread: {
    icon: mdiMessageBadge,
    description: "Unread Messages",
  },
};

export function MessagesCount({
  count,
  variant = "total",
  status,
  className,
}: {
  count?: number;
  variant?: keyof typeof variants;
  status: "error" | "success" | "pending";
  className?: string;
}) {
  const countFormatted = formatNumber(count ?? 0);
  const isHighlighted = variant === "unread" && (count ?? 0) > 0;
  const colorClassName = isHighlighted ? "text-green-600" : "text-gray-600";

  return (
    <div
      className={clsx(
        "flex items-center space-x-1",
        { "opacity-50": status === "error" },
        className,
      )}
      title={countFormatted + " " + variants[variant].description}
    >
      {variants[variant].icon && (
        <Icon
          path={variants[variant].icon}
          size={1}
          className={colorClassName}
        />
      )}

      {status === "pending" ? (
        <Spinner size="sm" />
      ) : status === "success" ? (
        variant === "unread" ? (
          <Badge
            label={countFormatted}
            variant={isHighlighted ? "green" : "gray"}
            size="md"
            className="tabular-nums"
          />
        ) : (
          <span className={clsx("font-medium tabular-nums", colorClassName)}>
            {countFormatted}
          </span>
        )
      ) : (
        "?"
      )}
    </div>
  );
}
