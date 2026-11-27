// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { api } from "@/api/client";
import { setSessionToken } from "@/lib/api";

const { AlertCircle } = Icons;

const PRODUCT = "notes";
const HAIRLINE = "1px solid rgba(255,255,255,0.10)";
const DANGER = "#c98b7a";
const MIN_PASSWORD = 10;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Screen() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [formError, setFormError] = React.useState(null);
  const [status, setStatus] = React.useState("idle"); // idle | saving | done

  const validate = () => {
    const next = {};
    if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address";
    if (password.length < MIN_PASSWORD)
      next.password = `Password must be at least ${MIN_PASSWORD} characters`;
    if (confirm !== password) next.confirm = "Passwords do not match";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "saving") return;
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setFormError(null);
      return;
    }
    setFormError(null);
    setStatus("saving");

    const { data, response } = await api.POST("/auth/register", {
      body: { email: email.trim(), password },
    });

    if (data) {
      setSessionToken(data.token);
      setStatus("done");
      navigate("notes");
      return;
    }

    setStatus("idle");
    if (response && response.status === 409) {
      setFormError({ kind: "taken", text: "This email is already in use" });
      return;
    }
    if (response && response.status === 422) {
      setFormError({ kind: "invalid", text: "Enter a valid email address" });
      return;
    }
    setFormError({
      kind: "error",
      text: "Something went wrong creating your account. Your details are still here — try again.",
    });
  };

  const saving = status === "saving";

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6"
      style={{
        backgroundColor: brand.backgroundColor,
        color: brand.primaryColor,
        fontFamily: brand.fontBody,
      }}
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
        style={{
          backgroundColor: "rgba(255,255,255,0.04)",
          border: HAIRLINE,
          borderRadius: brand.radius,
        }}
      >
        <p className="text-2xl" style={{ fontFamily: brand.fontHeading }}>
          {PRODUCT}
        </p>
        <div
          aria-hidden
          className="mt-3 h-px w-12"
          style={{ backgroundColor: brand.accentColor }}
        />

        <h1
          data-testid="create-your-account-title"
          className="mt-6 text-3xl leading-tight"
          style={{ fontFamily: brand.fontHeading }}
        >
          Create your account
        </h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
          Keep private notes in your own space. Free to use, no card needed.
        </p>

        <form
          data-testid="account-details-form"
          className="mt-8"
          onSubmit={handleSubmit}
          noValidate
        >
          <h2
            className="text-xs uppercase"
            style={{ color: brand.neutralColor, letterSpacing: "0.18em" }}
          >
            Account details
          </h2>
          <div
            aria-hidden
            className="mt-3 h-px w-full"
            style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
          />

          {formError && (
            <div
              className="velvet-rise mt-5 flex items-start gap-3 p-3"
              style={{ border: `1px solid ${DANGER}`, borderRadius: brand.radius }}
              role="alert"
            >
              <AlertCircle
                aria-hidden
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: DANGER }}
              />
              <div className="text-xs leading-relaxed" style={{ color: brand.primaryColor }}>
                <p style={{ color: brand.neutralColor }}>{formError.text}</p>
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
              <label
                htmlFor="vl-email"
                className="block text-xs uppercase"
                style={{ color: brand.neutralColor, letterSpacing: "0.18em" }}
              >
                Email address
              </label>
              <input
                data-testid="email-address-input"
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  if (formError) setFormError(null);
                }}
                className="w-full px-3 text-sm disabled:opacity-60"
                style={{
                  border: HAIRLINE,
                  borderRadius: brand.radius,
                  height: 46,
                  backgroundColor: "rgba(0,0,0,0.25)",
                  color: brand.primaryColor,
                  borderColor: errors.email ? DANGER : "rgba(255,255,255,0.10)",
                }}
              />
              {errors.email && (
                <p
                  id="vl-email-error"
                  className="flex items-start gap-1.5 text-xs leading-relaxed"
                  style={{ color: DANGER }}
                >
                  <AlertCircle aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="vl-password"
                className="block text-xs uppercase"
                style={{ color: brand.neutralColor, letterSpacing: "0.18em" }}
              >
                Password
              </label>
              <input
                data-testid="password-input"
                id="vl-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="&lt;choose-a-password&gt;"
                value={password}
                disabled={saving}
                aria-invalid={errors.password ? "true" : undefined}
                aria-describedby={errors.password ? "vl-password-error" : undefined}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                }}
                className="w-full px-3 text-sm disabled:opacity-60"
                style={{
                  border: HAIRLINE,
                  borderRadius: brand.radius,
                  height: 46,
                  backgroundColor: "rgba(0,0,0,0.25)",
                  color: brand.primaryColor,
                  borderColor: errors.password ? DANGER : "rgba(255,255,255,0.10)",
                }}
              />
              {errors.password && (
                <p
                  id="vl-password-error"
                  className="flex items-start gap-1.5 text-xs leading-relaxed"
                  style={{ color: DANGER }}
                >
                  <AlertCircle aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="vl-confirm"
                className="block text-xs uppercase"
                style={{ color: brand.neutralColor, letterSpacing: "0.18em" }}
              >
                Confirm password
              </label>
              <input
                data-testid="confirm-password-input"
                id="vl-confirm"
                name="confirm_password"
                type="password"
                autoComplete="new-password"
                placeholder="&lt;repeat-the-password&gt;"
                value={confirm}
                disabled={saving}
                aria-invalid={errors.confirm ? "true" : undefined}
                aria-describedby={errors.confirm ? "vl-confirm-error" : undefined}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  if (errors.confirm) setErrors((p) => ({ ...p, confirm: undefined }));
                }}
                className="w-full px-3 text-sm disabled:opacity-60"
                style={{
                  border: HAIRLINE,
                  borderRadius: brand.radius,
                  height: 46,
                  backgroundColor: "rgba(0,0,0,0.25)",
                  color: brand.primaryColor,
                  borderColor: errors.confirm ? DANGER : "rgba(255,255,255,0.10)",
                }}
              />
              {errors.confirm && (
                <p
                  id="vl-confirm-error"
                  className="flex items-start gap-1.5 text-xs leading-relaxed"
                  style={{ color: DANGER }}
                >
                  <AlertCircle aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{errors.confirm}</span>
                </p>
              )}
            </div>
          </div>

          <button
            data-testid="create-account-btn"
            type="submit"
            disabled={saving}
            aria-busy={saving ? "true" : undefined}
            className="mt-8 h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90 disabled:opacity-70 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              backgroundColor: brand.accentColor,
              color: brand.backgroundColor,
              borderRadius: brand.radius,
              outlineColor: brand.primaryColor,
            }}
          >
            {saving ? "Creating account…" : "Create account"}
          </button>
          <p className="sr-only" role="status">
            {saving ? "Creating your account." : ""}
          </p>
        </form>

        <p
          className="mt-8 text-xs uppercase"
          style={{ color: brand.neutralColor, letterSpacing: "0.18em" }}
        >
          Already have an account?{" "}
          <button
            type="button"
            data-testid="already-have-an-account-sign-in-link"
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
