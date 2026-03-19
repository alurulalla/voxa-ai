import {
  MailQuestionIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  MessageSquareIcon,
  ClockIcon,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface ConversationStatusIconProps {
  status: "unresolved" | "escalated" | "resolved" | "all" | string;
  className?: string;
}

const statusConfig = {
  resolved: {
    icon: CheckCircleIcon,
    bgColor: "bg-teal-500 dark:bg-teal-600",
    label: "Resolved",
  },
  unresolved: {
    icon: MailQuestionIcon,
    bgColor: "bg-amber-500 dark:bg-amber-600",
    label: "Unresolved",
  },
  escalated: {
    icon: AlertTriangleIcon,
    bgColor: "bg-orange-500 dark:bg-orange-600",
    label: "Escalated",
  },
  all: {
    icon: MessageSquareIcon,
    bgColor: "bg-teal-500 dark:bg-teal-600",
    label: "All Conversations",
  },
} as const;

export const ConversationStatusIcon = ({
  status,
  className,
}: ConversationStatusIconProps) => {
  // Default to a fallback if status doesn't match
  const config = statusConfig[status as keyof typeof statusConfig] || {
    icon: ClockIcon,
    bgColor: "bg-gray-500 dark:bg-gray-600",
    label: status,
  };

  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full size-5 shadow-sm",
        config.bgColor,
        className,
      )}
      title={config.label}
    >
      <Icon className="size-3 stroke-[2.5] text-white" />
    </div>
  );
};

// Optional: If you want a version with text label for filters/dropdowns
export const ConversationStatusBadge = ({
  status,
  className,
  showIcon = true,
  showLabel = true,
}: ConversationStatusIconProps & {
  showIcon?: boolean;
  showLabel?: boolean;
}) => {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    icon: ClockIcon,
    bgColor: "bg-gray-500 dark:bg-gray-600",
    label: status,
  };

  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium",
        config.bgColor,
        className,
      )}
    >
      {showIcon && <Icon className="size-3.5 stroke-[2.5] text-white" />}
      {showLabel && <span className="text-white">{config.label}</span>}
    </div>
  );
};
