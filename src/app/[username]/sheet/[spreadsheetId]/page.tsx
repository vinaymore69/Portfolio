'use client'

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
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

// Dynamically import Luckysheet to avoid SSR issues
const LuckysheetWorkbook = dynamic(() => import('../../../../components/LuckysheetWorkbook'), {
  ssr: false,
  loading: () => (
    <Column gap="m" horizontal="center" vertical="center" style={{ padding: '3rem 0' }}>
      <Spinner size="l" />
      <Text>Loading spreadsheet...</Text>
    </Column>
  )
});

interface SpreadsheetInfo {
  title: string;
  sheets: Array<{
    sheetId: number;
    title: string;
    rowCount: number;
    columnCount: number;
  }>;
}

export default function SpreadsheetPage() {
  const { username, spreadsheetId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [spreadsheetInfo, setSpreadsheetInfo] = useState<SpreadsheetInfo | null>(null);
  const [sheetData, setSheetData] = useState(null);
  const [error, setError] = useState('');
  const [apiEnableUrl, setApiEnableUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [zoomRatio, setZoomRatio] = useState(1);
  const luckysheetRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const extractGoogleApiEnableUrl = (message: string) => {
    const match = message.match(/https:\/\/console\.developers\.google\.com\/apis\/api\/sheets\.googleapis\.com\/overview\?project=\d+/i);
    return match?.[0] || '';
  };

  const formatSheetLoadError = (status: number, message: string) => {
    if (status === 403 && /has not been used in project|disabled|SERVICE_DISABLED|accessNotConfigured/i.test(message)) {
      return 'Google Sheets API is disabled for the service account project. Enable it in Google Cloud Console, wait a few minutes, and retry.';
    }

    return message || 'Failed to load sheet data. Make sure the spreadsheet is shared with your service account.';
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // TODO: Parse and process the uploaded file (e.g., .xlsx, .csv)
    const reader = new FileReader();
    reader.onload = (e) => {
      // e.target?.result contains file content
      // You can parse and update Luckysheet here
      // For now, just log
      console.log('File uploaded:', file.name, e.target?.result);
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    checkAuthAndLoadSheet();
  }, [spreadsheetId]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousBodyOverscroll;
    };
  }, []);

  const checkAuthAndLoadSheet = async () => {
    try {
      // Check authentication
      const authResponse = await fetch('/api/check-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      
      if (!authResponse.ok) {
        router.push(`/${username}`);
        return;
      }
      
      await loadSheetData();
    } catch {
      router.push(`/${username}`);
    }
  };

  const loadSheetData = async () => {
    try {
      setLoading(true);
      setError('');
      setApiEnableUrl('');
      
      const response = await fetch('/api/sheets/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: username as string,
          spreadsheetId: spreadsheetId as string
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const details = String(errData?.details || errData?.error || 'Failed to load sheet data');
        const statusCode = Number(errData?.status_code || response.status || 500);
        const extractedUrl = extractGoogleApiEnableUrl(details);

        if (extractedUrl) {
          setApiEnableUrl(extractedUrl);
        }

        setError(formatSheetLoadError(statusCode, details));
        return;
      }

      const data = await response.json();
      setSpreadsheetInfo(data.spreadsheetInfo);
      setSheetData(data.sheetData);
    } catch {
      setError('Failed to load sheet data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!luckysheetRef.current) {
      console.error('Luckysheet instance not available');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // Get current data from Luckysheet
      const currentData = luckysheetRef.current.getLuckysheetData();
      
      if (!currentData || currentData.length === 0) {
        throw new Error('No data to save');
      }

      // Convert Luckysheet data to updates format
      const updates = convertLuckysheetToUpdates(currentData[0]);

      const response = await fetch('/api/sheets/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: username as string,
          spreadsheetId: spreadsheetId as string,
          updates: updates
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      // Show success feedback
      const successTag = document.createElement('div');
      successTag.textContent = 'Changes saved successfully!';
      successTag.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 10000;
        font-family: system-ui;
      `;
      document.body.appendChild(successTag);
      setTimeout(() => document.body.removeChild(successTag), 3000);

    } catch (err) {
      setError('Failed to save changes');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const convertLuckysheetToUpdates = (sheetData: any) => {
    const updates: Array<{ range: string; values: (string | number | boolean)[][] }> = [];
    const celldata = sheetData.celldata || [];
    
    // Group cells by rows for batch updates
    const rowGroups: { [key: number]: any[] } = {};
    
    celldata.forEach((cell: any) => {
      if (!rowGroups[cell.r]) {
        rowGroups[cell.r] = [];
      }
      rowGroups[cell.r].push(cell);
    });

    // Create updates for each row
    for (const [row, cells] of Object.entries(rowGroups)) {
      const rowNum = parseInt(row);
      const sortedCells = cells.sort((a, b) => a.c - b.c);
      
      // Find continuous ranges
      let startCol = sortedCells[0].c;
      let values: (string | number | boolean)[] = [];
      let lastCol = startCol - 1;
      
      sortedCells.forEach((cell, index) => {
        // Fill gaps with empty values
        while (lastCol + 1 < cell.c) {
          values.push('');
          lastCol++;
        }
        
        // Add cell value
        values.push(cell.v && cell.v.v !== undefined ? cell.v.v : '');
        lastCol = cell.c;
        
        // If this is the last cell or there's a gap to the next cell, create an update
        if (index === sortedCells.length - 1 || sortedCells[index + 1].c > cell.c + 1) {
          if (values.some(v => v !== '')) { // Only update if there are non-empty values
            const range = `${columnIndexToLetter(startCol)}${rowNum + 1}:${columnIndexToLetter(lastCol)}${rowNum + 1}`;
            updates.push({
              range: range,
              values: [values]
            });
          }
          
          // Reset for next range
          if (index < sortedCells.length - 1) {
            startCol = sortedCells[index + 1].c;
            values = [];
            lastCol = startCol - 1;
          }
        }
      });
    }
    
    return updates;
  };

  const columnIndexToLetter = (index: number): string => {
    let result = '';
    while (index >= 0) {
      result = String.fromCharCode(65 + (index % 26)) + result;
      index = Math.floor(index / 26) - 1;
    }
    return result;
  };

  const handleZoomChange = (delta: number) => {
    const nextZoom = Math.max(0.5, Math.min(2, Number((zoomRatio + delta).toFixed(2))));
    setZoomRatio(nextZoom);
    luckysheetRef.current?.setZoom?.(nextZoom);
  };

  const resetZoom = () => {
    setZoomRatio(1);
    luckysheetRef.current?.setZoom?.(1);
  };

  if (loading) {
    return (
      <Column gap="l" style={{ padding: '2rem' }}>
        <Row vertical="center" gap="s">
          <Spinner size="m" />
          <Text>Loading spreadsheet...</Text>
        </Row>
      </Column>
    );
  }

  if (error && !spreadsheetInfo) {
    return (
      <Column gap="l" style={{ padding: '2rem' }}>
        <Row vertical="center" gap="m">
          <Button
            onClick={() => router.push(`/${username}/sheet`)}
            variant="tertiary"
            size="s"
            prefixIcon="chevronLeft"
            label="Back to Sheets"
          />
          <Heading variant="heading-strong-l">Error</Heading>
        </Row>
        
        <Tag variant="error">{error}</Tag>

        {apiEnableUrl && (
          <Button
            href={apiEnableUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            label="Enable Google Sheets API"
          />
        )}
        
        <Button onClick={loadSheetData} variant="primary" label="Try Again" />
      </Column>
    );
  }

  return (
    <Column
      fillWidth
      style={{
        width: '100%',
        maxWidth: 'none',
        minHeight: 'calc(100dvh - 7.5rem)',
        height: 'calc(100dvh - 7.5rem)',
        overflow: 'hidden'
      }}
    >
      <div style={{ flex: 1, minHeight: 0, width: '100%', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            borderRadius: '0.75rem',
            background: 'rgba(12, 14, 20, 0.72)',
            backdropFilter: 'blur(8px)'
          }}
        >
          {error && <Tag variant="error" size="s">{error}</Tag>}
          <Button
            onClick={handleSave}
            variant="primary"
            size="s"
            disabled={saving}
            prefixIcon="save"
            label={saving ? 'Saving...' : 'Save'}
          />
          <Button onClick={() => handleZoomChange(-0.1)} variant="secondary" size="s" label="-" />
          <Button onClick={resetZoom} variant="secondary" size="s" label={`${Math.round(zoomRatio * 100)}%`} />
          <Button onClick={() => handleZoomChange(0.1)} variant="secondary" size="s" label="+" />
        </div>

        {sheetData && (
          <LuckysheetWorkbook
            ref={luckysheetRef}
            data={sheetData}
            options={{
              container: 'luckysheet',
              title: spreadsheetInfo?.title || 'Spreadsheet',
              lang: 'en',
            }}
          />
        )}
      </div>
    </Column>
  );
}