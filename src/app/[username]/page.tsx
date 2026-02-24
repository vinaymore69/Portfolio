'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Column,
  Row,
  Heading,
  Text,
  Button,
  PasswordInput,
  Spinner,
  Icon,
  Tag,
  Line,
} from '@once-ui-system/core';

interface FileItem {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  modifiedTime: string;
  webViewLink: string;
  webContentLink: string;
}

interface BreadcrumbItem {
  id: string;
  name: string;
}

export default function UserPortal() {
    // Handle file upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setLoadingFiles(true);
      setFileError('');
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', username as string);
        // Target folder: root or last folder in breadcrumb
        if (folderPath.length > 0) {
          formData.append('folderId', folderPath[folderPath.length - 1].id);
        }
        const response = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          loadFiles(folderPath.length > 0 ? folderPath[folderPath.length - 1].id : undefined);
        } else {
          setFileError('Failed to upload file');
        }
      } catch {
        setFileError('Failed to upload file');
      } finally {
        setLoadingFiles(false);
        // Reset file input
        (e.target as HTMLInputElement).value = '';
      }
    };
  const { username } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [fileError, setFileError] = useState('');
  const [folderPath, setFolderPath] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    checkAuthStatus();
  }, [username]);

  useEffect(() => {
    if (isAuthenticated) {
      loadFiles();
    }
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/check-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      if (response.ok) setIsAuthenticated(true);
    } catch {}
    finally { setAuthChecking(false); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    try {
      const response = await fetch('/api/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        const data = await response.json();
        setError(data.error || 'Authentication failed');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load files for a given folder ID (omit to load root)
  const loadFiles = async (folderId?: string) => {
    setLoadingFiles(true);
    setFileError('');
    try {
      const body: Record<string, string> = { username: username as string };
      if (folderId) body.folderId = folderId;

      const response = await fetch('/api/files/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      } else {
        setFileError('Failed to load files');
      }
    } catch {
      setFileError('Failed to load files');
    } finally {
      setLoadingFiles(false);
    }
  };

  // Open a folder — push to breadcrumb path and load its contents
  const handleFolderOpen = (folder: FileItem) => {
    const newPath = [...folderPath, { id: folder.id, name: folder.name }];
    setFolderPath(newPath);
    loadFiles(folder.id);
  };

  // Navigate back to a breadcrumb level (index = -1 means root)
  const handleBreadcrumbNavigate = (index: number) => {
    if (index === -1) {
      setFolderPath([]);
      loadFiles();
    } else {
      const newPath = folderPath.slice(0, index + 1);
      setFolderPath(newPath);
      loadFiles(newPath[newPath.length - 1].id);
    }
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const response = await fetch('/api/files/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fileId }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setFileError('Failed to download file');
      }
    } catch {
      setFileError('Failed to download file');
    }
  };

  const handlePrint = async (fileId: string) => {
    try {
      const response = await fetch('/api/files/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fileId }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank');
        if (printWindow) printWindow.onload = () => printWindow.print();
      } else {
        setFileError('Failed to open file for printing');
      }
    } catch {
      setFileError('Failed to open file for printing');
    }
  };

  const handleLogout = () => {
    document.cookie = `auth-${username}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setIsAuthenticated(false);
    setFiles([]);
    setFolderPath([]);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '—';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isFolder = (mimeType: string) => mimeType === 'application/vnd.google-apps.folder';

  const getFileIconName = (mimeType: string): string => {
    if (isFolder(mimeType)) return 'folder';
    if (mimeType.includes('pdf')) return 'document';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    if (mimeType.includes('image')) return 'gallery';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'grid';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'grid';
    return 'document';
  };

  const getFileTagLabel = (mimeType: string): string => {
    if (isFolder(mimeType)) return 'Folder';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'DOC';
    if (mimeType.includes('image')) return 'IMG';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'XLS';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'PPT';
    return 'FILE';
  };

  // Show spinner while checking existing auth cookie
  if (authChecking) {
    return (
      <Column fillWidth paddingY="128" horizontal="center">
        <Spinner />
      </Column>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <Column maxWidth="xs" fillWidth paddingY="128" gap="32" center>
        <Column fillWidth gap="8" horizontal="center">
          <Heading variant="heading-strong-xl" align="center">
            Welcome back
          </Heading>
          <Text variant="body-default-m" onBackground="neutral-weak" align="center">
            Enter your password to access{' '}
            <Text as="span" variant="body-strong-m" onBackground="neutral-strong">{username}</Text>'s files
          </Text>
        </Column>

        <Line />

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <Column fillWidth gap="16">
            <PasswordInput
              id="portal-password"
              label="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              errorMessage={error}
            />
            <Button
              type="submit"
              fillWidth
              label={loading ? 'Verifying…' : 'Access Files'}
              disabled={loading || !password}
            />
          </Column>
        </form>
      </Column>
    );
  }

  // Dashboard
  return (
    <Column maxWidth="l" fillWidth paddingY="40" gap="32">
      {/* Header */}
      <Row fillWidth horizontal="between" vertical="center">
        <Column gap="4">
          <Heading variant="heading-strong-xl">
            {username}'s Files
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Your private Google Drive portal
          </Text>
        </Column>
        <Button
          variant="secondary"
          size="s"
          label="Log out"
          prefixIcon="logout"
          onClick={handleLogout}
        />
      </Row>

      <Line />

      {/* Breadcrumb path (shown when inside a subfolder) */}
      <Row fillWidth gap="4" vertical="center" wrap>
        <Button
          variant="tertiary"
          size="s"
          label="Home"
          prefixIcon="home"
          onClick={() => handleBreadcrumbNavigate(-1)}
        />
        {folderPath.map((crumb, index) => (
          <Row key={crumb.id} gap="4" vertical="center">
            <Icon name="chevronRight" size="xs" onBackground="neutral-weak" />
            {index < folderPath.length - 1 ? (
              <Button
                variant="tertiary"
                size="s"
                label={crumb.name}
                onClick={() => handleBreadcrumbNavigate(index)}
              />
            ) : (
              <Text variant="body-strong-s" onBackground="neutral-strong" style={{ paddingInline: '8px' }}>
                {crumb.name}
              </Text>
            )}
          </Row>
        ))}
      </Row>

      {/* File error banner */}
      {fileError && (
        <Row
          fillWidth
          padding="12"
          radius="m"
          gap="8"
          vertical="center"
          background="danger-weak"
        >
          <Icon name="errorCircle" size="s" onBackground="danger-strong" />
          <Text variant="body-default-s" onBackground="danger-strong">{fileError}</Text>
        </Row>
      )}

      {/* Toolbar */}
      <Row fillWidth horizontal="between" vertical="center">
        <Text variant="label-default-s" onBackground="neutral-weak">
          {loadingFiles
            ? 'Loading…'
            : `${files.length} item${files.length !== 1 ? 's' : ''}`}
        </Text>
        <Row gap="8">
          {/* Temporarily disabled upload button
          <Button
            variant="tertiary"
            size="s"
            label="Upload"
            prefixIcon="plus"
            onClick={() => document.getElementById('file-upload-input')?.click()}
            disabled={loadingFiles}
          />
          */}
          <Button
            variant="tertiary"
            size="s"
            label="Refresh"
            prefixIcon="refresh"
            onClick={() => loadFiles(folderPath.length > 0 ? folderPath[folderPath.length - 1].id : undefined)}
            disabled={loadingFiles}
          />
        </Row>
        {/* Hidden file input for upload - temporarily disabled
        <input
          id="file-upload-input"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        */}
      </Row>

      {/* Files */}
      {loadingFiles ? (
        <Column fillWidth paddingY="80" horizontal="center">
          <Spinner />
        </Column>
      ) : files.length === 0 ? (
        <Column fillWidth paddingY="80" gap="12" horizontal="center">
          <Icon name="folder" size="l" onBackground="neutral-weak" />
          <Heading variant="heading-default-m" align="center" onBackground="neutral-weak">
            {folderPath.length > 0 ? 'Empty folder' : 'No files found'}
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak" align="center">
            {folderPath.length > 0
              ? 'This folder has no items.'
              : 'Share your Google Drive folder with the service account to see files here.'}
          </Text>
        </Column>
      ) : (
        <Column fillWidth gap="2">
          {files.map((file, index) => {
            const itemIsFolder = isFolder(file.mimeType);
            return (
              <Column key={file.id} fillWidth>
                <Row
                  fillWidth
                  padding="16"
                  gap="16"
                  vertical="center"
                  radius="m"
                  style={{ cursor: itemIsFolder ? 'pointer' : 'default' }}
                  onClick={itemIsFolder ? () => handleFolderOpen(file) : undefined}
                >
                  {/* File / folder icon */}
                  <Column
                    horizontal="center"
                    vertical="center"
                    radius="m"
                    background={itemIsFolder ? 'brand-alpha-weak' : 'neutral-alpha-weak'}
                    style={{ flexShrink: 0, width: '40px', height: '40px' }}
                  >
                    <Icon
                      name={getFileIconName(file.mimeType) as any}
                      size="s"
                      onBackground={itemIsFolder ? 'brand-strong' : 'neutral-strong'}
                    />
                  </Column>

                  {/* File info */}
                  <Column fillWidth gap="2">
                    <Row gap="8" vertical="center">
                      <Text variant="body-strong-s" onBackground="neutral-strong">
                        {file.name}
                      </Text>
                      <Tag
                        size="s"
                        variant={itemIsFolder ? 'brand' : 'neutral'}
                        label={getFileTagLabel(file.mimeType)}
                      />
                    </Row>
                    {!itemIsFolder && (
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        {formatFileSize(file.size)}
                        {file.modifiedTime && (
                          <> · {new Date(file.modifiedTime).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}</>
                        )}
                      </Text>
                    )}
                    {itemIsFolder && file.modifiedTime && (
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        Modified {new Date(file.modifiedTime).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </Text>
                    )}
                  </Column>

                  {/* Actions — folders get "Open" button, files get Download + Print */}
                  <Row gap="8" style={{ flexShrink: 0 }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    {itemIsFolder ? (
                      <Button
                        size="s"
                        variant="secondary"
                        label="Open"
                        suffixIcon="chevronRight"
                        onClick={() => handleFolderOpen(file)}
                      />
                    ) : (
                      <>
                        <Button
                          size="s"
                          variant="secondary"
                          label="Download"
                          prefixIcon="download"
                          onClick={() => handleDownload(file.id, file.name)}
                        />
                        {/* Only show Print for non-audio/video files */}
                        {!(file.mimeType.startsWith('audio/') || file.mimeType.startsWith('video/')) &&
                          <Button
                            size="s"
                            variant="secondary"
                            label="Print"
                            prefixIcon="print"
                            onClick={() => handlePrint(file.id)}
                          />
                        }
                      </>
                    )}
                  </Row>
                </Row>
                {index < files.length - 1 && <Line />}
              </Column>
            );
          })}
        </Column>
      )}
    </Column>
  );
}