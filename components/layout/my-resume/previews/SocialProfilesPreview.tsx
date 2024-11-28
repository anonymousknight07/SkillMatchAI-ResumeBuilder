import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import {
  Github,
  Linkedin,
  Twitter,
  Globe,
  Code2,
} from "lucide-react";
import React from "react";

const platformIcons: { [key: string]: any } = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  leetcode: Code2,
  codechef: Code2,
  hackerrank: Code2,
  portfolio: Globe,
};

const SocialProfilesPreview = () => {
  const { formData } = useFormContext();

  if (!formData?.socialProfiles?.length) return null;

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{
          color: formData?.themeColor || themeColors[0],
        }}
      >
        Links
      </h2>
      <hr
        style={{
          borderColor: formData?.themeColor || themeColors[0],
        }}
      />
      <div className="flex flex-wrap gap-4 justify-center my-4">
        {formData?.socialProfiles.map((profile: any, index: number) => {
          const Icon = platformIcons[profile.platform] || Globe;
          return (
            <a
              key={index}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs hover:text-primary-700 transition-colors"
              style={{
                color: formData?.themeColor || themeColors[0],
              }}
            >
              <Icon className="h-4 w-4" />
              {profile.url}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SocialProfilesPreview;