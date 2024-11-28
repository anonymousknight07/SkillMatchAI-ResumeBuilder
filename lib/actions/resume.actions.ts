"use server";

import { connectToDB } from "../mongoose";
import Resume from "../models/resume.model";
import Experience from "../models/experience.model";
import Education from "../models/education.model";
import Skill from "../models/skill.model";
import CustomSection from "../models/custom-section.model";
import SocialProfile from "../models/social-profile.model";
import { revalidatePath } from "next/cache";

export async function fetchUserResumes(userId: string) {
  try {
    await connectToDB();

    const resumes = await Resume.find({ userId })
      .sort({ updatedAt: -1 })
      .populate([
        "experience",
        "education",
        "skills",
        "customSections",
        "socialProfiles",
      ])
      .lean();

    if (!resumes) {
      return JSON.stringify([]);
    }

    return JSON.stringify(resumes);
  } catch (error: any) {
    console.error("Error fetching user resumes:", error);
    return JSON.stringify([]);
  }
}

export async function fetchResume(resumeId: string) {
  try {
    await connectToDB();

    const resume = await Resume.findOne({ resumeId })
      .populate([
        "experience",
        "education",
        "skills",
        "customSections",
        "socialProfiles",
      ])
      .lean();

    if (!resume) {
      throw new Error("Resume not found");
    }

    return JSON.stringify(resume);
  } catch (error: any) {
    console.error("Error fetching resume:", error);
    throw new Error(`Failed to fetch resume: ${error.message}`);
  }
}

export async function createResume({
  resumeId,
  userId,
  title,
}: {
  resumeId: string;
  userId: string;
  title: string;
}) {
  try {
    await connectToDB();

    const newResume = new Resume({
      resumeId,
      userId,
      title,
    });

    const savedResume = await newResume.save();
    
    return { success: true, data: JSON.stringify(savedResume) };
  } catch (error: any) {
    console.error("Error creating resume:", error);
    return { success: false, error: error?.message };
  }
}

export async function updateResume({
  resumeId,
  updates,
}: {
  resumeId: string;
  updates: any;
}) {
  try {
    await connectToDB();

    const resume = await Resume.findOne({ resumeId });

    if (!resume) {
      throw new Error("Resume not found");
    }

    Object.assign(resume, updates);
    await resume.save();

    return { success: true, data: JSON.stringify(resume) };
  } catch (error: any) {
    console.error("Error updating resume:", error);
    return { success: false, error: error?.message };
  }
}

export async function deleteResume(resumeId: string, path: string) {
  try {
    await connectToDB();

    const resume = await Resume.findOne({ resumeId });

    if (!resume) {
      throw new Error("Resume not found");
    }

    // Delete associated data
    await Experience.deleteMany({ _id: { $in: resume.experience } });
    await Education.deleteMany({ _id: { $in: resume.education } });
    await Skill.deleteMany({ _id: { $in: resume.skills } });
    await CustomSection.deleteMany({ _id: { $in: resume.customSections } });
    await SocialProfile.deleteMany({ _id: { $in: resume.socialProfiles } });

    await Resume.findOneAndDelete({ resumeId });

    revalidatePath(path);

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting resume:", error);
    return { success: false, error: error?.message };
  }
}

export async function addExperienceToResume(
  resumeId: string,
  experienceDataArray: any
) {
  try {
    await connectToDB();

    const resume = await Resume.findOne({ resumeId });

    if (!resume) {
      throw new Error("Resume not found");
    }

    const savedExperiences = await Promise.all(
      experienceDataArray.map(async (expData: any) => {
        if (expData._id) {
          const existingExp = await Experience.findById(expData._id);
          if (existingExp) {
            return await Experience.findByIdAndUpdate(expData._id, expData, {
              new: true,
            });
          }
        }
        const newExp = new Experience(expData);
        return await newExp.save();
      })
    );

    const expIds = savedExperiences.map((exp) => exp._id);
    resume.experience = expIds;

    const updatedResume = await resume.save();

    return { success: true, data: JSON.stringify(updatedResume) };
  } catch (error: any) {
    console.error("Error adding experience to resume:", error);
    return { success: false, error: error?.message };
  }
}

export async function addEducationToResume(
  resumeId: string,
  educationDataArray: any
) {
  try {
    await connectToDB();

    const resume = await Resume.findOne({ resumeId });

    if (!resume) {
      throw new Error("Resume not found");
    }

    const savedEducations = await Promise.all(
      educationDataArray.map(async (eduData: any) => {
        if (eduData._id) {
          const existingEdu = await Education.findById(eduData._id);
          if (existingEdu) {
            return await Education.findByIdAndUpdate(eduData._id, eduData, {
              new: true,
            });
          }
        }
        const newEdu = new Education(eduData);
        return await newEdu.save();
      })
    );

    const eduIds = savedEducations.map((edu) => edu._id);
    resume.education = eduIds;

    const updatedResume = await resume.save();

    return { success: true, data: JSON.stringify(updatedResume) };
  } catch (error: any) {
    console.error("Error adding education to resume:", error);
    return { success: false, error: error?.message };
  }
}

export async function addSkillToResume(resumeId: string, skillDataArray: any) {
  try {
    await connectToDB();

    const resume = await Resume.findOne({ resumeId });

    if (!resume) {
      throw new Error("Resume not found");
    }

    const savedSkills = await Promise.all(
      skillDataArray.map(async (skillData: any) => {
        if (skillData._id) {
          const existingSkill = await Skill.findById(skillData._id);
          if (existingSkill) {
            return await Skill.findByIdAndUpdate(skillData._id, skillData, {
              new: true,
            });
          }
        }
        const newSkill = new Skill(skillData);
        return await newSkill.save();
      })
    );

    const skillIds = savedSkills.map((skill) => skill._id);
    resume.skills = skillIds;

    const updatedResume = await resume.save();

    return { success: true, data: JSON.stringify(updatedResume) };
  } catch (error: any) {
    console.error("Error adding skills to resume:", error);
    return { success: false, error: error?.message };
  }
}

export async function addCustomSectionToResume(
  resumeId: string,
  customSectionDataArray: any
) {
  try {
    await connectToDB();

    const resume = await Resume.findOne({ resumeId });

    if (!resume) {
      throw new Error("Resume not found");
    }

    const savedCustomSections = await Promise.all(
      customSectionDataArray.map(async (sectionData: any) => {
        if (sectionData._id) {
          const existingSection = await CustomSection.findById(sectionData._id);
          if (existingSection) {
            return await CustomSection.findByIdAndUpdate(
              sectionData._id,
              sectionData,
              { new: true }
            );
          }
        }
        const newSection = new CustomSection(sectionData);
        return await newSection.save();
      })
    );

    const sectionIds = savedCustomSections.map((section) => section._id);
    resume.customSections = sectionIds;

    const updatedResume = await resume.save();

    return { success: true, data: JSON.stringify(updatedResume) };
  } catch (error: any) {
    console.error("Error adding custom sections to resume:", error);
    return { success: false, error: error?.message };
  }
}

export async function addSocialProfilesToResume(
  resumeId: string,
  socialProfileDataArray: any
) {
  try {
    await connectToDB();

    const resume = await Resume.findOne({ resumeId });

    if (!resume) {
      throw new Error("Resume not found");
    }

    const savedProfiles = await Promise.all(
      socialProfileDataArray.map(async (profileData: any) => {
        if (profileData._id) {
          const existingProfile = await SocialProfile.findById(profileData._id);
          if (existingProfile) {
            return await SocialProfile.findByIdAndUpdate(
              profileData._id,
              profileData,
              { new: true }
            );
          }
        }
        const newProfile = new SocialProfile(profileData);
        return await newProfile.save();
      })
    );

    const profileIds = savedProfiles.map((profile) => profile._id);
    resume.socialProfiles = profileIds;

    const updatedResume = await resume.save();

    return { success: true, data: JSON.stringify(updatedResume) };
  } catch (error: any) {
    console.error("Error adding social profiles to resume:", error);
    return { success: false, error: error?.message };
  }
}

export async function checkResumeOwnership(
  userId: string,
  resumeId: string
): Promise<boolean> {
  try {
    await connectToDB();

    const resume = await Resume.findOne({ resumeId, userId }).lean();
    return !!resume;
  } catch (error) {
    console.error("Error checking resume ownership:", error);
    return false;
  }
}