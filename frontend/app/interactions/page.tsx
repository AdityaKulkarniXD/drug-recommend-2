"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertTriangle, Search, Plus, X, Info, ShieldCheck, ExternalLink, AlertCircle, RefreshCw } from "lucide-react";
import SymptomSearch from "@/components/features/symptom-search";

// Mock data for drug interactions
const INTERACTION_LEVELS = {
  SEVERE: {
    label: "Severe",
    description: "Avoid combination - serious interaction possible",
    color: "bg-red-500",
    textColor: "text-red-500",
    icon: AlertTriangle,
  },
  MODERATE: {
    label: "Moderate",
    description: "Use with caution - monitor closely",
    color: "bg-amber-500",
    textColor: "text-amber-500",
    icon: AlertCircle,
  },
  MILD: {
    label: "Mild",
    description: "Minor interaction - usually not significant",
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    icon: Info,
  },
  NONE: {
    label: "None",
    description: "No known interaction",
    color: "bg-green-500",
    textColor: "text-green-500",
    icon: ShieldCheck,
  },
};

const mockInteractions = {
  "Ibuprofen,Aspirin": {
    level: INTERACTION_LEVELS.MODERATE,
    details:
      "Taking ibuprofen with aspirin may increase the risk of gastrointestinal bleeding and may reduce aspirin's heart benefits. If possible, avoid concurrent use or separate administration times.",
  },
  "Ibuprofen,Lisinopril": {
    level: INTERACTION_LEVELS.MODERATE,
    details:
      "Ibuprofen may decrease the effectiveness of lisinopril in controlling blood pressure. This combination may also increase the risk of kidney problems.",
  },
  "Warfarin,Aspirin": {
    level: INTERACTION_LEVELS.SEVERE,
    details:
      "This combination significantly increases the risk of bleeding. Avoid unless specifically directed by your healthcare provider.",
  },
  "Simvastatin,Grapefruit Juice": {
    level: INTERACTION_LEVELS.MODERATE,
    details:
      "Grapefruit juice can increase the level of simvastatin in your blood, increasing the risk of side effects including muscle breakdown.",
  },
  "Warfarin,Vitamin K": {
    level: INTERACTION_LEVELS.SEVERE,
    details:
      "Vitamin K directly counteracts the anticoagulant effect of warfarin, potentially reducing its effectiveness in preventing blood clots.",
  },
  "Metformin,Alcohol": {
    level: INTERACTION_LEVELS.MODERATE,
    details:
      "Combining metformin with alcohol can increase the risk of low blood sugar (hypoglycemia) and lactic acidosis, a rare but serious side effect.",
  },
  "Levothyroxine,Calcium Supplements": {
    level: INTERACTION_LEVELS.MILD,
    details:
      "Calcium supplements can reduce the absorption of levothyroxine. Take these medications at least 4 hours apart.",
  },
};

export default function InteractionsPage() {
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [interactions, setInteractions] = useState(null);
  const [checked, setChecked] = useState(false);

  const handleAddDrug = (drug) => {
    if (!selectedDrugs.includes(drug)) {
      setSelectedDrugs([...selectedDrugs, drug]);
    }
  };

  const handleRemoveDrug = (drug) => {
    setSelectedDrugs(selectedDrugs.filter((d) => d !== drug));
    setInteractions(null);
    setChecked(false);
  };

  const checkInteractions = () => {
    if (selectedDrugs.length < 2) return;

    // Create all possible pairs of drugs
    const results = [];
    for (let i = 0; i < selectedDrugs.length; i++) {
      for (let j = i + 1; j < selectedDrugs.length; j++) {
        const pair = [selectedDrugs[i], selectedDrugs[j]].sort().join(",");
        const interaction = mockInteractions[pair];
        
        if (interaction) {
          results.push({
            drugs: [selectedDrugs[i], selectedDrugs[j]],
            ...interaction,
          });
        } else {
          results.push({
            drugs: [selectedDrugs[i], selectedDrugs[j]],
            level: INTERACTION_LEVELS.NONE,
            details: "No known interaction between these medications.",
          });
        }
      }
    }

    setInteractions(results);
    setChecked(true);
  };

  const resetAll = () => {
    setSelectedDrugs([]);
    setInteractions(null);
    setChecked(false);
  };

  return (
    <div className="container max-w-4xl mx-auto py-32 px-4">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Drug Interaction Checker</h1>
          <p className="text-muted-foreground">
            Check potential interactions between medications, supplements, and foods.
          </p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Enter Medications</CardTitle>
            <CardDescription>
              Include prescription medications, over-the-counter drugs, and supplements.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <SymptomSearch
                onSymptomSelect={handleAddDrug}
                placeholder="Search for medications, supplements, or foods..."
              />
              
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedDrugs.map((drug) => (
                  <div
                    key={drug}
                    className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center"
                  >
                    {drug}
                    <button
                      onClick={() => handleRemoveDrug(drug)}
                      className="ml-2 text-primary/70 hover:text-primary"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {selectedDrugs.length === 0 && (
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Search and add at least two medications, supplements, or foods to check for potential interactions.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={checkInteractions}
                disabled={selectedDrugs.length < 2}
                className="flex-1"
              >
                <Search className="mr-2 h-4 w-4" />
                Check Interactions
              </Button>
              {selectedDrugs.length > 0 && (
                <Button variant="outline" onClick={resetAll} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {checked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Interaction Results</CardTitle>
                <CardDescription>
                  {interactions.length} potential interactions checked
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {interactions.length === 0 ? (
                  <div className="text-center py-6">
                    <ShieldCheck className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Interactions Found</h3>
                    <p className="text-muted-foreground">
                      No known interactions were found between these medications.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {interactions.map((interaction, index) => {
                      const InteractionIcon = interaction.level.icon;
                      return (
                        <div
                          key={index}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className={`flex items-center p-4 border-b ${interaction.level !== INTERACTION_LEVELS.NONE ? 'bg-muted/50' : 'bg-green-500/10'}`}>
                            <div className={`w-3 h-3 rounded-full ${interaction.level.color} mr-3`}></div>
                            <div className="flex-1">
                              <div className="font-medium flex items-center">
                                <InteractionIcon className={`h-4 w-4 ${interaction.level.textColor} mr-2`} />
                                <span>{interaction.level.label} Interaction</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {interaction.drugs[0]} + {interaction.drugs[1]}
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-sm">{interaction.details}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="bg-muted/50 p-4 rounded-lg border border-border mt-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground">Important Note</h4>
                      <p className="text-muted-foreground text-sm">
                        This tool is for informational purposes only and should not replace professional medical advice.
                        Always consult with your healthcare provider or pharmacist about potential drug interactions.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4 border-t pt-6">
                <Button
                  variant="outline"
                  onClick={checkInteractions}
                  className="w-full sm:w-auto"
                >
                  Recheck Interactions
                </Button>
                <a 
                  href="https://www.drugs.com/drug_interactions.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="secondary" className="w-full">
                    Learn More
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Understanding Interaction Levels</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.values(INTERACTION_LEVELS).map((level) => (
                <div key={level.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                  <div>
                    <span className="font-medium">{level.label}:</span> {level.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}