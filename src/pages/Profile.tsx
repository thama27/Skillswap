import React, { useState, useEffect, useCallback } from 'react';
import {
  Edit3,
  CheckCircle2,
  AlertCircle,
  Plus,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, updateProfile as updateProfileInDb, type DatabaseProfile } from '../services/profileService';
import { getUserSkills, addUserSkillByName, removeUserSkill, type UserSkillRecord } from '../services/skillService';
import DashboardLayout from '../components/DashboardLayout';
import ProfileCard from '../components/ProfileCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import SkillChip from '../components/SkillChip';
import type { UserSkill, Interest } from '../types';

export const Profile: React.FC = () => {
  const { user, updateProfile: updateLocalProfile } = useAuth();

  const [profileData, setProfileData] = useState<DatabaseProfile | null>(null);
  const [dbSkills, setDbSkills] = useState<UserSkillRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  // Edit modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEducation, setEditEducation] = useState('B.Tech IT');
  const [editBio, setEditBio] = useState('Interested in AI, software development and collaborative learning.');
  const [editProficiency, setEditProficiency] = useState('Intermediate');
  const [editAvailability, setEditAvailability] = useState('Weekends');
  const [editInterestsText, setEditInterestsText] = useState('');

  const [newSkillText, setNewSkillText] = useState('');
  const [skillLoading, setSkillLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setErrorMessage('');

    try {
      const isSupabaseUser = !user.id.startsWith('u_demo_') && !user.id.startsWith('u_thamayanthi');

      if (isSupabaseUser) {
        // Fetch from Supabase
        const [profRes, skillsRes] = await Promise.all([
          getProfile(user.id),
          getUserSkills(user.id),
        ]);

        if (profRes.error) {
          setErrorMessage(profRes.error);
        } else if (profRes.data) {
          setProfileData(profRes.data);
          setEditName(profRes.data.full_name || user.name || '');
          setEditProficiency(profRes.data.proficiency || 'Intermediate');
          setEditAvailability(profRes.data.availability?.[0] || 'Weekends');
          setEditInterestsText(profRes.data.interests?.join(', ') || '');
        }

        if (skillsRes.data) {
          setDbSkills(skillsRes.data);
        }
      } else {
        // Demo user fallback
        setEditName(user.name);
        setEditEducation(user.education || 'B.Tech IT');
        setEditBio(user.bio || '');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to load profile details.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    setErrorMessage('');

    try {
      const interestsArray = editInterestsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const availabilityArray = [editAvailability];

      const isSupabaseUser = !user.id.startsWith('u_demo_') && !user.id.startsWith('u_thamayanthi');

      if (isSupabaseUser) {
        const res = await updateProfileInDb(user.id, {
          full_name: editName.trim(),
          proficiency: editProficiency,
          availability: availabilityArray,
          interests: interestsArray,
        });

        if (res.error) {
          setErrorMessage(res.error);
          return;
        }

        if (res.data) {
          setProfileData(res.data);
        }
      }

      // Sync context user
      updateLocalProfile({
        name: editName.trim(),
        education: editEducation,
        bio: editBio,
      });

      setIsEditing(false);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
      await loadData();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save profile changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkillQuick = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkillText.trim();
    if (!trimmed || !user?.id) return;

    setSkillLoading(true);
    try {
      const isSupabaseUser = !user.id.startsWith('u_demo_') && !user.id.startsWith('u_thamayanthi');

      if (isSupabaseUser) {
        await addUserSkillByName(user.id, trimmed, 'teach', editProficiency);
        await loadData();
      } else {
        // demo fallback
        setDbSkills(prev => [
          ...prev,
          {
            id: `us_${Date.now()}`,
            user_id: user.id,
            skill_id: `s_${Date.now()}`,
            skill_type: 'teach',
            proficiency: editProficiency,
            created_at: new Date().toISOString(),
            skills: { id: `s_${Date.now()}`, name: trimmed, category: 'Technical Skills' }
          }
        ]);
      }
      setNewSkillText('');
    } catch (err) {
      console.error('Error adding skill:', err);
    } finally {
      setSkillLoading(false);
    }
  };

  const handleRemoveSkill = async (skillRecordId: string) => {
    if (!user?.id) return;
    try {
      const isSupabaseUser = !user.id.startsWith('u_demo_') && !user.id.startsWith('u_thamayanthi');
      if (isSupabaseUser) {
        await removeUserSkill(skillRecordId, user.id);
        await loadData();
      } else {
        setDbSkills(prev => prev.filter(s => s.id !== skillRecordId));
      }
    } catch (err) {
      console.error('Error removing skill:', err);
    }
  };

  // Convert dbSkills to UserSkill[] for ProfileCard
  const mappedUserSkills: UserSkill[] = dbSkills.map((d) => ({
    id: d.id,
    userId: d.user_id,
    skill: {
      id: d.skills?.id || d.skill_id,
      name: d.skills?.name || 'Skill',
      category: d.skills?.category || undefined,
    },
    proficiency: (d.proficiency as any) || 'Intermediate',
    verified: true,
  }));

  // Convert profile interests to Interest[]
  const rawInterests = profileData?.interests || ['Artificial Intelligence', 'Web Development'];
  const mappedInterests: Interest[] = rawInterests.map((name, i) => ({
    id: `int_${i}`,
    name,
  }));

  const activeProficiency = profileData?.proficiency || editProficiency || 'Intermediate';
  const activeAvailability = profileData?.availability?.join(', ') || editAvailability || 'Weekends';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Toast Alert */}
        {saveToast && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#11131A] border border-emerald-500/50 shadow-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile details updated successfully in Supabase!</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-white/[0.05]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                My Profile
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium">
                Student Profile
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Personal student details, verified technical skills, and availability schedules.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsEditing(true)}
            icon={<Edit3 className="w-3.5 h-3.5" />}
          >
            Edit Profile
          </Button>
        </div>

        {/* Loading State Indicator */}
        {isLoading ? (
          <div className="bg-[#11131A] border border-white/[0.08] rounded-2xl p-12 text-center shadow-card">
            <Loader2 className="w-6 h-6 text-brand-purple animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">Loading your profile from Supabase...</p>
          </div>
        ) : (
          user && (
            <ProfileCard
              user={{
                ...user,
                name: profileData?.full_name || user.name,
                email: profileData?.email || user.email,
              }}
              skills={mappedUserSkills}
              interests={mappedInterests}
              proficiency={activeProficiency}
              availability={activeAvailability}
              onEdit={() => setIsEditing(true)}
              isCurrentUser={true}
            />
          )
        )}

        {/* SKILLS MANAGEMENT CARD */}
        <div className="bg-[#11131A] border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Manage Active Skills
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Add skills to exchange or remove existing ones from your account
              </p>
            </div>
          </div>

          {/* Quick Add Input */}
          <form onSubmit={handleAddSkillQuick} className="flex gap-2">
            <input
              type="text"
              value={newSkillText}
              onChange={(e) => setNewSkillText(e.target.value)}
              placeholder="Add another skill (e.g. Next.js, Docker, Kubernetes)..."
              disabled={skillLoading}
              className="flex-1 bg-[#0D0F14] text-xs text-slate-100 rounded-xl border border-white/10 px-3.5 py-2.5 outline-none focus:border-brand-purple"
            />
            <Button
              type="submit"
              size="sm"
              isLoading={skillLoading}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add
            </Button>
          </form>

          {/* Interactive Chips with Remove Button */}
          <div className="flex flex-wrap gap-2 pt-2">
            {mappedUserSkills.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No skills added yet. Type a skill above to add it!</p>
            ) : (
              mappedUserSkills.map((s) => (
                <SkillChip
                  key={s.id}
                  name={s.skill.name}
                  proficiency={s.proficiency}
                  onRemove={() => handleRemoveSkill(s.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <Modal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          title="Edit Profile"
          subtitle="Update your student information and learning schedule"
          maxWidth="md"
          footer={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveProfile}
                isLoading={isSaving}
              >
                Save Changes
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="Full Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Interests & Focus Areas (comma separated)
              </label>
              <input
                type="text"
                value={editInterestsText}
                onChange={(e) => setEditInterestsText(e.target.value)}
                placeholder="e.g. Artificial Intelligence, Web Development, UI/UX"
                className="w-full bg-[#0D0F14] text-xs text-slate-100 rounded-xl border border-white/10 px-3 py-2.5 outline-none focus:border-brand-purple"
              />
            </div>

            <Input
              label="Degree / Education"
              value={editEducation}
              onChange={(e) => setEditEducation(e.target.value)}
              placeholder="e.g. B.Tech IT"
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Bio & Career Goal
              </label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                className="w-full bg-[#0D0F14] text-sm text-slate-100 rounded-xl border border-white/10 p-3 outline-none focus:border-brand-purple resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Proficiency Level
              </label>
              <select
                value={editProficiency}
                onChange={(e) => setEditProficiency(e.target.value)}
                className="w-full bg-[#0D0F14] text-sm text-slate-100 rounded-xl border border-white/10 p-2.5 outline-none focus:border-brand-purple"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Availability
              </label>
              <select
                value={editAvailability}
                onChange={(e) => setEditAvailability(e.target.value)}
                className="w-full bg-[#0D0F14] text-sm text-slate-100 rounded-xl border border-white/10 p-2.5 outline-none focus:border-brand-purple"
              >
                <option value="Weekends">Weekends</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Weekday Evenings">Weekday Evenings</option>
                <option value="Saturday & Sunday">Saturday & Sunday</option>
              </select>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default Profile;
