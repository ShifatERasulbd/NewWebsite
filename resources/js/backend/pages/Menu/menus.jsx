import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { MenuTable } from '@/backend/components/menu/table';
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
import { useAppContext } from '@/backend/context/AppContext';

import { deleteMenu, fetchMenus } from './api';

export default function Menus() {
  const navigate = useNavigate();
  const { setPageTitle } = useAppContext();
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [menuToDelete, setMenuToDelete] = useState(null);

  useEffect(() => {
    setPageTitle('Menus');
  }, [setPageTitle]);

  useEffect(() => {
    let ignore = false;

    async function loadMenus() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await fetchMenus();
        if (!ignore) {
          setMenus(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message || 'Failed to load menus.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMenus();

    return () => {
      ignore = true;
    };
  }, []);

  const handleConfirmDelete = async () => {
    if (!menuToDelete) return;
    const id = menuToDelete.id;

    setDeletingId(id);
    try {
      await deleteMenu(id);
      setMenus((previous) => previous.filter((menu) => menu.id !== id));
      toast.success('Menu deleted successfully.', { style: { color: '#16a34a' } });
      setMenuToDelete(null);
    } catch (error) {
      const message = error.message || 'Failed to delete menu.';
      toast.error(message, { style: { color: '#dc2626' } });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <MenuTable
        menus={menus}
        onAdd={() => navigate('/menus/add')}
        onEdit={(id) => navigate(`/menus/${id}/edit`)}
        onRequestDelete={setMenuToDelete}
        deletingId={deletingId}
      />

      <AlertDialog open={menuToDelete !== null} onOpenChange={(open) => !open && setMenuToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{menuToDelete?.title}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={deletingId === menuToDelete?.id}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}