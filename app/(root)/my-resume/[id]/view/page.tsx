import FinalResumeView from "@/components/layout/ResumeView";
import React from "react";
import { Metadata } from "next";
import {
  checkResumeOwnership,
  fetchResume,
} from "@/lib/actions/resume.actions";
import { currentUser } from "@clerk/nextjs/server";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const data = await fetchResume(params.id);
  const resume = JSON.parse(data || "{}");

  if (resume?.firstName === undefined && resume?.lastName === undefined) {
    return {
      title: "Skill Match AI - AI-Powered Professional Resume Creator",
      description:
        "Easily craft a standout professional resume with Skill Match’s AI-driven Resume Builder. With just a few clicks, generate a personalized and polished resume that highlights your skills and experience.",
    };
  }

  return {
    title: `${resume?.firstName}${resume?.firstName && " "}
    ${resume?.lastName}${resume?.lastName && " "}- SkillMatch AI Resume Builder`,
    description: `${resume?.firstName} ${resume?.lastName}'s Resume. Powered by Skill Match AI Resume Builder.`,
  };
}

const MyResume = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  const isResumeOwner = await checkResumeOwnership(user?.id || "", params.id);

  return <FinalResumeView params={params} isOwnerView={isResumeOwner} />;
};

export default MyResume;
