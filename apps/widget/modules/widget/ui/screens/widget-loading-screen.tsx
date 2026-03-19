"use client";

import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { LoaderIcon, SparklesIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type InitStep = "storage" | "org" | "session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const [step, setStep] = useState<InitStep>("org");
  const [sessionValid, setSessionValid] = useState(false);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setScreen = useSetAtom(screenAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || ""),
  );

  const validateOrganization = useAction(api.public.organizations.validate);

  useEffect(() => {
    if (step !== "org") {
      return;
    }

    setLoadingMessage("Finding organization Id");

    if (!organizationId) {
      setErrorMessage("Organization ID is required");
      setScreen("error");

      return;
    }

    setLoadingMessage("Verifying organization...");

    validateOrganization({ organizationId })
      .then((result) => {
        if (result.valid) {
          setOrganizationId(organizationId);
          setStep("session");
        } else {
          setErrorMessage(result.reason || "Invalid configuration");
          setScreen("error");
        }
      })
      .catch(() => {
        setErrorMessage("unable to verify organization");
        setScreen("error");
      });
  }, [
    step,
    organizationId,
    setErrorMessage,
    setScreen,
    setLoadingMessage,
    validateOrganization,
    setOrganizationId,
    setStep,
  ]);

  const validateContactSession = useMutation(
    api.public.contactSessions.validate,
  );
  useEffect(() => {
    if (step !== "session") {
      return;
    }
    setLoadingMessage("Finding contact session Id");
    if (!contactSessionId) {
      setSessionValid(false);
      setStep("done");

      return;
    }

    setLoadingMessage("Validating session...");

    validateContactSession({
      contactSessionId,
    })
      .then((result) => {
        setSessionValid(result.valid);
        setStep("done");
      })
      .catch(() => {
        setSessionValid(false);
        setStep("done");
      });
  }, [contactSessionId, setLoadingMessage, step, validateContactSession]);

  useEffect(() => {
    if (step !== "done") {
      return;
    }

    const hasValidSession = contactSessionId && sessionValid;
    setScreen(hasValidSession ? "selection" : "auth");
  }, [contactSessionId, sessionValid, setScreen, step]);

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-white/20 p-1.5 backdrop-blur-sm">
              <SparklesIcon className="size-5 text-white" />
            </div>
            <p className="font-bold text-2xl text-white drop-shadow-md">
              Connecting to Voxa AI
            </p>
          </div>
          <p className="text-base text-white/90">
            Please wait while we set up your experience
          </p>
        </div>
      </WidgetHeader>
      <div className="flex flex-col flex-1 justify-center items-center gap-y-4 p-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-teal-500/20 blur-xl animate-pulse" />
          <LoaderIcon className="size-8 text-teal-600 dark:text-teal-400 animate-spin relative" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="font-medium text-foreground">
            {loadingMessage || "Loading..."}
          </p>
          <p className="text-xs text-muted-foreground">
            This will only take a moment
          </p>
        </div>
      </div>
    </>
  );
};
