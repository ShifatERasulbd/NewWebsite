import React, { Suspense, lazy } from 'react'
import { ForgotPasswordForm } from '@/backend/components/forgotPassword';
import { LoginForm } from '@/backend/components/login-form';
import { RegisterForm } from '@/backend/components/register-form';
import { ResetPasswordForm } from '@/backend/components/resetPassword';
import { Toaster } from '@/backend/components/ui/sonner';
import { AppProvider } from '@/backend/context/AppContext';
import AppLayout from '@/backend/layouts/AppLayout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function lazyWithRetry(importer, key) {
    return lazy(async () => {
        const storageKey = `lazy-retry:${key}`;

        try {
            const module = await importer();
            sessionStorage.removeItem(storageKey);
            return module;
        } catch (error) {
            const hasRetried = sessionStorage.getItem(storageKey) === '1';

            if (!hasRetried && error instanceof TypeError) {
                sessionStorage.setItem(storageKey, '1');
                window.location.reload();
                return new Promise(() => {});
            }

            sessionStorage.removeItem(storageKey);
            throw error;
        }
    });
}

const Dashboard = lazyWithRetry(() => import('@/backend/pages/dashboard'), 'dashboard');

// user route
const Users = lazyWithRetry(() => import('@/backend/pages/User/user'), 'users');
const AddUser = lazyWithRetry(() => import('@/backend/pages/User/addUser'), 'users-add');
const EditUser = lazyWithRetry(() => import('@/backend/pages/User/editUser'), 'users-edit');

function AuthScreen({ children }) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 text-foreground">
            <div className="w-full max-w-md space-y-5">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-900">
                    <span className="inline-flex size-6 items-center justify-center rounded-full border border-slate-900 text-[11px]">A</span>
                    <span>Acme Inc.</span>
                </div>
                {children}
            </div>
        </main>
    );
}

export default function App() {
    return (
        <AppProvider>
            <BrowserRouter basename="/admin">
                <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <AuthScreen>
                                    <LoginForm />
                                </AuthScreen>
                            }
                        />

                        <Route
                            path="/register"
                            element={
                                <AuthScreen>
                                    <RegisterForm />
                                </AuthScreen>
                            }
                        />

                        <Route
                            path="/forgot-password"
                            element={
                                <AuthScreen>
                                    <ForgotPasswordForm />
                                </AuthScreen>
                            }
                        />

                        <Route
                            path="/reset-password/:token"
                            element={
                                <AuthScreen>
                                    <ResetPasswordForm />
                                </AuthScreen>
                            }
                        />

                        <Route element={<AppLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />

                            {/* users */}
                            <Route path="/users" element={<Users />} />
                            <Route path="/users/add" element={<AddUser />} />
                            <Route path="/users/:id/edit" element={<EditUser />} />
                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
            <Toaster position="top-right" richColors />
        </AppProvider>
    );
}