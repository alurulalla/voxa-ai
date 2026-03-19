import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { SparklesIcon, UserIcon, MailIcon, ArrowRightIcon } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export const WidgetAuthScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const setContactSessionId = useSetAtom(
    contactSessionIdAtomFamily(organizationId || ""),
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const createContactSession = useMutation(api.public.contactSessions.create);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!organizationId) {
      return;
    }

    const metadata: Doc<"contactSessions">["metadata"] = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages?.join(","),
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      timezoneOffset: new Date().getTimezoneOffset(),
      cookieEnabled: navigator.cookieEnabled,
      referrer: document.referrer || "direct",
      currentUrl: window.location.href,
    };

    const contactSessionsId = await createContactSession({
      ...values,
      organizationId,
      metadata,
    });

    setContactSessionId(contactSessionsId);
    setScreen("selection");
  };

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-3 px-2 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
              <SparklesIcon className="size-6 text-white" />
            </div>
            <p className="font-bold text-2xl text-white drop-shadow-md sm:text-3xl">
              Chat with Voxa AI
            </p>
          </div>
          <p className="text-base text-white/90 sm:text-lg">
            Welcome! Please introduce yourself to get started
          </p>
        </div>
      </WidgetHeader>
      <form
        className="flex flex-1 flex-col gap-y-4 p-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    placeholder="e.g. John Doe"
                    autoComplete="off"
                    type="text"
                    className="h-10 bg-background pl-9 focus-visible:ring-teal-500"
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    placeholder="e.g. john.doe@example.com"
                    autoComplete="off"
                    type="email"
                    className="h-10 bg-background pl-9 focus-visible:ring-teal-500"
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          disabled={form.formState.isSubmitting}
          size="lg"
          type="submit"
          className="bg-teal-500 hover:bg-teal-600 text-white disabled:bg-teal-300 dark:disabled:bg-teal-800"
        >
          {form.formState.isSubmitting ? (
            "Starting chat..."
          ) : (
            <>
              Continue
              <ArrowRightIcon className="size-4 ml-2" />
            </>
          )}
        </Button>
      </form>
    </>
  );
};
