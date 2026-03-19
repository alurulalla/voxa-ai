"use client";
import { Button } from "@workspace/ui/components/button";
import { WidgetHeader } from "../components/widget-header";
import { ArrowLeftIcon, MenuIcon, BotIcon } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { useAction, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { cn } from "@workspace/ui/lib/utils";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || ""),
  );
  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
          contactSessionId,
          conversationId,
        }
      : "skip",
  );

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? {
          threadId: conversation.threadId,
          contactSessionId,
        }
      : "skip",
    { initialNumItems: 5 },
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 5,
      observerEnabled: false,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const createMessage = useAction(api.public.messages.create);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation || !contactSessionId) {
      return;
    }

    form.reset();
    await createMessage({
      threadId: conversation.threadId,
      prompt: values.message,
      contactSessionId,
    });
  };

  const onBack = () => {
    setConversationId(null);
    setScreen("inbox");
  };

  return (
    <>
      <WidgetHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-x-2">
            <Button
              size="icon"
              variant="transparent"
              onClick={onBack}
              className="hover:bg-white/20 text-white"
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-white/20 p-1 backdrop-blur-sm">
                <BotIcon className="size-4 text-white" />
              </div>
              <div className="flex flex-col">
                <p className="font-medium text-white text-sm">
                  Chat with Voxa AI
                </p>
                <p className="text-xs text-white/70">Online</p>
              </div>
            </div>
          </div>
          <Button
            size="icon"
            variant="transparent"
            className="hover:bg-white/20 text-white"
          >
            <MenuIcon className="size-4" />
          </Button>
        </div>
      </WidgetHeader>

      <AIConversation className="bg-muted/30">
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            ref={topElementRef}
            onLoadMore={handleLoadMore}
          />
          {toUIMessages(messages.results ?? [])?.map((message) => {
            return (
              <AIMessage
                key={message.id}
                from={message.role === "user" ? "user" : "assistant"}
              >
                <AIMessageContent>
                  <AIResponse>{message.content}</AIResponse>
                </AIMessageContent>
                {message.role === "assistant" ? (
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-teal-500/20 blur-sm" />
                    <DicebearAvatar
                      imageUrl="/logo.svg"
                      seed="assistant"
                      size={32}
                      className="relative ring-2 ring-teal-500/30"
                    />
                  </div>
                ) : (
                  <DicebearAvatar
                    seed={contactSessionId || "user"}
                    size={32}
                    className="ring-2 ring-transparent"
                  />
                )}
              </AIMessage>
            );
          })}
          <AIConversationScrollButton />
        </AIConversationContent>
      </AIConversation>

      <AIInput
        className="rounded-none border-x-0 border-t bg-background p-3"
        onSubmit={form.handleSubmit(onSubmit)}
        {...form}
      >
        <Controller
          control={form.control}
          disabled={conversation?.status === "resolved"}
          name="message"
          render={({ field }) => (
            <AIInputTextarea
              disabled={conversation?.status === "resolved"}
              onChange={field.onChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)();
                }
              }}
              placeholder={
                conversation?.status === "resolved"
                  ? "This conversation has been resolved."
                  : "Type your message..."
              }
              value={field.value}
              className={cn(
                "focus-visible:ring-teal-500 rounded-lg",
                conversation?.status === "resolved" && "opacity-60",
              )}
            />
          )}
        />
        <AIInputToolbar className="mt-2">
          <AIInputTools />
          <AIInputSubmit
            disabled={
              conversation?.status === "resolved" || !form.formState.isValid
            }
            status="ready"
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white disabled:bg-teal-300 dark:disabled:bg-teal-800"
          />
        </AIInputToolbar>
      </AIInput>
    </>
  );
};
