import React, { useState } from "react";
import { Col, Label, Button } from "reactstrap";
import { useField, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import NameConversion from "../../utils/customFunctions/NameConversion";

const KeywordInput = ({ label, required = false, notitle = false, ...props }) => {
  const { t } = useTranslation("common");
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();
  const [inputValue, setInputValue] = useState("");

  const handleAddKeyword = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const newKeywords = [...(field.value || []), trimmed];
    setFieldValue(field.name, newKeywords);
    setInputValue("");
  };

  const handleRemoveKeyword = (index) => {
    const newKeywords = (field.value || []).filter((_, i) => i !== index);
    setFieldValue(field.name, newKeywords);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <div className="input-error mb-4">
      <div className={notitle ? "form-floating" : "align-items-center row"}>
        {!notitle && (
          <Col sm="3">
            <Label className="col-form-label form-label-title">
              {label || t(NameConversion(field.name))}
              {required && <span className="theme-color ms-2 required-dot">*</span>}
            </Label>
          </Col>
        )}
        <Col sm="9">
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Enter keyword"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button color="primary" type="button" onClick={handleAddKeyword}>
              Add
            </Button>
          </div>

          {/* keyword chips */}

          {/* Keyword list (display tags horizontally, no extra gap below) */}
          {(field.value || []).length > 0 && (
            <div
              className="keyword-list d-flex flex-wrap align-items-center mt-2"
              style={{
                gap: "8px",
                marginTop: "8px",
                marginBottom: 0,
              }}
            >
              {field.value.map((kw, i) => (
                <span
                  key={i}
                  className="badge bg-primary d-flex align-items-center"
                  style={{
                    display: "inline-flex",
                    gap: "6px",
                    padding: "8px 10px",
                    fontSize: "0.9rem",
                    borderRadius: "16px",
                  }}
                >
                  {kw}
                  <button
                    type="button"
                    className="btn-close btn-close-white btn-sm ms-1"
                    style={{ fontSize: "0.6rem" }}
                    onClick={() => handleRemoveKeyword(i)}
                    aria-label="Remove"
                  />
                </span>
              ))}
            </div>
          )}


          {/* error message */}
          {meta.touched && meta.error && (
            <div className="text-danger small mt-1">{meta.error}</div>
          )}
        </Col>
      </div>
    </div>
  );
};

export default KeywordInput;
