import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function ImageUpload({
    label,
    value,
    onChange,
    onRemove,
    error,
    multiple = false,
    accept = {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxSize = 5242880, // 5MB
}) {
    const [previews, setPreviews] = useState([]);

    const onDrop = useCallback(
        (acceptedFiles) => {
            const newPreviews = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );

            if (multiple) {
                setPreviews((prev) => [...prev, ...newPreviews]);
                onChange([...(value || []), ...acceptedFiles]);
            } else {
                setPreviews(newPreviews);
                onChange(acceptedFiles[0]);
            }
        },
        [multiple, onChange, value]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
        multiple,
    });

    const removePreview = (index) => {
        if (multiple) {
            const newPreviews = [...previews];
            newPreviews.splice(index, 1);
            setPreviews(newPreviews);
            const newValue = [...(value || [])];
            newValue.splice(index, 1);
            onChange(newValue);
        } else {
            setPreviews([]);
            onChange(null);
        }
    };

    const existingImage = typeof value === 'string' ? value : null;

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            {/* Existing image preview */}
            {existingImage && (
                <div className="mb-4 relative inline-block">
                    <img
                        src={existingImage}
                        alt="Current"
                        className="h-32 w-auto object-cover rounded-md"
                    />
                    {onRemove && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    )}
                </div>
            )}

            {/* New previews */}
            {previews.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-4">
                    {previews.map((file, index) => (
                        <div key={index} className="relative">
                            <img
                                src={file.preview}
                                alt={file.name}
                                className="h-32 w-auto object-cover rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => removePreview(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={clsx(
                    'flex justify-center rounded-lg border border-dashed px-6 py-10 cursor-pointer transition-colors',
                    isDragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400',
                    error && 'border-red-500'
                )}
            >
                <div className="text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <div className="mt-4 flex text-sm text-gray-600">
                        <input {...getInputProps()} />
                        <p className="pl-1">
                            ទម្លាក់ឯកសារនៅទីនេះ ឬ{' '}
                            <span className="font-semibold text-blue-600">ចុចដើម្បីជ្រើសរើស</span>
                        </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG, GIF, WEBP មិនលើសពី 5MB
                    </p>
                </div>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
