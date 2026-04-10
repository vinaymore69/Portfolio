"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Column, Heading, Input, PasswordInput, Text } from "@once-ui-system/core";
import { getSupabaseClient, hasSupabasePublicEnv } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!hasSupabasePublicEnv()) {
    return (
      <Column maxWidth="xs" fillWidth paddingY="xl" gap="16" center>
        <Heading variant="heading-strong-l" align="center">
          Supabase is not configured
        </Heading>
        <Text variant="body-default-s" onBackground="neutral-weak" align="center">
          Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your local env file and restart the dev server.
        </Text>
      </Column>
    );
  }

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const supabaseClient = getSupabaseClient();
    const { error: signupError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    setMessage("Signup successful. Check your email for confirmation, then login.");
    setLoading(false);

    window.setTimeout(() => {
      router.push("/login");
    }, 1200);
  };

  return (
    <Column maxWidth="xs" fillWidth paddingY="xl" gap="24" center>
      <Heading variant="heading-strong-xl" align="center">
        Create your account
      </Heading>
      <Text variant="body-default-m" onBackground="neutral-weak" align="center">
        Sign up to access the Drive users dashboard.
      </Text>

      <form onSubmit={handleSignup} style={{ width: "100%" }}>
        <Column fillWidth gap="16">
          <Input
            id="fullName"
            label="Full name"
            value={fullName}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setFullName(event.target.value)}
            required
          />
          <Input
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
            required
          />
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
            required
          />
          <Button
            type="submit"
            fillWidth
            disabled={loading || !fullName || !email || !password}
            label={loading ? "Creating account..." : "Sign up"}
          />
        </Column>
      </form>

      {error ? (
        <Text variant="body-default-s" onBackground="danger-strong" align="center">
          {error}
        </Text>
      ) : null}
      {message ? (
        <Text variant="body-default-s" onBackground="success-strong" align="center">
          {message}
        </Text>
      ) : null}

      <Button href="/login" variant="tertiary" size="s" label="Already have an account? Login" />
    </Column>
  );
}
