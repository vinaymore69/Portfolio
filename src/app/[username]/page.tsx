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
  Input,
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
  const { username } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  
  // Files State
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [fileError, setFileError] = useState('');
  const [folderPath, setFolderPath] = useState<BreadcrumbItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingFileName, setUploadingFileName] = useState('');

  // Settings State
  const [viewMode, setViewMode] = useState<'files' | 'settings'>('files');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileMsgType, setProfileMsgType] = useState<'success' | 'error'>('success');
  const [email, setEmail] = useState('');
  const [folderId, setFolderId] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, [username]);

  useEffect(() => {
    if (isAuthenticated) {
      if (viewMode === 'files') {
        loadFiles(folderPath.length > 0 ? folderPath[folderPath.length - 1].id : undefined);
      } else if (viewMode === 'settings') {
        loadProfile();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, viewMode]);

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

  const handleLogout = () => {
    document.cookie = `auth-${username}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setIsAuthenticated(false);
    setFiles([]);
    setFolderPath([]);
    setViewMode('files');
  };

  // ----- PROFILE SETTINGS LOGIC ----- //

  const loadProfile = async () => {
    setProfileLoading(true);
    setProfileMessage('');
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setEmail(data.profile.email || '');
        setFolderId(data.profile.folder_id || '');
      } else {
        setProfileMessage('Failed to load profile');
        setProfileMsgType('error');
      }
    } catch {
      setProfileMessage('Network error loading profile');
      setProfileMsgType('error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage('');

    try {
      const updates: any = {};
      if (email) updates.email = email;
      if (folderId) updates.folderId = folderId;
      if (newPassword) updates.password = newPassword;

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        setProfileMessage('Profile updated successfully');
        setProfileMsgType('success');
        setNewPassword(''); // clear after success
      } else {
        const data = await res.json();
        setProfileMessage(data.error || 'Failed to update profile');
        setProfileMsgType('error');
      }
    } catch {
      setProfileMessage('Network error updating profile');
      setProfileMsgType('error');
    } finally {
      setProfileLoading(false);
    }
  };


  // ----- FILE LOGIC ----- //

  const loadFiles = async (targetFolderId?: string) => {
    setLoadingFiles(true);
    setFileError('');
    try {
      const body: Record<string, string> = { username: username as string };
      if (targetFolderId) body.folderId = targetFolderId;

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadingFileName(file.name);
    setUploadProgress(0);
    setFileError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('username', username as string);
      // Target folder: root or last folder in breadcrumb
      if (folderPath.length > 0) {
        formData.append('folderId', folderPath[folderPath.length - 1].id);
      }
      const uploadResult = await new Promise<{ ok: boolean; data: any }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/files/upload');

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        };

        xhr.onload = () => {
          let data: any = {};
          try {
            data = JSON.parse(xhr.responseText || '{}');
          } catch {}

          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(100);
            resolve({ ok: true, data });
            return;
          }

          resolve({ ok: false, data });
        };

        xhr.onerror = () => reject(new Error('Network error while uploading file'));
        xhr.send(formData);
      });

      if (uploadResult.ok) {
        await loadFiles(folderPath.length > 0 ? folderPath[folderPath.length - 1].id : undefined);
      } else {
        setFileError(uploadResult.data?.details || uploadResult.data?.error || 'Failed to upload file');
      }
    } catch {
      setFileError('Failed to upload file');
    } finally {
      setIsUploading(false);
      setUploadingFileName('');
      setUploadProgress(null);
      // Reset file input
      (e.target as HTMLInputElement).value = '';
    }
  };

  const handleFolderOpen = (folder: FileItem) => {
    const newPath = [...folderPath, { id: folder.id, name: folder.name }];
    setFolderPath(newPath);
    loadFiles(folder.id);
  };

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

  // ----- RENDER SCREENS ----- //

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

  // Dashboard Context
  return (
    <Column maxWidth="l" fillWidth paddingY="40" gap="32">
      {/* Header */}
      <Row fillWidth horizontal="between" vertical="center" wrap>
        <Column gap="4">
          <Heading variant="heading-strong-xl">
            {username}'s {viewMode === 'settings' ? 'Settings' : 'Portal'}
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Your private Google Drive portal
          </Text>
        </Column>
        
        <Row gap="8">
          {viewMode === 'files' ? (
            <Button
              variant="secondary"
              size="s"
              label="Settings"
              prefixIcon="person"
              onClick={() => setViewMode('settings')}
            />
          ) : (
            <Button
              variant="secondary"
              size="s"
              label="Files"
              prefixIcon="folder"
              onClick={() => setViewMode('files')}
            />
          )}
          <Button
            variant="secondary"
            size="s"
            label="Log out"
            prefixIcon="logout"
            onClick={handleLogout}
          />
        </Row>
      </Row>

      <Line />

      {/* Settings View */}
      {viewMode === 'settings' && (
        <Column fillWidth gap="24">
          {profileLoading && !email && !folderId ? (
            <Column paddingY="40" horizontal="center">
              <Spinner />
            </Column>
          ) : (
            <form onSubmit={handleUpdateProfile} style={{ width: '100%' }}>
              <Column fillWidth gap="24" maxWidth="s">
                <Text variant="body-default-m" onBackground="neutral-weak">
                  Update your contact email, password, and target Google Drive folder.
                </Text>
                
                {profileMessage && (
                  <Text 
                    variant="body-default-s" 
                    onBackground={profileMsgType === 'success' ? 'success-strong' : 'danger-strong'}
                  >
                    {profileMessage}
                  </Text>
                )}

                <Input
                  id="email"
                  label="Email Login"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="Enter an email to login with..."
                />

                <PasswordInput
                  id="new-password"
                  label="New Password"
                  value={newPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep unchanged"
                />

                <Input
                  id="folder-id"
                  label="Google Drive Folder ID"
                  value={folderId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFolderId(e.target.value)}
                />

                <Button
                  type="submit"
                  label={profileLoading ? "Updating..." : "Save Settings"}
                  disabled={profileLoading}
                />
              </Column>
            </form>
          )}
        </Column>
      )}

      {/* Files View */}
      {viewMode === 'files' && (
        <>
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
              <Row key={crumb.id} gap="4" vertical="center" wrap>
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
          <Row fillWidth horizontal="between" vertical="center" wrap>
            <Text variant="label-default-s" onBackground="neutral-weak" style={{ flexShrink: 0 }}>
              {loadingFiles
                ? 'Loading…'
                : `${files.length} item${files.length !== 1 ? 's' : ''}`}
            </Text>
            <Row gap="8" wrap>
              <Button
                variant="tertiary"
                size="s"
                label="Spreadsheets"
                prefixIcon="grid"
                onClick={() => window.location.href = `/${username}/sheet`}
                disabled={loadingFiles}
              />
              <Button
                variant="tertiary"
                size="s"
                label="Upload"
                prefixIcon="plus"
                onClick={() => document.getElementById('file-upload-input')?.click()}
                disabled={loadingFiles || isUploading}
              />
              <Button
                variant="tertiary"
                size="s"
                label="Refresh"
                prefixIcon="refresh"
                onClick={() => loadFiles(folderPath.length > 0 ? folderPath[folderPath.length - 1].id : undefined)}
                disabled={loadingFiles || isUploading}
              />
            </Row>
            {/* Hidden file input for upload */}
            <input
              id="file-upload-input"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </Row>

          {isUploading && (
            <Column fillWidth gap="8">
              <Row fillWidth horizontal="between" vertical="center">
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Uploading {uploadingFileName}
                </Text>
                <Text variant="body-strong-s" onBackground="neutral-strong">
                  {uploadProgress ?? 0}%
                </Text>
              </Row>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  background: 'var(--neutral-alpha-medium)',
                }}
              >
                <div
                  style={{
                    width: `${uploadProgress ?? 0}%`,
                    height: '100%',
                    background: 'var(--brand-solid-strong)',
                    transition: 'width 120ms linear',
                  }}
                />
              </div>
            </Column>
          )}

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
                        <Row gap="8" vertical="center" wrap>
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

                      {/* Actions */}
                      <Row gap="8" style={{ flexShrink: 0 }} onClick={(e: React.MouseEvent) => e.stopPropagation()} wrap>
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
        </>
      )}
    </Column>
  );
}