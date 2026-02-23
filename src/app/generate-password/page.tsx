"use client";

import React, { useState } from "react";
import {
  Column,
  Heading,
  Text,
  Button,
  PasswordInput,
  Line,
  Row,
  Icon,
} from "@once-ui-system/core";

export default function GeneratePassword() {
  const [password, setPassword] = useState("");
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setHash("");
    try {
      const response = await fetch("/api/generate-password-hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        const data = await response.json();
        setHash(data.hash);
      } else {
        setError("Failed to generate hash");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Column maxWidth="xs" fillWidth paddingY="xl" gap="32" center>
      <Column fillWidth gap="8" horizontal="center">
        <Heading variant="heading-strong-xl" align="center">
          Generate Password Hash
        </Heading>
        <Text variant="body-default-m" onBackground="neutral-weak" align="center">
          Enter a password to generate a secure hash for user registration.
        </Text>
      </Column>

      <Line />

      <form onSubmit={handleGenerate} style={{ width: "100%" }}>
        <Column fillWidth gap="16">
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            errorMessage={error}
            autoFocus
          />
          <Button
            type="submit"
            fillWidth
            label={loading ? "Generating…" : "Generate Hash"}
            disabled={loading || !password}
          />
        </Column>
      </form>

      {hash && (
        <Column fillWidth gap="8" align="center" style={{ marginTop: 16 }}>
          <Text variant="body-strong-m" onBackground="brand-strong">
            Hash generated successfully!
          </Text>
          <Row gap="8" vertical="center" style={{ wordBreak: "break-all" }}>
            <Icon name="lock" onBackground="brand-strong" />
            <Text as="span" variant="body-default-s" style={{ background: "#f7fafc", padding: 8, borderRadius: 4, color: '#222' }}>
              {hash}
            </Text>
          </Row>
        </Column>
      )}
    </Column>
  );
}
