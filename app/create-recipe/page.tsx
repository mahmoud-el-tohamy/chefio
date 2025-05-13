"use client";
import React, { useState } from 'react';
import Step1 from '@/components/create-recipe/Step1';
import Step2 from '@/components/create-recipe/Step2';
import SuccessModal from '@/components/create-recipe/SuccessModal';

export default function CreateRecipePage() {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNext = () => {
    if (step === 2) {
      setShowSuccess(true);
    } else {
      setStep(step + 1);
    }
  };
  const handleBack = () => setStep(step - 1);
  const handleCancel = () => window.location.href = '/home';
  const handleSuccessClose = () => {
    setShowSuccess(false);
    window.location.href = '/home';
  };

  return (
    <div>
      {step === 1 && <Step1 onNext={handleNext} onCancel={handleCancel} />}
      {step === 2 && <Step2 onNext={handleNext} onBack={handleBack} onCancel={handleCancel} />}
      {showSuccess && <SuccessModal onClose={handleSuccessClose} />}
    </div>
  );
} 