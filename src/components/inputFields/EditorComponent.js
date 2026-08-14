import React, { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { ErrorMessage } from "formik";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

function EditorComponent({ name, onChange, editorLoaded, value = "", onBlur }) {
  const { t } = useTranslation("common");
  const editor = useRef(null);

  // Memoize config to prevent unnecessary re-renders
  const config = useMemo(() => ({
    readonly: false,
    placeholder: t("start_typing") || "Start typing...",
    height: 500,
    // Add other buttons or settings here
    buttons: [
          "source", "|", 
          "bold", "italic", "underline", "strikethrough", "|",
          "ul", "ol", "|",
          "outdent", "indent", "|",
          "font", "fontsize", "brush", "paragraph", "|",
          "image", "table", "link", "|",
          "align", "undo", "redo", "|",
          "hr", "eraser", "copyformat", "|",
          "fullsize", "print", "about"
        ],
  }), [t]);

  const handleBlur = (newContent) => {
    // If you are using Formik, onBlur usually expects an event or a specific value
    if (onBlur) {
      onBlur(newContent);
    }
  };

  const handleChange = (newContent) => {
    // Check if the content is effectively empty (stripping tags and NBSP)
    const isBlank = newContent
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, "")
      .trim() === "";

    // Send actual content back to Formik/Parent, or empty string if blank
    if (onChange) {
      onChange(isBlank ? "" : newContent);
    }
  };

  return (
    <div className="editor-wrapper">
      {editorLoaded ? (
        <JoditEditor
          ref={editor}
          value={value} // Use value from props directly
          config={config}
          tabIndex={1}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      ) : (
        <div>{t("Editorloading")}</div>
      )}
      
      <ErrorMessage 
        name={name} 
        render={(msg) => <div className='invalid-feedback d-block'>{t(msg)}</div>} 
      />
    </div>
  );
}

export default EditorComponent;