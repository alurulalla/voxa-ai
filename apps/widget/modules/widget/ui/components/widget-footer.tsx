import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useAtomValue, useSetAtom } from "jotai";
import { HomeIcon, InboxIcon } from "lucide-react";
import { screenAtom } from "../../atoms/widget-atoms";

export const WidgetFooter = () => {
  const screen = useAtomValue(screenAtom);
  const setScreen = useSetAtom(screenAtom);

  return (
    <footer className="flex items-center justify-between border-t bg-background">
      <Button
        className="h-14 flex-1 rounded-none hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors"
        onClick={() => setScreen("selection")}
        size="icon"
        variant="ghost"
      >
        <HomeIcon
          className={cn(
            "size-5 transition-colors",
            screen === "selection"
              ? "text-teal-600 dark:text-teal-400"
              : "text-muted-foreground",
          )}
        />
      </Button>
      <Button
        className="h-14 flex-1 rounded-none hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors"
        onClick={() => setScreen("inbox")}
        size="icon"
        variant="ghost"
      >
        <InboxIcon
          className={cn(
            "size-5 transition-colors",
            screen === "inbox"
              ? "text-teal-600 dark:text-teal-400"
              : "text-muted-foreground",
          )}
        />
      </Button>
    </footer>
  );
};
