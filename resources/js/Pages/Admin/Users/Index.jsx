import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function UsersIndex({ users, roles, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');
    const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
    const [deleting, setDeleting] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/users', { search, role }, { preserveState: true });
    };

    const handleDelete = () => {
        setDeleting(true);
        router.delete(`/admin/users/${deleteModal.user.id}`, {
            onSuccess: () => {
                setDeleteModal({ open: false, user: null });
                setDeleting(false);
            },
            onError: () => setDeleting(false),
        });
    };

    return (
        <AdminLayout title="អ្នកប្រើប្រាស់">
            <Head title="អ្នកប្រើប្រាស់" />

            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">គ្រប់គ្រងអ្នកប្រើប្រាស់</h2>
                <Button href="/admin/users/create">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    បង្កើតអ្នកប្រើប្រាស់ថ្មី
                </Button>
            </div>

            <div className="bg-white shadow rounded-lg mb-6">
                <form onSubmit={handleSearch} className="p-4 flex gap-4">
                    <Input placeholder="ស្វែងរក..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
                    <Select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="">Role ទាំងអស់</option>
                        {roles.map((r) => (<option key={r.id} value={r.name}>{r.name}</option>))}
                    </Select>
                    <Button type="submit"><MagnifyingGlassIcon className="h-5 w-5" /></Button>
                </form>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">អ្នកប្រើប្រាស់</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">អ៊ីមែល</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">អត្ថបទ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ស្ថានភាព</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">សកម្មភាព</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.data.length > 0 ? (
                            users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {user.avatar ? (
                                                <img src={`/storage/${user.avatar}`} alt="" className="h-10 w-10 rounded-full" />
                                            ) : (
                                                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                                            )}
                                            <span className="ml-3 text-sm font-medium text-gray-900">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles?.map((role) => (
                                                <span key={role.id} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">{role.name}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.posts_count}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.is_active ? 'សកម្ម' : 'អសកម្ម'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <Link href={`/admin/users/${user.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-4">
                                            <PencilIcon className="h-5 w-5 inline" />
                                        </Link>
                                        <button onClick={() => setDeleteModal({ open: true, user })} className="text-red-600 hover:text-red-900">
                                            <TrashIcon className="h-5 w-5 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">មិនមានអ្នកប្រើប្រាស់</td></tr>
                        )}
                    </tbody>
                </table>
                <Pagination links={users.links} meta={users} />
            </div>

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, user: null })}
                onConfirm={handleDelete}
                title="លុបអ្នកប្រើប្រាស់"
                message={`តើអ្នកប្រាកដថាចង់លុបអ្នកប្រើប្រាស់ "${deleteModal.user?.name}" មែនទេ?`}
                loading={deleting}
            />
        </AdminLayout>
    );
}
