import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import AddMenuItemForm from '@/backend/components/menu-items/addForm';
import { useAppContext } from '@/backend/context/AppContext';
import { fetchMenus } from '@/backend/pages/Menu/api';
import { fetchPages } from '@/backend/pages/Page/api';

import { createMenuItem, fetchMenuItems } from './api';
import { toParentOptions } from './utils';

// Build the menu item URL from a page slug
const buildUrl = (slug) => (slug ? `/${String(slug).replace(/^\/+/, '')}` : '');

export default function AddMenuItem() {
    const { menuId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setPageTitle } = useAppContext();

    const [form, setForm] = useState({
        menu_id: String(menuId),
        parent_id: searchParams.get('parent_id') || '',
        page_id: '',
        title: '',
        url: '',
        status: 'published',
    });
    const [menus, setMenus] = useState([]);
    const [pages, setPages] = useState([]);
    const [parentItems, setParentItems] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadError, setLoadError] = useState('');

    const backPath = `/menus/${menuId}`;

    useEffect(() => {
        setPageTitle('Add Menu Item');
    }, [setPageTitle]);

    useEffect(() => {
        let ignore = false;

        async function loadOptions() {
            try {
                const [menuData, itemData, pageData] = await Promise.all([
                    fetchMenus(),
                    fetchMenuItems(menuId),
                    fetchPages(),
                ]);

                if (!ignore) {
                    setMenus(Array.isArray(menuData) ? menuData : []);
                    setParentItems(toParentOptions(itemData));
                    setPages(Array.isArray(pageData) ? pageData : pageData?.data || []);
                }
            } catch {
                if (!ignore) {
                    setLoadError('Failed to load form dependencies.');
                }
            }
        }

        loadOptions();

        return () => {
            ignore = true;
        };
    }, [menuId]);

    const clearError = (name) =>
        setErrors((previous) => {
            if (!previous[name]) return previous;
            const next = { ...previous };
            delete next[name];
            return next;
        });

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Selecting a page fills the URL from its slug (and the title if empty)
        if (name === 'page_id') {
            const page = pages.find((p) => String(p.id) === String(value));

            setForm((previous) => ({
                ...previous,
                page_id: value,
                url: page ? buildUrl(page.slug) : '',
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
            await createMenuItem({
                menu_id: Number(menuId),
                parent_id: form.parent_id ? Number(form.parent_id) : null,
                page_id: form.page_id ? Number(form.page_id) : null,
                title: form.title.trim(),
                url: form.url.trim() || null,
                status: form.status,
            });

            toast.success('Menu item created successfully.', { style: { color: '#16a34a' } });
            navigate(backPath);
        } catch (error) {
            const fieldErrors = error.payload?.errors || {};
            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors);
            } else {
                const message = error.message || 'Failed to create menu item.';
                setLoadError(message);
                toast.error(message, { style: { color: '#dc2626' } });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-5">
            {loadError && <p className="text-sm text-destructive">{loadError}</p>}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                <AddMenuItemForm
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