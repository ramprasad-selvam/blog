'use client';
import "./style.css";
import { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email or phone number is required";
    } else {
      const isEmail = /^\S+@\S+\.\S+$/.test(form.email);
      const isPhone = /^\+?\d{10,15}$/.test(form.email);
      if (!isEmail && !isPhone) {
        newErrors.email = "Enter a valid email or phone number";
      }
    }

    if (!form.message.trim()) newErrors.message = "Message is required";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    if (errors.files) setErrors(prev => ({ ...prev, files: "" }));
  };

  const removeFile = (index) => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
    if (files.length === 1 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (errors.files) setErrors(prev => ({ ...prev, files: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setStatus("");
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) element.focus();
      return;
    }

    setErrors({});
    setStatus("Sending...");
    setStatusType("");
    setIsSubmitting(true);

    try {
      const fileUrls = [];
      if (files.length > 0) {
        setStatus("Uploading files...");
        const uploadPromises = files.map(file =>
          upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/upload",
          })
        );
        const uploadedBlobs = await Promise.all(uploadPromises);
        fileUrls.push(...uploadedBlobs.map(blob => blob.url));
      }

      setStatus("Sending message...");
      const res = await fetch("/api/sendmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          fileUrls: fileUrls,
        }),
      });

      if (res.ok) {
        setStatus("✅ Message sent successfully! I'll get back to you soon.");
        setStatusType("success");
        setForm({ name: "", email: "", message: "" });
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const data = await res.json();
        setStatus("❌ Failed to send: " + (data.error || "Please try again later."));
        setStatusType("error");
      }
    } catch (err) {
      setStatus("❌ Network error: Please check your connection and try again.");
      setStatusType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container">
      <div className="contact-container">
        <h1>Get in Touch</h1>
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder=" "
              value={form.name}
              onChange={handleChange}
              className={errors.name ? "input-error" : ""}
            />
            <label htmlFor="name">Your Name</label>
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <input
              type="text"
              name="email"
              placeholder=" "
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            <label htmlFor="email">Email or Phone Number</label>
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <textarea
              name="message"
              placeholder=" "
              rows={5}
              value={form.message}
              onChange={handleChange}
              className={errors.message ? "input-error" : ""}
            />
            <label htmlFor="message">Your Message</label>
            {errors.message && <span className="error">{errors.message}</span>}
          </div>
          <div className="file-section">
            <label className="file-upload-label">
              <div className={`file-upload ${errors.files ? "input-error" : ""}`}>
                <input
                  type="file"
                  name="files"
                  onChange={handleFileChange}
                  multiple
                  ref={fileInputRef}
                />
                <div className="upload-text">
                  {files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "Click to upload files (no size limit)"}
                </div>
              </div>
            </label>
            {files.length > 0 && (
              <div className="file-preview-list">
                {files.map((file, idx) => (
                  <div key={idx} className="file-preview">
                    <span>{file.name}</span>
                    <button type="button" onClick={() => removeFile(idx)} aria-label={`Remove ${file.name}`}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {errors.files && <span className="error">{errors.files}</span>}
          </div>
          <button type="submit" disabled={isSubmitting} className={`submit-btn ${isSubmitting ? "submitting" : ""}`}>
            {isSubmitting ? status.split(' ')[0] + "..." : "Send Message"}
          </button>
        </form>
        {status && <div className={`status ${statusType}`}>{status}</div>}
      </div>
    </main>
  );
}