// components/TiptapEditor.jsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import { useEffect } from "react";
import "./style.css";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";

const TiptapEditor = ({ handleChangeValue, content = "" }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {},
        },
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color.configure({ types: ["textStyle"] }),
      TextStyle,
    ],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      handleChangeValue(html);
    },
    content: content,
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, false); // false: không tạo transaction undo
    }
  }, [content, editor]);

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} onChange={handleChangeValue} />
    </div>
  );
};

export default TiptapEditor;
