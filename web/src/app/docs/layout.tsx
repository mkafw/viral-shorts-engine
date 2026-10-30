'use client';

import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { FrameworkProvider } from 'fumadocs-core/framework';
import { usePathname, useParams, useRouter } from 'next/navigation';
import NextLink from 'next/link';
import type { AnchorHTMLAttributes, FC, ReactNode } from 'react';
import { pageLoader } from '@/lib/source';

const Link: FC<AnchorHTMLAttributes<HTMLAnchorElement> & { prefetch?: boolean }> = (props) => {
  const { prefetch: _, ...rest } = props;
  return <NextLink href={rest.href || ''} {...rest} />;
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <FrameworkProvider usePathname={usePathname} useParams={useParams} useRouter={useRouter} Link={Link}>
      <DocsLayout tree={pageLoader.pageTree} nav={{ title: '《灵魂积碳》导演圣经' }}>
        {children}
      </DocsLayout>
    </FrameworkProvider>
  );
}
