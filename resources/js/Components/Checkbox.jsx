import clsx from 'clsx';

export default function Checkbox({ label, error, className, ...props }) {
    return (
        <div className="flex items-start">
            <div className="flex h-5 items-center">
                <input
                    type="checkbox"
                    className={clsx(
                        'h-4 w-4 rounded border-gray-300 text-blue-600',
                        'focus:ring-blue-500',
                        'disabled:bg-gray-100 disabled:cursor-not-allowed',
                        className
                    )}
                    {...props}
                />
            </div>
            {label && (
                <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">{label}</label>
                </div>
            )}
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
