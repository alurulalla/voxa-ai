"use client";
import { Button } from "@workspace/ui/components/button";
import { WidgetHeader } from "../components/widget-header";
import {
  MessageSquareTextIcon,
  ChevronRightIcon,
  SparklesIcon,
  MicIcon,
} from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  errorMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";
import { WidgetFooter } from "../components/widget-footer";

export const WidgetSelectionScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || ""),
  );
  const setConversationId = useSetAtom(conversationIdAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);

  const createConversation = useMutation(api.public.conversations.create);
  const [isPending, setIsPending] = useState(false);
  const [isVoicePending, setIsVoicePending] = useState(false);

  const handleNewConversation = async () => {
    if (!contactSessionId) {
      setScreen("auth");
    }

    if (!organizationId) {
      setScreen("error");
      setErrorMessage("Missing Organization ID");

      return;
    }

    if (!contactSessionId) {
      setScreen("auth");
      return;
    }

    setIsPending(true);

    try {
      const conversationId = await createConversation({
        contactSessionId,
        organizationId,
      });
      setConversationId(conversationId);
      setScreen("chat");
    } catch {
      setScreen("auth");
    } finally {
      setIsPending(false);
    }
  };

  const handleVoiceConversation = async () => {
    if (!contactSessionId) {
      setScreen("auth");
    }

    if (!organizationId) {
      setScreen("error");
      setErrorMessage("Missing Organization ID");
      return;
    }

    if (!contactSessionId) {
      setScreen("auth");
      return;
    }

    setIsVoicePending(true);

    try {
      const conversationId = await createConversation({
        contactSessionId,
        organizationId,
      });
      setConversationId(conversationId);
      // TODO: Navigate to voice conversation screen
      // setScreen("voice-chat");
    } catch {
      setScreen("auth");
    } finally {
      setIsVoicePending(false);
    }
  };

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-3 px-2 py-6">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-white/20 p-1.5 backdrop-blur-sm">
              <SparklesIcon className="size-5 text-white" />
            </div>
            <p className="font-bold text-2xl text-white drop-shadow-md">
              How would you like to chat?
            </p>
          </div>
          <p className="text-base text-white/90">
            Choose your preferred way to connect with Voxa AI
          </p>
        </div>
      </WidgetHeader>

      <div className="flex flex-col flex-1 overflow-y-auto gap-y-4 p-4">
        <div className="space-y-3">
          {/* Text Chat Option */}
          <Button
            className="h-auto w-full justify-between py-4 px-5 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/30 group"
            variant="outline"
            onClick={handleNewConversation}
            disabled={isPending || isVoicePending}
          >
            <div className="flex items-center gap-x-3">
              <div className="rounded-full bg-teal-100 p-2 dark:bg-teal-900/50 group-hover:bg-teal-200 dark:group-hover:bg-teal-800/50 transition-colors">
                <MessageSquareTextIcon className="size-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="font-medium text-base">Text conversation</span>
                <span className="text-xs text-muted-foreground">
                  {isPending ? "Starting chat..." : "Chat via text messages"}
                </span>
              </div>
            </div>
            <ChevronRightIcon className="size-5 text-muted-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
          </Button>

          {/* Voice Chat Option */}
          <Button
            className="h-auto w-full justify-between py-4 px-5 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/30 group"
            variant="outline"
            onClick={handleVoiceConversation}
            disabled={isPending || isVoicePending}
          >
            <div className="flex items-center gap-x-3">
              <div className="rounded-full bg-teal-100 p-2 dark:bg-teal-900/50 group-hover:bg-teal-200 dark:group-hover:bg-teal-800/50 transition-colors">
                <MicIcon className="size-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="font-medium text-base">
                  Voice conversation
                </span>
                <span className="text-xs text-muted-foreground">
                  {isVoicePending
                    ? "Starting voice chat..."
                    : "Talk naturally with AI"}
                </span>
              </div>
            </div>
            <ChevronRightIcon className="size-5 text-muted-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
          </Button>
        </div>
      </div>

      <WidgetFooter />
    </>
  );
};
