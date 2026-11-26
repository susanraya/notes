// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Check, Clock, AlertCircle, CheckCircle } = Icons;

const PRODUCT = "notes";
const HAIRLINE = "1px solid rgba(255,255,255,0.10)";
const DANGER = "#c98b7a";
const MIN_PASSWORD = 10;
// Emails already registered in this sample space — used to prove AC-002.
const TAKEN_EMAILS = ["hana.ibarra@fieldnotes.co", "theo.marchetti@fieldnotes.co"];

export default function Screen() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [formError, setFormError] = React.useState(null);
  const [status, setStatus] = React.useState("idle"); // idle | saving | done
  const [focused, setFocused] = React.useState(null);
  const [offline, setOffline] = React.useState(false);
  const timers = React.useRef([]);

  React.useEffect(() => {
    const sync = () => setOffline(typeof navigator !== "undefined" && navigator.onLine === false);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const label = { color: brand.neutralColor, letterSpacing: "0.18em" };
  const fieldBase = {
    border: HAIRLINE,
    borderRadius: brand.radius,
    height: 46,
    backgroundColor: "rgba(0,0,0,0.25)",
    color: brand.primaryColor,
  };
  const fieldStyle = (key, hasError) => ({
    ...fieldBase,
    borderColor: hasError ? DANGER : "rgba(255,255,255,0.10)",
    outline: focused === key ? `2px solid ${brand.accentColor}` : "2px solid transparent",
    outlineOffset: 2,
    transition: "border-color 160ms ease, background-color 160ms ease",
  });

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const longEnough = password.length >= MIN_PASSWORD;
  const mixed = /[A-Za-z]/.test(password) && /[0-9]/.test(password);

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = "Enter the email address you want to sign in with.";
    else if (!emailOk) next.email = "That does not look like an email address — check for a missing @ or domain.";
    if (!password) next.password = "Choose a password for your notes space.";
    else if (!longEnough || !mixed) next.password = `Use at least ${MIN_PASSWORD} characters, including a letter and a number.`;
    if (!confirm) next.confirm = "Type the password once more so we know it is the one you meant.";
    else if (confirm !== password) next.confirm = "The two passwords do not match.";
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === "saving") return;
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setFormError(null);
      return;
    }
    if (offline) {
      setFormError({
        kind: "offline",
        text: "No connection, so the account could not be created. notes needs to be online — your details are still here, try again once you are back.",
      });
      return;
    }
    if (TAKEN_EMAILS.includes(email.trim().toLowerCase())) {
      setFormError({ kind: "taken", text: "That email address is already in use. Sign in instead, or register with another address." });
      return;
    }
    setFormError(null);
    setStatus("saving");
    timers.current.push(
      setTimeout(() => {
        setStatus("done");
        timers.current.push(setTimeout(() => navigate("notes"), 1500));
      }, 800)
    );
  };

  const saving = status === "saving";

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6"
      style={{ backgroundColor: brand.backgroundColor, color: brand.primaryColor, fontFamily: brand.fontBody }}
    >
      <style>{`
        @keyframes velvet-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .velvet-rise { animation: velvet-rise 220ms ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .velvet-rise { animation: none; }
        }
      `}</style>

      <main
        className="w-full max-w-md p-6 sm:p-10"
        style={{ backgroundColor: "rgba(255,255,255,0.04)", border: HAIRLINE, borderRadius: brand.radius }}
      >
        <p className="text-2xl" style={{ fontFamily: brand.fontHeading }}>{PRODUCT}</p>
        <div aria-hidden className="mt-3 h-px w-12" style={{ backgroundColor: brand.accentColor }} />

        <h1 data-wf="b-0-0" className="mt-6 text-3xl leading-tight" style={{ fontFamily: brand.fontHeading }}>
          Create your account
        </h1>
        <p data-wf="b-1-0" className="mt-3 text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
          Keep private notes in your own space. Free to use, no card needed.
        </p>

        {status === "done" ? (
          <section className="velvet-rise mt-8" aria-live="polite">
            <div
              className="flex items-start gap-3 p-4"
              style={{ border: `1px solid ${brand.accentColor}`, borderRadius: brand.radius, backgroundColor: "rgba(143,174,139,0.10)" }}
            >
              <CheckCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" style={{ color: brand.accentColor }} />
              <div>
                <p className="text-lg leading-snug" style={{ fontFamily: brand.fontHeading }}>Account created</p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
                  {email.trim()} is signed in. Opening your empty notes space — nothing in it yet but you.
                </p>
              </div>
            </div>
          </section>
        ) : (
          <form className="mt-8" onSubmit={handleSubmit} noValidate>
            <section data-wf="b-2-0">
              <h2 className="text-xs uppercase" style={label}>Account details</h2>
              <div aria-hidden className="mt-3 h-px w-full" style={{ backgroundColor: "rgba(255,255,255,0.10)" }} />

              {offline && (
                <p
                  className="mt-5 flex items-start gap-2 p-3 text-xs leading-relaxed"
                  style={{ border: HAIRLINE, borderRadius: brand.radius, color: brand.neutralColor }}
                >
                  <Clock aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>Offline. notes needs a connection to create your account — your details stay on screen until then.</span>
                </p>
              )}

              {formError && (
                <div
                  className="velvet-rise mt-5 flex items-start gap-3 p-3"
                  style={{ border: `1px solid ${DANGER}`, borderRadius: brand.radius }}
                  role="alert"
                >
                  <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" style={{ color: DANGER }} />
                  <div className="text-xs leading-relaxed" style={{ color: brand.primaryColor }}>
                    <span className="font-bold uppercase tracking-[0.18em]" style={{ color: DANGER }}>
                      {formError.kind === "taken" ? "Email in use" : "Not saved"}
                    </span>
                    <p className="mt-1" style={{ color: brand.neutralColor }}>{formError.text}</p>
                    {formError.kind === "taken" && (
                      <button
                        type="button"
                        onClick={() => navigate("sign-in")}
                        className="mt-2 underline underline-offset-4 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        style={{ color: brand.accentColor, outlineColor: brand.accentColor }}
                      >
                        Go to sign in
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-5 space-y-5">
                <div className="space-y-2">
                  <label htmlFor="vl-email" className="block text-xs uppercase" style={label}>Email address</label>
                  <input
                    data-wf="i-2-0-0"
                    id="vl-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    value={email}
                    disabled={saving}
                    aria-invalid={errors.email ? "true" : undefined}
                    aria-describedby={errors.email ? "vl-email-error" : undefined}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); if (formError) setFormError(null); }}
                    className="w-full px-3 text-sm disabled:opacity-60"
                    style={fieldStyle("email", !!errors.email)}
                  />
                  {errors.email && (
                    <p id="vl-email-error" className="flex items-start gap-1.5 text-xs leading-relaxed" style={{ color: DANGER }}>
                      <AlertCircle aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="vl-password" className="block text-xs uppercase" style={label}>Password</label>
                  <input
                    data-wf="i-2-0-1"
                    id="vl-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="&lt;choose-a-password&gt;"
                    value={password}
                    disabled={saving}
                    aria-invalid={errors.password ? "true" : undefined}
                    aria-describedby={errors.password ? "vl-password-rules vl-password-error" : "vl-password-rules"}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: undefined })); }}
                    className="w-full px-3 text-sm disabled:opacity-60"
                    style={fieldStyle("password", !!errors.password)}
                  />
                  <ul id="vl-password-rules" className="space-y-1 text-xs" style={{ color: brand.neutralColor, fontVariantNumeric: "tabular-nums" }}>
                    <li className="flex items-center gap-1.5">
                      {longEnough
                        ? <Check aria-hidden className="h-3.5 w-3.5" style={{ color: brand.accentColor }} />
                        : <span aria-hidden className="h-3.5 w-3.5 text-center leading-[0.875rem]">·</span>}
                      <span style={longEnough ? { color: brand.primaryColor } : undefined}>
                        {MIN_PASSWORD} characters or more {longEnough ? "— met" : `(${password.length} so far)`}
                      </span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      {mixed
                        ? <Check aria-hidden className="h-3.5 w-3.5" style={{ color: brand.accentColor }} />
                        : <span aria-hidden className="h-3.5 w-3.5 text-center leading-[0.875rem]">·</span>}
                      <span style={mixed ? { color: brand.primaryColor } : undefined}>
                        A letter and a number {mixed ? "— met" : ""}
                      </span>
                    </li>
                  </ul>
                  {errors.password && (
                    <p id="vl-password-error" className="flex items-start gap-1.5 text-xs leading-relaxed" style={{ color: DANGER }}>
                      <AlertCircle aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="vl-confirm" className="block text-xs uppercase" style={label}>Confirm password</label>
                  <input
                    data-wf="i-2-0-2"
                    id="vl-confirm"
                    name="confirm_password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="&lt;repeat-the-password&gt;"
                    value={confirm}
                    disabled={saving}
                    aria-invalid={errors.confirm ? "true" : undefined}
                    aria-describedby={errors.confirm ? "vl-confirm-error" : undefined}
                    onFocus={() => setFocused("confirm")}
                    onBlur={() => setFocused(null)}
                    onChange={(e) => { setConfirm(e.target.value); if (errors.confirm) setErrors((p) => ({ ...p, confirm: undefined })); }}
                    className="w-full px-3 text-sm disabled:opacity-60"
                    style={fieldStyle("confirm", !!errors.confirm)}
                  />
                  {errors.confirm && (
                    <p id="vl-confirm-error" className="flex items-start gap-1.5 text-xs leading-relaxed" style={{ color: DANGER }}>
                      <AlertCircle aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{errors.confirm}</span>
                    </p>
                  )}
                </div>
              </div>
            </section>

            <button
              data-wf="b-3-0"
              type="submit"
              disabled={saving}
              aria-busy={saving ? "true" : undefined}
              className="mt-8 h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90 disabled:opacity-70 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: brand.accentColor, color: brand.backgroundColor, borderRadius: brand.radius, outlineColor: brand.primaryColor }}
            >
              {saving ? "Creating account…" : "Create account"}
            </button>
            <p className="sr-only" role="status">{saving ? "Creating your account." : ""}</p>
          </form>
        )}

        <p data-wf="b-4-0" className="mt-8 text-xs uppercase" style={label}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("sign-in")}
            className="underline underline-offset-4 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: brand.accentColor, outlineColor: brand.accentColor }}
          >
            Sign in
          </button>
        </p>
      </main>
    </div>
  );
}
