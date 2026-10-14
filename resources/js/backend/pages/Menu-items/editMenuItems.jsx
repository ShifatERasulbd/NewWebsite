import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import EditMenuItemForm from '@/backend/components/menu-items/editForm';
import { useAppContext } from '@/backend/context/AppContext';
import { fetchMenus } from '@/backend/pages/Menu/api';
import { fetchPages } from '@/backend/pages/Page/api';

import { fetchMenuItem, fetchMenuItems, updateMenuItem } from './api';
import { removeItem, toParentOptions } from './utils';

// Build the menu item URL from a page slug
const buildUrl = (slug) => (slug ? `/${String(slug).replace(/^\/+/, '')}` : '');

const initialForm = {
    menu_id: '',
    parent_id: '',
    page_id: '',
    title: '',
    url: '',
    status: 'published',
};

export default function EditMenuItem() {
    const { menuId, id } = useParams();
    const navigate = useNavigate();
    const { setPageTitle } = useAppContext();

    const [form, setForm] = useState(initialForm);
    const [menus, setMenus] = useState([]);
    const [pages, setPages] = useState([]);
    const [parentItems, setParentItems] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const backPath = `/menus/${menuId}`;

    useEffect(() => {
        setPageTitle('Edit Menu Item');
    }, [setPageTitle]);

    useEffect(() => {
        let ignore = false;

        async function loadData() {
            setIsLoading(true);
            setLoadError('');

            try {
                const [item, menuData, itemData, pageData] = await Promise.all([
                    fetchMenuItem(id),
                    fetchMenus(),
                    fetchMenuItems(menuId),
                    fetchPages(),
                ]);

                if (!ignore) {
                    setForm({
                        menu_id: String(item?.menu_id || menuId),
                        parent_id: item?.parent_id ? String(item.parent_id) : '',
                        page_id: item?.page_id ? String(item.page_id) : '',
                        title: item?.title || '',
                        // Use the live page slug when a page is attached
                        url: item?.page?.slug ? buildUrl(item.page.slug) : item?.url || '',
                        status: item?.status || 'published',
                    });
                    setMenus(Array.isArray(menuData) ? menuData : []);
                    setPages(Array.isArray(pageData) ? pageData : pageData?.data || []);
                    // Exclude this item AND its descendants to prevent circular parents
                    setParentItems(toParentOptions(removeItem(itemData, Number(id))));
                }
            } catch (error) {
                if (!ignore) {
                    setLoadError(error.message || 'Failed to load menu item.');
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        loadData();

        return () => {
            ignore = true;
        };
    }, [id, menuId]);

    const clearError = (name) =>
        setErrors((previous) => {
            if (!previous[name]) return previous;
            const next = { ...previous };
            delete next[name];
            return next;
        });

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Selecting a page fills the URL from its slug
        if (name === 'page_id') {
            const page = pages.find((p) => String(p.id) === String(value));

            setForm((previous) => ({
                ...previous,
                page_id: value,
                url: page ? buildUrl(page.slug) : previous.url,
                title: previous.title || page?.title || '',
            }));
            clearError('page_id');
            clearError('url');
            clearError('title');
            return;
        }

        setForm((previous) => ({ ...previous, [name]: value }));
        clearError(name);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setLoadError('');

        try {
            await updateMenuItem(id, {
                menu_id: Number(menuId),
                parent_id: form.parent_id ? Number(form.parent_id) : null,
                page_id: form.page_id ? Number(form.page_id) : null,
                title: form.title.trim(),
                url: form.url.trim() || null,
                status: form.status,
            });

            toast.success('Menu item updated successfully.', { style: { color: '#16a34a' } });
            navigate(backPath);
        } catch (error) {
            const fieldErrors = error.payload?.errors || {};
            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors);
            } else {
                const message = error.message || 'Failed to update menu item.';
                setLoadError(message);
                toast.error(message, { style: { color: '#dc2626' } });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-10">Loading...</div>;
    }

    return (
        <div className="space-y-5">
            {loadError && <p className="text-sm text-destructive">{loadError}</p>}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                <EditMenuItemForm
                    form={form}
                    menus={menus}
                    pages={pages}
                    parentItems={parentItems}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate(backPath)}
                    isSubmitting={isSubmitting}
                    errors={errors}
                />
            </div>
        </div>
    );
}