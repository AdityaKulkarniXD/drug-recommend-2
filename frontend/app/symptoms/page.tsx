"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  AlertCircle, 
  HeartPulse, 
  Stethoscope,
  Loader2,
  User
} from "lucide-react";
import SymptomSearch from "@/components/features/symptom-search";
import { supabase } from "@/lib/supabase";

const steps = [
  { id: "symptoms", label: "Symptoms", icon: HeartPulse },
  { id: "diagnosis", label: "Potential Diagnosis", icon: Stethoscope },
  { id: "review", label: "Review", icon: CheckCircle },
];

export default function SymptomsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    symptoms: [],
    symptomsDetails: "",
  });
  
  const [predictedDisease, setPredictedDisease] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (currentStep === 2) {
      fetchUserProfile();
    }
  }, [currentStep]);

  const fetchUserProfile = async () => {
    setLoadingProfile(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setProfile(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setError("");
    
    try {
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
        await handlePredict();
      }
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
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
      setFormData({
        ...formData,
        symptoms: [...formData.symptoms, symptom],
      });
    }
  };

  const removeSymptom = (symptom) => {
    setFormData({
      ...formData,
      symptoms: formData.symptoms.filter((s) => s !== symptom),
    });
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
                onChange={(e) => setFormData({ ...formData, symptomsDetails: e.target.value })}
              />
            </div>
          </div>
        );

      case 1: // Potential Diagnosis
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
      
      case 2: // Review
        return (
          <div className="space-y-6">
            {loadingProfile ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading profile information...</span>
              </div>
            ) : (
              <>
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Patient Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium">{profile?.name || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Age</p>
                      <p className="font-medium">{profile?.age || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Gender</p>
                      <p className="font-medium">{profile?.gender || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Weight</p>
                      <p className="font-medium">{profile?.weight ? `${profile.weight} kg` : "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Height</p>
                      <p className="font-medium">{profile?.height ? `${profile.height} cm` : "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pregnancy Status</p>
                      <p className="font-medium">{profile?.pregnancy_status || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <h3 className="font-medium mb-4">Medical History</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-muted-foreground mb-2">Conditions</p>
                      <div className="flex flex-wrap gap-2">
                        {profile?.medical_history?.length > 0 ? (
                          profile.medical_history.map((condition: string) => (
                            <div
                              key={condition}
                              className="bg-secondary/10 text-secondary rounded-full px-3 py-1 text-sm"
                            >
                              {condition}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No medical conditions recorded</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-2">Current Medications</p>
                      <div className="flex flex-wrap gap-2">
                        {profile?.current_medications?.length > 0 ? (
                          profile.current_medications.map((medication: string) => (
                            <div
                              key={medication}
                              className="bg-accent/10 text-accent rounded-full px-3 py-1 text-sm"
                            >
                              {medication}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No current medications</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-2">Allergies</p>
                      <p className="text-sm">{profile?.allergies || "No allergies recorded"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <h3 className="font-medium mb-2">Current Symptoms</h3>
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
              </>
            )}
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
              disabled={isLoading || loadingProfile}
              className="rounded-full"
            >
              {(isLoading || loadingProfile) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentStep === steps.length - 1 ? "Get Recommendations" : "Next"}
              {!isLoading && !loadingProfile && currentStep !== steps.length - 1 && (
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