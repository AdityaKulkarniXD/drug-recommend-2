"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  AlertCircle, 
  HeartPulse, 
  ClipboardList, 
  User, 
  PillIcon,
  Stethoscope,
  Loader2
} from "lucide-react";
import SymptomSearch from "@/components/features/symptom-search";

// Mock disease mapping based on symptoms
const SYMPTOM_TO_DISEASE = {
  "fatigue": ["Chronic Fatigue Syndrome", "Depression", "Anemia"],
  "weight_loss": ["Diabetes", "Hyperthyroidism", "Depression"],
  "restlessness": ["Anxiety Disorder", "ADHD", "Hyperthyroidism"],
  "lethargy": ["Depression", "Hypothyroidism", "Anemia"],
  "headache": ["Migraine", "Tension Headache", "Sinusitis"],
  "fever": ["Flu", "COVID-19", "Common Cold"],
  "cough": ["Bronchitis", "Upper Respiratory Infection", "COVID-19"],
  "sore_throat": ["Strep Throat", "Viral Pharyngitis", "Tonsillitis"],
  "runny_nose": ["Allergic Rhinitis", "Common Cold", "Sinusitis"],
  "nausea": ["Gastroenteritis", "Food Poisoning", "Migraine"],
  "chest_pain": ["Angina", "Acid Reflux", "Costochondritis"],
  "shortness_of_breath": ["Asthma", "Anxiety", "COVID-19"],
  "dizziness": ["Vertigo", "Low Blood Pressure", "Inner Ear Infection"],
  "abdominal_pain": ["Gastritis", "Appendicitis", "IBS"],
  "back_pain": ["Muscle Strain", "Herniated Disc", "Sciatica"],
  "joint_pain": ["Arthritis", "Gout", "Fibromyalgia"],
  "muscle_pain": ["Fibromyalgia", "Muscle Strain", "Polymyalgia"],
  "rash": ["Eczema", "Contact Dermatitis", "Psoriasis"],
};

const steps = [
  { id: "symptoms", label: "Symptoms", icon: HeartPulse },
  { id: "medical-history", label: "Medical History", icon: ClipboardList },
  { id: "personal-info", label: "Personal Info", icon: User },
  { id: "medications", label: "Current Medications", icon: PillIcon },
  { id: "diagnosis", label: "Potential Diagnosis", icon: Stethoscope },
  { id: "review", label: "Review", icon: CheckCircle },
];

export default function SymptomsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    symptoms: [],
    symptomsDetails: "",
    medicalConditions: [],
    allergies: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    currentMedications: [],
    pregnancyStatus: "not-pregnant",
    liverKidneyStatus: "normal"
  });
  
  const [predictedDisease, setPredictedDisease] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate potential diseases based on symptoms
  const getPotentialDiseases = () => {
    const diseases = new Set();
    formData.symptoms.forEach(symptom => {
      const relatedDiseases = SYMPTOM_TO_DISEASE[symptom] || [];
      relatedDiseases.forEach(disease => diseases.add(disease));
    });
    return Array.from(diseases);
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Make API call to backend
      const response = await fetch("http://127.0.0.1:8000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms: formData.symptoms }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setPredictedDisease(data.Disease);
      
      // Store the full response data in session storage to use in recommendations page
      sessionStorage.setItem('diseaseData', JSON.stringify(data));
      
    } catch (err) {
      console.error("Error predicting disease:", err);
      setError("Failed to predict disease. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === 0) {
        // Make prediction when moving from symptoms step
        await handlePredict();
      }
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Navigate to recommendations page with form data
      router.push("/recommendations");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const addSymptom = (symptom) => {
    if (!formData.symptoms.includes(symptom)) {
      updateFormData("symptoms", [...formData.symptoms, symptom]);
    }
  };

  const removeSymptom = (symptom) => {
    updateFormData(
      "symptoms",
      formData.symptoms.filter((s) => s !== symptom)
    );
  };

  const addMedicalCondition = (condition) => {
    if (!formData.medicalConditions.includes(condition)) {
      updateFormData("medicalConditions", [...formData.medicalConditions, condition]);
    }
  };

  const removeMedicalCondition = (condition) => {
    updateFormData(
      "medicalConditions",
      formData.medicalConditions.filter((c) => c !== condition)
    );
  };

  const addMedication = (medication) => {
    if (!formData.currentMedications.includes(medication)) {
      updateFormData("currentMedications", [...formData.currentMedications, medication]);
    }
  };

  const removeMedication = (medication) => {
    updateFormData(
      "currentMedications",
      formData.currentMedications.filter((m) => m !== medication)
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Symptoms
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base">What symptoms are you experiencing?</Label>
              <SymptomSearch onSymptomSelect={addSymptom} />
              
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.symptoms.map((symptom) => (
                  <div
                    key={symptom}
                    className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center"
                  >
                    {symptom}
                    <button
                      onClick={() => removeSymptom(symptom)}
                      className="ml-2 text-primary/70 hover:text-primary"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="symptomsDetails" className="text-base">
                Please describe your symptoms in detail
              </Label>
              <Textarea
                id="symptomsDetails"
                placeholder="Include when they started, severity, and any triggers..."
                className="mt-1"
                value={formData.symptomsDetails}
                onChange={(e) => updateFormData("symptomsDetails", e.target.value)}
              />
            </div>
          </div>
        );
      
      case 1: // Medical History
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base">
                Do you have any pre-existing medical conditions?
              </Label>
              <SymptomSearch
                onSymptomSelect={addMedicalCondition}
                placeholder="Search medical conditions..."
              />
              
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.medicalConditions.map((condition) => (
                  <div
                    key={condition}
                    className="bg-secondary/10 text-secondary rounded-full px-3 py-1 text-sm flex items-center"
                  >
                    {condition}
                    <button
                      onClick={() => removeMedicalCondition(condition)}
                      className="ml-2 text-secondary/70 hover:text-secondary"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="allergies" className="text-base">
                Do you have any known allergies to medications?
              </Label>
              <Textarea
                id="allergies"
                placeholder="List any medication allergies..."
                className="mt-1"
                value={formData.allergies}
                onChange={(e) => updateFormData("allergies", e.target.value)}
              />
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pregnancyStatus" className="text-base">
                  Pregnancy Status
                </Label>
                <Select 
                  value={formData.pregnancyStatus}
                  onValueChange={(value) => updateFormData("pregnancyStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-pregnant">Not Pregnant</SelectItem>
                    <SelectItem value="pregnant">Pregnant</SelectItem>
                    <SelectItem value="breastfeeding">Breastfeeding</SelectItem>
                    <SelectItem value="planning">Planning Pregnancy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="liverKidneyStatus" className="text-base">
                  Liver/Kidney Function
                </Label>
                <Select
                  value={formData.liverKidneyStatus}
                  onValueChange={(value) => updateFormData("liverKidneyStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="mild-impairment">Mild Impairment</SelectItem>
                    <SelectItem value="moderate-impairment">Moderate Impairment</SelectItem>
                    <SelectItem value="severe-impairment">Severe Impairment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      
      case 2: // Personal Info
        return (
          <div className="space-y-6">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-base">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => updateFormData("age", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">Gender</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => updateFormData("gender", value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-base">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter your weight"
                  value={formData.weight}
                  onChange={(e) => updateFormData("weight", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height" className="text-base">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Enter your height"
                  value={formData.height}
                  onChange={(e) => updateFormData("height", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base mb-2 block">Lifestyle Factors</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="smoking" />
                  <Label htmlFor="smoking">Smoking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="alcohol" />
                  <Label htmlFor="alcohol">Regular alcohol consumption</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="exercise" />
                  <Label htmlFor="exercise">Regular exercise</Label>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3: // Current Medications
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base">
                Are you currently taking any medications?
              </Label>
              <SymptomSearch
                onSymptomSelect={addMedication}
                placeholder="Search medications..."
              />
              
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.currentMedications.map((medication) => (
                  <div
                    key={medication}
                    className="bg-accent/10 text-accent rounded-full px-3 py-1 text-sm flex items-center"
                  >
                    {medication}
                    <button
                      onClick={() => removeMedication(medication)}
                      className="ml-2 text-accent/70 hover:text-accent"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">
                    Why is this information important?
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Some medications can interact with each other, causing adverse effects or reducing effectiveness. 
                    This information helps us provide safer recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Over-the-counter medications and supplements</Label>
              <Textarea
                placeholder="List any vitamins, supplements, or over-the-counter medications you take regularly..."
              />
            </div>
          </div>
        );

      case 4: // Potential Diagnosis
        return (
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Analyzing your symptoms...</span>
              </div>
            ) : error ? (
              <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <h4 className="font-medium text-destructive">Error</h4>
                    <p className="text-muted-foreground text-sm">{error}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={handlePredict}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <h3 className="font-medium mb-4">Potential Condition Based on Your Symptoms</h3>
                  {predictedDisease ? (
                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h4 className="font-medium text-primary mb-2">{predictedDisease}</h4>
                      <p className="text-sm text-muted-foreground">
                        This condition is suggested based on your reported symptoms. Please continue to the next steps to get detailed recommendations.
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No specific condition identified. Please provide more symptoms for better analysis.
                    </p>
                  )}
                </div>

                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Important Notice</h4>
                      <p className="text-muted-foreground text-sm">
                        This is a potential condition based on your symptoms. This is not a diagnosis. 
                        Always consult with a qualified healthcare provider for proper medical diagnosis and treatment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 5: // Review
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <h3 className="font-medium mb-2">Symptoms</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.symptoms.length > 0 ? (
                  formData.symptoms.map((symptom) => (
                    <div
                      key={symptom}
                      className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                    >
                      {symptom}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No symptoms selected</p>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{formData.symptomsDetails || "No details provided"}</p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <h3 className="font-medium mb-2">Potential Condition</h3>
              {predictedDisease ? (
                <div className="bg-secondary/10 text-secondary rounded-full px-3 py-1 text-sm inline-block">
                  {predictedDisease}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No condition identified</p>
              )}
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <h3 className="font-medium mb-2">Medical History</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.medicalConditions.length > 0 ? (
                  formData.medicalConditions.map((condition) => (
                    <div
                      key={condition}
                      className="bg-secondary/10 text-secondary rounded-full px-3 py-1 text-sm"
                    >
                      {condition}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No medical conditions</p>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Allergies:</strong> {formData.allergies || "None reported"}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <p><strong>Pregnancy Status:</strong> {formData.pregnancyStatus}</p>
                <p><strong>Liver/Kidney Function:</strong> {formData.liverKidneyStatus}</p>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <h3 className="font-medium mb-2">Personal Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Age:</strong> {formData.age || "Not provided"}</p>
                <p><strong>Gender:</strong> {formData.gender || "Not provided"}</p>
                <p><strong>Weight:</strong> {formData.weight ? `${formData.weight} kg` : "Not provided"}</p>
                <p><strong>Height:</strong> {formData.height ? `${formData.height} cm` : "Not provided"}</p>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <h3 className="font-medium mb-2">Current Medications</h3>
              <div className="flex flex-wrap gap-2">
                {formData.currentMedications.length > 0 ? (
                  formData.currentMedications.map((medication) => (
                    <div
                      key={medication}
                      className="bg-accent/10 text-accent rounded-full px-3 py-1 text-sm"
                    >
                      {medication}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No current medications</p>
                )}
              </div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">
                  Ready for your personalized recommendations
                </h4>
                <p className="text-muted-foreground text-sm">
                  Our AI will analyze your information to provide safe, personalized medication recommendations based on trusted medical sources.
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-32 px-4">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Personalized Medication Recommendation</h1>
          <p className="text-muted-foreground">
            Please provide your information to receive tailored medication suggestions for your symptoms.
          </p>
        </div>

        <div className="hidden md:flex justify-between mb-8">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < steps.length - 1
                    ? "flex-1"
                    : ""
                }`}
              >
                <div
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    index <= currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  <StepIcon className="h-5 w-5" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      index < currentStep
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                )}
                <span
                  className={`hidden lg:block text-sm ${
                    index <= currentStep
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="md:hidden mb-4">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-2 h-2 mx-1 rounded-full ${
                      index === currentStep
                        ? "bg-primary"
                        : index < currentStep
                        ? "bg-primary/50"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm font-medium">{steps[currentStep].label}</p>
            </div>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{steps[currentStep].label}</CardTitle>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="rounded-full"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="rounded-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentStep === steps.length - 1 ? "Get Recommendations" : "Next"}
              {!isLoading && currentStep !== steps.length - 1 && (
                <ChevronRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
          <p>
            <strong>Privacy Note:</strong> Your health information is private and securely processed. We do not store or share your personal health data.
          </p>
        </div>
      </div>
    </div>
  );
}