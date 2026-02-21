import { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Textarea from '@/Components/Textarea';
import Checkbox from '@/Components/Checkbox';
import Select from '@/Components/Select';
import ImageUpload from '@/Components/ImageUpload';

export default function UserForm({ user, roles, permissions }) {
    const isEdit = !!user;
    const [selectedRole, setSelectedRole] = useState(user?.roles?.[0] || '');
    const [processing, setProcessing] = useState(false);
    const { errors } = usePage().props;

    const { data, setData } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        is_active: user?.is_active ?? true,
        avatar: null,
        role: user?.roles?.[0] || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (key === 'role') {
                if (selectedRole) {
                    formData.append('roles[]', selectedRole);
                }
            } else if (key === 'avatar' && data[key]) {
                formData.append(key, data[key]);
            } else if (key === 'password' && !data[key]) {
                // Skip empty password on edit
            } else if (key === 'is_active') {
                formData.append(key, data[key] ? '1' : '0');
            } else if (data[key] !== null && data[key] !== '') {
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
            router.post(`/admin/users/${user.id}`, formData, options);
        } else {
            router.post('/admin/users', formData, options);
        }
    };

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
        setData('role', e.target.value);
    };

    return (
        <AdminLayout title={isEdit ? 'កែប្រែអ្នកប្រើប្រាស់' : 'បង្កើតអ្នកប្រើប្រាស់ថ្មី'}>
            <Head title={isEdit ? 'កែប្រែអ្នកប្រើប្រាស់' : 'បង្កើតអ្នកប្រើប្រាស់ថ្មី'} />

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
                            <h3 className="text-lg font-medium">ព័ត៌មានអ្នកប្រើប្រាស់</h3>
                            <Input label="ឈ្មោះ *" value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} />
                            <Input label="អ៊ីមែល *" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} error={errors.email} />
                            <Input label={isEdit ? 'ពាក្យសម្ងាត់ថ្មី' : 'ពាក្យសម្ងាត់ *'} type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} error={errors.password} />
                            <Input label="បញ្ជាក់ពាក្យសម្ងាត់" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                            <Input label="ទូរស័ព្ទ" value={data.phone} onChange={(e) => setData('phone', e.target.value)} error={errors.phone} />
                            <Textarea label="ប្រវត្តិរូប" value={data.bio} onChange={(e) => setData('bio', e.target.value)} error={errors.bio} />
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">រូបភាព</h3>
                            <ImageUpload
                                value={user?.avatar_url}
                                onChange={(file) => setData('avatar', file)}
                                error={errors.avatar}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">ស្ថានភាព</h3>
                            <Checkbox label="សកម្ម" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                            <div className="flex gap-4 mt-6">
                                <Button type="submit" loading={processing} className="flex-1">{isEdit ? 'រក្សាទុក' : 'បង្កើត'}</Button>
                                <Button type="button" variant="outline" href="/admin/users">បោះបង់</Button>
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">Role</h3>
                            <Select
                                label="ជ្រើសរើស Role *"
                                value={selectedRole}
                                onChange={handleRoleChange}
                                error={errors?.roles}
                            >
                                <option value="">ជ្រើសរើស Role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
