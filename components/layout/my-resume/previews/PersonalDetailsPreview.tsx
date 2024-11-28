import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

function PersonalDetailsPreview() {
  const { formData } = useFormContext();
  
  const renderPhoto = () => {
    if (!formData?.profilePhoto) return null;
    return (
      <img
        src={formData.profilePhoto}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover border-2"
        style={{ borderColor: formData?.themeColor || themeColors[0] }}
      />
    );
  };

  const photoPosition = formData?.photoPosition || 'right';
  
  return (
    <div className="flex items-center gap-4">
      {photoPosition === 'left' && renderPhoto()}
      <div className={`flex-1 ${photoPosition === 'center' ? 'text-center' : ''}`}>
        <h2
          className="font-bold text-xl"
          style={{
            color: formData?.themeColor || themeColors[0],
          }}
        >
          {formData?.firstName} {formData?.lastName}
        </h2>

        <h2 className="text-sm font-medium">
          {formData?.jobTitle}
        </h2>

        <h2
          className="font-normal text-xs"
          style={{
            color: formData?.themeColor || themeColors[0],
          }}
        >
          {formData?.address}
        </h2>

        <div className="flex justify-between">
          <h2
            className="font-normal text-xs"
            style={{
              color: formData?.themeColor || themeColors[0],
            }}
          >
            {formData?.phone}
          </h2>

          <h2
            className="font-normal text-xs"
            style={{
              color: formData?.themeColor || themeColors[0],
            }}
          >
            {formData?.email}
          </h2>
        </div>
      </div>
      {(photoPosition === 'right' || photoPosition === 'center') && renderPhoto()}
      
      <hr
        className="border-[1.5px] my-2 mb-5"
        style={{
          borderColor: formData?.themeColor || themeColors[0],
        }}
      />
    </div>
  );
}

export default PersonalDetailsPreview;