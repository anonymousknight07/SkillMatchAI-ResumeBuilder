"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addSocialProfilesToResume } from "@/lib/actions/resume.actions";
import { useFormContext } from "@/lib/context/FormProvider";
import {
  Github,
  Linkedin,
  Twitter,
  Globe,
  Loader2,
  Minus,
  Plus,
  Code2,
} from "lucide-react";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const platformOptions = [
  { value: "github", label: "GitHub", icon: Github },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "twitter", label: "Twitter", icon: Twitter },
  { value: "leetcode", label: "LeetCode", icon: Code2 },
  { value: "codechef", label: "CodeChef", icon: Code2 },
  { value: "hackerrank", label: "HackerRank", icon: Code2 },
  { value: "portfolio", label: "Portfolio", icon: Globe },
];

const SocialProfilesForm = ({ params }: { params: { id: string } }) => {
  const { formData, handleInputChange } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const [profilesList, setProfilesList] = useState(
    formData?.socialProfiles?.length > 0
      ? formData.socialProfiles
      : [
          {
            platform: "",
            url: "",
          },
        ]
  );
  const { toast } = useToast();

  const handleChange = (index: number, name: string, value: any) => {
    const newProfilesList = [...profilesList];
    newProfilesList[index][name] = value;
    setProfilesList(newProfilesList);

    handleInputChange({
      target: {
        name: "socialProfiles",
        value: newProfilesList,
      },
    });
  };

  const AddNewProfile = () => {
    const newProfilesList = [
      ...profilesList,
      {
        platform: "",
        url: "",
      },
    ];
    setProfilesList(newProfilesList);

    handleInputChange({
      target: {
        name: "socialProfiles",
        value: newProfilesList,
      },
    });
  };

  const RemoveProfile = () => {
    const newProfilesList = profilesList.slice(0, -1);
    setProfilesList(newProfilesList);

    handleInputChange({
      target: {
        name: "socialProfiles",
        value: newProfilesList,
      },
    });
  };

  const onSave = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    const result = await addSocialProfilesToResume(
      params.id,
      formData.socialProfiles
    );

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Social profiles updated successfully.",
        className: "bg-white",
      });
    } else {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
        className: "bg-white",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary-700 border-t-4 bg-white">
      <h2 className="text-lg font-semibold leading-none tracking-tight">
        Social & Coding Profiles
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Add your social media and coding profile links
      </p>

      <div className="mt-5">
        {profilesList.map((profile: any, index: number) => {
          const selectedPlatform = platformOptions.find(
            (p) => p.value === profile.platform
          );
          const Icon = selectedPlatform?.icon || Globe;

          return (
            <div
              key={index}
              className="border p-3 my-5 rounded-lg space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-slate-700 font-semibold">
                    Platform:
                  </label>
                  <Select
                    value={profile.platform}
                    onValueChange={(value) =>
                      handleChange(index, "platform", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platformOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="flex items-center gap-2"
                        >
                          <option.icon className="h-4 w-4" />
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-700 font-semibold">URL:</label>
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-gray-500" />
                    <Input
                      name="url"
                      defaultValue={profile.url}
                      onChange={(e) =>
                        handleChange(index, "url", e.target.value)
                      }
                      className="no-focus"
                      placeholder="Enter profile URL"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2 justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={AddNewProfile}
            className="text-primary"
          >
            <Plus className="size-4 mr-2" /> Add Profile
          </Button>
          <Button
            variant="outline"
            onClick={RemoveProfile}
            className="text-primary"
          >
            <Minus className="size-4 mr-2" /> Remove
          </Button>
        </div>
        <Button
          disabled={isLoading}
          onClick={onSave}
          className="bg-primary-700 hover:bg-primary-800 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" /> &nbsp; Saving
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  );
};

export default SocialProfilesForm;