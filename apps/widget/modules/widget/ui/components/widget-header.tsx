import { cn } from "@workspace/ui/lib/utils";
import React from "react";

export const WidgetHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <header
      className={cn(
        "bg-gradient-to-b from-teal-500 to-teal-600 p-2 text-primary-foreground",
        className,
      )}
    >
      {children}
    </header>
  );
};
