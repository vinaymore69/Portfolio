"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Row, IconButton, SmartLink, Text } from "@once-ui-system/core";
import { person, social } from "@/resources";
import styles from "./Footer.module.scss";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/counter/up", { cache: "no-store" });

        if (!response.ok) return;

        const data = await response.json();
        const count =
          typeof data.count === "number"
            ? data.count
            : typeof data.value === "number"
              ? data.value
              : null;

        if (typeof count === "number") {
          setVisitCount(count);
        }
      } catch {
        // Silently fail to keep footer stable if counter API is unavailable.
      }
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname]);

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
        <Text variant="body-default-xs" onBackground="neutral-weak">
          Live visits: {visitCount ?? "..."}
        </Text>
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
