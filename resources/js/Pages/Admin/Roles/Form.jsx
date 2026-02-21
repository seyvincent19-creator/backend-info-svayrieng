import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Checkbox from '@/Components/Checkbox';

export default function RoleForm({ role, permissions, groupedPermissions }) {
    const isEdit = !!role;
    const [selectedPermissions, setSelectedPermissions] = useState(role?.permissions || []);

    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name || '',
        permissions: role?.permissions || [],
    });

    useEffect(() => {
        setData('permissions', selectedPermissions);
    }, [selectedPermissions]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/roles/${role.id}`);
        } else {
            post('/admin/roles');
        }
    };

    const togglePermission = (permission) => {
        setSelectedPermissions((prev) =>
            prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission]
        );
    };

    const toggleGroup = (groupPermissions) => {
        const allSelected = groupPermissions.every((p) => selectedPermissions.includes(p));
        if (allSelected) {
            setSelectedPermissions((prev) => prev.filter((p) => !groupPermissions.includes(p)));
        } else {
            setSelectedPermissions((prev) => [...new Set([...prev, ...groupPermissions])]);
        }
    };

    return (
        <AdminLayout title={isEdit ? 'កែប្រែ Role' : 'បង្កើត Role ថ្មី'}>
            <Head title={isEdit ? 'កែប្រែ Role' : 'បង្កើត Role ថ្មី'} />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">Permissions</h3>
                            <div className="space-y-6">
                                {Object.entries(groupedPermissions).map(([group, perms]) => (
                                    <div key={group} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium capitalize">{group}</h4>
                                            <button
                                                type="button"
                                                onClick={() => toggleGroup(perms)}
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                {perms.every((p) => selectedPermissions.includes(p)) ? 'ដកចេញទាំងអស់' : 'ជ្រើសរើសទាំងអស់'}
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {perms.map((permission) => (
                                                <Checkbox
                                                    key={permission}
                                                    label={permission}
                                                    checked={selectedPermissions.includes(permission)}
                                                    onChange={() => togglePermission(permission)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white shadow rounded-lg p-6 space-y-4">
                            <h3 className="text-lg font-medium">ព័ត៌មាន Role</h3>
                            <Input
                                label="ឈ្មោះ *"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                disabled={role?.name === 'Super Admin'}
                            />
                            <div className="flex gap-4 pt-4">
                                <Button type="submit" loading={processing}>{isEdit ? 'រក្សាទុក' : 'បង្កើត'}</Button>
                                <Button type="button" variant="outline" href="/admin/roles">បោះបង់</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
