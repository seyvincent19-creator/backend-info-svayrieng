import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import Checkbox from '@/Components/Checkbox';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <>
            <Head title="ចូលគណនី" />
            <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                            មន្ទីរព័ត៌មានខេត្តស្វាយរៀង
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            ចូលទៅក្នុងផ្ទាំងគ្រប់គ្រង
                        </p>
                    </div>

                    <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <Input
                                label="អ៊ីមែល"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email}
                                autoComplete="email"
                                autoFocus
                            />

                            <Input
                                label="ពាក្យសម្ងាត់"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                error={errors.password}
                                autoComplete="current-password"
                            />

                            <div className="flex items-center justify-between">
                                <Checkbox
                                    label="ចងចាំខ្ញុំ"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                loading={processing}
                            >
                                ចូល
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
