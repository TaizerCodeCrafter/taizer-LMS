import React, { useState, useEffect } from "react";
import {
  Settings,
  User,
  Shield,
  Key,
  Mail,
  AlertTriangle,
  Save,
  Camera,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  Sparkles
} from "lucide-react";
import { compressImageFile } from "../../utils/imageCompressor";

const SettingsTab = ({
  adminProfile = {},
  setAdminProfile,
  webHomeSettings = {},
  setWebHomeSettings,
  onSaveProfile,
  onSaveBranding,
  onTriggerReset
}) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const initialBranding = webHomeSettings?.branding || {
    logo: "/logo.png",
    siteName: "Taizer LMS",
    siteTagline: "Crypto & Forex Trading Academy"
  };

  const [brandingForm, setBrandingForm] = useState(initialBranding);

  // Keep brandingForm in sync if webHomeSettings updates
  React.useEffect(() => {
    if (webHomeSettings?.branding) {
      setBrandingForm(webHomeSettings.branding);
    }
  }, [webHomeSettings]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploadingLogo(true);
        const compressed = await compressImageFile(file, {
          maxWidth: 600,
          maxHeight: 600,
          quality: 0.85
        });
        setBrandingForm((prev) => ({ ...prev, logo: compressed }));
      } catch (err) {
        console.error("Logo compress error:", err);
      } finally {
        setIsUploadingLogo(false);
      }
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploadingPhoto(true);
        const compressed = await compressImageFile(file, {
          maxWidth: 600,
          maxHeight: 600,
          quality: 0.82
        });
        setAdminProfile({ ...adminProfile, photo: compressed });
      } catch (err) {
        console.error("Photo compress error:", err);
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e1424]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Platform & Profile Settings
            </h2>
            <p className="text-xs text-slate-400">
              Manage security credentials, system preferences, and admin profile data
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ADMIN PROFILE CARD */}
        <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Administrator Credentials</h3>
              <p className="text-xs text-slate-400">Update display name and password</p>
            </div>
          </div>

          {/* AVATAR UPLOAD */}
          <div className="flex items-center gap-5 pt-2">
            <div className="relative group">
              <img
                src={adminProfile.photo || "/admin-profile.png"}
                alt="Profile"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
                onError={(e) => {
                  e.target.src = "/logo.png";
                }}
              />
              <label className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {isUploadingPhoto ? (
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                ) : (
                  <>
                    <Camera className="w-5 h-5 text-white mb-1" />
                    <span className="text-[9px] font-bold text-slate-200">Change</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isUploadingPhoto}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                {adminProfile.name || "Administrator"}
              </p>
              <p className="text-xs text-indigo-400 mt-0.5">
                {adminProfile.email || "admin@econoacademy.lk"}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-2">
                Super Admin Access
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                Full Display Name
              </label>
              <input
                type="text"
                value={adminProfile.name || ""}
                onChange={(e) =>
                  setAdminProfile({ ...adminProfile, name: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                value={adminProfile.email || ""}
                onChange={(e) =>
                  setAdminProfile({ ...adminProfile, email: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                Security Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={adminProfile.password || ""}
                onChange={(e) =>
                  setAdminProfile({ ...adminProfile, password: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={onSaveProfile}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Admin Profile</span>
            </button>
          </div>
        </div>

        {/* PLATFORM BRANDING & LOGO CARD */}
        <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Platform Logo & Academy Branding</h3>
              <p className="text-xs text-slate-400">Official academy logo, name & tagline</p>
            </div>
          </div>

          {/* LOGO PREVIEW & UPLOAD */}
          <div className="flex items-center gap-5 pt-2">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-indigo-500/40 shadow-xl flex items-center justify-center overflow-hidden p-2">
                <img
                  src={brandingForm.logo || "/logo.png"}
                  alt="Academy Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "/logo.png";
                  }}
                />
              </div>
              <label className="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {isUploadingLogo ? (
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                ) : (
                  <>
                    <Camera className="w-5 h-5 text-white mb-1" />
                    <span className="text-[9px] font-bold text-slate-200">Change</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={isUploadingLogo}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                {brandingForm.siteName || "EconoAcademy"}
              </p>
              <p className="text-xs text-indigo-400 mt-0.5">
                {brandingForm.siteTagline || "Economics & Sinhala LMS"}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mt-2">
                Applies to Website, Sidebar & LMS
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                Academy / Institute Name
              </label>
              <input
                type="text"
                value={brandingForm.siteName || ""}
                onChange={(e) =>
                  setBrandingForm({ ...brandingForm, siteName: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                Tagline / Motto
              </label>
              <input
                type="text"
                value={brandingForm.siteTagline || ""}
                onChange={(e) =>
                  setBrandingForm({ ...brandingForm, siteTagline: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="button"
              onClick={() => onSaveBranding && onSaveBranding(brandingForm)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Academy Branding & Logo</span>
            </button>
          </div>
        </div>

        {/* PREFERENCES & DANGER ZONE */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* PREFERENCES */}
          <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-6">
            <h3 className="text-base font-bold text-white">System Preferences</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Maintenance Mode</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Restrict student portal access during system maintenance
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    maintenanceMode ? "bg-indigo-600" : "bg-slate-800"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      maintenanceMode ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Email Notifications</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Receive email alerts for new student payment receipts
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    emailAlerts ? "bg-indigo-600" : "bg-slate-800"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      emailAlerts ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* DANGER ZONE */}
          <div className="bg-rose-950/20 border border-rose-900/30 rounded-3xl p-8 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-400">Danger Zone</h3>
                <p className="text-xs text-rose-300/70">
                  Critical irreversible administrative actions
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Clearing the database will permanently delete all student accounts, payment records, curriculum modules, and assessments.
            </p>

            <button
              onClick={onTriggerReset}
              className="w-full py-3 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Perform Critical System Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
