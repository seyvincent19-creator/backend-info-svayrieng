import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function RolesIndex({ roles, filters }) {
    const [deleteModal, setDeleteModal] = useState({ open: false, role: null });
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        setDeleting(true);
        router.delete(`/admin/roles/${deleteModal.role.id}`, {
            onSuccess: () => {
                setDeleteModal({ open: false, role: null });
                setDeleting(false);
            },
            onError: () => setDeleting(false),
        });
    };

    return (
        <AdminLayout title="Roles">
            <Head title="Roles" />

            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">គ្រប់គ្រង Roles</h2>
                <Button href="/admin/roles/create">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    បង្កើត Role ថ្មី
                </Button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ឈ្មោះ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">អ្នកប្រើប្រាស់</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">សកម្មភាព</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {roles.data.map((role) => (
                            <tr key={role.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{role.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.permissions_count}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.users_count}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <Link href={`/admin/roles/${role.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-4">
                                        <PencilIcon className="h-5 w-5 inline" />
                                    </Link>
                                    {role.name !== 'Super Admin' && (
                                        <button onClick={() => setDeleteModal({ open: true, role })} className="text-red-600 hover:text-red-900">
                                            <TrashIcon className="h-5 w-5 inline" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination links={roles.links} meta={roles} />
            </div>

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, role: null })}
                onConfirm={handleDelete}
                title="លុប Role"
                message={`តើអ្នកប្រាកដថាចង់លុប Role "${deleteModal.role?.name}" មែនទេ?`}
                loading={deleting}
            />
        </AdminLayout>
    );
}
