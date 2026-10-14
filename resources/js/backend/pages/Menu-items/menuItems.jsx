import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { MenuItemTable } from '@/backend/components/menu-items/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/backend/components/ui/alert-dialog';
import { Button } from '@/backend/components/ui/button';
import { useAppContext } from '@/backend/context/AppContext';
import { fetchMenus } from '@/backend/pages/Menu/api';

import { deleteMenuItem, fetchMenuItems, reorderMenuItems } from './api';
import {
  findNode,
  flattenItems,
  getNestError,
  moveNode,
  moveSibling,
  outdentItem,
} from './utils';

const DRAG_THRESHOLD = 40; // px of horizontal drag needed to nest/un-nest

const successStyle = { style: { color: '#16a34a' } };
const errorStyle = { style: { color: '#dc2626' } };

export default function MenuItems() {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const { setPageTitle } = useAppContext();

  const [menu, setMenu] = useState(null);
  const [tree, setTree] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const rows = useMemo(() => flattenItems(tree), [tree]);

  useEffect(() => {
    setPageTitle(menu ? `${menu.title} Items` : 'Menu Items');
  }, [setPageTitle, menu]);

  const loadData = useCallback(async () => {
    setErrorMessage('');
    try {
      const [menus, items] = await Promise.all([fetchMenus(), fetchMenuItems(menuId)]);
      const current = menus.find((m) => String(m.id) === String(menuId)) || null;
      if (!current) {
        setErrorMessage('Menu not found.');
      }
      setMenu(current);
      setTree(items);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load menu items.');
    } finally {
      setIsLoading(false);
    }
  }, [menuId]);

  useEffect(() => {
    setIsLoading(true);
    loadData();
  }, [loadData]);

  // Optimistically apply a move, then persist it
  const applyMove = async ({ tree: nextTree, payload }) => {
    setTree(nextTree);

    try {
      await reorderMenuItems(payload);
      toast.success('Menu structure updated.', successStyle);
    } catch (error) {
      toast.error(error.message || 'Failed to update menu structure.', errorStyle);
      loadData();
    }
  };

  const nestUnder = (draggedId, parentId) => {
    const error = getNestError(tree, draggedId, parentId);
    if (error) {
      toast.error(error, errorStyle);
      return;
    }

    const result = moveNode(tree, draggedId, parentId);
    if (result) applyMove(result);
  };

  const handleReorder = (draggedId, targetId, deltaX = 0) => {
    const found = findNode(tree, draggedId);
    if (!found) return;

    // Dropped on its own row: horizontal drag only
    if (draggedId === targetId) {
      if (deltaX > DRAG_THRESHOLD) {
        const previous = found.siblings[found.index - 1];
        if (!previous) {
          toast.error('There is no item above to nest under.', errorStyle);
          return;
        }
        nestUnder(draggedId, previous.id);
      } else if (deltaX < -DRAG_THRESHOLD) {
        const result = outdentItem(tree, draggedId);
        if (!result) {
          toast.error('This item is already at the top level.', errorStyle);
          return;
        }
        applyMove(result);
      }
      return;
    }

    // Dropped on another row while dragging right: nest inside that row
    if (deltaX > DRAG_THRESHOLD) {
      nestUnder(draggedId, targetId);
      return;
    }

    // Otherwise: reorder among siblings
    const { tree: nextTree, siblings } = moveSibling(tree, draggedId, targetId);

    if (!siblings) {
      toast.error('To move between levels, drag the item right (nest) or left (un-nest).', errorStyle);
      return;
    }

    applyMove({
      tree: nextTree,
      payload: siblings.map((item, index) => ({
        id: item.id,
        order: index + 1,
        parent_id: item.parent_id ?? null,
      })),
    });
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete.id;

    setDeletingId(id);
    try {
      await deleteMenuItem(id);
      toast.success('Menu item deleted successfully.', successStyle);
      setItemToDelete(null);
      await loadData(); // children may be removed too
    } catch (error) {
      toast.error(error.message || 'Failed to delete menu item.', errorStyle);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate('/menus')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Menus
      </Button>

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      {menu && (
        <MenuItemTable
          items={rows}
          onAdd={() => navigate(`/menus/${menuId}/items/add`)}
          onAddChild={(parentId) => navigate(`/menus/${menuId}/items/add?parent_id=${parentId}`)}
          onEdit={(id) => navigate(`/menus/${menuId}/items/${id}/edit`)}
          onRequestDelete={setItemToDelete}
          onReorder={handleReorder}
          deletingId={deletingId}
        />
      )}

      <AlertDialog open={itemToDelete !== null} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{itemToDelete?.title}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={deletingId === itemToDelete?.id}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}