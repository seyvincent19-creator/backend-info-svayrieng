import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import Input from '@/Components/Input';

export default function TagForm({ tag }) {
    const isEdit = !!tag;
    const { data, setData, post, put, processing, errors } = useForm({
        name: tag?.name || '',
        slug: tag?.slug || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/tags/${tag.id}`);
        } else {
            post('/admin/tags');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'កែប្រែ Tag' : 'បង្កើត Tag ថ្មី'}>
            <Head title={isEdit ? 'កែប្រែ Tag' : 'បង្កើត Tag ថ្មី'} />

            <div className="max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="bg-white shadow rounded-lg p-6 space-y-4">
                        <Input
                            label="ឈ្មោះ *"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                        />
                        <Input
                            label="Slug"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            error={errors.slug}
                        />
                        <div className="flex gap-4 pt-4">
                            <Button type="submit" loading={processing}>{isEdit ? 'រក្សាទុក' : 'បង្កើត'}</Button>
                            <Button type="button" variant="outline" href="/admin/tags">បោះបង់</Button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
