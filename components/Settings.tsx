
import React, { useState, useRef } from 'react';
import { User as UserType } from '../types';
import { useLang } from '../context/LanguageContext';
import { translations } from '../services/i18n';
import {
  User as UserIcon,
  Globe,
  Bell,
  Shield,
  Moon,
  HelpCircle,
  ChevronRight,
  LogOut,
  Camera,
  X,
  ChevronLeft,
  Check,
  Lock,
  Eye,
  EyeOff,
  MessageCircle,
  Info
} from 'lucide-react';

interface SettingsProps {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onBack?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, setUser, onLogout, darkMode, setDarkMode, onBack }) => {
  const { lang, setLang } = useLang();
  const T = translations[lang];

  const [showEditProfile, setShowEditProfile]   = useState(false);
  const [showPassword,    setShowPassword]      = useState(false);
  const [showNotifs,      setShowNotifs]        = useState(false);
  const [showLanguage,    setShowLanguage]      = useState(false);
  const [showHelp,        setShowHelp]          = useState(false);
  const [toast,           setToast]             = useState<string | null>(null);
  const [showPwValue,     setShowPwValue]       = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editForm, setEditForm] = useState({
    name:    user?.name    || '',
    email:   user?.email   || '',
    phone:   user?.phone   || '',
    address: user?.address || '',
  });

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });

  const [notifSettings, setNotifSettings] = useState({
    appointments: true,
    reminders:    true,
    promotions:   false,
    updates:      true,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSaveProfile = () => {
    if (user) setUser({ ...user, ...editForm });
    setShowEditProfile(false);
    showToast(T.settingsProfileSaved);
  };

  const handleSavePassword = () => {
    if (!pwForm.current) { showToast(T.settingsPwCurrentRequired); return; }
    if (pwForm.next.length < 6) { showToast(T.settingsPwTooShort); return; }
    if (pwForm.next !== pwForm.confirm) { showToast(T.settingsPwMismatch); return; }
    setPwForm({ current: '', next: '', confirm: '' });
    setShowPassword(false);
    showToast(T.settingsPwSaved);
  };

  const handleSaveNotifs = () => {
    setShowNotifs(false);
    showToast(T.settingsNotifSaved);
  };

  const handleSelectLanguage = (optionName: string) => {
    if (optionName === 'English') {
      setLang('en');
      setShowLanguage(false);
      showToast(T.settingsLangChanged);
    } else if (optionName === 'Español') {
      setLang('es');
      setShowLanguage(false);
      showToast(T.settingsLangChanged);
    } else {
      showToast(T.settingsLangComingSoon);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const url = URL.createObjectURL(file);
    setUser({ ...user, imageUrl: url });
    showToast(T.settingsPhotoSaved);
  };

  const firstName = (user?.name || 'Usuario').split(' ')[0];
  const displayLang = lang === 'en' ? 'English' : 'Español';

  const profileFields = [
    { key: 'name',    label: T.settingsFullName,  type: 'text'  },
    { key: 'email',   label: T.settingsEmail,      type: 'email' },
    { key: 'phone',   label: T.settingsTelephone,  type: 'tel'   },
    { key: 'address', label: T.settingsAddress,    type: 'text'  },
  ];

  const pwFields = [
    { key: 'current', label: T.settingsCurrentPw },
    { key: 'next',    label: T.settingsNewPw      },
    { key: 'confirm', label: T.settingsConfirmPw  },
  ];

  const notifItems = [
    { key: 'appointments' as const, label: T.settingsNotifAppts,    sub: T.settingsNotifAptsSub    },
    { key: 'reminders'    as const, label: T.settingsNotifReminders, sub: T.settingsNotifRemindersSub },
    { key: 'promotions'   as const, label: T.settingsNotifPromo,     sub: T.settingsNotifPromoSub   },
    { key: 'updates'      as const, label: T.settingsNotifUpdates,   sub: T.settingsNotifUpdatesSub },
  ];

  const helpItems = [
    { q: T.settingsHelpQ1, a: T.settingsHelpA1 },
    { q: T.settingsHelpQ2, a: T.settingsHelpA2 },
    { q: T.settingsHelpQ3, a: T.settingsHelpA3 },
    { q: T.settingsHelpQ4, a: T.settingsHelpA4 },
  ];

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[500] bg-secondary text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-black flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Check className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      <div className="px-2 flex items-center gap-4">
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-2 p-3 bg-white dark:bg-darkCard rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary transition-colors">
            <ChevronLeft className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">{T.back}</span>
          </button>
        )}
        <div>
          <h2 className="text-2xl font-black text-secondary dark:text-slate-100">{T.settingsTitle}</h2>
          <p className="text-xs text-slate-400 font-medium">{T.settingsSub}</p>
        </div>
      </div>

      {/* Quick Profile */}
      <div className="bg-white dark:bg-darkCard p-8 rounded-5xl border border-white dark:border-slate-800 shadow-sm flex items-center gap-6 transition-colors">
        <div className="relative group shrink-0">
          <img
            src={user?.imageUrl || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b1f8?auto=format&fit=crop&q=80&w=200'}
            className="w-20 h-20 rounded-4xl object-cover shadow-xl border-4 border-crema dark:border-slate-700"
            alt="Profile"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-xl shadow-lg border-2 border-white dark:border-slate-800 hover:bg-secondary transition-colors"
            title={T.settingsEditProfile}
          >
            <Camera className="w-4 h-4" />
          </button>
          <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
        </div>
        <div>
          <h3 className="text-xl font-black text-secondary dark:text-slate-200 leading-none">{firstName}</h3>
          <p className="text-xs text-slate-400 font-bold mt-1">{user?.email}</p>
          <button onClick={() => setShowEditProfile(true)} className="text-primary text-[10px] font-black uppercase tracking-widest mt-2 hover:underline">
            {T.settingsEditProfile}
          </button>
        </div>
      </div>

      {/* Settings sections */}
      <div className="space-y-4">
        <SettingGroup title={T.settingsPreferences}>
          <SettingItem icon={<Moon className="text-purple-500" />} label={T.settingsDarkMode} toggle={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          <SettingItem icon={<Globe className="text-blue-500" />}  label={T.settingsLanguage} value={displayLang} onClick={() => setShowLanguage(true)} />
        </SettingGroup>

        <SettingGroup title={T.settingsSecurity}>
          <SettingItem icon={<Shield className="text-emerald-500" />} label={T.settingsPassword}      onClick={() => setShowPassword(true)} />
          <SettingItem icon={<Bell className="text-amber-500" />}     label={T.settingsNotifications} onClick={() => setShowNotifs(true)} />
        </SettingGroup>

        <SettingGroup title={T.settingsSupport}>
          <SettingItem icon={<HelpCircle className="text-slate-400" />} label={T.settingsHelp}   onClick={() => setShowHelp(true)} />
          <SettingItem icon={<LogOut className="text-rose-500" />}      label={T.settingsLogout} noChevron color="text-rose-500" onClick={onLogout} />
        </SettingGroup>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] text-slate-300 dark:text-slate-600 font-black uppercase tracking-[0.3em]">Pawell v1.0.6 · 2024</p>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <Modal title={T.settingsEditProfile} onClose={() => setShowEditProfile(false)}>
          <div className="space-y-4">
            {profileFields.map(({ key, label, type }) => (
              <div key={key} className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                <input
                  type={type}
                  value={(editForm as any)[key]}
                  onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                  className="w-full p-4 bg-crema dark:bg-slate-800 rounded-3xl font-bold text-secondary dark:text-slate-200 outline-none"
                />
              </div>
            ))}
            <button onClick={handleSaveProfile} className="w-full py-5 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
              {T.settingsSaveChanges}
            </button>
          </div>
        </Modal>
      )}

      {/* Change Password Modal */}
      {showPassword && (
        <Modal title={T.settingsChangePassword} onClose={() => setShowPassword(false)}>
          <div className="space-y-4">
            {pwFields.map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                <div className="flex items-center bg-crema dark:bg-slate-800 rounded-3xl px-5 gap-2">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type={showPwValue ? 'text' : 'password'}
                    value={(pwForm as any)[key]}
                    onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                    className="flex-1 py-4 bg-transparent font-bold text-secondary dark:text-slate-200 outline-none"
                    placeholder="••••••••"
                  />
                  {key === 'next' && (
                    <button type="button" onClick={() => setShowPwValue(v => !v)} className="text-slate-400">
                      {showPwValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button onClick={handleSavePassword} className="w-full py-5 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
              {T.settingsUpdatePw}
            </button>
          </div>
        </Modal>
      )}

      {/* Notifications Modal */}
      {showNotifs && (
        <Modal title={T.settingsNotifTitle} onClose={() => setShowNotifs(false)}>
          <div className="space-y-2">
            {notifItems.map(({ key, label, sub }) => (
              <button key={key} onClick={() => setNotifSettings(n => ({ ...n, [key]: !n[key] }))} className="w-full flex items-center justify-between p-5 bg-crema dark:bg-slate-800 rounded-3xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                <div className="text-left">
                  <p className="font-black text-secondary dark:text-slate-200 text-sm">{label}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</p>
                </div>
                <div className={`w-11 h-6 rounded-full p-1 transition-colors shrink-0 ml-4 ${notifSettings[key] ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-600'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${notifSettings[key] ? 'translate-x-5' : ''}`} />
                </div>
              </button>
            ))}
            <button onClick={handleSaveNotifs} className="w-full py-5 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 mt-2">
              {T.settingsSavePrefs}
            </button>
          </div>
        </Modal>
      )}

      {/* Language Modal */}
      {showLanguage && (
        <Modal title={T.settingsSelectLang} onClose={() => setShowLanguage(false)}>
          <div className="space-y-3">
            {(['Español', 'English', 'Português', 'Français'] as const).map(optionName => {
              const isActive = optionName === displayLang;
              const isAvailable = optionName === 'Español' || optionName === 'English';
              return (
                <button
                  key={optionName}
                  onClick={() => handleSelectLanguage(optionName)}
                  className={`w-full py-4 rounded-3xl font-black text-sm flex items-center justify-between px-5 transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : isAvailable ? 'bg-crema dark:bg-slate-800 text-secondary dark:text-slate-200 hover:bg-slate-100' : 'bg-crema dark:bg-slate-800 text-slate-300 dark:text-slate-600'}`}
                >
                  <span>{optionName}</span>
                  {isActive && <Check className="w-5 h-5" />}
                  {!isAvailable && !isActive && <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{T.settingsLangComingSoon}</span>}
                </button>
              );
            })}
          </div>
        </Modal>
      )}

      {/* Help Modal */}
      {showHelp && (
        <Modal title={T.settingsHelpTitle} onClose={() => setShowHelp(false)}>
          <div className="space-y-3">
            {helpItems.map(({ q, a }) => (
              <div key={q} className="bg-crema dark:bg-slate-800 p-5 rounded-4xl space-y-2">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="font-black text-secondary dark:text-slate-200 text-sm">{q}</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed pl-6">{a}</p>
              </div>
            ))}
            <div className="bg-primary/5 border border-primary/20 p-5 rounded-4xl flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="font-black text-secondary dark:text-slate-200 text-sm">{T.settingsNeedHelp}</p>
                <p className="text-xs text-slate-400 font-medium">{T.settingsHelpEmail}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const SettingGroup = ({ title, children }: any) => (
  <div className="space-y-2">
    <h4 className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest px-4">{title}</h4>
    <div className="bg-white dark:bg-darkCard rounded-5xl border border-white dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      {children}
    </div>
  </div>
);

const SettingItem = ({ icon, label, value, toggle, onToggle, onClick, noChevron, color = 'text-secondary dark:text-slate-200' }: any) => (
  <button
    onClick={onClick || (onToggle ? onToggle : undefined)}
    className="w-full px-6 py-5 flex items-center justify-between hover:bg-crema/50 dark:hover:bg-slate-700/50 transition-all border-b border-slate-50 dark:border-slate-800 last:border-none group"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <span className={`text-sm font-black ${color}`}>{label}</span>
    </div>
    <div className="flex items-center gap-3">
      {value && <span className="text-xs font-bold text-slate-400">{value}</span>}
      {onToggle !== undefined && (
        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${toggle ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${toggle ? 'translate-x-4' : ''}`} />
        </div>
      )}
      {!noChevron && onToggle === undefined && <ChevronRight className="w-4 h-4 text-slate-200" />}
    </div>
  </button>
);

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[200] bg-secondary/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
    <div className="bg-white dark:bg-darkCard w-full max-w-md rounded-t-5xl sm:rounded-5xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
      <div className="p-8 space-y-6 max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-secondary dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="p-2 bg-crema dark:bg-slate-700 rounded-xl text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  </div>
);
