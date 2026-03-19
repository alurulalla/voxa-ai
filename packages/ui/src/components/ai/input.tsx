"use client";

import {
  Loader2Icon,
  SendIcon,
  SquareIcon,
  XIcon,
  SparklesIcon,
} from "lucide-react";
import type {
  ComponentProps,
  HTMLAttributes,
  KeyboardEventHandler,
} from "react";
import { Children, useCallback, useEffect, useRef } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";

type UseAutoResizeTextareaProps = {
  minHeight: number;
  maxHeight?: number;
};

const useAutoResizeTextarea = ({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        return;
      }

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      // Temporarily shrink to get the right scrollHeight
      textarea.style.height = `${minHeight}px`;

      // Calculate new height
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY),
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight],
  );

  useEffect(() => {
    // Set initial height
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  // Adjust height on window resize
  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
};

export type AIInputProps = HTMLAttributes<HTMLFormElement>;

export const AIInput = ({ className, ...props }: AIInputProps) => (
  <form
    className={cn(
      "w-full divide-y overflow-hidden rounded-md border bg-background",
      "focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 dark:focus-within:border-teal-400 dark:focus-within:ring-teal-400",
      className,
    )}
    {...props}
  />
);

export type AIInputTextareaProps = ComponentProps<typeof Textarea> & {
  minHeight?: number;
  maxHeight?: number;
};

export const AIInputTextarea = ({
  onChange,
  className,
  placeholder = "What would you like to know?",
  minHeight = 48,
  maxHeight = 164,
  ...props
}: AIInputTextareaProps) => {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <Textarea
      className={cn(
        "text-sm!",
        "w-full resize-none rounded-none border-none p-3 shadow-none outline-none ring-0",
        "bg-transparent dark:bg-transparent",
        "focus-visible:ring-0 placeholder:text-muted-foreground/70",
        className,
      )}
      name="message"
      onChange={(e) => {
        adjustHeight();
        onChange?.(e);
      }}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      ref={textareaRef}
      {...props}
    />
  );
};

export type AIInputToolbarProps = HTMLAttributes<HTMLDivElement>;

export const AIInputToolbar = ({
  className,
  ...props
}: AIInputToolbarProps) => (
  <div
    className={cn(
      "flex items-center justify-between p-1 bg-muted/30",
      className,
    )}
    {...props}
  />
);

export type AIInputToolsProps = HTMLAttributes<HTMLDivElement>;

export const AIInputTools = ({ className, ...props }: AIInputToolsProps) => (
  <div
    className={cn(
      "flex items-center gap-1",
      "[&_button:first-child]:rounded-bl-xl",
      className,
    )}
    {...props}
  />
);

export type AIInputButtonProps = ComponentProps<typeof Button>;

export const AIInputButton = ({
  variant = "ghost",
  className,
  size,
  children,
  ...props
}: AIInputButtonProps) => {
  const newSize = (size ?? Children.count(children) > 1) ? "default" : "icon";

  return (
    <Button
      className={cn(
        "shrink-0 gap-1.5 rounded-lg transition-all",
        variant === "ghost" &&
          "text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30",
        newSize === "default" && "px-3",
        className,
      )}
      size={newSize}
      type="button"
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  );
};

export type AIInputSubmitProps = ComponentProps<typeof Button> & {
  status?: "submitted" | "streaming" | "ready" | "error";
};

export const AIInputSubmit = ({
  className,
  variant = "default",
  size = "icon",
  status,
  children,
  ...props
}: AIInputSubmitProps) => {
  let Icon = <SendIcon className="size-4" />;
  let statusClasses = "";

  if (status === "submitted") {
    Icon = <Loader2Icon className="size-4 animate-spin" />;
  } else if (status === "streaming") {
    Icon = <SquareIcon className="size-4" />;
  } else if (status === "error") {
    Icon = <XIcon className="size-4" />;
    statusClasses = "bg-destructive hover:bg-destructive/90";
  }

  const defaultClasses =
    "bg-teal-500 hover:bg-teal-600 text-white disabled:bg-teal-300 dark:disabled:bg-teal-800";

  return (
    <Button
      className={cn(
        "gap-1.5 rounded-md rounded-br-lg",
        !statusClasses && defaultClasses,
        statusClasses,
        className,
      )}
      size={size}
      type="submit"
      variant={variant}
      {...props}
    >
      {children ?? Icon}
    </Button>
  );
};

// Model Select Components
export type AIInputModelSelectProps = ComponentProps<typeof Select>;

export const AIInputModelSelect = (props: AIInputModelSelectProps) => (
  <Select {...props} />
);

export type AIInputModelSelectTriggerProps = ComponentProps<
  typeof SelectTrigger
>;

export const AIInputModelSelectTrigger = ({
  className,
  ...props
}: AIInputModelSelectTriggerProps) => (
  <SelectTrigger
    className={cn(
      "border-none bg-transparent font-medium text-muted-foreground shadow-none transition-colors",
      "hover:bg-teal-50 dark:hover:bg-teal-950/30 hover:text-teal-600 dark:hover:text-teal-400",
      "data-[state=open]:bg-teal-50 dark:data-[state=open]:bg-teal-950/30 data-[state=open]:text-teal-600 dark:data-[state=open]:text-teal-400",
      className,
    )}
    {...props}
  />
);

export type AIInputModelSelectContentProps = ComponentProps<
  typeof SelectContent
>;

export const AIInputModelSelectContent = ({
  className,
  ...props
}: AIInputModelSelectContentProps) => (
  <SelectContent
    className={cn("border-teal-200 dark:border-teal-800", className)}
    {...props}
  />
);

export type AIInputModelSelectItemProps = ComponentProps<typeof SelectItem>;

export const AIInputModelSelectItem = ({
  className,
  ...props
}: AIInputModelSelectItemProps) => (
  <SelectItem
    className={cn(
      "focus:bg-teal-50 dark:focus:bg-teal-950/30 focus:text-teal-600 dark:focus:text-teal-400",
      className,
    )}
    {...props}
  />
);

export type AIInputModelSelectValueProps = ComponentProps<typeof SelectValue>;

export const AIInputModelSelectValue = ({
  className,
  ...props
}: AIInputModelSelectValueProps) => (
  <SelectValue className={cn(className)} {...props} />
);
