import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function PagesIndex({ pages, filters }) {
    const [deleteModal, setDeleteModal] = useState({ open: false, page: null });
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        setDeleting(true);
        router.delete(`/admin/pages/${deleteModal.page.id}`, {
            onSuccess: () => {
                setDeleteModal({ open: false, page: null });
                setDeleting(false);
            },
            onError: () => setDeleting(false),
        });
    };

    return (
        <AdminLayout title="ទំព័រ">
            <Head title="ទំព័រ" />

            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">គ្រប់គ្រងទំព័រ</h2>
                <Button href="/admin/pages/create">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    បង្កើតទំព័រថ្មី
                </Button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ចំណងជើង</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ស្ថានភាព</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">សកម្មភាព</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {pages.data.length > 0 ? (
                            pages.data.map((page) => (
                                <tr key={page.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{page.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.slug}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${page.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {page.is_active ? 'សកម្ម' : 'អសកម្ម'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <Link href={`/admin/pages/${page.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-4">
                                            <PencilIcon className="h-5 w-5 inline" />
                                        </Link>
                                        <button onClick={() => setDeleteModal({ open: true, page })} className="text-red-600 hover:text-red-900">
                                            <TrashIcon className="h-5 w-5 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">មិនមានទំព័រ</td></tr>
                        )}
                    </tbody>
                </table>
                <Pagination links={pages.links} meta={pages} />
            </div>

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, page: null })}
                onConfirm={handleDelete}
                title="លុបទំព័រ"
                message={`តើអ្នកប្រាកដថាចង់លុបទំព័រ "${deleteModal.page?.title}" មែនទេ?`}
                loading={deleting}
            />
        </AdminLayout>
    );
}
