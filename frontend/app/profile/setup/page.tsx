"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import SymptomSearch from "@/components/features/symptom-search";

export default function ProfileSetupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    medical_history: [],
    current_medications: [],
    allergies: "",
    pregnancy_status: "not-pregnant",
    liver_kidney_status: "normal"
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          ...profile,
        });

      if (error) throw error;

      toast({
        title: "Profile created successfully",
        description: "You can now start using MedSage!",
      });

      router.push("/symptoms");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMedicalCondition = (condition: string) => {
    if (!profile.medical_history.includes(condition)) {
      setProfile({
        ...profile,
        medical_history: [...profile.medical_history, condition],
      });
    }
  };

  const removeMedicalCondition = (condition: string) => {
    setProfile({
      ...profile,
      medical_history: profile.medical_history.filter((c) => c !== condition),
    });
  };

  const addMedication = (medication: string) => {
    if (!profile.current_medications.includes(medication)) {
      setProfile({
        ...profile,
        current_medications: [...profile.current_medications, medication],
      });
    }
  };

  const removeMedication = (medication: string) => {
    setProfile({
      ...profile,
      current_medications: profile.current_medications.filter((m) => m !== medication),
    });
  };

  return (
    <div className="container max-w-2xl mx-auto py-32 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Set Up Your Profile</CardTitle>
            <CardDescription>
              Please provide your information to receive personalized recommendations.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSave}>
            <CardContent className="space-y-6">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup
                  value={profile.gender}
                  onValueChange={(value) => setProfile({ ...profile, gender: value })}
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

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Medical History</Label>
                <SymptomSearch
                  onSymptomSelect={addMedicalCondition}
                  placeholder="Search medical conditions..."
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.medical_history.map((condition) => (
                    <div
                      key={condition}
                      className="bg-secondary/10 text-secondary rounded-full px-3 py-1 text-sm flex items-center"
                    >
                      {condition}
                      <button
                        type="button"
                        onClick={() => removeMedicalCondition(condition)}
                        className="ml-2 text-secondary/70 hover:text-secondary"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Medications</Label>
                <SymptomSearch
                  onSymptomSelect={addMedication}
                  placeholder="Search medications..."
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.current_medications.map((medication) => (
                    <div
                      key={medication}
                      className="bg-accent/10 text-accent rounded-full px-3 py-1 text-sm flex items-center"
                    >
                      {medication}
                      <button
                        type="button"
                        onClick={() => removeMedication(medication)}
                        className="ml-2 text-accent/70 hover:text-accent"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Textarea
                  id="allergies"
                  value={profile.allergies}
                  onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                  placeholder="List any known allergies..."
                />
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pregnancy_status">Pregnancy Status</Label>
                  <Select
                    value={profile.pregnancy_status}
                    onValueChange={(value) => setProfile({ ...profile, pregnancy_status: value })}
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
                  <Label htmlFor="liver_kidney_status">Liver/Kidney Function</Label>
                  <Select
                    value={profile.liver_kidney_status}
                    onValueChange={(value) => setProfile({ ...profile, liver_kidney_status: value })}
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
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Complete Profile Setup"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}