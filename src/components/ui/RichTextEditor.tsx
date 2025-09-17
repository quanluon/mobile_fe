import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { uploadApi } from '../../lib/api/upload';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  readOnly?: boolean;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Enter content...',
  height = 200,
  readOnly = false,
  className = '',
}) => {
  const quillRef = useRef<ReactQuill>(null);

  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          // Show loading state
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection();
            quill.insertEmbed(range?.index || 0, 'image', 'Loading...');
            quill.setSelection((range?.index || 0) + 1);
          }

          // Upload file to S3
          const uploadResult = await uploadApi.uploadAndMoveToPermanent(file, 'rich-text-editors');
          
          // Replace loading text with actual image
          if (quill) {
            const range = quill.getSelection();
            quill.deleteText((range?.index || 1) - 1, 1);
            quill.insertEmbed((range?.index || 1) - 1, 'image', uploadResult.publicUrl);
          }
        } catch (error) {
          console.error('Image upload failed:', error);
          // Remove loading text on error
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection();
            quill.deleteText((range?.index || 1) - 1, 1);
          }
        }
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'link', 'image'
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        modules={modules}
        formats={formats}
        style={{ height: height + 42 }} // Add toolbar height
      />
      <style>{`
        .rich-text-editor .ql-editor {
          min-height: ${height}px;
          font-size: 14px;
          line-height: 1.5;
        }
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid #d9d9d9;
          border-left: 1px solid #d9d9d9;
          border-right: 1px solid #d9d9d9;
          border-radius: 6px 6px 0 0;
        }
        .rich-text-editor .ql-container {
          border-bottom: 1px solid #d9d9d9;
          border-left: 1px solid #d9d9d9;
          border-right: 1px solid #d9d9d9;
          border-radius: 0 0 6px 6px;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #bfbfbf;
          font-style: normal;
        }
        .rich-text-editor .ql-toolbar .ql-formats {
          margin-right: 15px;
        }
        .rich-text-editor .ql-toolbar button {
          width: 28px;
          height: 28px;
        }
        .rich-text-editor .ql-toolbar button:hover {
          color: #1890ff;
        }
        .rich-text-editor .ql-toolbar button.ql-active {
          color: #1890ff;
          background-color: #e6f7ff;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
