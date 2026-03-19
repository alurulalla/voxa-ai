import { Hint } from "@workspace/ui/components/hint";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import {
  CheckCircleIcon,
  AlertTriangleIcon,
  MailQuestionIcon,
  ArrowRightIcon,
} from "lucide-react";

export const ConversationStatusButton = ({
  status,
  onClick,
  disabled,
}: {
  status: Doc<"conversations">["status"];
  onClick: () => void;
  disabled?: boolean;
}) => {
  if (status === "resolved") {
    return (
      <Hint text="Mark as unresolved">
        <Button
          disabled={disabled}
          onClick={onClick}
          size="sm"
          variant="outline"
          className="border-teal-500 bg-teal-500 text-white hover:bg-teal-600 hover:text-white dark:border-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
        >
          <CheckCircleIcon className="size-4" />
          Resolved
        </Button>
      </Hint>
    );
  }

  if (status === "escalated") {
    return (
      <Hint text="Mark as resolved">
        <Button
          disabled={disabled}
          onClick={onClick}
          size="sm"
          variant="outline"
          className="border-orange-500 bg-orange-500 text-white hover:bg-orange-600 hover:text-white dark:border-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
        >
          <AlertTriangleIcon className="size-4" />
          Escalated
        </Button>
      </Hint>
    );
  }

  return (
    <Hint text="Mark as escalated">
      <Button
        disabled={disabled}
        onClick={onClick}
        size="sm"
        variant="outline"
        className="border-amber-500 bg-amber-500 text-white hover:bg-amber-600 hover:text-white dark:border-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
      >
        <MailQuestionIcon className="size-4" />
        Unresolved
      </Button>
    </Hint>
  );
};
