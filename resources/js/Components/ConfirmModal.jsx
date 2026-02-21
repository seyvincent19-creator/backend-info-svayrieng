import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Button from './Button';

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'បញ្ជាក់ការលុប',
    message = 'តើអ្នកប្រាកដថាចង់លុបធាតុនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។',
    confirmText = 'លុប',
    cancelText = 'បោះបង់',
    loading = false,
}) {
    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </TransitionChild>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <ExclamationTriangleIcon
                                                className="h-6 w-6 text-red-600"
                                            />
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <DialogTitle
                                                as="h3"
                                                className="text-base font-semibold text-gray-900"
                                            >
                                                {title}
                                            </DialogTitle>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">{message}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                                    <Button
                                        variant="danger"
                                        onClick={onConfirm}
                                        loading={loading}
                                    >
                                        {confirmText}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={onClose}
                                        disabled={loading}
                                    >
                                        {cancelText}
                                    </Button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
