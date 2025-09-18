'use client';
import "./style.css";
import { useState, useRef } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "", files: [] });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Updated validation to limit number of files only by total size (5MB), no max file count limit

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

    // Remove max files count restriction
    // Only limit total size to 5MB
    const totalSize = form.files.reduce((sum, file) => sum + (file.size || 0), 0);
    if (totalSize > 5 * 1024 * 1024) newErrors.files = "Total file size must be less than 5MB";

    form.files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) newErrors.files = "Each file must be less than 5MB";
    });

    return newErrors;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    Promise.all(
      files.map(file => new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result.split(",")[1];
          resolve({ name: file.name, data: base64, size: file.size });
        };
        reader.readAsDataURL(file);
      }))
    ).then(base64Files => {
      setForm(prev => ({ ...prev, files: base64Files }));
      if (errors.files) setErrors({ ...errors, files: "" });
    });
  };

  const removeFile = (index) => {
    setForm(prev => {
      const newFiles = [...prev.files];
      newFiles.splice(index, 1);
      return { ...prev, files: newFiles };
    });
    if (form.files.length === 1 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (errors.files) setErrors({ ...errors, files: "" });
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
      const res = await fetch("/api/sendmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("✅ Message sent successfully! I'll get back to you soon.");
        setStatusType("success");
        setForm({ name: "", email: "", message: "", files: [] });
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
        <div className="contact-header">
          <h1>Get in Touch</h1>
          <p className="intro">
            Have something in mind or just want to chat? Reach out using the form below or email me at{" "}
            <a href="mailto:ramprasadselvam@gmail.com">ramprasadselvam@gmail.com</a>.
          </p>
        </div>

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
                <div className="upload-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11 15H13V9H16L12 4L8 9H11V15Z" fill="currentColor" />
                    <path
                      d="M20 18H4V11H2V18C2 19.103 2.897 20 4 20H20C21.103 20 22 19.103 22 18V11H20V18Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span>
                  {form.files.length > 0
                    ? `${form.files.length} file${form.files.length > 1 ? "s" : ""} selected`
                    : "Click to upload files (optional, max 5 files, total 5MB)"}
                </span>
                <input
                  type="file"
                  name="files"
                  onChange={handleFileChange}
                  multiple
                  ref={fileInputRef}
                />
              </div>
            </label>

            {form.files.length > 0 && (
              <div className="file-preview-list">
                {form.files.map((file, idx) => (
                  <div key={idx} className="file-preview">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="remove-file"
                      aria-label={`Remove ${file.name}`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 18L18 6M6 6L18 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errors.files && <span className="error">{errors.files}</span>}
          </div>

          <button
            type="submit"
            className={`submit-btn ${isSubmitting ? "submitting" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>

        {status && (
          <div className={`status ${statusType} ${status ? "show" : ""}`}>
            {status}
          </div>
        )}
      </div>
    </main>
  );
}
