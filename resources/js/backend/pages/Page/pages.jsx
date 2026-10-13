import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PageTable } from '@/backend/components/page/table';
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

import { deletePage, fetchPages } from './api';

export default function Pages() {
  const navigate = useNavigate();
  const { setPageTitle, can } = useAppContext();
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [pageToDelete, setPageToDelete] = useState(null);
  const canCreate = can('create', 'pages');
  const canUpdate = can('update', 'pages');
  const canDelete = can('delete', 'pages');

  useEffect(() => {
    setPageTitle('Pages');
  }, [setPageTitle]);

  useEffect(() => {
    let ignore = false;

    async function loadPages() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await fetchPages();
        if (!ignore) {
          setPages(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message || 'Failed to load pages.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadPages();

    return () => {
      ignore = true;
    };
  }, []);

  const handleConfirmDelete = async () => {
    if (!pageToDelete) {
      return;
    }

    const id = pageToDelete.id;

    setDeletingId(id);
    setErrorMessage('');

    try {
      await deletePage(id);
      setPages((previous) => previous.filter((page) => page.id !== id));
      toast.success('Page deleted successfully.', {
        style: { color: '#16a34a' },
      });
      setPageToDelete(null);
    } catch (error) {
      const message = error.message || 'Failed to delete page.';
      setErrorMessage(message);
      toast.error(message, {
        style: { color: '#dc2626' },
      });
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
        <PageTable
          pages={pages}
          onAdd={() => navigate('/pages/add')}
          onEdit={(id) => navigate(`/pages/${id}/edit`)}
          onBuilder={(id) => navigate(`/pages/${id}/builder`)}
          onRequestDelete={setPageToDelete}
          deletingId={deletingId}
          canCreate={canCreate}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      </div>

      <AlertDialog open={pageToDelete !== null} onOpenChange={(open) => !open && setPageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{pageToDelete?.title}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={deletingId === pageToDelete?.id}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}