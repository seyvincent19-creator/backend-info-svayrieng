import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Pagination({ links, meta }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                {links[0].url ? (
                    <Link
                        href={links[0].url}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        មុន
                    </Link>
                ) : (
                    <span className="relative inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400">
                        មុន
                    </span>
                )}
                {links[links.length - 1].url ? (
                    <Link
                        href={links[links.length - 1].url}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        បន្ទាប់
                    </Link>
                ) : (
                    <span className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400">
                        បន្ទាប់
                    </span>
                )}
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        បង្ហាញ <span className="font-medium">{meta?.from || 0}</span> ដល់{' '}
                        <span className="font-medium">{meta?.to || 0}</span> ក្នុងចំណោម{' '}
                        <span className="font-medium">{meta?.total || 0}</span> លទ្ធផល
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                        {links.map((link, index) => {
                            if (index === 0) {
                                return link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </Link>
                                ) : (
                                    <span
                                        key={index}
                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300"
                                    >
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </span>
                                );
                            }

                            if (index === links.length - 1) {
                                return link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </Link>
                                ) : (
                                    <span
                                        key={index}
                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300"
                                    >
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </span>
                                );
                            }

                            return link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 ${
                                        link.active
                                            ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                            : 'text-gray-900 hover:bg-gray-50'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={index}
                                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
}
