import { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Textarea from '@/Components/Textarea';
import ImageUpload from '@/Components/ImageUpload';

export default function SettingsIndex({ settings }) {
    const [processing, setProcessing] = useState(false);
    const { errors } = usePage().props;

    const { data, setData } = useForm({
        site_name: settings?.site_name?.value || '',
        site_description: settings?.site_description?.value || '',
        logo: null,
        favicon: null,
        footer_text: settings?.footer_text?.value || '',
        facebook_url: settings?.facebook_url?.value || '',
        twitter_url: settings?.twitter_url?.value || '',
        youtube_url: settings?.youtube_url?.value || '',
        telegram_url: settings?.telegram_url?.value || '',
        contact_email: settings?.contact_email?.value || '',
        contact_phone: settings?.contact_phone?.value || '',
        contact_address: settings?.contact_address?.value || '',
        map_embed_url: settings?.map_embed_url?.value || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (data[key] !== null && data[key] !== undefined) {
                if (data[key] instanceof File) {
                    formData.append(key, data[key]);
                } else {
                    formData.append(key, data[key]);
                }
            }
        });

        router.post('/admin/settings', formData, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout title="ការកំណត់">
            <Head title="ការកំណត់" />

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
                <div className="space-y-6">
                    {/* General Settings */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4">ការកំណត់ទូទៅ</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Input
                                label="ឈ្មោះគេហទំព័រ"
                                value={data.site_name}
                                onChange={(e) => setData('site_name', e.target.value)}
                            />
                            <div className="md:col-span-2">
                                <Textarea
                                    label="ការពិពណ៌នាគេហទំព័រ"
                                    value={data.site_description}
                                    onChange={(e) => setData('site_description', e.target.value)}
                                    rows={2}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Logo & Favicon */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4">រូបសញ្ញា</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                                {settings?.logo?.value && (
                                    <img src={settings.logo.value} alt="Logo" className="h-16 mb-4" />
                                )}
                                <ImageUpload onChange={(file) => setData('logo', file)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                                {settings?.favicon?.value && (
                                    <img src={settings.favicon.value} alt="Favicon" className="h-8 mb-4" />
                                )}
                                <ImageUpload onChange={(file) => setData('favicon', file)} />
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4">តំណភ្ជាប់សង្គម</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Input label="Facebook URL" value={data.facebook_url} onChange={(e) => setData('facebook_url', e.target.value)} />
                            <Input label="Twitter URL" value={data.twitter_url} onChange={(e) => setData('twitter_url', e.target.value)} />
                            <Input label="YouTube URL" value={data.youtube_url} onChange={(e) => setData('youtube_url', e.target.value)} />
                            <Input label="Telegram URL" value={data.telegram_url} onChange={(e) => setData('telegram_url', e.target.value)} />
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4">ព័ត៌មានទំនាក់ទំនង</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Input label="អ៊ីមែល" value={data.contact_email} onChange={(e) => setData('contact_email', e.target.value)} />
                            <Input label="ទូរស័ព្ទ" value={data.contact_phone} onChange={(e) => setData('contact_phone', e.target.value)} />
                            <div className="md:col-span-2">
                                <Textarea label="អាសយដ្ឋាន" value={data.contact_address} onChange={(e) => setData('contact_address', e.target.value)} rows={2} />
                            </div>
                            <div className="md:col-span-2">
                                <Input label="តំណភ្ជាប់ផែនទី Google Maps (Embed URL)" value={data.map_embed_url} onChange={(e) => setData('map_embed_url', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4">បាតកថា</h3>
                        <Textarea label="អត្ថបទបាតកថា" value={data.footer_text} onChange={(e) => setData('footer_text', e.target.value)} />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" loading={processing}>រក្សាទុកការកំណត់</Button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
