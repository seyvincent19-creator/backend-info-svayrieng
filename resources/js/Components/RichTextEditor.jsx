import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
} from 'lucide-react';
import clsx from 'clsx';

const MenuButton = ({ onClick, active, disabled, children, title }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={clsx(
            'p-1.5 rounded hover:bg-gray-200 disabled:opacity-50',
            active && 'bg-gray-200 text-blue-600'
        )}
    >
        {children}
    </button>
);

export default function RichTextEditor({ content, onChange, label, error }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
            Image,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    const addLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div
                className={clsx(
                    'border rounded-md overflow-hidden',
                    error ? 'border-red-500' : 'border-gray-300'
                )}
            >
                <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        active={editor.isActive('bold')}
                        title="Bold"
                    >
                        <Bold className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        active={editor.isActive('italic')}
                        title="Italic"
                    >
                        <Italic className="w-4 h-4" />
                    </MenuButton>
                    <div className="w-px bg-gray-300 mx-1" />
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        active={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <List className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        active={editor.isActive('orderedList')}
                        title="Numbered List"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        active={editor.isActive('blockquote')}
                        title="Quote"
                    >
                        <Quote className="w-4 h-4" />
                    </MenuButton>
                    <div className="w-px bg-gray-300 mx-1" />
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        active={editor.isActive({ textAlign: 'left' })}
                        title="Align Left"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        active={editor.isActive({ textAlign: 'center' })}
                        title="Align Center"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        active={editor.isActive({ textAlign: 'right' })}
                        title="Align Right"
                    >
                        <AlignRight className="w-4 h-4" />
                    </MenuButton>
                    <div className="w-px bg-gray-300 mx-1" />
                    <MenuButton onClick={addLink} active={editor.isActive('link')} title="Add Link">
                        <LinkIcon className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton onClick={addImage} title="Add Image">
                        <ImageIcon className="w-4 h-4" />
                    </MenuButton>
                    <div className="w-px bg-gray-300 mx-1" />
                    <MenuButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo"
                    >
                        <Undo className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo"
                    >
                        <Redo className="w-4 h-4" />
                    </MenuButton>
                </div>
                <EditorContent
                    editor={editor}
                    className="prose max-w-none focus:outline-none"
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
