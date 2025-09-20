"use client";
import { useEffect, useRef, useId } from "react";

// HugeRTE and required modules (bundled approach)
import hugerte from 'hugerte';
import 'hugerte/models/dom';
import 'hugerte/icons/default';
import 'hugerte/themes/silver';
import 'hugerte/skins/ui/oxide/skin.js';
import 'hugerte/skins/ui/oxide/content.js';
import 'hugerte/skins/content/default/content.js';

// Import only the plugins you need
import 'hugerte/plugins/advlist';
import 'hugerte/plugins/autolink';
import 'hugerte/plugins/lists';
import 'hugerte/plugins/link';
import 'hugerte/plugins/image';
import 'hugerte/plugins/charmap';
import 'hugerte/plugins/preview';
import 'hugerte/plugins/anchor';
import 'hugerte/plugins/searchreplace';
import 'hugerte/plugins/visualblocks';
import 'hugerte/plugins/code';
import 'hugerte/plugins/fullscreen';
import 'hugerte/plugins/insertdatetime';
import 'hugerte/plugins/media';
import 'hugerte/plugins/table';
import 'hugerte/plugins/help';
import 'hugerte/plugins/wordcount';

// For help plugin localization
import 'hugerte/plugins/help/js/i18n/keynav/en.js';

interface RichTextEditorProps {
  value: string;
  onEditorChange: (content: string) => void;
  id?: string;
  height?: number;
  disabled?: boolean;
}

export default function RichTextEditor({
  value,
  onEditorChange,
  id,
  height = 250,
  disabled = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const autoId = useId();
  const editorId = id ?? `editor-${autoId}`;
  const editorInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initEditor = async () => {
      if (editorInstanceRef.current) {
        return; // Editor already initialized
      }

      try {
        let isInitialLoad = true;
        
        await hugerte.init({
          selector: `#${editorId}`,
          height,
          // Use bundled skins
          skin_url: 'default',
          content_css: 'default',
          plugins: 
            "advlist autolink lists link image charmap preview anchor " +
            "searchreplace visualblocks code fullscreen insertdatetime " +
            "media table help wordcount",
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          readonly: disabled,
          setup: (editor: any) => {
            editorInstanceRef.current = editor;
            
            // Set initial content
            editor.on('init', () => {
              editor.setContent(value || '');
              // Allow changes to be tracked after initial load
              setTimeout(() => {
                isInitialLoad = false;
              }, 100);
            });

            // Handle content changes - but ignore during initial load
            editor.on('change keyup undo redo', () => {
              if (!isInitialLoad) {
                const content = editor.getContent();
                onEditorChange(content);
              }
            });

            // Handle programmatic content changes (like SetContent) separately
            editor.on('SetContent', (e: any) => {
              // Only trigger onChange for SetContent if it's not during initial load
              // and not a programmatic update from parent component
              if (!isInitialLoad && !editor._programmingUpdate) {
                const content = editor.getContent();
                onEditorChange(content);
              }
            });
          },
        });
      } catch (error) {
        console.error('Failed to initialize HugeRTE:', error);
      }
    };

    initEditor();

    // Cleanup function
    return () => {
      if (editorInstanceRef.current) {
        try {
          editorInstanceRef.current.remove();
          editorInstanceRef.current = null;
        } catch (error) {
          console.error('Error removing editor:', error);
        }
      }
    };
  }, [editorId, height, disabled]); // Include height and disabled in deps

  // Update content when value prop changes
  useEffect(() => {
    if (editorInstanceRef.current && editorInstanceRef.current.initialized) {
      const currentContent = editorInstanceRef.current.getContent();
      if (currentContent !== value) {
        // Mark this as a programmatic update to prevent triggering onChange
        editorInstanceRef.current._programmingUpdate = true;
        editorInstanceRef.current.setContent(value || '');
        // Clear the flag after a short delay
        setTimeout(() => {
          if (editorInstanceRef.current) {
            editorInstanceRef.current._programmingUpdate = false;
          }
        }, 50);
      }
    }
  }, [value]);

  // Handle disabled state changes
  useEffect(() => {
    if (editorInstanceRef.current && editorInstanceRef.current.initialized) {
      editorInstanceRef.current.setMode(disabled ? 'readonly' : 'design');
    }
  }, [disabled]);

  return (
    <div className="hugerte-editor-wrapper">
      <textarea
        ref={editorRef}
        id={editorId}
        defaultValue={value}
        style={{ width: '100%', height: `${height}px` }}
        disabled={disabled}
      />
    </div>
  );
}