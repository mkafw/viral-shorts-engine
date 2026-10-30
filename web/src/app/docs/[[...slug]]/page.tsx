import { pageLoader } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as CustomComponents from '@/components/mdx';
import React from 'react';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = pageLoader.getPage(params.slug);
  if (!page) notFound();

  const data = page.data as {
    body: React.ComponentType<any>;
    toc: any[];
    full?: boolean;
    title?: string;
    description?: string;
  };
  const MDX = data.body;

  return (
    <DocsPage toc={data.toc} full={data.full}>
      <DocsTitle>{data.title}</DocsTitle>
      <DocsDescription>{data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents, ...CustomComponents }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return pageLoader.getPages().map((page) => ({
    slug: page.slugs,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = pageLoader.getPage(params.slug);
  if (!page) notFound();

  const d = page.data as { title?: string; description?: string };
  return {
    title: d.title,
    description: d.description,
  };
}
