"use client";

import React, { useState } from "react";
import {
  Column,
  Row,
  Heading,
  Text,
  Button,
  Tag,
  Icon,
} from "@once-ui-system/core";
// ─── Types ───────────────────────────────────────────────────────────────────

interface ResourceFile {
  id: string;
  title: string;
  subject: string;
  type: "Practical" | "Assignment" | "Rubric" | "Notes" | "Lab Manual";
  semester: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
  fileType: "pdf" | "docx" | "xlsx" | "zip";
  downloadUrl: string; // Replace with real URLs or API endpoints
  description?: string;
}

// ─── Mock Data — replace downloadUrl with real file paths ───────────────────

const resources: ResourceFile[] = [
  {
    id: "1",
    title: "Practical 1 – Introduction to Python",
    subject: "Programming Fundamentals",
    type: "Practical",
    semester: "Sem 3",
    uploadedBy: "Prof. Sharma",
    uploadedAt: "Feb 10, 2025",
    fileSize: "1.2 MB",
    fileType: "pdf",
    downloadUrl: "/files/practical-1-python.pdf",
    description: "Basic I/O, data types, loops, and functions.",
  },
  {
    id: "2",
    title: "Assignment 2 – ER Diagrams",
    subject: "Database Management",
    type: "Assignment",
    semester: "Sem 3",
    uploadedBy: "Prof. Mehta",
    uploadedAt: "Feb 14, 2025",
    fileSize: "800 KB",
    fileType: "pdf",
    downloadUrl: "/files/assignment-2-er.pdf",
    description: "Design ER diagrams for a hospital management system.",
  },
  {
    id: "3",
    title: "Practical Rubric – OS Lab",
    subject: "Operating Systems",
    type: "Rubric",
    semester: "Sem 4",
    uploadedBy: "Prof. Iyer",
    uploadedAt: "Jan 30, 2025",
    fileSize: "340 KB",
    fileType: "docx",
    downloadUrl: "/files/rubric-os-lab.docx",
    description: "Grading criteria for all OS lab practicals.",
  },
  {
    id: "4",
    title: "Lab Manual – Data Structures",
    subject: "Data Structures",
    type: "Lab Manual",
    semester: "Sem 3",
    uploadedBy: "Prof. Kulkarni",
    uploadedAt: "Jan 20, 2025",
    fileSize: "3.5 MB",
    fileType: "pdf",
    downloadUrl: "/files/lab-manual-ds.pdf",
    description: "Linked lists, stacks, queues, trees, and graphs experiments.",
  },
  {
    id: "5",
    title: "Assignment 3 – Network Topologies",
    subject: "Computer Networks",
    type: "Assignment",
    semester: "Sem 4",
    uploadedBy: "Prof. Joshi",
    uploadedAt: "Feb 5, 2025",
    fileSize: "1.1 MB",
    fileType: "pdf",
    downloadUrl: "/files/assignment-3-networks.pdf",
    description: "Compare star, ring, and mesh topologies with diagrams.",
  },
  {
    id: "6",
    title: "Practical 5 – SQL Queries",
    subject: "Database Management",
    type: "Practical",
    semester: "Sem 3",
    uploadedBy: "Prof. Mehta",
    uploadedAt: "Feb 17, 2025",
    fileSize: "620 KB",
    fileType: "pdf",
    downloadUrl: "/files/practical-5-sql.pdf",
    description: "SELECT, JOIN, GROUP BY, and subquery exercises.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<ResourceFile["type"], string> = {
  Practical: "success",
  Assignment: "warning",
  Rubric: "danger",
  Notes: "info",
  "Lab Manual": "neutral",
};

const FILE_ICONS: Record<ResourceFile["fileType"], string> = {
  pdf: "filePdf",
  docx: "fileText",
  xlsx: "fileSpreadsheet",
  zip: "fileArchive",
};

const ALL_TYPES = ["All", "Practical", "Assignment", "Rubric", "Notes", "Lab Manual"];
const ALL_SEMESTERS = ["All", "Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];

// ─── Component ───────────────────────────────────────────────────────────────

export default function XiePage() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [activeSem, setActiveSem] = useState("All");
  const [downloading, setDownloading] = useState<string | null>(null);

  const filtered = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase());
    const matchesType = activeType === "All" || r.type === activeType;
    const matchesSem = activeSem === "All" || r.semester === activeSem;
    return matchesSearch && matchesType && matchesSem;
  });

  const handleDownload = (file: ResourceFile) => {
    setDownloading(file.id);
    // Trigger browser download — works for any URL or blob
    const link = document.createElement("a");
    link.href = file.downloadUrl;
    link.download = `${file.title}.${file.fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(null), 1500);
  };

  return (
    <Column maxWidth="m" fillWidth paddingY="xl" gap="xl">
      {/* ── Header ── */}
      <Column gap="8">
        <Row gap="12" vertical="center">
          <Icon name="bookOpen" size="xl" onBackground="brand-strong" />
          <Heading variant="display-strong-xl">Resource Hub</Heading>
        </Row>
        <Text variant="body-default-l" onBackground="neutral-weak">
          Download practicals, assignments, rubrics, and lab manuals — all in one place.
        </Text>
      </Column>

      {/* ── Search ── */}
      <Row
        fillWidth
        border="neutral-medium"
        radius="m"
        padding="12"
        gap="12"
        vertical="center"
        background="neutral-weak"
      >
        <Icon name="search" onBackground="neutral-weak" />
        <input
          type="text"
          placeholder="Search by title or subject…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            width: "100%",
            fontSize: "var(--font-size-body-default-m)",
            color: "var(--neutral-on-background-strong)",
          }}
        />
        {search && (
          <Icon
            name="x"
            onBackground="neutral-weak"
            style={{ cursor: "pointer" }}
            onClick={() => setSearch("")}
          />
        )}
      </Row>

      {/* ── Filters ── */}
      <Column gap="m">
        <Text variant="label-default-s" onBackground="neutral-weak">
          FILTER BY TYPE
        </Text>
        <Row wrap gap="8">
          {ALL_TYPES.map((t) => (
            <Tag
              key={t}
              size="l"
              onClick={() => setActiveType(t)}
              style={{
                cursor: "pointer",
                opacity: activeType === t ? 1 : 0.5,
                borderColor: activeType === t ? "var(--brand-border-strong)" : undefined,
              }}
            >
              {t}
            </Tag>
          ))}
        </Row>

        <Text variant="label-default-s" onBackground="neutral-weak">
          FILTER BY SEMESTER
        </Text>
        <Row wrap gap="8">
          {ALL_SEMESTERS.map((s) => (
            <Tag
              key={s}
              size="l"
              onClick={() => setActiveSem(s)}
              style={{
                cursor: "pointer",
                opacity: activeSem === s ? 1 : 0.5,
                borderColor: activeSem === s ? "var(--brand-border-strong)" : undefined,
              }}
            >
              {s}
            </Tag>
          ))}
        </Row>
      </Column>

      {/* ── Results count ── */}
      <Text variant="body-default-s" onBackground="neutral-weak">
        Showing {filtered.length} of {resources.length} files
      </Text>

      {/* ── File Cards ── */}
      <Column fillWidth gap="m">
        {filtered.length === 0 && (
          <Column fillWidth vertical="center" horizontal="center" padding="xl" gap="12">
            <Icon name="folderOpen" size="xl" onBackground="neutral-weak" />
            <Text onBackground="neutral-weak">No files match your search.</Text>
          </Column>
        )}

        {filtered.map((file) => (
          <Row
            key={file.id}
            fillWidth
            border="neutral-medium"
            radius="l"
            padding="20"
            gap="16"
            vertical="center"
            background="neutral-weak"
            style={{ transition: "border-color 0.2s" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor =
                "var(--brand-border-medium)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor =
                "var(--neutral-border-medium)")
            }
          >
            {/* File type icon */}
            <Column
              padding="12"
              radius="m"
              background="brand-alpha-weak"
              horizontal="center"
              vertical="center"
              style={{ minWidth: 48, minHeight: 48 }}
            >
              <Icon
                name={FILE_ICONS[file.fileType] || "file"}
                onBackground="brand-medium"
                size="m"
              />
            </Column>

            {/* Info */}
            <Column flex={1} gap="4">
              <Row gap="8" vertical="center" wrap>
                <Text variant="heading-strong-m">{file.title}</Text>
                <Tag size="s">{file.type}</Tag>
                <Tag size="s">{file.semester}</Tag>
              </Row>
              <Text variant="body-default-s" onBackground="brand-weak">
                {file.subject}
              </Text>
              {file.description && (
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {file.description}
                </Text>
              )}
              <Row gap="16" paddingTop="4" wrap>
                <Row gap="4" vertical="center">
                  <Icon name="user" size="xs" onBackground="neutral-weak" />
                  <Text variant="label-default-xs" onBackground="neutral-weak">
                    {file.uploadedBy}
                  </Text>
                </Row>
                <Row gap="4" vertical="center">
                  <Icon name="calendar" size="xs" onBackground="neutral-weak" />
                  <Text variant="label-default-xs" onBackground="neutral-weak">
                    {file.uploadedAt}
                  </Text>
                </Row>
                <Row gap="4" vertical="center">
                  <Icon name="hardDrive" size="xs" onBackground="neutral-weak" />
                  <Text variant="label-default-xs" onBackground="neutral-weak">
                    {file.fileSize} · .{file.fileType.toUpperCase()}
                  </Text>
                </Row>
              </Row>
            </Column>

            {/* Download button */}
            <Button
              variant="primary"
              size="m"
              prefixIcon={downloading === file.id ? "loader" : "download"}
              label={downloading === file.id ? "Downloading…" : "Download"}
              onClick={() => handleDownload(file)}
              disabled={downloading === file.id}
            />
          </Row>
        ))}
      </Column>

      {/* ── Footer note ── */}
      <Row
        fillWidth
        border="brand-alpha-medium"
        background="brand-alpha-weak"
        radius="m"
        padding="16"
        gap="12"
        vertical="center"
      >
        <Icon name="info" onBackground="brand-weak" />
        <Text variant="body-default-s" onBackground="brand-weak">
          Files are provided for academic use. Contact your professor if a file is missing
          or outdated.
        </Text>
      </Row>
    </Column>
  );
}