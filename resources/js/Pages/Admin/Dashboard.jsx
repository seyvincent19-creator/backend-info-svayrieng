import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    DocumentTextIcon,
    EyeIcon,
    FolderIcon,
    UsersIcon,
    ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
            <div className="flex items-center">
                <div className={`flex-shrink-0 ${color} rounded-md p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd className="text-2xl font-semibold text-gray-900">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
);

export default function Dashboard({ stats, latestPosts, popularPosts }) {
    return (
        <AdminLayout title="ផ្ទាំងគ្រប់គ្រង">
            <Head title="ផ្ទាំងគ្រប់គ្រង" />

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="អត្ថបទសរុប"
                    value={stats.total_posts}
                    icon={DocumentTextIcon}
                    color="bg-blue-500"
                />
                <StatCard
                    title="បានផ្សាយ"
                    value={stats.published_posts}
                    icon={ArrowTrendingUpIcon}
                    color="bg-green-500"
                />
                <StatCard
                    title="សេចក្តីព្រាង"
                    value={stats.draft_posts}
                    icon={DocumentTextIcon}
                    color="bg-yellow-500"
                />
                <StatCard
                    title="ចំនួនមើលសរុប"
                    value={stats.total_views}
                    icon={EyeIcon}
                    color="bg-purple-500"
                />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Latest Posts */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">អត្ថបទថ្មីៗ</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {latestPosts.length > 0 ? (
                            latestPosts.map((post) => (
                                <div key={post.id} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate"
                                        >
                                            {post.title}
                                        </Link>
                                        <span
                                            className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                                post.status === 'published'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {post.status === 'published' ? 'បានផ្សាយ' : 'សេចក្តីព្រាង'}
                                        </span>
                                    </div>
                                    <div className="mt-1 flex items-center text-sm text-gray-500">
                                        <span>{post.category}</span>
                                        <span className="mx-2">•</span>
                                        <span>{post.author}</span>
                                        <span className="mx-2">•</span>
                                        <span>{post.created_at}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-gray-500">
                                មិនមានអត្ថបទ
                            </div>
                        )}
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-t">
                        <Link
                            href="/admin/posts"
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            មើលទាំងអស់ →
                        </Link>
                    </div>
                </div>

                {/* Popular Posts */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">អត្ថបទពេញនិយម</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {popularPosts.length > 0 ? (
                            popularPosts.map((post, index) => (
                                <div key={post.id} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center">
                                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                                            {index + 1}
                                        </span>
                                        <div className="ml-3 flex-1 min-w-0">
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
                                            >
                                                {post.title}
                                            </Link>
                                            <p className="text-sm text-gray-500">
                                                {post.views.toLocaleString()} មើល
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-gray-500">
                                មិនមានអត្ថបទ
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">សកម្មភាពរហ័ស</h3>
                <div className="flex flex-wrap gap-4">
                    <Link
                        href="/admin/posts/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        បង្កើតអត្ថបទថ្មី
                    </Link>
                    <Link
                        href="/admin/categories"
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                        <FolderIcon className="h-5 w-5 mr-2" />
                        គ្រប់គ្រងប្រភេទ
                    </Link>
                    <Link
                        href="/admin/users"
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                        <UsersIcon className="h-5 w-5 mr-2" />
                        គ្រប់គ្រងអ្នកប្រើប្រាស់
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
