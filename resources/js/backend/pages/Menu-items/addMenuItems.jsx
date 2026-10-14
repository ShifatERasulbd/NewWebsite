import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import AddMenuItemForm from '@/backend/components/menu-items/addForm';
import { useAppContext } from '@/backend/context/AppContext';
import { fetchMenus } from '@/backend/pages/Menu/api';

import { createMenuItem, fetchMenuItems } from './api';
import { toParentOptions } from './utils';

export default function AddMenuItem() {
    const { menuId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setPageTitle } = useAppContext();

    const [form, setForm] = useState({
        menu_id: String(menuId),
        parent_id: searchParams.get('parent_id') || '',
        title: '',
        component_id: '',
        url: '',
        status: 'published',
    });
    const [menus, setMenus] = useState([]);
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
                const [menuData, itemData] = await Promise.all([fetchMenus(), fetchMenuItems(menuId)]);
                if (!ignore) {
                    setMenus(Array.isArray(menuData) ? menuData : []);
                    setParentItems(toParentOptions(itemData));
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));

        setErrors((previous) => {
            if (!previous[name]) return previous;
            const next = { ...previous };
            delete next[name];
            return next;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setLoadError('');

        try {
            await createMenuItem({
                ...form,
                menu_id: Number(menuId),
                parent_id: form.parent_id ? Number(form.parent_id) : null,
                title: form.title.trim(),
                component_id: form.component_id.trim() || null,
                url: form.url.trim() || null,
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