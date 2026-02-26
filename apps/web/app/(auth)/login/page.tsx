"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Github } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Label,
  Button,
  Separator,
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@trackrel/ui";
import { signIn } from "@/lib/auth-client";
import { signInSchema, magicLinkSchema } from "@trackrel/db/validation";

export default function LoginPage() {
  const router = useRouter();
  const [isEmailFlow, setIsEmailFlow] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (isEmailFlow) {
        // Password login
        const result = signInSchema.safeParse({ email, password });
        if (!result.success) {
          setError(result.error.issues[0]?.message || "Invalid input");
          setIsLoading(false);
          return;
        }

        const { error: signInError } = await signIn.email({
          email,
          password,
          callbackURL: "/dashboard",
        });

        if (signInError) {
          setError(signInError.message || "Failed to sign in");
        } else {
          router.push("/dashboard");
        }
      } else {
        // Magic link
        const result = magicLinkSchema.safeParse({ email });
        if (!result.success) {
          setError(result.error.issues[0]?.message || "Invalid email");
          setIsLoading(false);
          return;
        }

        const { error: magicLinkError } = await signIn.magicLink({
          email,
          callbackURL: "/dashboard",
        });

        if (magicLinkError) {
          setError(magicLinkError.message || "Failed to send magic link");
        } else {
          setSuccessMessage("Check your email for a login link.");
        }
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setError(null);
    setIsLoading(true);
    try {
      await signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch {
      setError(`Failed to sign in with ${provider}`);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-display">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your Trackrel account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => handleOAuth("github")}
            disabled={isLoading}
            className="w-full"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuth("google")}
            disabled={isLoading}
            className="w-full"
          >
            <svg
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {isEmailFlow && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
          {successMessage && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {successMessage}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEmailFlow ? "Sign in" : "Send magic link"}
          </Button>
        </form>

        <div className="flex items-center justify-center space-x-2 text-sm">
          <button
            type="button"
            onClick={() => {
              setIsEmailFlow(!isEmailFlow);
              setError(null);
              setSuccessMessage(null);
            }}
            className="text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            {isEmailFlow ? "Use magic link instead" : "Use password instead"}
          </button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary underline underline-offset-4 hover:text-primary/90"
          >
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
