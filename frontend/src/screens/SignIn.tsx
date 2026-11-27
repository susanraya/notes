// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Input, Label } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Check, ChevronRight, Clock, AlertCircle, CheckCircle } = Icons;

const LAST_SESSION = {
  endedReason: "expired",
  endedCopy: "Your session ended after 30 minutes without activity.",
  lastActive: "25 Nov 2026, 18:42",
  rememberedEmail: "susan.raya@quorq.ai",
};

const SAMPLE_EXCERPT = {
  title: "Thursday — cellar tasting",
  folder: "Field notes",
  date: "24 Nov 2026",
  lines: [
    "Three bottles from the north rack, opened at four.",
    "The 2019 is still tight — give it eighteen months.",
    "Ask Marguerite about the cork supplier in Beaune.",
  ],
};

function isEmailish(value) {
  const v = String(value).trim();
  return v.length > 3 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

export default function Screen() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState(LAST_SESSION.rememberedEmail);
  const [password, setPassword] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState({ email: "", password: "" });
  const [status, setStatus] = React.useState("idle"); // idle | submitting | error | success
  const [formError, setFormError] = React.useState("");
  const [resetNote, setResetNote] = React.useState("");
  const [online, setOnline] = React.useState(
    typeof navigator === "undefined" || navigator.onLine !== false,
  );

  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const timers = React.useRef([]);

  React.useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const after = (ms, fn) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  const busy = status === "submitting" || status === "success";

  const surface = "rgba(255,255,255,0.035)";
  const surfaceHi = "rgba(255,255,255,0.055)";
  const hairline = "rgba(255,255,255,0.11)";
  const hairlineSoft = "rgba(255,255,255,0.07)";

  function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setResetNote("");

    const next = { email: "", password: "" };
    if (!email.trim()) next.email = "Enter the email address on your account.";
    else if (!isEmailish(email)) next.email = "That does not look like an email address.";
    if (!password) next.password = "Enter your password.";

    setFieldErrors(next);

    if (next.email || next.password) {
      setStatus("idle");
      setFormError("");
      if (next.email && emailRef.current) emailRef.current.focus();
      else if (next.password && passwordRef.current) passwordRef.current.focus();
      return;
    }

    if (!online) {
      setStatus("error");
      setFormError(
        "No connection. Notes needs to reach the server to sign you in — your email and password are still here.",
      );
      return;
    }

    setFormError("");
    setStatus("submitting");

    after(900, () => {
      if (password.length < 8) {
        setStatus("error");
        setFormError(
          "We could not sign you in with that email and password. Check both and try again.",
        );
        if (passwordRef.current) passwordRef.current.focus();
        return;
      }
      setStatus("success");
      after(650, () => navigate("notes"));
    });
  }

  function handleForgot() {
    if (busy) return;
    setFormError("");
    if (!isEmailish(email)) {
      setFieldErrors((f) => ({
        ...f,
        email: "Add your email address first — the reset link goes there.",
      }));
      if (emailRef.current) emailRef.current.focus();
      return;
    }
    setFieldErrors((f) => ({ ...f, email: "" }));
    setResetNote(
      "If an account exists for " +
        email.trim() +
        ", a reset link is on its way. It expires in 30 minutes.",
    );
  }

  const fieldStyle = {
    backgroundColor: "rgba(255,255,255,0.045)",
    border: "1px solid " + hairline,
    borderRadius: brand.radius,
    color: brand.primaryColor,
    fontFamily: brand.fontBody,
  };

  const linkBtnClass =
    "v-focus v-link w-full text-left text-sm py-3 px-1 rounded-sm transition-colors duration-200";

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: brand.backgroundColor,
        color: brand.primaryColor,
        fontFamily: brand.fontBody,
        ["--v-accent"]: brand.accentColor,
        ["--v-muted"]: brand.neutralColor,
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .v-focus:focus-visible { outline: 2px solid var(--v-accent); outline-offset: 3px; border-radius: 4px; }
          .v-field:focus { outline: none; border-color: var(--v-accent) !important; box-shadow: 0 0 0 1px var(--v-accent); }
          .v-field::placeholder { color: var(--v-muted); opacity: .75; }
          .v-link { color: var(--v-muted); }
          .v-link:hover { color: var(--v-accent); }
          .v-primary { transition: filter .18s ease, opacity .18s ease; }
          .v-primary:hover:not(:disabled) { filter: brightness(1.07); }
          .v-primary:active:not(:disabled) { filter: brightness(.94); }
          .v-primary:disabled { opacity: .55; cursor: not-allowed; }
          @keyframes vRise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
          @keyframes vFade { from { opacity: 0; } to { opacity: 1; } }
          @keyframes vPulse { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
          .v-rise { animation: vRise .42s cubic-bezier(.22,.61,.36,1) both; }
          .v-fade { animation: vFade .3s ease both; }
          .v-dot { animation: vPulse 1.1s ease-in-out infinite; }
          .v-dot:nth-child(2) { animation-delay: .15s; }
          .v-dot:nth-child(3) { animation-delay: .3s; }
          @media (prefers-reduced-motion: reduce) {
            .v-rise, .v-fade, .v-dot { animation: none !important; }
          }
        `,
        }}
      />

      <div className="mx-auto grid min-h-screen w-full max-w-[1200px] grid-cols-1 lg:grid-cols-12">
        {/* Editorial panel — brand side */}
        <aside
          className="hidden lg:flex lg:col-span-5 flex-col justify-between px-12 py-14"
          style={{ borderRight: "1px solid " + hairlineSoft }}
        >
          <div>
            <p
              className="text-[11px] uppercase tracking-[0.3em]"
              style={{ color: brand.accentColor }}
            >
              Notes
            </p>
            <p
              className="mt-6 text-[30px] leading-[1.35]"
              style={{ fontFamily: brand.fontHeading, color: brand.primaryColor }}
            >
              A quiet place for
              <br />
              everything you keep.
            </p>
            <div className="mt-6 h-px w-16" style={{ backgroundColor: brand.accentColor }} />
          </div>

          {/* Signature element: ruled sheet with a real excerpt */}
          <div
            className="v-rise mt-12 overflow-hidden"
            style={{
              backgroundColor: surface,
              border: "1px solid " + hairlineSoft,
              borderRadius: brand.radius,
              borderLeft: "2px solid " + brand.accentColor,
            }}
          >
            <div className="px-7 pt-6 pb-2">
              <p
                className="text-[19px]"
                style={{ fontFamily: brand.fontHeading, color: brand.primaryColor }}
              >
                {SAMPLE_EXCERPT.title}
              </p>
              <p
                className="mt-2 text-[11px] uppercase tracking-[0.22em]"
                style={{ color: brand.neutralColor, fontVariantNumeric: "tabular-nums" }}
              >
                {SAMPLE_EXCERPT.folder} · {SAMPLE_EXCERPT.date}
              </p>
            </div>
            <ul className="px-7 pb-6">
              {SAMPLE_EXCERPT.lines.map((line) => (
                <li
                  key={line}
                  className="py-3 text-[14px] leading-relaxed"
                  style={{
                    color: brand.neutralColor,
                    borderBottom: "1px solid " + hairlineSoft,
                  }}
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <p
            className="mt-12 max-w-[42ch] text-[13px] leading-relaxed"
            style={{ color: brand.neutralColor }}
          >
            Every note belongs to one account and is visible only to it. Signing out ends the
            session on this device straight away.
          </p>
        </aside>

        {/* Sign-in column */}
        <main className="lg:col-span-7 flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-[440px]">
            <p
              className="lg:hidden mb-8 text-[11px] uppercase tracking-[0.3em]"
              style={{ color: brand.accentColor }}
            >
              Notes
            </p>

            {/* b-0-0 page title */}
            <div data-wf="b-0-0">
              <h1
                className="text-[34px] leading-tight sm:text-[40px]"
                style={{ fontFamily: brand.fontHeading, color: brand.primaryColor }}
              >
                Sign in to Notes
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed" style={{ color: brand.neutralColor }}>
                Your note list is waiting behind this page.
              </p>
            </div>

            {/* Session-expired notice */}
            <div
              className="v-fade mt-8 flex items-start gap-3 px-4 py-4"
              style={{
                backgroundColor: surface,
                border: "1px solid " + hairline,
                borderLeft: "2px solid " + brand.accentColor,
                borderRadius: brand.radius,
              }}
            >
              <Clock
                className="mt-[2px] h-4 w-4 shrink-0"
                style={{ color: brand.accentColor }}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] leading-relaxed" style={{ color: brand.primaryColor }}>
                  {LAST_SESSION.endedCopy} Sign in again to open your notes.
                </p>
                <p
                  className="mt-1 text-[12px]"
                  style={{ color: brand.neutralColor, fontVariantNumeric: "tabular-nums" }}
                >
                  Last active {LAST_SESSION.lastActive}
                </p>
              </div>
            </div>

            {/* Offline / stale state */}
            {!online && (
              <div
                className="v-fade mt-4 flex items-start gap-3 px-4 py-4"
                style={{
                  backgroundColor: surfaceHi,
                  border: "1px dashed " + hairline,
                  borderRadius: brand.radius,
                }}
                role="status"
              >
                <AlertCircle
                  className="mt-[2px] h-4 w-4 shrink-0"
                  style={{ color: brand.accentColor }}
                  aria-hidden="true"
                />
                <p className="text-[13px] leading-relaxed" style={{ color: brand.primaryColor }}>
                  <span className="font-medium">Offline.</span> Notes works online only. We will
                  keep what you have typed and let you sign in as soon as the connection returns.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-8">
              {/* b-1-0 form fields */}
              <div data-wf="b-1-0" className="space-y-6">
                <div>
                  <Label
                    htmlFor="signin-email"
                    className="block text-[11px] uppercase tracking-[0.22em]"
                    style={{ color: brand.neutralColor }}
                  >
                    Email address
                  </Label>
                  <Input
                    data-wf="i-1-0-0"
                    id="signin-email"
                    ref={emailRef}
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    value={email}
                    disabled={busy}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: "" }));
                    }}
                    aria-invalid={fieldErrors.email ? "true" : undefined}
                    aria-describedby={fieldErrors.email ? "signin-email-error" : undefined}
                    className="v-field mt-3 h-12 w-full px-4 text-[15px]"
                    style={{
                      ...fieldStyle,
                      borderColor: fieldErrors.email ? brand.accentColor : hairline,
                    }}
                  />
                  {fieldErrors.email && (
                    <p
                      id="signin-email-error"
                      className="v-fade mt-2 flex items-start gap-2 text-[13px]"
                      style={{ color: brand.accentColor }}
                    >
                      <AlertCircle className="mt-[2px] h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{fieldErrors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="signin-password"
                    className="block text-[11px] uppercase tracking-[0.22em]"
                    style={{ color: brand.neutralColor }}
                  >
                    Password
                  </Label>
                  <Input
                    data-wf="i-1-0-1"
                    id="signin-password"
                    ref={passwordRef}
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="&lt;your-password&gt;"
                    value={password}
                    disabled={busy}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors((f) => ({ ...f, password: "" }));
                      if (status === "error") {
                        setStatus("idle");
                        setFormError("");
                      }
                    }}
                    aria-invalid={fieldErrors.password ? "true" : undefined}
                    aria-describedby={fieldErrors.password ? "signin-password-error" : undefined}
                    className="v-field mt-3 h-12 w-full px-4 text-[15px]"
                    style={{
                      ...fieldStyle,
                      borderColor: fieldErrors.password ? brand.accentColor : hairline,
                    }}
                  />
                  {fieldErrors.password && (
                    <p
                      id="signin-password-error"
                      className="v-fade mt-2 flex items-start gap-2 text-[13px]"
                      style={{ color: brand.accentColor }}
                    >
                      <AlertCircle className="mt-[2px] h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{fieldErrors.password}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Form-level messages: error / reset confirmation / success */}
              <div aria-live="polite" className="min-h-[8px]">
                {status === "error" && formError && (
                  <div
                    role="alert"
                    className="v-fade mt-6 flex items-start gap-3 px-4 py-3"
                    style={{
                      backgroundColor: surfaceHi,
                      border: "1px solid " + brand.accentColor,
                      borderRadius: brand.radius,
                    }}
                  >
                    <AlertCircle
                      className="mt-[2px] h-4 w-4 shrink-0"
                      style={{ color: brand.accentColor }}
                      aria-hidden="true"
                    />
                    <p
                      className="text-[13px] leading-relaxed"
                      style={{ color: brand.primaryColor }}
                    >
                      {formError}
                    </p>
                  </div>
                )}

                {resetNote && status !== "error" && (
                  <div
                    className="v-fade mt-6 flex items-start gap-3 px-4 py-3"
                    style={{
                      backgroundColor: surface,
                      border: "1px solid " + hairline,
                      borderRadius: brand.radius,
                    }}
                  >
                    <CheckCircle
                      className="mt-[2px] h-4 w-4 shrink-0"
                      style={{ color: brand.accentColor }}
                      aria-hidden="true"
                    />
                    <p
                      className="text-[13px] leading-relaxed"
                      style={{ color: brand.primaryColor }}
                    >
                      {resetNote}
                    </p>
                  </div>
                )}

                {status === "success" && (
                  <div
                    className="v-fade mt-6 flex items-center gap-3 px-4 py-3"
                    style={{
                      backgroundColor: surface,
                      border: "1px solid " + hairline,
                      borderRadius: brand.radius,
                    }}
                  >
                    <CheckCircle
                      className="h-4 w-4 shrink-0"
                      style={{ color: brand.accentColor }}
                      aria-hidden="true"
                    />
                    <p className="text-[13px]" style={{ color: brand.primaryColor }}>
                      Signed in. Opening your notes…
                    </p>
                  </div>
                )}
              </div>

              {/* b-2-0 primary action */}
              <div data-wf="b-2-0" className="mt-7">
                <Button
                  type="submit"
                  disabled={busy || !online}
                  className="v-primary v-focus flex h-12 w-full items-center justify-center gap-2 text-[14px] font-medium tracking-[0.04em]"
                  style={{
                    backgroundColor: brand.accentColor,
                    color: brand.backgroundColor,
                    borderRadius: brand.radius,
                    border: "1px solid " + brand.accentColor,
                  }}
                >
                  {status === "submitting" ? (
                    <>
                      <span className="flex items-center gap-1" aria-hidden="true">
                        <span
                          className="v-dot h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: brand.backgroundColor }}
                        />
                        <span
                          className="v-dot h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: brand.backgroundColor }}
                        />
                        <span
                          className="v-dot h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: brand.backgroundColor }}
                        />
                      </span>
                      <span>Checking your details…</span>
                    </>
                  ) : status === "success" ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      <span>Signed in</span>
                    </>
                  ) : !online ? (
                    <span>Waiting for a connection</span>
                  ) : (
                    <span>Sign in</span>
                  )}
                </Button>
                <p className="mt-3 text-[12px]" style={{ color: brand.neutralColor }}>
                  Sessions end after 30 minutes of inactivity, or the moment you sign out.
                </p>
              </div>
            </form>

            <div className="my-8 h-px w-full" style={{ backgroundColor: hairlineSoft }} />

            {/* Row 4 — secondary links */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                data-wf="b-3-0"
                type="button"
                onClick={handleForgot}
                disabled={busy}
                className={linkBtnClass}
              >
                Forgot your password?
              </button>
              <button
                data-wf="b-3-1"
                type="button"
                onClick={() => navigate("register")}
                disabled={busy}
                className={linkBtnClass + " sm:text-right"}
              >
                <span className="inline-flex items-center gap-1.5 sm:flex-row-reverse">
                  <span>Create an account</span>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </button>
            </div>

            <p
              className="mt-10 flex items-center gap-2 text-[12px]"
              style={{ color: brand.neutralColor }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: online ? brand.accentColor : brand.neutralColor }}
                aria-hidden="true"
              />
              {online ? "Connected" : "No connection"} · Notes keeps passwords hashed, never in
              plain text.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
