import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    HomeIcon,
    DocumentTextIcon,
    FolderIcon,
    TagIcon,
    UsersIcon,
    ShieldCheckIcon,
    Cog6ToothIcon,
    DocumentIcon,
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon,
    ArrowRightOnRectangleIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'ផ្ទាំងគ្រប់គ្រង', href: '/admin', icon: HomeIcon, permission: null },
    { name: 'អត្ថបទ', href: '/admin/posts', icon: DocumentTextIcon, permission: 'posts.view' },
    { name: 'ប្រភេទ', href: '/admin/categories', icon: FolderIcon, permission: 'categories.manage' },
    { name: 'Tags', href: '/admin/tags', icon: TagIcon, permission: 'tags.manage' },
    { name: 'ទំព័រ', href: '/admin/pages', icon: DocumentIcon, permission: 'pages.manage' },
    { name: 'អ្នកប្រើប្រាស់', href: '/admin/users', icon: UsersIcon, permission: 'users.manage' },
    { name: 'Roles', href: '/admin/roles', icon: ShieldCheckIcon, permission: 'roles.manage' },
    { name: 'ការកំណត់', href: '/admin/settings', icon: Cog6ToothIcon, permission: 'settings.manage' },
];

export default function AdminLayout({ children, title }) {
    const { auth, flash, settings } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const hasPermission = (permission) => {
        if (!permission) return true;
        if (auth.user?.roles?.includes('Super Admin')) return true;
        return auth.user?.permissions?.includes(permission);
    };

    const handleLogout = () => {
        router.post('/admin/logout');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between h-16 px-4 bg-blue-950">
                    <Link href="/admin" className="flex items-center">
                        {settings?.logo ? (
                            <img src={settings.logo} alt="Logo" className="h-8 w-auto" />
                        ) : (
                            <span className="text-white font-bold text-lg">Admin</span>
                        )}
                    </Link>
                    <button
                        className="lg:hidden text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <nav className="mt-4 px-2 space-y-1">
                    {navigation.map((item) =>
                        hasPermission(item.permission) ? (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                    window.location.pathname === item.href ||
                                    (item.href !== '/admin' && window.location.pathname.startsWith(item.href))
                                        ? 'bg-blue-800 text-white'
                                        : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                                }`}
                            >
                                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                {item.name}
                            </Link>
                        ) : null
                    )}
                </nav>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex flex-1 items-center">
                            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                        </div>

                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            {/* User menu */}
                            <div className="relative">
                                <button
                                    type="button"
                                    className="flex items-center gap-x-2 text-sm"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                >
                                    {auth.user?.avatar_url ? (
                                        <img
                                            src={auth.user.avatar_url}
                                            alt=""
                                            className="h-8 w-8 rounded-full bg-gray-50"
                                        />
                                    ) : (
                                        <UserCircleIcon className="h-8 w-8 text-gray-400" />
                                    )}
                                    <span className="hidden lg:flex lg:items-center">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {auth.user?.name}
                                        </span>
                                        <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-400" />
                                    </span>
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                            <p className="font-medium">{auth.user?.name}</p>
                                            <p className="text-gray-500 text-xs">{auth.user?.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                                            ចាកចេញ
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Flash messages */}
                {(flash?.success || flash?.error) && (
                    <div className="mx-4 mt-4 sm:mx-6 lg:mx-8">
                        {flash.success && (
                            <div className="rounded-md bg-green-50 p-4">
                                <p className="text-sm font-medium text-green-800">{flash.success}</p>
                            </div>
                        )}
                        {flash.error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <p className="text-sm font-medium text-red-800">{flash.error}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Page content */}
                <main className="py-6">
                    <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
