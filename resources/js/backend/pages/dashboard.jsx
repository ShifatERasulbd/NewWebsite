import { useEffect, useState } from 'react';

import { HeaderCard } from '@/backend/components/dashboard/Header-Card';

import { useAppContext } from '@/backend/context/AppContext';

import { fetchUsers } from '@/backend/pages/User/api';

export default function Dashboard() {
    const { setPageTitle } = useAppContext();
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        setPageTitle('Dashboard');
    }, [setPageTitle]);

    useEffect(() => {
        let ignore = false;

        async function loadUsersCount() {
            try {
                const users = await fetchUsers();
                if (!ignore) {
                    setTotalUsers(Array.isArray(users) ? users.length : 0);
                }
            } catch {
                if (!ignore) {
                    setTotalUsers(0);
                }
            }
        }

        loadUsersCount();

        return () => {
            ignore = true;
        };
    }, []);

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1">
                <HeaderCard totalUsers={totalUsers} />
            </div>
        </div>
    );
}
