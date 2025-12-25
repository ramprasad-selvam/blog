'use client';

import { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";
import { 
  Send, 
  User, 
  Mail, 
  MessageSquare, 
  Paperclip, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"" | "success" | "error">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email or phone is required";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setStatus("Initializing...");

    try {
      const fileUrls: string[] = [];
      if (files.length > 0) {
        setStatus("Uploading assets...");
        const uploadPromises = files.map(file =>
          upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/upload",
          })
        );
        const uploadedBlobs = await Promise.all(uploadPromises);
        fileUrls.push(...uploadedBlobs.map(blob => blob.url));
      }

      setStatus("Transmitting message...");
      const res = await fetch("/api/sendmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, fileUrls }),
      });

      if (res.ok) {
        setStatus("Message sent successfully!");
        setStatusType("success");
        setForm({ name: "", email: "", message: "" });
        setFiles([]);
      } else {
        throw new Error("Transmission failed");
      }
    } catch (err) {
      setStatus("Failed to send. Please try again.");
      setStatusType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          
          {/* Sidebar Info */}
          <div className="lg:col-span-2 bg-blue-600/10 p-12 border-r border-white/5 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase mb-4">
                Get In <br /> Touch
              </h1>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                Have a project in mind or just want to chat about dev tools? Drop a message.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-400">
                <CheckCircle2 size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Available for Hire</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-3 p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    name="name" value={form.name} onChange={handleChange}
                    className="w-full bg-black/40 border border-white/5 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-blue-500/40 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-[9px] text-red-500 font-bold uppercase pl-2">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Email or Phone</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    name="email" value={form.email} onChange={handleChange}
                    className="w-full bg-black/40 border border-white/5 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-blue-500/40 transition-all"
                    placeholder="hello@example.com"
                  />
                </div>
                {errors.email && <p className="text-[9px] text-red-500 font-bold uppercase pl-2">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Message</label>
                <div className="relative group">
                  <MessageSquare className="absolute left-4 top-6 text-zinc-700 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <textarea 
                    name="message" value={form.message} onChange={handleChange} rows={4}
                    className="w-full bg-black/40 border border-white/5 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-blue-500/40 transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                {errors.message && <p className="text-[9px] text-red-500 font-bold uppercase pl-2">{errors.message}</p>}
              </div>

              {/* File Upload Section */}
              <div className="space-y-3">
                <label 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-3 w-full py-4 border-2 border-dashed border-white/5 hover:border-blue-500/20 hover:bg-blue-500/5 rounded-2xl cursor-pointer transition-all group"
                >
                  <Paperclip size={16} className="text-zinc-500 group-hover:text-blue-400" />
                  <span className="text-[10px] font-black text-zinc-500 group-hover:text-blue-400 uppercase tracking-widest">
                    Attach Assets {files.length > 0 && `(${files.length})`}
                  </span>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
                </label>

                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-zinc-800/50 border border-white/5 px-3 py-1.5 rounded-full">
                        <span className="text-[9px] font-bold text-zinc-400 truncate max-w-[100px]">{file.name}</span>
                        <button type="button" onClick={() => removeFile(idx)} className="text-zinc-500 hover:text-red-400">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                type="submit" disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {status.split(' ')[0]}
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>

              {statusType && (
                <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                  statusType === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {statusType === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span className="text-[10px] font-bold uppercase tracking-widest">{status}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}