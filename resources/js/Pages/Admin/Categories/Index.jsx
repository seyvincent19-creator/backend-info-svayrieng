import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function CategoriesIndex({ categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteModal, setDeleteModal] = useState({ open: false, category: null });
    const [deleting, setDeleting] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/categories', { search }, { preserveState: true });
    };

    const handleDelete = () => {
        setDeleting(true);
        router.delete(`/admin/categories/${deleteModal.category.id}`, {
            onSuccess: () => {
                setDeleteModal({ open: false, category: null });
                setDeleting(false);
            },
            onError: () => setDeleting(false),
        });
    };

    return (
        <AdminLayout title="ប្រភេទ">
            <Head title="ប្រភេទ" />

            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">គ្រប់គ្រងប្រភេទ</h2>
                </div>
                <Button href="/admin/categories/create">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    បង្កើតប្រភេទថ្មី
                </Button>
            </div>

            <div className="bg-white shadow rounded-lg mb-6">
                <form onSubmit={handleSearch} className="p-4">
                    <div className="flex gap-4">
                        <Input
                            placeholder="ស្វែងរកប្រភេទ..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit">
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </form>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ឈ្មោះ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ប្រភេទមេ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">អត្ថបទ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ស្ថានភាព</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">សកម្មភាព</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {categories.data.length > 0 ? (
                            categories.data.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                                        {category.name_en && (
                                            <span className="text-xs text-gray-500 ml-2">({category.name_en})</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {category.parent?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.posts_count}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {category.is_active ? 'សកម្ម' : 'អសកម្ម'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <Link href={`/admin/categories/${category.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-4">
                                            <PencilIcon className="h-5 w-5 inline" />
                                        </Link>
                                        <button onClick={() => setDeleteModal({ open: true, category })} className="text-red-600 hover:text-red-900">
                                            <TrashIcon className="h-5 w-5 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">មិនមានប្រភេទ</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Pagination links={categories.links} meta={categories} />
            </div>

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, category: null })}
                onConfirm={handleDelete}
                title="លុបប្រភេទ"
                message={`តើអ្នកប្រាកដថាចង់លុបប្រភេទ "${deleteModal.category?.name}" មែនទេ?`}
                loading={deleting}
            />
        </AdminLayout>
    );
}
