import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';

export default function PostsIndex({ posts, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [type, setType] = useState(filters.type || '');
    const [deleteModal, setDeleteModal] = useState({ open: false, post: null });
    const [deleting, setDeleting] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/posts', {
            search,
            status,
            category_id: categoryId,
            type,
        }, { preserveState: true });
    };

    const handleDelete = () => {
        setDeleting(true);
        router.delete(`/admin/posts/${deleteModal.post.id}`, {
            onSuccess: () => {
                setDeleteModal({ open: false, post: null });
                setDeleting(false);
            },
            onError: () => setDeleting(false),
        });
    };

    return (
        <AdminLayout title="អត្ថបទ">
            <Head title="អត្ថបទ" />

            {/* Header */}
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">គ្រប់គ្រងអត្ថបទ</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        សរុប {posts.total} អត្ថបទ
                    </p>
                </div>
                <Button href="/admin/posts/create">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    បង្កើតអត្ថបទថ្មី
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg mb-6">
                <form onSubmit={handleSearch} className="p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <Input
                            placeholder="ស្វែងរកអត្ថបទ..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">ស្ថានភាពទាំងអស់</option>
                            <option value="published">បានផ្សាយ</option>
                            <option value="draft">សេចក្តីព្រាង</option>
                        </Select>
                        <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                            <option value="">ប្រភេទទាំងអស់</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </Select>
                        <Select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="">ប្រភេទមាតិកាទាំងអស់</option>
                            <option value="normal">អត្ថបទធម្មតា</option>
                            <option value="video">វីដេអូ</option>
                        </Select>
                        <Button type="submit">
                            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                            ស្វែងរក
                        </Button>
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    អត្ថបទ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ប្រភេទ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    អ្នកនិពន្ធ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ស្ថានភាព
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    មើល
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    សកម្មភាព
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {posts.data.length > 0 ? (
                                posts.data.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {post.cover_image && (
                                                    <img
                                                        src={`/storage/${post.cover_image}`}
                                                        alt=""
                                                        className="h-10 w-10 rounded object-cover mr-3"
                                                    />
                                                )}
                                                <div className="max-w-xs">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {post.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {post.type === 'video' && (
                                                            <span className="text-purple-600 mr-2">វីដេអូ</span>
                                                        )}
                                                        {post.is_featured && (
                                                            <span className="text-yellow-600 mr-2">សំខាន់</span>
                                                        )}
                                                        {post.is_breaking && (
                                                            <span className="text-red-600">បន្ទាន់</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {post.category?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {post.author?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    post.status === 'published'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {post.status === 'published' ? 'បានផ្សាយ' : 'សេចក្តីព្រាង'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <EyeIcon className="h-4 w-4 mr-1" />
                                                {post.views.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                <PencilIcon className="h-5 w-5 inline" />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteModal({ open: true, post })}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <TrashIcon className="h-5 w-5 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        មិនមានអត្ថបទ
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={posts.links} meta={posts} />
            </div>

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, post: null })}
                onConfirm={handleDelete}
                title="លុបអត្ថបទ"
                message={`តើអ្នកប្រាកដថាចង់លុបអត្ថបទ "${deleteModal.post?.title}" មែនទេ?`}
                loading={deleting}
            />
        </AdminLayout>
    );
}
