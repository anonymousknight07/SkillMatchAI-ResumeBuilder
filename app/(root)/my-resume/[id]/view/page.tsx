import FinalResumeView from "@/components/layout/ResumeView";
import React from "react";
import { Metadata } from "next";
import {
  checkResumeOwnership,
  fetchResume as fetchResumeFromLib,
} from "@/lib/actions/resume.actions";
import { currentUser } from "@clerk/nextjs/server";

// Helper function to safely parse JSON
function safeParseJSON(jsonString: string | null | undefined) {
  try {
    return jsonString ? JSON.parse(jsonString) : {};
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return {};
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const data = await fetchResumeFromLib(params.id);

  if (!data) {
    return {
      title: "Skill Match AI - AI-Powered Professional Resume Creator",
      description:
        "Easily craft a standout professional resume with Skill Match’s AI-driven Resume Builder. With just a few clicks, generate a personalized and polished resume that highlights your skills and experience.",
    };
  }

  const resume = safeParseJSON(data);

  if (!resume?.firstName && !resume?.lastName) {
    return {
      title: "Skill Match AI - AI-Powered Professional Resume Creator",
      description:
        "Easily craft a standout professional resume with Skill Match’s AI-driven Resume Builder. With just a few clicks, generate a personalized and polished resume that highlights your skills and experience.",
    };
  }

  return {
    title: `${resume.firstName || ""}${resume.firstName && " "}${resume.lastName || ""} - SkillMatch AI Resume Builder`,
    description: `${resume.firstName || ""} ${resume.lastName || ""}'s Resume. Powered by Skill Match AI Resume Builder.`,
  };
}

const MyResume = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!user) {
    console.error("Error: User is not logged in.");
    return <div>Error: User not found.</div>;
  }

  const isResumeOwner = await checkResumeOwnership(user.id, params.id);

  return <FinalResumeView params={params} isOwnerView={isResumeOwner} />;
};

export default MyResume;

// Updated fetchResume function
export async function fetchResume(id: string): Promise<string | null> {
  if (!id) {
    console.error("Error: Resume ID is not provided.");
    return null;
  }

  try {
    const response = await fetch(`/api/resumes/${id}`); // Adjust to your API endpoint
    if (!response.ok) {
      console.error(`Failed to fetch resume with id ${id}. Status: ${response.status}`);
      return null;
    }
    return await response.text(); // Assuming the API returns a JSON string
  } catch (error) {
    console.error(`Error fetching resume: ${(error as Error).message}`);
    return null;
  }
}
