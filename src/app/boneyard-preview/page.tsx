'use client';

import { Skeleton } from 'boneyard-js/react';
import { Button, Column, Heading, Icon, Row, Tag, Text } from '@once-ui-system/core';

const fixture = (
  <Column gap="s">
    <Text size="s">2 spreadsheets found</Text>
    <Column gap="xs">
      <Button
        variant="tertiary"
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
              <Text variant="body-strong-m">Quarterly Planning</Text>
            </Row>
            <Icon name="chevronRight" size="s" />
          </Row>
          <Text size="xs">Modified: 1/1/2026, 10:00:00 AM • Source: Drive Folder</Text>
        </Column>
      </Button>
      <Button
        variant="tertiary"
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
              <Text variant="body-strong-m">Project Timeline</Text>
              <Tag size="s" variant="accent">Direct</Tag>
            </Row>
            <Icon name="chevronRight" size="s" />
          </Row>
          <Text size="xs">Modified: 1/2/2026, 12:30:00 PM • Source: Direct Access</Text>
        </Column>
      </Button>
    </Column>
  </Column>
);

export default function BoneyardPreviewPage() {
  return (
    <Column gap="l" style={{ padding: '2rem', maxWidth: '960px', width: '100%' }}>
      <Heading variant="heading-strong-l">Boneyard Preview</Heading>
      <Text size="s">This page exists only so boneyard can capture named skeleton layouts.</Text>

      <Skeleton name="user-sheet-list" loading={false} fixture={fixture}>
        {fixture}
      </Skeleton>
    </Column>
  );
}
