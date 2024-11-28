"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addCustomSectionToResume } from "@/lib/actions/resume.actions";
import { useFormContext } from "@/lib/context/FormProvider";
import { Loader2, Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import RichTextEditor from "@/components/common/RichTextEditor";

const CustomSectionsForm = ({ params }: { params: { id: string } }) => {
  const { formData, handleInputChange } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const [customSectionsList, setCustomSectionsList] = useState(
    formData?.customSections?.length > 0
      ? formData.customSections
      : [
          {
            title: "",
            content: "",
          },
        ]
  );
  const { toast } = useToast();

  const handleChange = (index: number, name: string, value: any) => {
    const newSectionsList = [...customSectionsList];
    newSectionsList[index][name] = value;
    setCustomSectionsList(newSectionsList);

    handleInputChange({
      target: {
        name: "customSections",
        value: newSectionsList,
      },
    });
  };

  const AddNewSection = () => {
    const newSectionsList = [
      ...customSectionsList,
      {
        title: "",
        content: "",
      },
    ];
    setCustomSectionsList(newSectionsList);

    handleInputChange({
      target: {
        name: "customSections",
        value: newSectionsList,
      },
    });
  };

  const RemoveSection = () => {
    const newSectionsList = customSectionsList.slice(0, -1);
    setCustomSectionsList(newSectionsList);

    handleInputChange({
      target: {
        name: "customSections",
        value: newSectionsList,
      },
    });
  };

  const onSave = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    const result = await addCustomSectionToResume(
      params.id,
      formData.customSections
    );

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Custom sections updated successfully.",
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
        Custom Sections
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Add additional sections to your resume
      </p>

      <div className="mt-5">
        {customSectionsList.map((section: any, index: number) => (
          <div
            key={index}
            className="border p-3 my-5 rounded-lg space-y-4"
          >
            <div className="space-y-2">
              <label className="text-slate-700 font-semibold">
                Section Title:
              </label>
              <Input
                name="title"
                defaultValue={section.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                className="no-focus"
                placeholder="e.g., Certifications, Awards, Publications"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-700 font-semibold">Content:</label>
              <RichTextEditor
                defaultValue={section.content}
                onRichTextEditorChange={(value) =>
                  handleChange(index, "content", value.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2 justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={AddNewSection}
            className="text-primary"
          >
            <Plus className="size-4 mr-2" /> Add Section
          </Button>
          <Button
            variant="outline"
            onClick={RemoveSection}
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

export default CustomSectionsForm;