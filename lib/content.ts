import {
  discoverCategories,
  discoverWorks,
  discoverImagesByCategory,
  type DiscoveredCategory,
  type DiscoveredWork,
  type ImageItem,
} from "./discover";

export type Category = DiscoveredCategory;
export type Work = DiscoveredWork;
export type { ImageItem };

let _categories: Category[] | null = null;
let _works: Work[] | null = null;

export function getCategories(): Category[] {
  if (!_categories) {
    try {
      _categories = discoverCategories();
    } catch {
      _categories = [];
    }
  }
  return _categories;
}

export function getWorks(): Work[] {
  if (!_works) {
    try {
      _works = discoverWorks();
    } catch {
      _works = [];
    }
  }
  return _works;
}

export function getCategoryImages(categorySlug: string): ImageItem[] {
  try {
    return discoverImagesByCategory(categorySlug);
  } catch {
    return [];
  }
}

export const categories = getCategories();
export const works = getWorks();
