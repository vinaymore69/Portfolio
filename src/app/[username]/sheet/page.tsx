'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Column,
  Row,
  Heading,
  Text,
  Button,
  Spinner,
  Icon,
  Tag,
} from '@once-ui-system/core';

interface SpreadsheetItem {
  id: string;
  name: string;
  modifiedTime: string;
  source?: 'folder' | 'direct';
}

export default function SheetsPage() {
  const { username } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetItem[]>([]);
  const [error, setError] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('Checking authentication for user:', username);
    try {
      const response = await fetch('/api/check-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      
      console.log('Auth response status:', response.status);
      
      if (!response.ok) {
        console.log('Authentication failed, redirecting to login');
        setAuthError('Please login first');
        setTimeout(() => router.push(`/${username}`), 2000);
        return;
      }
      
      console.log('Authentication successful, loading spreadsheets');
      loadSpreadsheets();
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthError('Authentication error');
      setTimeout(() => router.push(`/${username}`), 2000);
    }
  };

  const loadSpreadsheets = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/sheets/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }), // Pass username to API
      });

      if (!response.ok) {
        throw new Error('Failed to load spreadsheets');
      }

      const data = await response.json();
      setSpreadsheets(data.spreadsheets || []);
    } catch (err) {
      setError('Failed to load spreadsheets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openSpreadsheet = (spreadsheetId: string) => {
    router.push(`/${username}/sheet/${spreadsheetId}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Column gap="l" style={{ padding: '2rem' }}>
        <Row gap="s" style={{ alignItems: 'center' }}>
          <Spinner size="m" />
          <Text>Loading spreadsheets...</Text>
        </Row>
      </Column>
    );
  }

  if (authError) {
    return (
      <Column gap="l" style={{ padding: '2rem' }}>
        <Row vertical="center" gap="m">
          <Heading variant="heading-strong-l">Authentication Required</Heading>
        </Row>
        <Tag variant="error">{authError}</Tag>
        <Text>Redirecting to login page...</Text>
        <Button onClick={() => router.push(`/${username}`)} variant="primary">
          Go to Login
        </Button>
      </Column>
    );
  }

  return (
    <Column gap="l" style={{ padding: '2rem' }}>
      <Row gap="m" vertical="center" horizontal="between">
        <Row gap="m" vertical="center">
          <Button
            onClick={() => router.push(`/${username}`)}
            variant="ghost"
            size="s"
            prefixIcon="chevronLeft"
            label="Back to Portal"
          />
          <Heading variant="heading-strong-l">Spreadsheets</Heading>
        </Row>
      </Row>

      {error && (
        <Row>
          <Tag variant="error">{error}</Tag>
        </Row>
      )}

      {spreadsheets.length === 0 && !error && (
        <Column gap="m" horizontal="center" style={{ padding: '3rem 0' }}>
          <Icon name="spreadsheet" size="xl" />
          <Text align="center">
            No spreadsheets found in your folder.
            <br />
            Create or share Google Sheets with your service account to see them here.
          </Text>
        </Column>
      )}

      {spreadsheets.length > 0 && (
        <Column gap="s">
          <Text size="s" variant="body-secondary">
            {spreadsheets.length} spreadsheet{spreadsheets.length !== 1 ? 's' : ''} found
          </Text>
          
          <Column gap="xs">
            {spreadsheets.map((sheet) => (
              <Button
                key={sheet.id}
                onClick={() => openSpreadsheet(sheet.id)}
                variant="ghost"
                style={{
                  padding: '1rem',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  border: '1px solid var(--neutral-border-weak)',
                  borderRadius: '0.5rem',
                }}
              >
                <Column gap="xs" style={{ flex: 1 }}>
                  <Row gap="s" vertical="center" horizontal="between">
                    <Row gap="s" vertical="center">
                      <Icon name="spreadsheet" />
                      <Text variant="body-strong-m">{sheet.name}</Text>
                      {sheet.source === 'direct' && (
                        <Tag size="xs" variant="accent">Direct</Tag>
                      )}
                    </Row>
                    <Icon name="chevronRight" size="s" />
                  </Row>
                  <Text size="xs" variant="body-secondary">
                    Modified: {formatDate(sheet.modifiedTime)}
                    {sheet.source && ` • Source: ${sheet.source === 'direct' ? 'Direct Access' : 'Drive Folder'}`}
                  </Text>
                </Column>
              </Button>
            ))}
          </Column>
        </Column>
      )}

      {/* Sample spreadsheet for testing - you can remove this */}
      <Column gap="m" style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed var(--neutral-border-weak)', borderRadius: '0.5rem' }}>
        <Text weight="medium" size="s">Sample Spreadsheet (for testing):</Text>
        <Button
          onClick={() => openSpreadsheet('1057MdIFd-8CSOqJbWc1WTt64oru64JAqByNO366TYfA')}
          variant="secondary"
          size="s"
          prefixIcon="spreadsheet"
          label="Open Test Sheet"
        />
        <Text size="xs" variant="body-secondary">
          This opens the spreadsheet ID you provided: 1057MdIFd-8CSOqJbWc1WTt64oru64JAqByNO366TYfA
        </Text>
      </Column>
    </Column>
  );
}