// Flatten nested tree into rows with depth
export function flattenItems(items, depth = 0) {
    return items.flatMap((item) => [
        { ...item, depth },
        ...flattenItems(item.children || [], depth + 1),
    ]);
}

// Remove an item and all its descendants from the tree
export function removeItem(items, id) {
    return items
        .filter((item) => item.id !== id)
        .map((item) => ({ ...item, children: removeItem(item.children || [], id) }));
}

// Move an item before/after a sibling (same parent only)
export function moveSibling(items, draggedId, targetId) {
    const from = items.findIndex((i) => i.id === draggedId);
    const to = items.findIndex((i) => i.id === targetId);

    if (from !== -1 && to !== -1) {
        const next = [...items];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return { tree: next, siblings: next };
    }

    for (let index = 0; index < items.length; index++) {
        const children = items[index].children || [];
        if (!children.length) continue;

        const result = moveSibling(children, draggedId, targetId);
        if (result.siblings) {
            const next = [...items];
            next[index] = { ...items[index], children: result.tree };
            return { tree: next, siblings: result.siblings };
        }
    }

    return { tree: items, siblings: null };
}

// Build dropdown options with indented titles
export function toParentOptions(items) {
    return flattenItems(items).map((item) => ({
        ...item,
        title: `${'— '.repeat(item.depth)}${item.title}`,
    }));
}

// ---------- nesting helpers ----------

const MAX_DEPTH_INDEX = 4; // 5 levels total (0..4)

// Find a node with its parent, siblings list and index
export function findNode(items, id, parent = null) {
    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        if (item.id === id) {
            return { node: item, parent, siblings: items, index };
        }
        const found = findNode(item.children || [], id, item);
        if (found) return found;
    }
    return null;
}

function detach(items, id) {
    return items
        .filter((item) => item.id !== id)
        .map((item) => ({ ...item, children: detach(item.children || [], id) }));
}

function attach(items, parentId, node, index = null) {
    if (parentId === null) {
        const next = [...items];
        next.splice(index ?? next.length, 0, node);
        return next;
    }

    return items.map((item) => {
        if (item.id === parentId) {
            const children = [...(item.children || [])];
            children.splice(index ?? children.length, 0, node);
            return { ...item, children };
        }
        return { ...item, children: attach(item.children || [], parentId, node, index) };
    });
}

function subtreeHeight(node) {
    const children = node.children || [];
    if (!children.length) return 1;
    return 1 + Math.max(...children.map(subtreeHeight));
}

function isInSubtree(node, id) {
    return (node.children || []).some((child) => child.id === id || isInSubtree(child, id));
}

// Returns an error message if the item can't become a child of parentId
export function getNestError(tree, id, parentId) {
    const found = findNode(tree, id);
    const target = flattenItems(tree).find((item) => item.id === parentId);

    if (!found || !target) return 'Item not found.';
    if (id === parentId || isInSubtree(found.node, parentId)) {
        return 'An item cannot be nested under itself or its own children.';
    }
    if (target.depth + subtreeHeight(found.node) > MAX_DEPTH_INDEX) {
        return 'Maximum nesting depth of 5 levels reached.';
    }
    return null;
}

// Move a node under newParentId (null = top level) at index (null = end).
// Returns the new tree and the reorder payload for the affected lists.
export function moveNode(tree, id, newParentId, index = null) {
    const found = findNode(tree, id);
    if (!found) return null;

    const oldParentId = found.parent ? found.parent.id : null;
    const moved = { ...found.node, parent_id: newParentId };
    const next = attach(detach(tree, id), newParentId, moved, index);

    const payload = [];
    new Set([oldParentId, newParentId]).forEach((parentId) => {
        const list = parentId === null ? next : findNode(next, parentId)?.node.children || [];
        list.forEach((item, i) => {
            payload.push({ id: item.id, order: i + 1, parent_id: parentId });
        });
    });

    return { tree: next, payload };
}

// Move an item out one level, placing it right after its old parent
export function outdentItem(tree, id) {
    const found = findNode(tree, id);
    if (!found || !found.parent) return null;

    const parentFound = findNode(tree, found.parent.id);
    const newParentId = parentFound.parent ? parentFound.parent.id : null;

    return moveNode(tree, id, newParentId, parentFound.index + 1);
}