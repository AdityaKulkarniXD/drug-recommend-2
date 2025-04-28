"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  Pill,
  FileText,
  ShieldAlert,
  Clock,
  ThumbsUp,
  ExternalLink,
  Share2,
} from "lucide-react";
import Link from "next/link";

// Mock data for drug recommendations
const RECOMMENDATIONS = [
  {
    id: 1,
    name: "Ibuprofen",
    brand: "Advil, Motrin",
    type: "NSAID",
    dosage: "400-600mg every 6-8 hours",
    effectiveness: 0.85,
    safetyScore: 0.9,
    interactionRisk: "Low",
    sideEffects: ["Stomach upset", "Heartburn", "Dizziness", "Mild headache"],
    warnings: ["Not recommended for those with heart conditions", "Avoid alcohol"],
    description:
      "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) that reduces hormones that cause inflammation and pain in the body.",
  },
  {
    id: 2,
    name: "Acetaminophen",
    brand: "Tylenol",
    type: "Analgesic",
    dosage: "500-1000mg every 4-6 hours",
    effectiveness: 0.8,
    safetyScore: 0.95,
    interactionRisk: "Low",
    sideEffects: ["Nausea", "Headache", "Skin rash"],
    warnings: ["Avoid alcohol", "Do not exceed 4000mg per day"],
    description:
      "Acetaminophen is used to treat mild to moderate pain and reduce fever. It's gentler on the stomach than NSAIDs.",
  },
  {
    id: 3,
    name: "Naproxen",
    brand: "Aleve",
    type: "NSAID",
    dosage: "250-500mg twice daily",
    effectiveness: 0.82,
    safetyScore: 0.85,
    interactionRisk: "Medium",
    sideEffects: ["Stomach pain", "Heartburn", "Nausea", "Drowsiness"],
    warnings: ["Not recommended for those with kidney problems", "Avoid alcohol"],
    description:
      "Naproxen is a nonsteroidal anti-inflammatory drug (NSAID) that reduces inflammation and pain in the body, with longer-lasting effects than ibuprofen.",
  },
];

export default function RecommendationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedDrug, setSelectedDrug] = useState(RECOMMENDATIONS[0]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const renderLoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="h-8 w-2/3 bg-muted rounded animate-pulse"></div>
      <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-60 bg-muted rounded animate-pulse"></div>
        ))}
      </div>
      <div className="h-60 bg-muted rounded animate-pulse"></div>
    </div>
  );

  return (
    <div className="container max-w-5xl mx-auto py-32 px-4">
      {loading ? (
        renderLoadingSkeleton()
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Your Personalized Recommendations</h1>
            <p className="text-muted-foreground">
              Based on your symptoms and health profile, here are medication options that may help.
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border border-border flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-foreground">Important Note</h4>
              <p className="text-muted-foreground text-sm">
                These recommendations are for informational purposes only and should not replace professional medical advice.
                Always consult with a healthcare provider before starting any medication.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RECOMMENDATIONS.map((drug, index) => (
              <motion.div
                key={drug.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card
                  className={`h-full transition-all duration-300 hover:shadow-md cursor-pointer overflow-hidden ${
                    selectedDrug.id === drug.id
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                  onClick={() => setSelectedDrug(drug)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-1">
                      <CardTitle className="text-xl">{drug.name}</CardTitle>
                      <Badge
                        variant={
                          drug.safetyScore > 0.9
                            ? "outline"
                            : drug.safetyScore > 0.8
                            ? "secondary"
                            : "destructive"
                        }
                        className="ml-2"
                      >
                        {drug.interactionRisk} Risk
                      </Badge>
                    </div>
                    <CardDescription>{drug.brand}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground mb-1">Effectiveness</p>
                      <div className="h-2 w-full bg-muted rounded overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${drug.effectiveness * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground mb-1">Safety Score</p>
                      <div className="h-2 w-full bg-muted rounded overflow-hidden">
                        <div
                          className={`h-full ${
                            drug.safetyScore > 0.9
                              ? "bg-green-500"
                              : drug.safetyScore > 0.8
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${drug.safetyScore * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm">{drug.description.substring(0, 100)}...</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex items-center text-primary">
                      <Pill className="h-4 w-4 mr-1" />
                      <span className="text-xs">{drug.type}</span>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">{selectedDrug.name}</CardTitle>
                    <CardDescription>{selectedDrug.brand} • {selectedDrug.type}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="dosage">Dosage</TabsTrigger>
                    <TabsTrigger value="side-effects">Side Effects</TabsTrigger>
                    <TabsTrigger value="warnings">Warnings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <p>{selectedDrug.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <div className="flex items-center mb-2">
                          <ThumbsUp className="h-5 w-5 text-green-500 mr-2" />
                          <h3 className="font-medium">Effectiveness</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {Math.round(selectedDrug.effectiveness * 100)}% effective for your symptoms
                        </p>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <div className="flex items-center mb-2">
                          <ShieldAlert className="h-5 w-5 text-amber-500 mr-2" />
                          <h3 className="font-medium">Safety Profile</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedDrug.interactionRisk} risk of interactions with your health profile
                        </p>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <div className="flex items-center mb-2">
                          <Clock className="h-5 w-5 text-blue-500 mr-2" />
                          <h3 className="font-medium">Typical Onset</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Relief typically begins within 30-60 minutes
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 flex items-start gap-3 mt-4">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-foreground">
                          Why we recommend this for you
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          Based on your reported symptoms of headache and muscle pain, combined with your medical history and current medications, {selectedDrug.name} offers a good balance of effectiveness and safety for your specific situation.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="dosage" className="space-y-4">
                    <h3 className="text-lg font-medium mb-2">Recommended Dosage</h3>
                    <p>{selectedDrug.dosage}</p>
                    
                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                      <h4 className="font-medium mb-2">Administration Guidelines</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        <li>Take with food to reduce stomach upset</li>
                        <li>Swallow tablet whole; do not crush or chew</li>
                        <li>Stay well hydrated while taking this medication</li>
                        <li>Do not exceed the recommended dose</li>
                      </ul>
                    </div>
                    
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
                      <h4 className="font-medium mb-2">Personalized Dosing Note</h4>
                      <p className="text-sm text-muted-foreground">
                        Based on your weight and health conditions, start with the lower recommended dose and increase only if needed and tolerated well.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="side-effects" className="space-y-4">
                    <h3 className="text-lg font-medium mb-2">Potential Side Effects</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Common (may affect up to 1 in 10 people)</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                          {selectedDrug.sideEffects.map((effect, index) => (
                            <li key={index}>{effect}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Uncommon (may affect up to 1 in 100 people)</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                          <li>Skin rash or itching</li>
                          <li>Tinnitus (ringing in the ears)</li>
                          <li>Elevated blood pressure</li>
                        </ul>
                      </div>
                      
                      <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                        <h4 className="font-medium mb-2 text-destructive">Seek Medical Attention if</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                          <li>Severe stomach pain or black stools</li>
                          <li>Swelling of face, lips, or tongue</li>
                          <li>Difficulty breathing or wheezing</li>
                          <li>Unusual bruising or bleeding</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="warnings" className="space-y-4">
                    <h3 className="text-lg font-medium mb-2">Important Warnings</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                        <h4 className="font-medium mb-2">Do Not Take If</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                          {selectedDrug.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                          <li>You are allergic to {selectedDrug.name} or similar medications</li>
                          <li>You are in the third trimester of pregnancy</li>
                          <li>You have severe liver or kidney disease</li>
                        </ul>
                      </div>
                      
                      <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/20">
                        <h4 className="font-medium mb-2">Use With Caution If</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                          <li>You have a history of stomach ulcers or bleeding</li>
                          <li>You have high blood pressure</li>
                          <li>You have asthma</li>
                          <li>You are elderly (over 65 years)</li>
                        </ul>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <h4 className="font-medium mb-2">Drug Interactions</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {selectedDrug.name} may interact with the following:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                          <li>Blood thinners (e.g., warfarin, aspirin)</li>
                          <li>Some high blood pressure medications</li>
                          <li>Lithium</li>
                          <li>Certain antidepressants</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6 gap-4">
                <Button 
                  onClick={() => router.push("/interactions")}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Check Drug Interactions
                </Button>
                <Link href="https://medlineplus.gov/" target="_blank" rel="noopener">
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    Learn More
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              variant="outline"
              onClick={() => router.push("/symptoms")}
              className="rounded-full"
            >
              Back to Symptoms
            </Button>
            <Button
              onClick={() => router.push("/")}
              className="rounded-full"
            >
              Start a New Recommendation
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}