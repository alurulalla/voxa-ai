"use client";

import { api } from "@workspace/backend/_generated/api";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { usePaginatedQuery } from "convex/react";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  CornerUpLeftIcon,
  FilterIcon,
  MailQuestionIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  UsersIcon,
  ClockIcon,
} from "lucide-react";
import {
  getCountriesFromTimezone,
  getCountryFlagUrl,
} from "@/lib/country-utils";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname } from "next/navigation";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { formatDistanceToNow } from "date-fns";
import { useAtomValue, useSetAtom } from "jotai/react";
import { statusFilterAtom } from "../../atoms";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const ConversationsPanel = () => {
  const pathName = usePathname();
  const statusFilter = useAtomValue(statusFilterAtom);
  const setStatusFilter = useSetAtom(statusFilterAtom);

  const conversations = usePaginatedQuery(
    api.private.conversations.getMany,
    {
      status: statusFilter === "all" ? undefined : statusFilter,
    },
    {
      initialNumItems: 5,
    },
  );

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingFirstPage,
    isLoadingMore,
  } = useInfiniteScroll({
    status: conversations.status,
    loadMore: conversations.loadMore,
    loadSize: 5,
    observerEnabled: false,
  });

  return (
    <div className="flex h-full w-full flex-col bg-background text-sidebar-foreground">
      <div className="flex flex-col gap-3.5 border-b p-2">
        <Select
          defaultValue="all"
          onValueChange={(value) =>
            setStatusFilter(
              value as "unresolved" | "escalated" | "resolved" | "all",
            )
          }
          value={statusFilter}
        >
          <SelectTrigger className="h-8 border-none px-1.5 shadow-none ring-0 hover:bg-teal-50 dark:hover:bg-teal-950/30 hover:text-teal-600 dark:hover:text-teal-400 focus-visible:ring-0">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <FilterIcon className="size-4 text-teal-600 dark:text-teal-400" />
                <span>All Conversations</span>
              </div>
            </SelectItem>
            <SelectItem value="unresolved">
              <div className="flex items-center gap-2">
                <MailQuestionIcon className="size-4 text-amber-600 dark:text-amber-400" />
                <span>Unresolved</span>
              </div>
            </SelectItem>
            <SelectItem value="escalated">
              <div className="flex items-center gap-2">
                <AlertTriangleIcon className="size-4 text-orange-600 dark:text-orange-400" />
                <span>Escalated</span>
              </div>
            </SelectItem>
            <SelectItem value="resolved">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="size-4 text-teal-600 dark:text-teal-400" />
                <span>Resolved</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoadingFirstPage ? (
        <SkeletonConversations />
      ) : (
        <ScrollArea className="max-h-[calc(100vh-53px)]">
          <div className="flex w-full flex-1 flex-col text-sm">
            {conversations.results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <UsersIcon className="h-12 w-12 text-teal-200 dark:text-teal-800 mb-3" />
                <h3 className="font-medium text-lg">No conversations yet</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  When customers start chatting, they'll appear here
                </p>
              </div>
            ) : (
              conversations.results.map((conversation) => {
                const isLastMessageFromOperator =
                  conversation.lastMessage?.message?.role !== "user";

                const country = getCountriesFromTimezone(
                  conversation.contactSession.metadata?.timezone,
                );

                const countryFlagUrl = country?.code
                  ? getCountryFlagUrl(country.code)
                  : undefined;

                return (
                  <Link
                    key={conversation._id}
                    href={`/conversations/${conversation._id}`}
                    className={cn(
                      "relative flex cursor-pointer items-start gap-3 border-b p-4 py-5 text-sm leading-tight transition-all duration-200",
                      "hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-white dark:hover:from-teal-950/20 dark:hover:to-transparent",
                      pathName === `/conversations/${conversation._id}` &&
                        "bg-gradient-to-r from-teal-50 to-white dark:from-teal-950/30 dark:to-transparent border-l-2 border-l-teal-500",
                    )}
                  >
                    <div
                      className={cn(
                        "-translate-y-1/2 absolute top-1/2 left-0 h-[64%] w-1 rounded-r-full bg-teal-500 opacity-0 transition-opacity",
                        pathName === `/conversations/${conversation._id}` &&
                          "opacity-100",
                      )}
                    />
                    <DicebearAvatar
                      seed={conversation.contactSession._id}
                      //badgeImageUrl={countryFlagUrl}
                      size={40}
                      className="shrink-0 ring-2 ring-transparent transition-all duration-200 group-hover:ring-teal-400 dark:group-hover:ring-teal-500 group-hover:ring-offset-2 ring-offset-background font-medium"
                    />
                    <div className="flex-1">
                      <div className="flex w-full items-center gap-2">
                        <span className="truncate font-medium group-hover:text-teal-700 dark:group-hover:text-teal-300">
                          {conversation.contactSession.name}
                        </span>
                        <span className="ml-auto shrink-0 flex items-center gap-1 text-muted-foreground text-xs">
                          <ClockIcon className="size-3" />
                          {formatDistanceToNow(conversation._creationTime)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <div className="flex w-0 grow items-center gap-1">
                          {isLastMessageFromOperator && (
                            <CornerUpLeftIcon className="size-3 shrink-0 text-teal-500" />
                          )}
                          <span
                            className={cn(
                              "line-clamp-1 text-muted-foreground text-xs",
                              !isLastMessageFromOperator &&
                                "font-medium text-foreground",
                            )}
                          >
                            {conversation.lastMessage?.text ||
                              "No messages yet"}
                          </span>
                        </div>
                        <ConversationStatusIcon status={conversation.status} />
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
            <InfiniteScrollTrigger
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              ref={topElementRef}
            />
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export const SkeletonConversations = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
      <div className="relative flex w-full min-w-0 flex-col p-2">
        <div className="w-full space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="flex items-start gap-3 rounded-lg p-4" key={index}>
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <div className="flex w-full items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="ml-auto h-3 w-12 shrink-0" />
                </div>
                <div className="mt-2">
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
