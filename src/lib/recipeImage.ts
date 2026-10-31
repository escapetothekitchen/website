import { existsSync } from 'node:fs';
import { join } from 'node:path';

// Prefer an explicit cover image, otherwise use the first photo in the recipe.
export function recipeImage(body: string, image?: string): string | undefined {
  const source = image
    || body.match(/!\[[^\]]*\]\(\s*([^\s)]+)[^)]*\)/)?.[1]
    || body.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1];
  // Some older recipes reference photos that are no longer in the repository.
  if (source?.startsWith('/') && !existsSync(join(process.cwd(), 'public', source))) {
    return undefined;
  }
  return source;
}
