"use client";
import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getUserInitial, getDisplayName } from "@/utils/user";
import Input from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";

export default function ProfilePage() {
  const { user, mutate } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ firstName: user?.firstName || "", lastName: user?.lastName || "", email: user?.email || "", username: user?.username || "" });
  const [message, setMessage] = useState({ text: "", ok: true });
  const [isUpdating, setIsUpdating] = useState(false);

  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [isPassEditing, setIsPassEditing] = useState(false);
  const [passForm, setPassForm] = useState({ newPassword: "", confirmPassword: "" });
  const [passMessage, setPassMessage] = useState({ text: "", ok: true });
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) return (
    <div className="flex min-h-full flex-col items-center px-4 py-6 md:py-10 font-display">
      <div className="w-full max-w-[520px] flex flex-col gap-5">
        {/* Avatar hero skeleton */}
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/8 bg-[#292524] px-6 py-10">
          <div className="size-24 rounded-full bg-white/5 animate-pulse" />
          <div className="flex flex-col items-center gap-2 mt-1">
            <div className="h-5 w-36 rounded-lg bg-white/5 animate-pulse" />
            <div className="h-3.5 w-24 rounded bg-white/5 animate-pulse" />
            <div className="h-3 w-32 rounded bg-white/5 animate-pulse" />
          </div>
        </div>
        {/* Info card skeleton */}
        <div className="rounded-2xl border border-white/8 bg-[#292524]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
            <div className="h-4 w-40 rounded bg-white/5 animate-pulse" />
            <div className="h-7 w-14 rounded-xl bg-white/5 animate-pulse" />
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-3.5 border-b border-white/5 last:border-0">
              <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
              <div className="h-3 w-28 rounded bg-white/5 animate-pulse" />
            </div>
          ))}
        </div>
        {/* Password card skeleton */}
        <div className="rounded-2xl border border-white/8 bg-[#292524]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
            <div className="h-4 w-24 rounded bg-white/5 animate-pulse" />
            <div className="h-7 w-20 rounded-xl bg-white/5 animate-pulse" />
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="h-3 w-48 rounded bg-white/5 animate-pulse" />
            <div className="h-3 w-16 rounded bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  const flash = (setter: typeof setMessage, text: string, ok = true) => {
    setter({ text, ok });
    setTimeout(() => setter({ text: "", ok: true }), 3000);
  };

  const startEdit = () => {
    setForm({ firstName: user.firstName || "", lastName: user.lastName || "", email: user.email || "", username: user.username || "" });
    setMessage({ text: "", ok: true });
    setIsEditing(true);
  };

  const cancelEdit = () => { setIsEditing(false); setMessage({ text: "", ok: true }); };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); flash(setMessage, d.error || "Failed to update", false); return; }
      mutate(); flash(setMessage, "Profile updated!"); setIsEditing(false);
    } catch { flash(setMessage, "Failed to update profile", false); }
    finally { setIsUpdating(false); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Please select an image file"); return; }
    if (file.size > 2 * 1024 * 1024) { alert("Image must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = async () => {
    if (!previewImage) return;
    setIsUploadingPhoto(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profileImage: previewImage }) });
      if (!res.ok) { alert("Failed to upload photo"); return; }
      mutate(); setIsPhotoOpen(false); setPreviewImage(null);
      flash(setMessage, "Profile photo updated!");
    } catch { alert("Failed to upload photo"); }
    finally { setIsUploadingPhoto(false); }
  };

  const handleRemovePhoto = async () => {
    setIsUploadingPhoto(true);
    try {
      await fetch(`/api/users/${user.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profileImage: null }) });
      mutate(); flash(setMessage, "Photo removed!");
    } catch { alert("Failed to remove photo"); }
    finally { setIsUploadingPhoto(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword.length < 8) { flash(setPassMessage, "Password must be at least 8 characters", false); return; }
    if (passForm.newPassword !== passForm.confirmPassword) { flash(setPassMessage, "Passwords do not match", false); return; }
    setIsChangingPass(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: passForm.newPassword }) });
      if (!res.ok) { const d = await res.json(); flash(setPassMessage, d.error || "Failed", false); return; }
      flash(setPassMessage, "Password changed!"); setPassForm({ newPassword: "", confirmPassword: "" }); setIsPassEditing(false);
    } catch { flash(setPassMessage, "Failed to change password", false); }
    finally { setIsChangingPass(false); }
  };

  return (
    <div className="flex min-h-full flex-col items-center px-4 py-6 md:py-10 font-display text-white">
      <div className="w-full max-w-[520px] flex flex-col gap-5">

        {/* Avatar hero */}
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/8 bg-[#292524] banig-xs px-6 py-10">
          <div className="relative">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="size-24 rounded-full border-2 border-primary/20 object-cover" />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-full border-2 border-primary/20 bg-gradient-to-br from-primary to-orange-500 text-3xl font-black text-stone-900">
                {getUserInitial(user)}
              </div>
            )}
            <button
              onClick={() => setIsPhotoOpen(true)}
              disabled={isUploadingPhoto}
              className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border border-white/10 bg-[#1c1917] text-slate-400 transition-colors hover:text-primary disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[14px]">photo_camera</span>
            </button>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-white">{getDisplayName(user)}</p>
            <p className="text-sm text-slate-500">@{user.username}</p>
            <p className="text-xs text-slate-600 mt-0.5">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          {user.profileImage && (
            <button onClick={handleRemovePhoto} disabled={isUploadingPhoto} className="flex items-center gap-1 text-xs font-bold text-slate-600 transition-colors hover:text-secondary">
              <span className="material-symbols-outlined text-[13px]">delete</span>Remove photo
            </button>
          )}
          {message.text && (
            <div className={`flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-sm ${message.ok ? "border-quaternary/20 bg-quaternary/10 text-quaternary" : "border-secondary/20 bg-secondary/10 text-secondary"}`}>
              <span className="material-symbols-outlined text-base">{message.ok ? "check_circle" : "error"}</span>
              {message.text}
            </div>
          )}
        </div>

        {/* Personal info */}
        <div className="rounded-2xl border border-white/8 bg-[#292524] banig-xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
            <h2 className="flex items-center gap-2 font-black text-white">
              <span className="material-symbols-outlined text-lg text-primary">person</span>
              Personal Information
            </h2>
            {!isEditing ? (
              <button onClick={startEdit} className="flex items-center gap-1.5 rounded-xl border border-white/8 px-3 py-1.5 text-xs font-bold text-slate-400 transition-all hover:border-primary/30 hover:text-primary">
                <span className="material-symbols-outlined text-[15px]">edit</span>Edit
              </button>
            ) : (
              <button onClick={cancelEdit} className="flex items-center gap-1.5 rounded-xl border border-white/8 px-3 py-1.5 text-xs font-bold text-slate-400 transition-all hover:text-white">
                <span className="material-symbols-outlined text-[15px]">close</span>Cancel
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="divide-y divide-white/5">
              {[
                { label: "First Name", value: user.firstName || "—" },
                { label: "Last Name",  value: user.lastName  || "—" },
                { label: "Email",      value: user.email },
                { label: "Username",   value: `@${user.username}` },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-6 py-3.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{row.label}</span>
                  <span className="text-sm font-semibold text-white">{row.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" placeholder="Juan" value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} />
                <Input label="Last Name" placeholder="Dela Cruz" value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} />
              </div>
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
              <Input label="Username" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} required />
              <div className="flex gap-3 justify-end pt-1">
                <button type="button" onClick={cancelEdit} className="rounded-xl border border-white/8 px-5 py-2.5 text-sm font-bold text-slate-400 transition-all hover:text-white">
                  Cancel
                </button>
                <button type="submit" disabled={isUpdating} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-stone-900 shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover disabled:opacity-60">
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Password */}
        <div className="rounded-2xl border border-white/8 bg-[#292524] banig-xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
            <h2 className="flex items-center gap-2 font-black text-white">
              <span className="material-symbols-outlined text-lg text-primary">lock</span>
              Password
            </h2>
            {!isPassEditing ? (
              <button onClick={() => { setIsPassEditing(true); setPassMessage({ text: "", ok: true }); }} className="flex items-center gap-1.5 rounded-xl border border-white/8 px-3 py-1.5 text-xs font-bold text-slate-400 transition-all hover:border-primary/30 hover:text-primary">
                <span className="material-symbols-outlined text-[15px]">edit</span>Change
              </button>
            ) : (
              <button onClick={() => { setIsPassEditing(false); setPassForm({ newPassword: "", confirmPassword: "" }); }} className="flex items-center gap-1.5 rounded-xl border border-white/8 px-3 py-1.5 text-xs font-bold text-slate-400 transition-all hover:text-white">
                <span className="material-symbols-outlined text-[15px]">close</span>Cancel
              </button>
            )}
          </div>

          {!isPassEditing ? (
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-slate-500">Keep your account secure with a strong password.</span>
              <span className="text-sm font-mono tracking-widest text-slate-600">••••••••</span>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="flex flex-col gap-4 p-6">
              {passMessage.text && (
                <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${passMessage.ok ? "border-quaternary/20 bg-quaternary/10 text-quaternary" : "border-secondary/20 bg-secondary/10 text-secondary"}`}>
                  <span className="material-symbols-outlined text-base">{passMessage.ok ? "check_circle" : "error"}</span>
                  {passMessage.text}
                </div>
              )}
              <Input
                label="New Password"
                type={showPass ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={passForm.newPassword}
                onChange={(e) => setPassForm({...passForm, newPassword: e.target.value})}
                required
                suffix={
                  <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-500 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-xl">{showPass ? "visibility_off" : "visibility"}</span>
                  </button>
                }
              />
              <Input label="Confirm New Password" type={showPass ? "text" : "password"} placeholder="Repeat new password" value={passForm.confirmPassword} onChange={(e) => setPassForm({...passForm, confirmPassword: e.target.value})} required />
              <div className="flex gap-3 justify-end pt-1">
                <button type="button" onClick={() => { setIsPassEditing(false); setPassForm({ newPassword: "", confirmPassword: "" }); }} className="rounded-xl border border-white/8 px-5 py-2.5 text-sm font-bold text-slate-400 transition-all hover:text-white">
                  Cancel
                </button>
                <button type="submit" disabled={isChangingPass} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-stone-900 shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover disabled:opacity-60">
                  {isChangingPass ? "Changing..." : "Save Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Photo modal */}
      <Modal isOpen={isPhotoOpen} onClose={() => { setIsPhotoOpen(false); setPreviewImage(null); }} title="Update Profile Photo" footer={<><Button variant="ghost" onClick={() => { setIsPhotoOpen(false); setPreviewImage(null); }} disabled={isUploadingPhoto}>Cancel</Button><Button onClick={handleSavePhoto} disabled={!previewImage || isUploadingPhoto}>{isUploadingPhoto ? "Uploading..." : "Save Photo"}</Button></>}>
        <div className="flex flex-col items-center gap-5">
          {previewImage ? (
            <img src={previewImage} alt="Preview" className="size-28 rounded-full border-2 border-primary/30 object-cover" />
          ) : user.profileImage ? (
            <img src={user.profileImage} alt="Current" className="size-28 rounded-full border-2 border-primary/30 object-cover" />
          ) : (
            <div className="flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-500 text-4xl font-black text-stone-900">{getUserInitial(user)}</div>
          )}
          <input ref={fileRef} id="profile-photo" name="profile-photo" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 rounded-xl border border-white/8 px-5 py-2.5 text-sm font-bold text-slate-300 transition-all hover:border-primary/30 hover:text-primary">
            <span className="material-symbols-outlined text-[18px]">upload</span>Choose Photo
          </button>
          <p className="text-xs text-slate-600">Max 2MB · JPG, PNG, GIF</p>
        </div>
      </Modal>
    </div>
  );
}
