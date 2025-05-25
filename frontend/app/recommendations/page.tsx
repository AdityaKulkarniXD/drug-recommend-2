"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function RecommendationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [diseaseData, setDiseaseData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get the disease data from session storage
    const storedData = sessionStorage.getItem('diseaseData');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setDiseaseData(parsedData);
      } catch (err) {
        console.error("Error parsing disease data:", err);
        setError("Failed to load recommendation data");
      }
    } else {
      setError("No disease data found. Please complete the symptom assessment first.");
    }
    
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

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

  const renderErrorMessage = () => (
    <div className="py-12 text-center space-y-4">
      <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
      <h2 className="text-2xl font-bold">Error Loading Recommendations</h2>
      <p className="text-muted-foreground">{error}</p>
      <Button onClick={() => router.push('/symptoms')} className="mt-4">
        Go Back to Symptoms
      </Button>
    </div>
  );

  return (
    <div className="container max-w-5xl mx-auto py-32 px-4">
      {loading ? (
        renderLoadingSkeleton()
      ) : error ? (
        renderErrorMessage()
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
              Based on your symptoms, here are the recommendations for {diseaseData?.Disease || "your condition"}.
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

          <Card className="glass-card">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{diseaseData?.Disease || "Condition Analysis"}</CardTitle>
                  <CardDescription>Recommended care for your condition</CardDescription>
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
                  <TabsTrigger value="diet">Diet</TabsTrigger>
                  <TabsTrigger value="medication">Medication</TabsTrigger>
                  <TabsTrigger value="precaution">Precautions</TabsTrigger>
                  <TabsTrigger value="workout">Workout</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <p>{diseaseData?.Overview || "No overview information available."}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                      <div className="flex items-center mb-2">
                        <ThumbsUp className="h-5 w-5 text-green-500 mr-2" />
                        <h3 className="font-medium">Recovery</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Follow the recommendations carefully for best results
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                      <div className="flex items-center mb-2">
                        <ShieldAlert className="h-5 w-5 text-amber-500 mr-2" />
                        <h3 className="font-medium">Care Required</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Take precautions and follow the treatment plan
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                      <div className="flex items-center mb-2">
                        <Clock className="h-5 w-5 text-blue-500 mr-2" />
                        <h3 className="font-medium">Recovery Period</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Varies based on adherence to recommendations
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 flex items-start gap-3 mt-4">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground">
                        Why these recommendations are important
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Based on your reported symptoms and AI analysis, these recommendations provide a holistic approach to managing {diseaseData?.Disease || "your condition"}.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="diet" className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">Dietary Recommendations</h3>
                  <p>{diseaseData?.Diet || "No specific dietary recommendations available."}</p>
                  
                  {diseaseData?.Diet && (
                    <div className="bg-muted/50 p-4 rounded-lg border border-border mt-4">
                      <h4 className="font-medium mb-2">Why Diet Matters</h4>
                      <p className="text-sm text-muted-foreground">
                        Following the recommended diet can help reduce symptoms and speed up recovery. Proper nutrition supports your body's healing process.
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="medication" className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">Medication Details</h3>
                  <p>{diseaseData?.Medication || "No medication information available."}</p>
                  
                  {diseaseData?.Dosage && (
                    <div className="bg-muted/50 p-4 rounded-lg border border-border mt-4">
                      <h4 className="font-medium mb-2">Dosage Information</h4>
                      <p className="text-sm">{diseaseData.Dosage}</p>
                    </div>
                  )}
                  
                  {diseaseData?.Side_Effects && (
                    <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/20 mt-4">
                      <h4 className="font-medium mb-2">Possible Side Effects</h4>
                      <p className="text-sm text-muted-foreground">{diseaseData.Side_Effects}</p>
                    </div>
                  )}
                  
                  {diseaseData?.Warnings && (
                    <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20 mt-4">
                      <h4 className="font-medium mb-2 text-destructive">Warnings</h4>
                      <p className="text-sm text-muted-foreground">{diseaseData.Warnings}</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="precaution" className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">Precautions to Take</h3>
                  <p>{diseaseData?.Precaution || "No precaution information available."}</p>
                  
                  <div className="bg-muted/50 p-4 rounded-lg border border-border mt-4">
                    <h4 className="font-medium mb-2">Why Precautions Matter</h4>
                    <p className="text-sm text-muted-foreground">
                      Following these precautions can help prevent complications and speed up your recovery process.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="workout" className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">Exercise and Physical Activity</h3>
                  <p>{diseaseData?.Workout || "No workout information available."}</p>
                  
                  <div className="bg-muted/50 p-4 rounded-lg border border-border mt-4">
                    <h4 className="font-medium mb-2">Exercise Guidelines</h4>
                    <p className="text-sm text-muted-foreground">
                      Always start slow and listen to your body. Stop if you experience pain or significant discomfort.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6 gap-4">
              <Button 
                onClick={() => router.push("/symptoms")}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Back to Symptoms
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
