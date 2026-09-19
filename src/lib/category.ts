export function buildCategoryTree(
  list: any[],
  parentId: any = null,
  depth = 0,
  currentPath = ""
): any[] {
  let result: any[] = [];
  list.filter((item) => item.parent_id === parentId).forEach((item) => {
    const fullPath = currentPath ? `${currentPath} > ${item.name}` : item.name;
    result.push({ ...item, depth, fullPath });
    const children = buildCategoryTree(list, item.id, depth + 1, fullPath);
    result = result.concat(children);
  });
  return result;
}

export function getAncestry(list: any[], currentId: any): any[] {
  if (!currentId) return [];
  const item = list.find((t) => t.id === currentId);
  if (!item) return [];
  return [item.id, ...getAncestry(list, item.parent_id)];
}

export function getRootCategory(list: any[], currentId: any): any | null {
  let curr = list.find((t) => t.id === currentId);
  while (curr && curr.parent_id) {
    const parent = list.find((t) => t.id === curr.parent_id);
    if (!parent) break;
    curr = parent;
  }
  return curr || null;
}

export function getDescendantCategoryIds(list: any[], parentId: any): string[] {
  if (!parentId) return [];
  const children = list.filter((t) => t.parent_id === parentId);
  let ids: string[] = [];
  for (const child of children) {
    ids.push(child.id);
    ids = ids.concat(getDescendantCategoryIds(list, child.id));
  }
  return ids;
}

export function findTargetCategory(tree: any[], filter: string | null): any | null {
  if (!filter) return null;
  const trimmed = filter.trim();
  // 1. Exact fullPath or exact ID
  let match = tree.find((t) => t.fullPath === trimmed || t.id === trimmed);
  if (match) return match;
  // 2. Case-insensitive fullPath
  match = tree.find((t) => t.fullPath?.toLowerCase() === trimmed.toLowerCase());
  if (match) return match;
  // 3. Root category with matching name
  match = tree.find((t) => !t.parent_id && t.name?.toLowerCase() === trimmed.toLowerCase());
  if (match) return match;
  // 4. Any category with matching name
  match = tree.find((t) => t.name?.toLowerCase() === trimmed.toLowerCase());
  return match || null;
}

export function resolveCategoryIds(
  typesList: any[],
  filter: string | null
): {
  targetType: any | null;
  rootType: any | null;
  matchingTypeIds: string[];
} {
  if (!filter) return { targetType: null, rootType: null, matchingTypeIds: [] };
  const tree = buildCategoryTree(typesList);
  const targetType = findTargetCategory(tree, filter);
  if (targetType) {
    const rootType = getRootCategory(typesList, targetType.id);
    return {
      targetType,
      rootType,
      matchingTypeIds: [targetType.id, ...getDescendantCategoryIds(typesList, targetType.id)],
    };
  }
  return {
    targetType: null,
    rootType: null,
    matchingTypeIds: [filter.trim()],
  };
}
