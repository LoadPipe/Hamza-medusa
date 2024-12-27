"use client";
import React from "react";

const ProgressBar = ({
  currentStep,
  allSteps,
}: {
  currentStep: number;
  allSteps: string[];
}) => {
  const active = "bg-primary-blue border-0 border-gray-400 w-[10px] h-[10px]";
  const round = "border rounded-full mx-3";
  const line = "h-0.5 bg-gray-400 flex-1";
  const inactive = "w-[5px] h-[5px] bg-primary-gray";
  return (
    <main>
      <div className="flex items-center	self-stretch mt-10 w-full mb-2">
        {allSteps.map((step, i) => {
          return i === allSteps.length - 1 ? (
            <div key={i}>
              <div
                className={`${round} ${currentStep === i ? active : inactive}`}
              />
            </div>
          ) : (
            <div key={i} className="flex items-center	self-stretch w-full">
              <div
                className={`${round} ${currentStep === i ? active : inactive}`}
              />
              <div className={line} />
            </div>
          );
        })}
      </div>
      <div>
        <p className="text-center text-primary-blue mt-8">
          {allSteps[currentStep]}
        </p>
      </div>
    </main>
  );
};

export default ProgressBar;
