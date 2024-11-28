import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

const CustomSectionsPreview = () => {
  const { formData } = useFormContext();

  if (!formData?.customSections?.length) return null;

  return (
    <div className="my-6">
      {formData?.customSections.map((section: any, index: number) => (
        <div key={index}>
          <h2
            className="text-center font-bold text-sm mb-2"
            style={{
              color: formData?.themeColor || themeColors[0],
            }}
          >
            {section.title}
          </h2>
          <hr
            style={{
              borderColor: formData?.themeColor || themeColors[0],
            }}
          />
          <div
            className="text-xs my-4 form-preview"
            dangerouslySetInnerHTML={{
              __html: section.content,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default CustomSectionsPreview;