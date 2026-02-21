import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import Textarea from '@/Components/Textarea';
import Checkbox from '@/Components/Checkbox';

export default function CategoryForm({ category, parentCategories }) {
    const isEdit = !!category;

    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
        name_en: category?.name_en || '',
        slug: category?.slug || '',
        description: category?.description || '',
        parent_id: category?.parent_id || '',
        order: category?.order || 0,
        is_active: category?.is_active ?? true,
        meta_title: category?.meta_title || '',
        meta_description: category?.meta_description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/categories/${category.id}`);
        } else {
            post('/admin/categories');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'កែប្រែប្រភេទ' : 'បង្កើតប្រភេទថ្មី'}>
            <Head title={isEdit ? 'កែប្រែប្រភេទ' : 'បង្កើតប្រភេទថ្មី'} />

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <div className="bg-white shadow rounded-lg p-6 space-y-4">
                        <Input
                            label="ឈ្មោះ (ខ្មែរ) *"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                        />

                        <Input
                            label="ឈ្មោះ (អង់គ្លេស)"
                            value={data.name_en}
                            onChange={(e) => setData('name_en', e.target.value)}
                            error={errors.name_en}
                        />

                        <Input
                            label="Slug"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            error={errors.slug}
                        />

                        <Textarea
                            label="ការពិពណ៌នា"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            error={errors.description}
                        />

                        <Select
                            label="ប្រភេទមេ"
                            value={data.parent_id}
                            onChange={(e) => setData('parent_id', e.target.value)}
                            error={errors.parent_id}
                        >
                            <option value="">គ្មាន (ប្រភេទចម្បង)</option>
                            {parentCategories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </Select>

                        <Input
                            label="លំដាប់"
                            type="number"
                            value={data.order}
                            onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                            error={errors.order}
                        />

                        <Checkbox
                            label="សកម្ម"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                        />

                        <hr className="my-4" />
                        <h4 className="font-medium">SEO</h4>

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

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" loading={processing}>
                                {isEdit ? 'រក្សាទុក' : 'បង្កើត'}
                            </Button>
                            <Button type="button" variant="outline" href="/admin/categories">
                                បោះបង់
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
