"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Column, Heading, Input, PasswordInput, Text } from "@once-ui-system/core";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Calls our custom authenticate API which checks the client_users table
      // It checks `username` OR `email` matching the identifier
      const response = await fetch('/api/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid username or password");
        setLoading(false);
        return;
      }

      setLoading(false);
      // Ensure we redirect to their specific folder portal using their real username
      router.push(`/${data.user.username}`);
    } catch (err) {
      setError("Network or server error occurred");
      setLoading(false);
    }
  };

  return (
    <Column maxWidth="xs" fillWidth paddingY="xl" gap="24" center>
      <Heading variant="heading-strong-xl" align="center">
        Client Portal Login
      </Heading>
      <Text variant="body-default-m" onBackground="neutral-weak" align="center">
        Log in with your username or registered email.
      </Text>

      <form onSubmit={handleLogin} style={{ width: "100%" }}>
        <Column fillWidth gap="16">
          <Input
            id="identifier"
            type="text"
            label="Email or Username"
            value={identifier}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setIdentifier(event.target.value)}
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
            disabled={loading || !identifier || !password}
            label={loading ? "Logging in..." : "Login"}
          />
        </Column>
      </form>

      {error ? (
        <Text variant="body-default-s" onBackground="danger-strong" align="center">
          {error}
        </Text>
      ) : null}

    </Column>
  );
}
