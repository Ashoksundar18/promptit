'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Camera, Save, Check } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export default function ProfileView() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setName(data.name || '');
        setImagePreview(data.image || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          image: imagePreview,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center h-[50vh]">
        <p className="text-text-muted">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-heading font-bold text-text-primary mb-1">Profile</h2>
        <p className="text-sm text-text-muted">Manage your personal information</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard>
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="relative w-24 h-24 rounded-full overflow-hidden bg-bg-tertiary border-2 border-glass-border mb-3 cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={36} className="text-text-muted" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-accent-blue hover:underline cursor-pointer"
            >
              Change photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/png,image/jpeg,image/gif,image/webp"
              onChange={handleImageChange}
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary px-1 flex items-center gap-1.5">
                <User size={12} />
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border focus:border-accent-blue/50 outline-none text-text-primary text-sm transition-all"
                placeholder="Your name"
              />
            </div>

            {/* Email (read-only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary px-1 flex items-center gap-1.5">
                <Mail size={12} />
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-muted text-sm cursor-not-allowed opacity-60"
              />
              <p className="text-[10px] text-text-muted px-1">Email cannot be changed</p>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8">
            <NeonButton
              onClick={handleSave}
              disabled={saving}
              className="w-full"
            >
              <span className="flex items-center justify-center gap-2">
                {saved ? (
                  <>
                    <Check size={16} />
                    Saved!
                  </>
                ) : saving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </span>
            </NeonButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
