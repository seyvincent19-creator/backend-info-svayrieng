import { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Textarea from '@/Components/Textarea';
import Checkbox from '@/Components/Checkbox';
import RichTextEditor from '@/Components/RichTextEditor';
import ImageUpload from '@/Components/ImageUpload';

export default function PageForm({ page }) {
    const isEdit = !!page;
    const [processing, setProcessing] = useState(false);
    const { errors } = usePage().props;

    const { data, setData } = useForm({
        title: page?.title || '',
        title_en: page?.title_en || '',
        slug: page?.slug || '',
        content: page?.content || '',
        content_en: page?.content_en || '',
        featured_image: null,
        is_active: page?.is_active ?? true,
        meta_title: page?.meta_title || '',
        meta_description: page?.meta_description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (key === 'featured_image' && data[key]) {
                formData.append(key, data[key]);
            } else if (key === 'is_active') {
                formData.append(key, data[key] ? '1' : '0');
            } else if (data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        const options = {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        };

        if (isEdit) {
            formData.append('_method', 'PUT');
            router.post(`/admin/pages/${page.id}`, formData, options);
        } else {
            router.post('/admin/pages', formData, options);
        }
    };

    return (
        <AdminLayout title={isEdit ? 'កែប្រែទំព័រ' : 'បង្កើតទំព័រថ្មី'}>
            <Head title={isEdit ? 'កែប្រែទំព័រ' : 'បង្កើតទំព័រថ្មី'} />

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
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white shadow rounded-lg p-6 space-y-4">
                            <h3 className="text-lg font-medium">ព័ត៌មានទំព័រ (ខ្មែរ)</h3>
                            <Input label="ចំណងជើង *" value={data.title} onChange={(e) => setData('title', e.target.value)} error={errors.title} />
                            <Input label="Slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} error={errors.slug} />
                            <RichTextEditor label="ខ្លឹមសារ *" content={data.content} onChange={(html) => setData('content', html)} error={errors.content} />
                        </div>

                        <div className="bg-white shadow rounded-lg p-6 space-y-4">
                            <h3 className="text-lg font-medium">Page Information (English)</h3>
                            <Input label="Title (English)" value={data.title_en} onChange={(e) => setData('title_en', e.target.value)} error={errors.title_en} />
                            <RichTextEditor label="Content (English)" content={data.content_en} onChange={(html) => setData('content_en', html)} error={errors.content_en} />
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">រូបភាពគម្រប</h3>
                            <ImageUpload
                                value={page?.featured_image ? `/storage/${page.featured_image}` : null}
                                onChange={(file) => setData('featured_image', file)}
                                error={errors.featured_image}
                            />
                        </div>

                        <div className="bg-white shadow rounded-lg p-6 space-y-4">
                            <h3 className="text-lg font-medium">SEO</h3>
                            <Input label="Meta Title" value={data.meta_title} onChange={(e) => setData('meta_title', e.target.value)} error={errors.meta_title} />
                            <Textarea label="Meta Description" value={data.meta_description} onChange={(e) => setData('meta_description', e.target.value)} error={errors.meta_description} rows={2} />
                        </div>
                    </div>

                    <div>
                        <div className="bg-white shadow rounded-lg p-6 space-y-4">
                            <h3 className="text-lg font-medium">ផ្សាយ</h3>
                            <Checkbox label="សកម្ម" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                            <div className="flex gap-4 pt-4">
                                <Button type="submit" loading={processing} className="flex-1">{isEdit ? 'រក្សាទុក' : 'បង្កើត'}</Button>
                                <Button type="button" variant="outline" href="/admin/pages">បោះបង់</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
