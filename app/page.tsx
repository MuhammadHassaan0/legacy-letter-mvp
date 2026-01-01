"use client";

import { FormEvent, useMemo, useState } from "react";

type Prompt = {
  id: string;
  title: string;
  placeholder: string;
  description?: string;
};

const PROMPTS: Prompt[] = [
  {
    id: "opening",
    title:
      "If someone important to you were hearing this many years from now, what would you want them to understand about the way you lived your life?",
    placeholder: "Share the moments or beliefs that shaped your path."
  },
  {
    id: "values",
    title:
      "What principles or values do you believe should never be compromised, regardless of the situation?",
    placeholder: "Name the values you want to pass along."
  },
  {
    id: "memories",
    title:
      "In your own words, what does a life well lived look like to you?",
    placeholder: "Describe the qualities of a life that feels complete."
  },
  {
    id: "lessons",
    title:
      "Is there a mistake, habit, or way of thinking that you hope those who come after you can avoid?",
    placeholder: "Offer a gentle warning or lesson learned."
  },
  {
    id: "hopes",
    title:
      "Is there something about you—your choices, your character, or your intentions—that people often misunderstand?",
    placeholder: "Clarify what you hope others come to see clearly."
  },
  {
    id: "closing",
    title:
      "If this message were played during a difficult or important decision, what guidance would you want it to offer?",
    placeholder: "Share the counsel that would steady someone you love."
  }
];

type Responses = Record<string, string>;

type PersonalDetails = {
  name: string;
  email: string;
};

const buildInitialResponses = (): Responses =>
  PROMPTS.reduce<Responses>((acc, prompt) => {
    acc[prompt.id] = "";
    return acc;
  }, {});

const formatLetter = (
  responses: Responses,
  timestamp: Date,
  details: PersonalDetails
) => {
  const formattedTimestamp = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short"
  }).format(timestamp);

  const aboutLines: string[] = [];
  if (details.name.trim()) {
    aboutLines.push(`Name: ${details.name.trim()}`);
  }
  if (details.email.trim()) {
    aboutLines.push(`Email: ${details.email.trim()}`);
  }
  const aboutSection =
    aboutLines.length > 0 ? `${aboutLines.join("\n")}\n\n` : "";

  const body = PROMPTS.map((prompt) => {
    const answer = responses[prompt.id].trim() || "[Not provided]";
    return `${prompt.title}\n${answer}`;
  }).join("\n\n");

  return `Legacy Letter\nCreated on: ${formattedTimestamp}\n\n${aboutSection}${body}\n`;
};

export default function Home() {
  const [responses, setResponses] = useState<Responses>(buildInitialResponses);
  const [details, setDetails] = useState<PersonalDetails>({
    name: "",
    email: ""
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const totalQuestions = PROMPTS.length;
  const isOptionalStep = currentStep === 0;
  const activePrompt = !isOptionalStep
    ? PROMPTS[currentStep - 1]
    : undefined;

  const allComplete = useMemo(
    () =>
      PROMPTS.every((prompt) => responses[prompt.id].trim().length > 0),
    [responses]
  );

  const previewLetter = useMemo(() => {
    return formatLetter(responses, new Date(), details);
  }, [responses, details]);

  const currentAnswer = activePrompt ? responses[activePrompt.id] : "";
  const currentAnswerValid =
    isOptionalStep || currentAnswer.trim().length > 0;

  const progressPercentage =
    (Math.min(currentStep, totalQuestions) / totalQuestions) * 100;

  const handleNext = () => {
    setShowErrors(false);
    if (currentStep < totalQuestions) {
      setCurrentStep((previous) => previous + 1);
    }
  };

  const handleBack = () => {
    setShowErrors(false);
    setCurrentStep((previous) => Math.max(0, previous - 1));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!allComplete) {
      setShowErrors(true);
      return;
    }

    const now = new Date();
    const letter = formatLetter(responses, now, details);
    const fileName = `legacy-letter-${now.toISOString().replace(/[:.]/g, "-")}.txt`;

    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setShowErrors(false);
    setLastSavedAt(
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "short"
      }).format(now)
    );
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-12 text-slate-800 md:px-10 lg:px-16">
      <section className="rounded-3xl bg-white/80 p-8 shadow-sm ring-1 ring-slate-200 backdrop-blur">
        <header className="flex flex-col gap-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-600">
            Legacy Letter
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Capture your reflections with care
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
            These six reflections guide you through crafting a letter that
            honors your journey and the people who matter most. Take a breath,
            answer at your own pace, and download your words when they feel
            complete.
          </p>
          <p className="text-sm font-medium text-brand-600">
            Most people finish in about 10 minutes.
          </p>
        </header>
      </section>

      <form
        className="flex flex-col gap-10 pb-20"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
                  {isOptionalStep
                    ? "About you (optional)"
                    : `Question ${currentStep} of ${totalQuestions}`}
                </p>
                <p className="text-xs text-slate-500">
                  Nothing is uploaded or stored.
                </p>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>

            {isOptionalStep ? (
              <div className="flex flex-col gap-4">
                <p className="text-base leading-relaxed text-slate-700">
                  Add your details if you&apos;d like them woven into the letter.
                  You can leave these blank.
                </p>
                <label className="flex flex-col gap-2 text-sm text-slate-700">
                  Name
                  <input
                    type="text"
                    value={details.name}
                    onChange={(event) =>
                      setDetails((previous) => ({
                        ...previous,
                        name: event.target.value
                      }))
                    }
                    placeholder="Your name (optional)"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 shadow-inner outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-700">
                  Email
                  <input
                    type="email"
                    value={details.email}
                    onChange={(event) =>
                      setDetails((previous) => ({
                        ...previous,
                        email: event.target.value
                      }))
                    }
                    placeholder="Your email (optional)"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 shadow-inner outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-200"
                  />
                </label>
              </div>
            ) : activePrompt ? (
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-slate-900">
                  {activePrompt.title}
                </h2>
                {activePrompt.description ? (
                  <p className="text-sm leading-relaxed text-slate-600">
                    {activePrompt.description}
                  </p>
                ) : null}
                <label className="sr-only" htmlFor={activePrompt.id}>
                  {activePrompt.title}
                </label>
                <textarea
                  id={activePrompt.id}
                  name={activePrompt.id}
                  value={currentAnswer}
                  onChange={(event) =>
                    setResponses((previous) => ({
                      ...previous,
                      [activePrompt.id]: event.target.value
                    }))
                  }
                  placeholder={activePrompt.placeholder}
                  className="min-h-[200px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base leading-relaxed text-slate-800 shadow-inner outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-200"
                />
                <p className="text-xs text-slate-500">
                  Tip: you can use system dictation to speak instead of typing.
                </p>
                {!currentAnswerValid && showErrors ? (
                  <p className="text-sm font-medium text-brand-600">
                    Please add a few words here so your letter feels complete.
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="inline-flex items-center justify-center rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                >
                  Back
                </button>
              </div>
              {currentStep < totalQuestions ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!currentAnswerValid}
                  className="inline-flex items-center justify-center rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:bg-brand-200"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!currentAnswerValid}
                  className="inline-flex items-center justify-center rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:bg-brand-200"
                >
                  Generate my letter
                </button>
              )}
            </div>
          </div>
        </div>

        <section className="rounded-3xl bg-white/70 p-6 shadow-inner ring-1 ring-slate-200 backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-900">Letter preview</h2>
          <p className="mt-1 text-sm text-slate-500">
            This gives you a sense of how your reflections will appear in the
            downloaded file.
          </p>
          <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-900/5 p-4 text-sm leading-relaxed text-slate-700">
            {previewLetter}
          </pre>
        </section>

        <div className="flex flex-col gap-4 rounded-3xl border border-brand-100 bg-brand-50/70 p-6 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-brand-800">
                Ready to download?
              </h2>
              <p className="text-sm text-brand-600">
                Your letter saves locally on download. We do not store anything.
              </p>
            </div>
            <p className="text-sm text-brand-600">
              Return to earlier questions anytime to revise before you export.
            </p>
          </div>
          {!allComplete && showErrors ? (
            <p className="text-sm font-medium text-brand-700">
              Please take a moment to fill every reflection so the letter feels
              whole.
            </p>
          ) : null}
          {lastSavedAt ? (
            <p className="text-sm text-brand-600">
              Last downloaded on {lastSavedAt}.
            </p>
          ) : (
            <p className="text-sm text-brand-500">
              You can revise as often as you like. Download when it feels right.
            </p>
          )}
        </div>
      </form>
    </main>
  );
}
