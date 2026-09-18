// src/components/practice/WorkspaceForm.tsx
import React, { useState, useEffect } from 'react';
import type { SubmissionData } from '../../types/domain';
import { Button } from '../common/Button';
import { Save, Send, HelpCircle, CheckCircle, AlertCircle, Eye, Edit3 } from 'lucide-react';
import { SubmissionSchema } from '../../lib/validator';

interface WorkspaceFormProps {
  initialData?: Partial<SubmissionData>;
  onSaveDraft: (data: SubmissionData) => Promise<void>;
  onSubmitSolution: (data: SubmissionData) => Promise<void>;
  isSubmitting: boolean;
}

export const WorkspaceForm: React.FC<WorkspaceFormProps> = ({
  initialData,
  onSaveDraft,
  onSubmitSolution,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<SubmissionData>({
    assumptions: initialData?.assumptions || '',
    coreClasses: initialData?.coreClasses || '',
    responsibilities: initialData?.responsibilities || '',
    relationships: initialData?.relationships || '',
    interfaces: initialData?.interfaces || '',
    tradeoffs: initialData?.tradeoffs || '',
    edgeCases: initialData?.edgeCases || '',
  });

  const [draftSaved, setDraftSaved] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [activeHelp, setActiveHelp] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Auto-save draft on change (debounced 1.5s)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        formData.assumptions ||
        formData.coreClasses ||
        formData.responsibilities ||
        formData.relationships ||
        formData.tradeoffs ||
        formData.edgeCases
      ) {
        onSaveDraft(formData);
        setDraftSaved(true);
        const hideTimer = setTimeout(() => setDraftSaved(false), 2500);
        return () => clearTimeout(hideTimer);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [formData, onSaveDraft]);

  const handleChange = (field: keyof SubmissionData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = SubmissionSchema.safeParse(formData);
    if (!result.success) {
      const formatted: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formatted[issue.path[0].toString()] = issue.message;
        }
      });
      setValidationErrors(formatted);
      return;
    }

    setValidationErrors({});
    onSubmitSolution(formData);
  };

  const sections: Array<{
    key: keyof SubmissionData;
    title: string;
    placeholder: string;
    guide: string;
    required: boolean;
  }> = [
    {
      key: 'assumptions',
      title: '1. Assumptions & System Boundaries',
      placeholder: 'e.g., Scale: 6 elevators, 50 floors. Single building deployment. Peak hour load profile at 9 AM...',
      guide: 'Specify system limits, capacity estimates, hardware/software boundaries, and non-functional assumptions.',
      required: true,
    },
    {
      key: 'coreClasses',
      title: '2. Core Classes & Domain Entities',
      placeholder: 'e.g., class Vehicle, class ParkingSpot, class Ticket, class Gate, class FeeCalculator...',
      guide: 'List key domain classes, structs, enums, and data models representing your system concepts.',
      required: true,
    },
    {
      key: 'responsibilities',
      title: '3. Class Responsibilities & SRP Boundaries',
      placeholder: 'e.g., SpotManager: tracks available spots per floor; FeeEngine: calculates checkout amount based on duration and spot type...',
      guide: 'Define what each class owns, stores, and executes according to the Single Responsibility Principle.',
      required: true,
    },
    {
      key: 'relationships',
      title: '4. Class Relationships & Structural Design Patterns',
      placeholder: 'e.g., Ticket HAS-A ParkingSpot. ElevatorController USES Strategy Pattern (LOOK/SCAN algorithm)...',
      guide: 'Describe inheritance hierarchies, compositions (HAS-A), associations, and structural design patterns.',
      required: true,
    },
    {
      key: 'interfaces',
      title: '5. Interfaces & Abstraction Contracts',
      placeholder: 'e.g., interface IPricingStrategy { calculateFee(ticket: Ticket): number }\ninterface IDispatchAlgorithm { nextElevator(req: Request): Elevator }',
      guide: 'Provide code-level interface contracts and abstract base classes used to decouple modules.',
      required: false,
    },
    {
      key: 'tradeoffs',
      title: '6. Design Rationale & SOLID Trade-offs',
      placeholder: 'e.g., Chose Strategy Pattern over switch-case for payment processors. Trade-off: slightly higher object overhead for extensibility...',
      guide: 'Explain why you chose this design architecture. Which SOLID principles guided your choices and what trade-offs were made?',
      required: true,
    },
    {
      key: 'edgeCases',
      title: '7. Edge Cases & Fault Tolerance',
      placeholder: 'e.g., Concurrency: Mutex lock on spot allocation during peak entries. Lost Ticket: Apply flat maximum penalty fee...',
      guide: 'Address race conditions, invalid states, unexpected inputs, power/network failures, and graceful error handling.',
      required: true,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Workspace Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111418] border border-[#262C34] p-3.5 rounded-lg">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-[#F3F4F6] font-mono">
            Architecture Specification
          </span>
          {draftSaved && (
            <span className="flex items-center space-x-1 text-[11px] font-mono text-[#35C98B] bg-[#35C98B]/10 px-2 py-0.5 rounded border border-[#35C98B]/30">
              <CheckCircle className="w-3 h-3" />
              <span>Draft Saved</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            leftIcon={previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          >
            {previewMode ? 'Edit Mode' : 'Preview Document'}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSaveDraft(formData)}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Draft
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            Submit for Design Review
          </Button>
        </div>
      </div>

      {/* Validation Errors Notice */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="bg-[#F07070]/10 border border-[#F07070]/30 p-3 rounded-lg text-[#F07070] text-xs flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 text-[#F07070] mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold block mb-0.5">Please resolve validation issues before submission:</span>
            <ul className="list-disc list-inside space-y-0.5 font-mono text-[11px]">
              {Object.entries(validationErrors).map(([key, msg]) => (
                <li key={key}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Preview Mode */}
      {previewMode ? (
        <div className="bg-[#111418] border border-[#262C34] rounded-lg p-6 space-y-6 text-xs text-[#F3F4F6]">
          <h2 className="text-sm font-bold font-mono text-[#8B9CF6] border-b border-[#262C34] pb-2">
            Structured Design Specification Preview
          </h2>

          {sections.map((section) => (
            <div key={section.key} className="space-y-1">
              <h3 className="font-semibold font-mono text-[#8B9CF6]">{section.title}</h3>
              <div className="bg-[#0B0D0F] border border-[#262C34] p-3 rounded font-mono text-[#F3F4F6] whitespace-pre-wrap leading-relaxed">
                {formData[section.key] || <span className="text-[#667085] italic">(Not specified)</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Edit Mode Sections */
        <div className="space-y-4">
          {sections.map((section) => {
            const errorMsg = validationErrors[section.key];
            const val = formData[section.key] || '';
            return (
              <div key={section.key} className="bg-[#111418] border border-[#262C34] rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 font-mono text-xs font-semibold text-[#F3F4F6]">
                    <span>{section.title}</span>
                    {section.required ? (
                      <span className="text-[#F07070] text-xs">*</span>
                    ) : (
                      <span className="text-[#667085] text-[11px] font-normal">(Optional)</span>
                    )}
                  </label>

                  <button
                    type="button"
                    onClick={() => setActiveHelp(activeHelp === section.key ? null : section.key)}
                    className="text-[#9CA3AF] hover:text-[#8B9CF6] text-[11px] flex items-center space-x-1 cursor-pointer font-mono"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Guide</span>
                  </button>
                </div>

                {activeHelp === section.key && (
                  <div className="bg-[#171B21] border border-[#262C34] p-2.5 rounded text-[11px] text-[#8B9CF6] font-mono leading-relaxed">
                    {section.guide}
                  </div>
                )}

                <textarea
                  rows={4}
                  value={val}
                  onChange={(e) => handleChange(section.key, e.target.value)}
                  placeholder={section.placeholder}
                  className={`w-full bg-[#0B0D0F] border rounded-md p-3 text-xs text-[#F3F4F6] placeholder-[#667085] focus:outline-none focus:ring-1 focus:ring-[#8B9CF6] transition-colors font-mono leading-relaxed ${
                    errorMsg ? 'border-[#F07070] focus:ring-[#F07070]' : 'border-[#262C34]'
                  }`}
                />

                <div className="flex items-center justify-between text-[11px] font-mono">
                  {errorMsg ? (
                    <span className="text-[#F07070]">{errorMsg}</span>
                  ) : (
                    <span className="text-[#667085]">Structured technical markdown</span>
                  )}
                  <span className="text-[#667085]">{val.length} chars</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Submit CTA Bar */}
      <div className="flex items-center justify-between bg-[#111418] border border-[#262C34] p-4 rounded-lg">
        <div className="text-xs text-[#9CA3AF] font-mono">
          Ensure all required sections are completed prior to submission.
        </div>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          leftIcon={<Send className="w-4 h-4" />}
        >
          Submit Solution for Design Review
        </Button>
      </div>
    </form>
  );
};
