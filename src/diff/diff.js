/**
 * Owner: Role 2 - Diff / Patch Engine
 * Editable only by the Role 2 branch.
 */

import { PATCH_TYPES } from "./change-types.js";

function getNodeKey(node) {
  if (node?.type !== "element") {
    return null;
  }

  const key = node.attributes?.key;
  return typeof key === "string" && key.length > 0 ? key : null;
}

function isSameNodeType(previousNode, nextNode) {
  if (!previousNode || !nextNode || previousNode.type !== nextNode.type) {
    return false;
  }

  if (previousNode.type === "text") {
    return true;
  }

  return previousNode.tagName === nextNode.tagName;
}

function hasAnyKeys(children) {
  return children.some((child) => getNodeKey(child) !== null);
}

function buildKeyIndex(children) {
  return children.reduce((result, child, index) => {
    const key = getNodeKey(child);

    if (key) {
      result.set(key, { child, index, matched: false });
    }

    return result;
  }, new Map());
}

function buildUnkeyedList(children) {
  return children.reduce((result, child, index) => {
    if (!getNodeKey(child)) {
      result.push({ child, index, matched: false });
    }

    return result;
  }, []);
}

function findReusableUnkeyed(unkeyedEntries, nextChild) {
  const entry = unkeyedEntries.find((candidate) => !candidate.matched && isSameNodeType(candidate.child, nextChild));

  if (!entry) {
    return null;
  }

  entry.matched = true;
  return entry;
}

function diffKeyedChildren(previousChildren, nextChildren, path) {
  const patches = [];
  const previousByKey = buildKeyIndex(previousChildren);
  const previousUnkeyed = buildUnkeyedList(previousChildren);

  nextChildren.forEach((nextChild) => {
    const key = getNodeKey(nextChild);

    if (key) {
      const previousEntry = previousByKey.get(key);

      if (previousEntry && isSameNodeType(previousEntry.child, nextChild)) {
        previousEntry.matched = true;
        const childPath = [...path, previousEntry.index];
        patches.push(...diffVNodes(previousEntry.child, nextChild, childPath));
        return;
      }

      return;
    }

    const previousEntry = findReusableUnkeyed(previousUnkeyed, nextChild);

    if (!previousEntry) {
      return;
    }

    const childPath = [...path, previousEntry.index];
    patches.push(...diffVNodes(previousEntry.child, nextChild, childPath));
  });

  patches.push({
    type: PATCH_TYPES.REORDER_CHILDREN,
    path: [...path],
    payload: { children: nextChildren },
  });

  return patches;
}

function diffIndexedChildren(previousChildren, nextChildren, path) {
  const patches = [];
  const sharedLength = Math.min(previousChildren.length, nextChildren.length);

  for (let index = 0; index < sharedLength; index += 1) {
    const childPath = [...path, index];
    const childPatches = diffVNodes(previousChildren[index], nextChildren[index], childPath);

    childPatches.forEach((patch) => {
      if (patch.type === PATCH_TYPES.REMOVE_NODE) {
        patches.push({
          type: PATCH_TYPES.REMOVE_CHILD,
          path: [...path],
          payload: { index },
        });
        return;
      }

      patches.push(patch);
    });
  }

  for (let index = previousChildren.length - 1; index >= nextChildren.length; index -= 1) {
    patches.push({
      type: PATCH_TYPES.REMOVE_CHILD,
      path: [...path],
      payload: { index },
    });
  }

  for (let index = previousChildren.length; index < nextChildren.length; index += 1) {
    patches.push({
      type: PATCH_TYPES.INSERT_CHILD,
      path: [...path],
      payload: { index, node: nextChildren[index] },
    });
  }

  return patches;
}

export function diffVNodes(previousNode, nextNode, path = []) {
  if (!previousNode && !nextNode) {
    return [];
  }

  if (!previousNode && nextNode) {
    return [
      {
        type: PATCH_TYPES.REPLACE_NODE,
        path: [...path],
        payload: { node: nextNode },
      },
    ];
  }

  if (previousNode && !nextNode) {
    return [
      {
        type: PATCH_TYPES.REMOVE_NODE,
        path: [...path],
        payload: {},
      },
    ];
  }

  if (!isSameNodeType(previousNode, nextNode)) {
    return [
      {
        type: PATCH_TYPES.REPLACE_NODE,
        path: [...path],
        payload: { node: nextNode },
      },
    ];
  }

  if (previousNode.type === "text" && nextNode.type === "text") {
    if (previousNode.textContent === nextNode.textContent) {
      return [];
    }

    return [
      {
        type: PATCH_TYPES.UPDATE_TEXT,
        path: [...path],
        payload: { textContent: nextNode.textContent ?? "" },
      },
    ];
  }

  const patches = [];
  const previousAttributes = previousNode.attributes ?? {};
  const nextAttributes = nextNode.attributes ?? {};

  Object.entries(nextAttributes).forEach(([name, value]) => {
    if (previousAttributes[name] !== value) {
      patches.push({
        type: PATCH_TYPES.SET_ATTRIBUTE,
        path: [...path],
        payload: { name, value },
      });
    }
  });

  Object.keys(previousAttributes).forEach((name) => {
    if (!(name in nextAttributes)) {
      patches.push({
        type: PATCH_TYPES.REMOVE_ATTRIBUTE,
        path: [...path],
        payload: { name },
      });
    }
  });

  const previousChildren = previousNode.children ?? [];
  const nextChildren = nextNode.children ?? [];

  if (hasAnyKeys(previousChildren) || hasAnyKeys(nextChildren)) {
    return patches.concat(diffKeyedChildren(previousChildren, nextChildren, path));
  }

  return patches.concat(diffIndexedChildren(previousChildren, nextChildren, path));
}





