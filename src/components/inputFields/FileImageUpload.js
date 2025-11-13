import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import Image from "next/image";
import { RiCloseLine } from "react-icons/ri";
import InputWrapper from "../../utils/hoc/InputWrapper";

/**
 * Props:
 * name: string (Formik field name)
 * multiple: boolean
 * selectedFiles: array of existing files (optional)
 * setSelectedFiles: function to update selected files
 */
const FileImageUpload = ({
  name,
  multiple = false,
  selectedFiles = [],
  setSelectedFiles,
  helperText = "",
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [localFiles, setLocalFiles] = useState(selectedFiles);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      id: Date.now() + Math.random(), // unique id
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    const updatedFiles = multiple ? [...localFiles, ...files] : files;
    setLocalFiles(updatedFiles);
    if (setSelectedFiles) setSelectedFiles(updatedFiles);
  };

  const removeFile = (id) => {
    const updatedFiles = localFiles.filter((f) => f.id !== id);
    setLocalFiles(updatedFiles);
    if (setSelectedFiles) setSelectedFiles(updatedFiles);
  };

  return (
    <>
      {/* Trigger Button */}
      <Button color="primary" onClick={toggleModal}>
        Upload {multiple ? "Files/Images" : "File/Image"}
      </Button>

      {/* Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Choose {multiple ? "Files/Images" : "File/Image"}</ModalHeader>
        <ModalBody>
          {/* File Input */}
          <Input
            type="file"
            multiple={multiple}
            onChange={handleFileChange}
            style={{ marginBottom: "1rem" }}
          />

          {/* Selected Files Preview */}
          {localFiles.length > 0 && (
            <div style={{ display: "flex", overflowX: "auto", gap: "10px", paddingTop: "1rem" }}>
              {localFiles.map((file) => (
                <div key={file.id} style={{ position: "relative", width: "100px", height: "100px" }}>
                  <Image
                    src={file.url}
                    alt={file.name}
                    width={100}
                    height={100}
                    style={{ objectFit: "cover", borderRadius: "5px" }}
                  />
                  <RiCloseLine
                    onClick={() => removeFile(file.id)}
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      cursor: "pointer",
                      color: "red",
                      background: "white",
                      borderRadius: "50%",
                      fontSize: "20px",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
        {helperText && <p className="help-text" style={{ padding: "0 1rem 1rem" }}>{helperText}</p>}
      </Modal>
    </>
  );
};

export default InputWrapper(FileImageUpload);
