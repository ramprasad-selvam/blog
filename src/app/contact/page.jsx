'use client';
import "./style.css";
import { useState, useRef } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "", file: null });
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
      const isPhone = /^\+?\d{10,15}$/.test(form.email); // supports +countrycode and 10-15 digits
      if (!isEmail && !isPhone) {
        newErrors.email = "Enter a valid email or phone number";
      }
    }

    if (!form.message.trim()) newErrors.message = "Message is required";

    // File validation (optional)
    if (form.file && form.file.size > 5 * 1024 * 1024) {
      newErrors.file = "File size must be less than 5MB";
    }

    return newErrors;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear file error
    if (errors.file) {
      setErrors({ ...errors, file: "" });
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      setForm({ ...form, file: { name: file.name, data: base64, size: file.size } });
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setForm({ ...form, file: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);

      // Focus on first error field
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) element.focus();

      setStatus("");
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
        setForm({ name: "", email: "", message: "", file: null });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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
          <p className="intro">Have something in mind or just want to chat? Reach out using the form below or email me at <a href="mailto:ramprasadselvam@gmail.com">ramprasadselvam@gmail.com</a>.</p>
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
              rows="5"
              value={form.message}
              onChange={handleChange}
              className={errors.message ? "input-error" : ""}
            />
            <label htmlFor="message">Your Message</label>
            {errors.message && <span className="error">{errors.message}</span>}
          </div>

          <div className="file-section">
            <label className="file-upload-label">
              <div className={`file-upload ${errors.file ? "input-error" : ""}`}>
                <div className="upload-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 15H13V9H16L12 4L8 9H11V15Z" fill="currentColor" />
                    <path d="M20 18H4V11H2V18C2 19.103 2.897 20 4 20H20C21.103 20 22 19.103 22 18V11H20V18Z" fill="currentColor" />
                  </svg>
                </div>
                <span>{form.file ? form.file.name : "Click to upload a file (optional)"}</span>
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </div>
            </label>

            {form.file && (
              <div className="file-preview">
                <span>{form.file.name}</span>
                <button type="button" onClick={removeFile} className="remove-file">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            )}

            {errors.file && <span className="error">{errors.file}</span>}
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