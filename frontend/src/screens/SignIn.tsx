// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
import React from "react";
import { useLocation } from "react-router-dom";

import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { api } from "@/api/client";
import { setSessionToken } from "@/lib/api";

const { AlertCircle, Clock, CheckCircle, ChevronRight } = Icons;

const HAIRLINE = "1px solid rgba(255,255,255,0.10)";
const DANGER = "#c98b7a";

const GENERIC_SIGN_IN_ERROR = "Email or password is incorrect";
const SESSION_EXPIRED_MESSAGE = "Your session has expired, please sign in again";
const SIGNED_OUT_MESSAGE = "You have been signed out";

export default function Screen() {
  const navigate = useNavigate();
  const location = useLocation();
  const reason = location.state && location.state.reason;

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [status, setStatus] = React.useState("idle"); // idle | submitting

  const submitting = status === "submitting";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setFormError("");
    setStatus("submitting");

    const { data } = await api.POST("/auth/login", {
      body: { email: email.trim(), password },
    });

    if (data) {
      setSessionToken(data.token);
      navigate("notes");
      return;
    }

    setStatus("idle");
    setFormError(GENERIC_SIGN_IN_ERROR);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6"
      style={{
        backgroundColor: brand.backgroundColor,
        color: brand.primaryColor,
        fontFamily: brand.fontBody,
      }}
    >
      <main
        className="w-full max-w-md p-6 sm:p-10"
        style={{
          backgroundColor: "rgba(255,255,255,0.04)",
          border: HAIRLINE,
          borderRadius: brand.radius,
        }}
      >
        <p className="text-2xl" style={{ fontFamily: brand.fontHeading }}>
          {"notes"}
        </p>
        <div
          aria-hidden
          className="mt-3 h-px w-12"
          style={{ backgroundColor: brand.accentColor }}
        />

        <h1
          data-testid="sign-in-to-notes-title"
          className="mt-6 text-3xl leading-tight"
          style={{ fontFamily: brand.fontHeading }}
        >
          Sign in to Notes
        </h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
          Your note list is waiting behind this page.
        </p>

        {reason === "expired" && (
          <div
            role="status"
            className="mt-5 flex items-start gap-3 p-3"
            style={{ border: HAIRLINE, borderRadius: brand.radius }}
          >
            <Clock
              aria-hidden
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: brand.accentColor }}
            />
            <p className="text-xs leading-relaxed" style={{ color: brand.neutralColor }}>
              {SESSION_EXPIRED_MESSAGE}
            </p>
          </div>
        )}

        {reason === "signed-out" && (
          <div
            role="status"
            className="mt-5 flex items-start gap-3 p-3"
            style={{ border: HAIRLINE, borderRadius: brand.radius }}
          >
            <CheckCircle
              aria-hidden
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: brand.accentColor }}
            />
            <p className="text-xs leading-relaxed" style={{ color: brand.neutralColor }}>
              {SIGNED_OUT_MESSAGE}
            </p>
          </div>
        )}

        <form data-testid="form-1" className="mt-8" onSubmit={handleSubmit} noValidate>
          <h2
            className="text-xs uppercase"
            style={{ color: brand.neutralColor, letterSpacing: "0.18em" }}
          >
            Account
          </h2>
          <div
            aria-hidden
            className="mt-3 h-px w-full"
            style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
          />

          {formError && (
            <div
              className="mt-5 flex items-start gap-3 p-3"
              style={{ border: `1px solid ${DANGER}`, borderRadius: brand.radius }}
              role="alert"
            >
              <AlertCircle
                aria-hidden
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: DANGER }}
              />
              <p className="text-xs leading-relaxed" style={{ color: brand.neutralColor }}>
                {formError}
              </p>
            </div>
          )}

          <div className="mt-5 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="si-email"
                className="block text-xs uppercase"
                style={{ color: brand.neutralColor, letterSpacing: "0.18em" }}
              >
                Email address
              </label>
              <input
                data-testid="email-address-input"
                id="si-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                disabled={submitting}
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formError) setFormError("");
                }}
                className="w-full px-3 text-sm disabled:opacity-60"
                style={{
                  border: HAIRLINE,
                  borderRadius: brand.radius,
                  height: 46,
                  backgroundColor: "rgba(0,0,0,0.25)",
                  color: brand.primaryColor,
                }}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="si-password"
                className="block text-xs uppercase"
                style={{ color: brand.neutralColor, letterSpacing: "0.18em" }}
              >
                Password
              </label>
              <input
                data-testid="password-input"
                id="si-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="&lt;your-password&gt;"
                value={password}
                disabled={submitting}
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formError) setFormError("");
                }}
                className="w-full px-3 text-sm disabled:opacity-60"
                style={{
                  border: HAIRLINE,
                  borderRadius: brand.radius,
                  height: 46,
                  backgroundColor: "rgba(0,0,0,0.25)",
                  color: brand.primaryColor,
                }}
              />
            </div>
          </div>

          <button
            data-testid="sign-in-btn"
            type="submit"
            disabled={submitting}
            aria-busy={submitting ? "true" : undefined}
            className="mt-8 h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90 disabled:opacity-70 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              backgroundColor: brand.accentColor,
              color: brand.backgroundColor,
              borderRadius: brand.radius,
              outlineColor: brand.primaryColor,
            }}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
          <p className="sr-only" role="status">
            {submitting ? "Signing you in." : ""}
          </p>
        </form>

        <div className="mt-8 flex items-center justify-between gap-2">
          <button
            type="button"
            data-testid="forgot-your-password-link"
            className="text-xs underline underline-offset-4 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: brand.neutralColor, outlineColor: brand.accentColor }}
          >
            Forgot your password?
          </button>
          <button
            type="button"
            data-testid="create-an-account-link"
            onClick={() => navigate("register")}
            className="inline-flex items-center gap-1 text-xs underline underline-offset-4 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: brand.accentColor, outlineColor: brand.accentColor }}
          >
            <span>Create an account</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </main>
    </div>
  );
}
