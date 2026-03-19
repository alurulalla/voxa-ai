"use client";

import { useAtomValue } from "jotai";
import { errorMessageAtom } from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { AlertTriangleIcon, XCircleIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export const WidgetErrorScreen = () => {
  const errorMessage = useAtomValue(errorMessageAtom);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-white/20 p-1.5 backdrop-blur-sm">
              <XCircleIcon className="size-5 text-white" />
            </div>
            <p className="font-bold text-2xl text-white drop-shadow-md">
              Oops! Something went wrong
            </p>
          </div>
          <p className="text-base text-white/90">
            We encountered an issue while setting up your experience
          </p>
        </div>
      </WidgetHeader>
      <div className="flex flex-col flex-1 justify-center items-center gap-y-4 p-4">
        <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
          <AlertTriangleIcon className="size-8 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex flex-col items-center gap-2 text-center max-w-xs">
          <p className="font-medium text-foreground">Error Details</p>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            {errorMessage || "Invalid configuration"}
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          className="mt-4 bg-teal-500 hover:bg-teal-600 text-white"
        >
          Try Again
        </Button>
      </div>
    </>
  );
};
