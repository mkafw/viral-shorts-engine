import { docs, meta } from '../../.source/server';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { loader } from 'fumadocs-core/source';

const source = toFumadocsSource(docs, meta);

export const pageLoader = loader({
  baseUrl: '/docs',
  source,
});