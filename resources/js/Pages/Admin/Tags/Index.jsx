import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function TagsIndex({ tags, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteModal, setDeleteModal] = useState({ open: false, tag: null });
    const [deleting, setDeleting] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/tags', { search }, { preserveState: true });
    };

    const handleDelete = () => {
        setDeleting(true);
        router.delete(`/admin/tags/${deleteModal.tag.id}`, {
            onSuccess: () => {
                setDeleteModal({ open: false, tag: null });
                setDeleting(false);
            },
            onError: () => setDeleting(false),
        });
    };

    return (
        <AdminLayout title="Tags">
            <Head title="Tags" />

            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">គ្រប់គ្រង Tags</h2>
                <Button href="/admin/tags/create">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    បង្កើត Tag ថ្មី
                </Button>
            </div>

            <div className="bg-white shadow rounded-lg mb-6">
                <form onSubmit={handleSearch} className="p-4 flex gap-4">
                    <Input placeholder="ស្វែងរក Tag..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
                    <Button type="submit"><MagnifyingGlassIcon className="h-5 w-5" /></Button>
                </form>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ឈ្មោះ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">អត្ថបទ</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">សកម្មភាព</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tags.data.length > 0 ? (
                            tags.data.map((tag) => (
                                <tr key={tag.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tag.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tag.slug}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tag.posts_count}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <Link href={`/admin/tags/${tag.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-4">
                                            <PencilIcon className="h-5 w-5 inline" />
                                        </Link>
                                        <button onClick={() => setDeleteModal({ open: true, tag })} className="text-red-600 hover:text-red-900">
                                            <TrashIcon className="h-5 w-5 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">មិនមាន Tag</td></tr>
                        )}
                    </tbody>
                </table>
                <Pagination links={tags.links} meta={tags} />
            </div>

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, tag: null })}
                onConfirm={handleDelete}
                title="លុប Tag"
                message={`តើអ្នកប្រាកដថាចង់លុប Tag "${deleteModal.tag?.name}" មែនទេ?`}
                loading={deleting}
            />
        </AdminLayout>
    );
}
