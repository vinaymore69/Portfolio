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
    <Column gap="m" alignItems="center" style={{ padding: '3rem 0' }}>
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
  const [saving, setSaving] = useState(false);
  const luckysheetRef = useRef<any>(null);

  useEffect(() => {
    checkAuthAndLoadSheet();
  }, [spreadsheetId]);

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
      
      const response = await fetch('/api/sheets/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: username as string,
          spreadsheetId: spreadsheetId as string,
          sheetName: 'Sheet1' // Default to Sheet1, could be made dynamic
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || 'Failed to load sheet data');
      }

      const data = await response.json();
      setSpreadsheetInfo(data.spreadsheetInfo);
      setSheetData(data.sheetData);
    } catch (err: any) {
      setError(err?.message || 'Failed to load sheet data. Make sure the spreadsheet is shared with your service account.');
      console.error(err);
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
    const updates = [];
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
      let values = [];
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
            variant="ghost"
            size="s"
            prefixIcon="chevronLeft"
            label="Back to Sheets"
          />
          <Heading variant="heading-strong-l">Error</Heading>
        </Row>
        
        <Tag variant="error">{error}</Tag>
        
        <Button onClick={loadSheetData} variant="primary" label="Try Again" />
      </Column>
    );
  }

  return (
    <Column style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <Row 
        vertical="center"
        horizontal="between"
        style={{ 
          padding: '1rem 2rem',
          borderBottom: '1px solid var(--neutral-border-weak)',
          backgroundColor: 'var(--neutral-background-weak)'
        }}
      >
        <Row vertical="center" gap="m">
          <Button
            onClick={() => router.push(`/${username}/sheet`)}
            variant="ghost"
            size="s"
            prefixIcon="chevronLeft"
            label="Back"
          />
          <Heading variant="heading-strong-m">
            {spreadsheetInfo?.title || 'Spreadsheet'}
          </Heading>
        </Row>
        
        <Row vertical="center" gap="s">
          {error && <Tag variant="error" size="s">{error}</Tag>}
          {saving && (
            <Row vertical="center" gap="xs">
              <Spinner size="s" />
              <Text size="s">Saving...</Text>
            </Row>
          )}
          <Button
            onClick={handleSave}
            variant="primary"
            size="s"
            disabled={saving}
            prefixIcon="save"
            label="Save Changes"
          />
        </Row>
      </Row>

      {/* Spreadsheet Container */}
      <div style={{ flex: 1, position: 'relative' }}>
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