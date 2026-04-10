"use client";

import { useEffect, useState } from "react";
import { Row, IconButton, Text } from "@once-ui-system/core";
import { person, social } from "@/resources";
import styles from "./Footer.module.scss";

const VISITOR_COUNT_STORAGE_KEY = "portfolio_visitor_count";
const VISITOR_DAILY_COOKIE_KEY = "portfolio_visitor_last_visit_date";
const VISITOR_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 400;

function getCookieValue(name: string): string | null {
  const cookiePrefix = `${name}=`;
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(cookiePrefix));

  if (!cookie) return null;
  return decodeURIComponent(cookie.slice(cookiePrefix.length));
}

function setCookieValue(name: string, value: string) {
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${VISITOR_COOKIE_MAX_AGE_SECONDS}; samesite=lax${secure}`;
}

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const today = new Date().toISOString().slice(0, 10);

    const storedCountRaw = window.localStorage.getItem(VISITOR_COUNT_STORAGE_KEY);
    const storedCount = storedCountRaw ? Number(storedCountRaw) : NaN;

    if (Number.isFinite(storedCount)) {
      setVisitorCount(storedCount);
    }

    const lastVisitDate = getCookieValue(VISITOR_DAILY_COOKIE_KEY);

    if (lastVisitDate === today) {
      return () => {
        isMounted = false;
      };
    }

    const loadVisitorCount = async () => {
      try {
        const response = await fetch("/api/counter/up", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = (await response.json()) as { count?: number | null };
        if (isMounted && typeof data.count === "number") {
          setVisitorCount(data.count);
          window.localStorage.setItem(VISITOR_COUNT_STORAGE_KEY, String(data.count));
          setCookieValue(VISITOR_DAILY_COOKIE_KEY, today);
        }
      } catch {
        // Keep footer stable even if counter API is temporarily unavailable.
      }
    };

    loadVisitorCount();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Row as="footer" fillWidth padding="8" horizontal="center" s={{ direction: "column" }}>
      <Row
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="between"
        vertical="center"
        s={{
          direction: "column",
          horizontal: "center",
          align: "center",
        }}
      >
        <Text variant="body-default-s" onBackground="neutral-strong">
          <Text onBackground="neutral-weak">© {currentYear} </Text>
          <Text paddingX="4">{person.name} </Text>
          <Text onBackground="neutral-weak">
              All rights reserved      </Text>
        </Text>
        <Row gap="4" vertical="center" s={{ horizontal: "center" }}>
          <Text variant="body-default-xs" onBackground="neutral-weak">
            Visitors: {visitorCount ?? "--"}
          </Text>
        </Row>
        <Row gap="16">
          {social.map(
            (item) =>
              item.link && (
                <IconButton
                  key={item.name}
                  href={item.link}
                  icon={item.icon}
                  tooltip={item.name}
                  size="s"
                  variant="ghost"
                />
              ),
          )}
        </Row>
      </Row>
      <Row height="80" hide s={{ hide: false }} />
    </Row>
  );
};
