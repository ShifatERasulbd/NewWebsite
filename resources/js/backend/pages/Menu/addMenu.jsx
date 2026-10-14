import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import AddMenuForm from '@/backend/components/menu/addForm';
import { useAppContext } from '@/backend/context/AppContext';

import { createMenu } from './api';

const initialForm = {
    title: '',
    url: '',
    status: 'draft',
};

export default function AddMenu() {
    const navigate = useNavigate();
    const { setPageTitle } = useAppContext();

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        setPageTitle('Add Menu');
    }, [setPageTitle]);

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
            await createMenu({
                title: form.title.trim(),
                url: form.url.trim(),
                status: form.status,
            });

            toast.success('Menu created successfully.', {
                style: { color: '#16a34a' },
            });
            navigate('/menus');
        } catch (error) {
            const fieldErrors = error.payload?.errors || {};

            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors);
            } else {
                const message = error.message || 'Failed to create menu.';
                setLoadError(message);
                toast.error(message, {
                    style: { color: '#dc2626' },
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-5">
            {loadError && <p className="text-sm text-destructive">{loadError}</p>}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                <AddMenuForm
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