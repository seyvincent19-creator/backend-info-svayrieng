import { useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import Textarea from '@/Components/Textarea';
import Checkbox from '@/Components/Checkbox';
import RichTextEditor from '@/Components/RichTextEditor';
import ImageUpload from '@/Components/ImageUpload';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function PostForm({ post, categories, tags }) {
    const isEdit = !!post;
    const [selectedTags, setSelectedTags] = useState(
        post?.tags?.map((t) => t.id) || []
    );
    const [processing, setProcessing] = useState(false);
    const { errors } = usePage().props;

    const [activeTab, setActiveTab] = useState('km');

    const { data, setData } = useForm({
        title: post?.title || '',
        title_en: post?.title_en || '',
        slug: post?.slug || '',
        excerpt: post?.excerpt || '',
        excerpt_en: post?.excerpt_en || '',
        content: post?.content || '',
        content_en: post?.content_en || '',
        cover_image: null,
        category_id: post?.category_id || '',
        type: post?.type || 'normal',
        video_url: post?.video_url || '',
        is_featured: post?.is_featured || false,
        is_breaking: post?.is_breaking || false,
        status: post?.status || 'draft',
        published_at: post?.published_at?.slice(0, 16) || '',
        tags: selectedTags,
        gallery_images: null,
        meta_title: post?.meta_title || '',
        meta_description: post?.meta_description || '',
    });

    useEffect(() => {
        setData('tags', selectedTags);
    }, [selectedTags]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (key === 'tags') {
                selectedTags.forEach((tagId) => {
                    formData.append('tags[]', tagId);
                });
            } else if (key === 'cover_image' && data[key]) {
                formData.append(key, data[key]);
            } else if (key === 'gallery_images' && data[key]) {
                Array.from(data[key]).forEach((file) => {
                    formData.append('gallery_images[]', file);
                });
            } else if (key === 'is_featured' || key === 'is_breaking') {
                formData.append(key, data[key] ? '1' : '0');
            } else if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        const options = {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onError: (errors) => {
                console.error('Validation errors:', errors);
            },
        };

        if (isEdit) {
            formData.append('_method', 'PUT');
            router.post(`/admin/posts/${post.id}`, formData, options);
        } else {
            router.post('/admin/posts', formData, options);
        }
    };

    const handleTagToggle = (tagId) => {
        setSelectedTags((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handleDeleteImage = (imageId) => {
        if (confirm('តើអ្នកប្រាកដថាចង់លុបរូបភាពនេះមែនទេ?')) {
            router.delete(`/admin/posts/image/${imageId}`);
        }
    };

    const flattenCategories = (cats, depth = 0) => {
        let result = [];
        cats.forEach((cat) => {
            result.push({ ...cat, depth });
            if (cat.children?.length) {
                result = [...result, ...flattenCategories(cat.children, depth + 1)];
            }
        });
        return result;
    };

    const flatCategories = flattenCategories(categories);

    return (
        <AdminLayout title={isEdit ? 'កែប្រែអត្ថបទ' : 'បង្កើតអត្ថបទថ្មី'}>
            <Head title={isEdit ? 'កែប្រែអត្ថបទ' : 'បង្កើតអត្ថបទថ្មី'} />

            <form onSubmit={handleSubmit}>
                {errors && Object.keys(errors).length > 0 && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="text-red-800 font-medium mb-2">មានបញ្ហាក្នុងការបញ្ជូនទម្រង់:</h4>
                        <ul className="list-disc list-inside text-red-600 text-sm">
                            {Object.values(errors).map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium">ព័ត៌មានអត្ថបទ</h3>
                                <div className="flex rounded-lg overflow-hidden border">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('km')}
                                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'km' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        🇰🇭 ខ្មែរ
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('en')}
                                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'en' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        🇺🇸 English
                                    </button>
                                </div>
                            </div>

                            {/* Khmer Content */}
                            <div className={`space-y-4 ${activeTab === 'km' ? '' : 'hidden'}`}>
                                <Input
                                    label="ចំណងជើង (ខ្មែរ) *"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    error={errors.title}
                                />

                                <Input
                                    label="Slug (ទុកទទេដើម្បីបង្កើតដោយស្វ័យប្រវត្តិ)"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    error={errors.slug}
                                />

                                <Textarea
                                    label="សង្ខេប (ខ្មែរ)"
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                    error={errors.excerpt}
                                    rows={3}
                                />

                                <RichTextEditor
                                    label="ខ្លឹមសារ (ខ្មែរ) *"
                                    content={data.content}
                                    onChange={(html) => setData('content', html)}
                                    error={errors.content}
                                />
                            </div>

                            {/* English Content */}
                            <div className={`space-y-4 ${activeTab === 'en' ? '' : 'hidden'}`}>
                                <Input
                                    label="Title (English)"
                                    value={data.title_en}
                                    onChange={(e) => setData('title_en', e.target.value)}
                                    error={errors.title_en}
                                    placeholder="Enter English title (optional)"
                                />

                                <Textarea
                                    label="Excerpt (English)"
                                    value={data.excerpt_en}
                                    onChange={(e) => setData('excerpt_en', e.target.value)}
                                    error={errors.excerpt_en}
                                    rows={3}
                                    placeholder="Enter English excerpt (optional)"
                                />

                                <RichTextEditor
                                    label="Content (English)"
                                    content={data.content_en}
                                    onChange={(html) => setData('content_en', html)}
                                    error={errors.content_en}
                                />
                            </div>
                        </div>

                        {/* Cover Image */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">រូបភាពគម្រប</h3>
                            <ImageUpload
                                value={post?.cover_image ? `/storage/${post.cover_image}` : null}
                                onChange={(file) => setData('cover_image', file)}
                                error={errors.cover_image}
                            />
                        </div>

                        {/* Gallery Images */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">រូបភាពបន្ថែម</h3>

                            {/* Existing images */}
                            {post?.images?.length > 0 && (
                                <div className="mb-4 flex flex-wrap gap-4">
                                    {post.images.map((image) => (
                                        <div key={image.id} className="relative">
                                            <img
                                                src={`/storage/${image.image_path}`}
                                                alt=""
                                                className="h-24 w-24 object-cover rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteImage(image.id)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <ImageUpload
                                multiple
                                onChange={(files) => setData('gallery_images', files)}
                                error={errors.gallery_images}
                            />
                        </div>

                        {/* SEO */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">SEO</h3>
                            <div className="space-y-4">
                                <Input
                                    label="Meta Title"
                                    value={data.meta_title}
                                    onChange={(e) => setData('meta_title', e.target.value)}
                                    error={errors.meta_title}
                                />
                                <Textarea
                                    label="Meta Description"
                                    value={data.meta_description}
                                    onChange={(e) => setData('meta_description', e.target.value)}
                                    error={errors.meta_description}
                                    rows={2}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publish */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">ផ្សាយ</h3>
                            <div className="space-y-4">
                                <Select
                                    label="ស្ថានភាព *"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    error={errors.status}
                                >
                                    <option value="draft">សេចក្តីព្រាង</option>
                                    <option value="published">បានផ្សាយ</option>
                                </Select>

                                <Input
                                    label="កាលបរិច្ឆេទផ្សាយ"
                                    type="datetime-local"
                                    value={data.published_at}
                                    onChange={(e) => setData('published_at', e.target.value)}
                                    error={errors.published_at}
                                />

                                <div className="flex gap-4">
                                    <Button type="submit" loading={processing} className="flex-1">
                                        {isEdit ? 'រក្សាទុក' : 'បង្កើត'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        href="/admin/posts"
                                    >
                                        បោះបង់
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">ប្រភេទ</h3>
                            <Select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                error={errors.category_id}
                            >
                                <option value="">ជ្រើសរើសប្រភេទ</option>
                                {flatCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {'—'.repeat(cat.depth)} {cat.name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Type */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">ប្រភេទមាតិកា</h3>
                            <Select
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                error={errors.type}
                            >
                                <option value="normal">អត្ថបទធម្មតា</option>
                                <option value="video">វីដេអូ</option>
                            </Select>

                            {data.type === 'video' && (
                                <div className="mt-4">
                                    <Input
                                        label="URL វីដេអូ *"
                                        value={data.video_url}
                                        onChange={(e) => setData('video_url', e.target.value)}
                                        error={errors.video_url}
                                        placeholder="https://youtube.com/watch?v=..."
                                    />
                                </div>
                            )}
                        </div>

                        {/* Flags */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">ទង់សម្គាល់</h3>
                            <div className="space-y-3">
                                <Checkbox
                                    label="អត្ថបទសំខាន់"
                                    checked={data.is_featured}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                />
                                <Checkbox
                                    label="ព័ត៌មានបន្ទាន់"
                                    checked={data.is_breaking}
                                    onChange={(e) => setData('is_breaking', e.target.checked)}
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => handleTagToggle(tag.id)}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            selectedTags.includes(tag.id)
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
