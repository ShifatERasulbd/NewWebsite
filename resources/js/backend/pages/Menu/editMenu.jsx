import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import EditMenuForm from '@/backend/components/menu/editForm';
import { useAppContext } from '@/backend/context/AppContext';

import { fetchMenu, updateMenu } from './api';

const initialForm = {
    title: '',
    url: '',
    status: 'draft',
};

export default function EditMenu() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setPageTitle } = useAppContext();

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        setPageTitle('Edit Menu');
    }, [setPageTitle]);

    useEffect(() => {
        let ignore = false;

        async function loadData() {
            setIsLoading(true);
            setLoadError('');

            try {
                const menu = await fetchMenu(id);

                if (!ignore) {
                    setForm({
                        title: menu?.title || '',
                        url: menu?.url || '',
                        status: menu?.status || 'draft',
                    });
                }
            } catch (error) {
                if (!ignore) {
                    setLoadError(error.message || 'Failed to load menu.');
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
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({ ...previous, [name]: value }));

        setErrors((previous) => {
            if (!previous[name]) {
                return previous;
            }
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
            await updateMenu(id, {
                title: form.title.trim(),
                url: form.url.trim(),
                status: form.status,
            });

            toast.success('Menu updated successfully.', {
                style: { color: '#16a34a' },
            });
            navigate('/menus');
        } catch (error) {
            const fieldErrors = error.payload?.errors || {};

            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors);
            } else {
                const message = error.message || 'Failed to update menu.';
                setLoadError(message);
                toast.error(message, {
                    style: { color: '#dc2626' },
                });
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
                <EditMenuForm
                    form={form}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/menus')}
                    isSubmitting={isSubmitting}
                    errors={errors}
                />
            </div>
        </div>
    );
}