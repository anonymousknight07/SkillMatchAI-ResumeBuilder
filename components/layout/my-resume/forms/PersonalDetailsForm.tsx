"use client";

import { useFormContext } from "@/lib/context/FormProvider";
import React, { useState } from "react";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { updateResume } from "@/lib/actions/resume.actions";
import { useToast } from "@/components/ui/use-toast";
import { compressImage } from "@/lib/utils/imageCompression";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PersonalDetailsForm = ({ params }: { params: { id: string } }) => {
  const { formData, handleInputChange } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const { toast } = useToast();

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsCompressing(true);
        const compressedFile = await compressImage(file);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          handleInputChange({
            target: {
              name: "profilePhoto",
              value: reader.result,
            },
          });
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        toast({
          title: "Error processing image",
          description: "Failed to process the image. Please try again.",
          variant: "destructive",
          className: "bg-white",
        });
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const removePhoto = () => {
    handleInputChange({
      target: {
        name: "profilePhoto",
        value: "",
      },
    });
  };

  const onSave = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    const updates = {
      firstName: formData?.firstName,
      lastName: formData?.lastName,
      jobTitle: formData?.jobTitle,
      address: formData?.address,
      phone: formData?.phone,
      email: formData?.email,
      profilePhoto: formData?.profilePhoto,
      photoPosition: formData?.photoPosition,
    };

    const result = await updateResume({
      resumeId: params.id,
      updates: updates,
    });

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Personal details updated successfully.",
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
        Personal Details
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Get Started with the basic information
      </p>

      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div className="space-y-2">
            <label className="mt-2 text-slate-700 font-semibold">
              First Name:
            </label>
            <Input
              name="firstName"
              defaultValue={formData?.firstName}
              required
              onChange={handleInputChange}
              className="no-focus"
            />
          </div>
          <div className="space-y-2">
            <label className="mt-2 text-slate-700 font-semibold">
              Last Name:
            </label>
            <Input
              name="lastName"
              required
              onChange={handleInputChange}
              defaultValue={formData?.lastName}
              className="no-focus"
            />
          </div>
          <div className="col-span-2 space-y-2">
            <label className="mt-2 text-slate-700 font-semibold">
              Job Title:
            </label>
            <Input
              name="jobTitle"
              required
              onChange={handleInputChange}
              defaultValue={formData?.jobTitle}
              className="no-focus"
            />
          </div>
          <div className="col-span-2 space-y-2">
            <label className="mt-2 text-slate-700 font-semibold">
              Address:
            </label>
            <Input
              name="address"
              required
              defaultValue={formData?.address}
              onChange={handleInputChange}
              className="no-focus"
            />
          </div>
          <div className="space-y-2">
            <label className="mt-2 text-slate-700 font-semibold">Phone:</label>
            <Input
              name="phone"
              required
              defaultValue={formData?.phone}
              onChange={handleInputChange}
              className="no-focus"
            />
          </div>
          <div className="space-y-2">
            <label className="mt-2 text-slate-700 font-semibold">Email:</label>
            <Input
              name="email"
              required
              defaultValue={formData?.email}
              onChange={handleInputChange}
              className="no-focus"
            />
          </div>
          <div className="space-y-2">
            <label className="mt-2 text-slate-700 font-semibold">
              Profile Photo:
            </label>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="no-focus"
                  disabled={isCompressing}
                />
                {isCompressing && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
              </div>
              {formData?.profilePhoto && (
                <div className="relative">
                  <img
                    src={formData.profilePhoto}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">Images will be automatically compressed for optimal performance</p>
          </div>
          <div className="space-y-2">
            <label className="mt-2 text-slate-700 font-semibold">
              Photo Position:
            </label>
            <Select
              value={formData?.photoPosition || 'right'}
              onValueChange={(value) =>
                handleInputChange({
                  target: { name: "photoPosition", value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button
            type="submit"
            disabled={isLoading || isCompressing}
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
      </form>
    </div>
  );
};

export default PersonalDetailsForm;