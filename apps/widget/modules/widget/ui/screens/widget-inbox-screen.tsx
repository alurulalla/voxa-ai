"use client";

import { WidgetHeader } from "../components/widget-header";
import { ArrowLeftIcon, InboxIcon } from "lucide-react";
import { WidgetFooter } from "../components/widget-footer";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { cn } from "@workspace/ui/lib/utils";

export const WidgetInboxScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || ""),
  );
  const conversations = usePaginatedQuery(
    api.public.conversations.getMany,
    contactSessionId
      ? {
          contactSessionId,
        }
      : "skip",
    {
      initialNumItems: 2,
    },
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: conversations.status,
      loadMore: conversations.loadMore,
      loadSize: 2,
      observerEnabled: false,
    });

  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-x-2 px-2 py-1">
          <Button
            variant="transparent"
            size="sm"
            onClick={() => setScreen("selection")}
            className="hover:bg-white/20 text-white"
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
          <div className="flex items-center gap-2">
            <InboxIcon className="size-5 text-white" />
            <p className="font-medium text-white">Your Conversations</p>
          </div>
        </div>
      </WidgetHeader>
      <div className="flex flex-col flex-1 gap-y-2 p-4 overflow-y-auto">
        {conversations?.results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="rounded-full bg-teal-100 p-3 dark:bg-teal-900/50 mb-3">
              <InboxIcon className="size-6 text-teal-600 dark:text-teal-400" />
            </div>
            <p className="font-medium text-lg">No conversations yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start a chat to see it appear here
            </p>
          </div>
        ) : (
          conversations?.results.length > 0 &&
          conversations.results.map((conversation) => (
            <Button
              key={conversation._id}
              className="h-auto w-full justify-between py-3 px-4 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/30 group transition-all"
              onClick={() => {
                setConversationId(conversation._id);
                setScreen("chat");
              }}
              variant="outline"
            >
              <div className="flex w-full flex-col gap-2 overflow-hidden text-start">
                <div className="flex w-full items-center justify-between gap-x-2">
                  <p className="text-muted-foreground text-xs flex items-center gap-1">
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        conversation.status === "resolved"
                          ? "bg-teal-500"
                          : conversation.status === "escalated"
                            ? "bg-orange-500"
                            : "bg-amber-500",
                      )}
                    />
                    Chat
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(conversation._creationTime))}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between gap-x-2">
                  <p className="truncate text-sm font-medium group-hover:text-teal-700 dark:group-hover:text-teal-300">
                    {conversation.lastMessage?.text || "No messages yet"}
                  </p>
                  <ConversationStatusIcon
                    status={conversation.status}
                    className="shrink-0"
                  />
                </div>
              </div>
            </Button>
          ))
        )}
        <InfiniteScrollTrigger
          canLoadMore={canLoadMore}
          onLoadMore={handleLoadMore}
          isLoadingMore={isLoadingMore}
          ref={topElementRef}
        />
      </div>
      <WidgetFooter />
    </>
  );
};
