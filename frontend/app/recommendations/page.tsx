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
  Loader2,
  Download
} from "lucide-react";
import Link from "next/link";

export default function RecommendationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [diseaseData, setDiseaseData] = useState(null);
  const [error, setError] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  // Print functionality
  const handlePrint = () => {
    const printContent = generatePrintableContent();
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Medical Recommendations Report - ${diseaseData?.Disease || 'Health Report'}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #007bff;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #007bff;
              margin: 0;
              font-size: 28px;
            }
            .header p {
              color: #666;
              margin: 10px 0 0 0;
            }
            .section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .section h2 {
              color: #007bff;
              border-left: 4px solid #007bff;
              padding-left: 15px;
              margin-bottom: 15px;
              font-size: 20px;
            }
            .section h3 {
              color: #333;
              margin-bottom: 10px;
              font-size: 16px;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 5px;
              padding: 15px;
              margin: 20px 0;
            }
            .important {
              background-color: #e3f2fd;
              border: 1px solid #90caf9;
              border-radius: 5px;
              padding: 15px;
              margin: 15px 0;
            }
            .danger {
              background-color: #ffebee;
              border: 1px solid #f8bbd9;
              border-radius: 5px;
              padding: 15px;
              margin: 15px 0;
            }
            ul {
              padding-left: 20px;
            }
            li {
              margin-bottom: 5px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body { print-color-adjust: exact; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Generate PDF and share functionality
  const handleShare = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Create a temporary element for PDF generation
      const printContent = generatePrintableContent();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = printContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.lineHeight = '1.6';
      tempDiv.style.color = '#333';
      tempDiv.style.maxWidth = '800px';
      tempDiv.style.padding = '20px';
      
      document.body.appendChild(tempDiv);

      // Use html2canvas and jsPDF (you'll need to install these)
      // For now, we'll use the Web Share API or fallback to download
      
      if (navigator.share) {
        // Web Share API (works on mobile and some desktop browsers)
        await navigator.share({
          title: `Medical Recommendations - ${diseaseData?.Disease || 'Health Report'}`,
          text: `Medical recommendations report for ${diseaseData?.Disease || 'health condition'}`,
          url: window.location.href,
        });
      } else {
        // Fallback: Create a shareable text content
        const shareableContent = generateShareableText();
        
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareableContent);
          alert('Report content copied to clipboard! You can now paste and share it.');
        } else {
          // Create a downloadable text file
          const blob = new Blob([shareableContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `medical-recommendations-${diseaseData?.Disease?.replace(/\s+/g, '-').toLowerCase() || 'report'}.txt`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }
      
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Unable to share. Please try the print option instead.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Generate printable HTML content
  const generatePrintableContent = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const parseDietList = (dietString) => {
      try {
        const parsed = JSON.parse(dietString?.replace(/'/g, '"') || '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return dietString ? [dietString] : [];
      }
    };

    const parseMedicationList = (medString) => {
      try {
        const parsed = JSON.parse(medString?.replace(/'/g, '"') || '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return medString ? [medString] : [];
      }
    };

    return `
      <div class="header">
        <h1>Medical Recommendations Report</h1>
        <p><strong>Condition:</strong> ${diseaseData?.Disease || 'Health Assessment'}</p>
        <p><strong>Generated on:</strong> ${currentDate}</p>
      </div>

      <div class="warning">
        <strong>⚠️ Important Medical Disclaimer:</strong><br>
        This report is for informational purposes only and should not replace professional medical advice. 
        Always consult with a healthcare provider before starting any medication or treatment plan.
      </div>

      <div class="section">
        <h2>📋 Overview</h2>
        <p>${diseaseData?.Overview || 'No overview information available.'}</p>
      </div>

      <div class="section">
        <h2>🍎 Dietary Recommendations</h2>
        ${parseDietList(diseaseData?.Diet).length > 0 ? `
          <ul>
            ${parseDietList(diseaseData.Diet).map(item => `<li>${item}</li>`).join('')}
          </ul>
        ` : '<p>No specific dietary recommendations available.</p>'}
        <div class="important">
          <strong>Why Diet Matters:</strong> Following the recommended diet can help reduce symptoms and speed up recovery. 
          Proper nutrition supports your body's healing process.
        </div>
      </div>

      <div class="section">
        <h2>💊 Medication Information</h2>
        ${parseMedicationList(diseaseData?.Medication).length > 0 ? `
          <h3>Recommended Medications:</h3>
          <ul>
            ${parseMedicationList(diseaseData.Medication).map(med => `<li>${med}</li>`).join('')}
          </ul>
        ` : '<p>No specific medications listed.</p>'}
        
        ${diseaseData?.Dosage ? `
          <h3>Dosage Information:</h3>
          <div class="important">
            <p>${diseaseData.Dosage}</p>
          </div>
        ` : ''}
        
        ${diseaseData?.Side_Effects ? `
          <h3>Possible Side Effects:</h3>
          <div class="warning">
            <p>${diseaseData.Side_Effects}</p>
          </div>
        ` : ''}
        
        ${diseaseData?.Warnings ? `
          <h3>⚠️ Important Warnings:</h3>
          <div class="danger">
            <p>${diseaseData.Warnings}</p>
          </div>
        ` : ''}
      </div>

      <div class="section">
        <h2>🛡️ Precautions</h2>
        ${Array.isArray(diseaseData?.Precautions) && diseaseData.Precautions.length > 0 ? `
          <ul>
            ${diseaseData.Precautions.map(item => `<li>${item}</li>`).join('')}
          </ul>
        ` : '<p>No specific precautions listed.</p>'}
        <div class="important">
          <strong>Why Precautions Matter:</strong> Following these precautions can help prevent complications 
          and speed up your recovery process.
        </div>
      </div>

      <div class="section">
        <h2>🏃‍♂️ Exercise & Physical Activity</h2>
        ${diseaseData?.Workout ? `
          <ul>
            ${diseaseData.Workout.split(';').map(item => `<li>${item.trim()}</li>`).join('')}
          </ul>
        ` : '<p>No specific workout recommendations available.</p>'}
        <div class="important">
          <strong>Exercise Guidelines:</strong> Always start slow and listen to your body. 
          Stop if you experience pain or significant discomfort.
        </div>
      </div>

      <div class="footer">
        <p><strong>This report was generated by AI-powered health assessment system</strong></p>
        <p>For additional information, consult: <a href="https://medlineplus.gov/" target="_blank">MedlinePlus.gov</a></p>
        <p><em>Generated on ${currentDate}</em></p>
      </div>
    `;
  };

  // Generate shareable text content
  const generateShareableText = () => {
    const currentDate = new Date().toLocaleDateString();
    
    const parseDietList = (dietString) => {
      try {
        const parsed = JSON.parse(dietString?.replace(/'/g, '"') || '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return dietString ? [dietString] : [];
      }
    };

    const parseMedicationList = (medString) => {
      try {
        const parsed = JSON.parse(medString?.replace(/'/g, '"') || '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return medString ? [medString] : [];
      }
    };

    return `
MEDICAL RECOMMENDATIONS REPORT
===============================

Condition: ${diseaseData?.Disease || 'Health Assessment'}
Generated: ${currentDate}

⚠️ IMPORTANT DISCLAIMER:
This report is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider before starting any medication or treatment plan.

OVERVIEW:
${diseaseData?.Overview || 'No overview information available.'}

DIETARY RECOMMENDATIONS:
${parseDietList(diseaseData?.Diet).length > 0 ? 
  parseDietList(diseaseData.Diet).map((item, idx) => `${idx + 1}. ${item}`).join('\n') : 
  'No specific dietary recommendations available.'}

MEDICATION INFORMATION:
${parseMedicationList(diseaseData?.Medication).length > 0 ? 
  parseMedicationList(diseaseData.Medication).map((med, idx) => `${idx + 1}. ${med}`).join('\n') : 
  'No specific medications listed.'}

${diseaseData?.Dosage ? `DOSAGE: ${diseaseData.Dosage}` : ''}
${diseaseData?.Side_Effects ? `SIDE EFFECTS: ${diseaseData.Side_Effects}` : ''}
${diseaseData?.Warnings ? `⚠️ WARNINGS: ${diseaseData.Warnings}` : ''}

PRECAUTIONS:
${Array.isArray(diseaseData?.Precautions) && diseaseData.Precautions.length > 0 ? 
  diseaseData.Precautions.map((item, idx) => `${idx + 1}. ${item}`).join('\n') : 
  'No specific precautions listed.'}

EXERCISE & PHYSICAL ACTIVITY:
${diseaseData?.Workout ? 
  diseaseData.Workout.split(';').map((item, idx) => `${idx + 1}. ${item.trim()}`).join('\n') : 
  'No specific workout recommendations available.'}

---
This report was generated by AI-powered health assessment system
For additional information, visit: https://medlineplus.gov/
Generated on ${currentDate}
    `.trim();
  };

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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={handlePrint}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={handleShare}
                    disabled={isGeneratingPDF}
                  >
                    {isGeneratingPDF ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Share2 className="h-4 w-4 mr-2" />
                    )}
                    {isGeneratingPDF ? 'Preparing...' : 'Share'}
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

  {(() => {
    let dietList = [];

    try {
      // Parse stringified array (remove extra quotes if needed)
      const parsed = JSON.parse(
        diseaseData?.Diet
          ?.replace(/'/g, '"') // Convert single quotes to double quotes
      );

      if (Array.isArray(parsed)) {
        dietList = parsed;
      }
    } catch (e) {
      // Fallback: show as raw string if parsing fails
      return <p className="text-muted-foreground">{diseaseData?.Diet}</p>;
    }

    return (
      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
        {dietList.map((item, index) => (
          <li key={index} className="capitalize">{item}</li>
        ))}
      </ul>
    );
  })()}

  {diseaseData?.Diet && (
    <div className="bg-muted/50 p-4 rounded-lg border border-border mt-4">
      <h4 className="font-medium mb-2">Why Diet Matters</h4>
      <p className="text-sm text-muted-foreground">
        Following the recommended diet can help reduce symptoms and speed up recovery.
        Proper nutrition supports your body's healing process.
      </p>
    </div>
  )}
</TabsContent>

                <TabsContent value="medication" className="space-y-4">
  <h3 className="text-lg font-medium mb-2">Medication Details</h3>

  {(() => {
    let medications = [];

    try {
      const parsed = JSON.parse(
        diseaseData?.Medication?.replace(/'/g, '"')
      );
      if (Array.isArray(parsed)) {
        medications = parsed;
      }
    } catch (e) {
      // fallback if parsing fails
      return <p className="text-muted-foreground">{diseaseData?.Medication}</p>;
    }

    return (
      <ul className="list-disc list-inside text-muted-foreground space-y-1">
        {medications.map((med, idx) => (
          <li key={idx}>{med}</li>
        ))}
      </ul>
    );
  })()}

  {diseaseData?.Dosage && (
    <div className="bg-muted/50 p-4 rounded-lg border border-border mt-4">
      <h4 className="font-medium mb-2">Dosage Information</h4>
      <p className="text-sm whitespace-pre-wrap text-muted-foreground">
        {diseaseData.Dosage}
      </p>
    </div>
  )}

  {diseaseData?.Side_Effects && (
    <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/20 mt-4">
      <h4 className="font-medium mb-2">Possible Side Effects</h4>
      <p className="text-sm whitespace-pre-wrap text-muted-foreground">
        {diseaseData.Side_Effects}
      </p>
    </div>
  )}

  {diseaseData?.Warnings && (
    <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20 mt-4">
      <h4 className="font-medium mb-2 text-destructive">Warnings</h4>
      <p className="text-sm whitespace-pre-wrap text-muted-foreground">
        {diseaseData.Warnings}
      </p>
    </div>
  )}
</TabsContent>

                
                <TabsContent value="precaution" className="space-y-4">
  <h3 className="text-lg font-medium mb-2">Precautions to Take</h3>

  {Array.isArray(diseaseData?.Precautions) && diseaseData.Precautions.length > 0 ? (
    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
      {diseaseData.Precautions.map((item, index) => (
        <li key={index} className="capitalize">{item}</li>
      ))}
    </ul>
  ) : (
    <p className="text-muted-foreground">No precaution information available.</p>
  )}

  <div className="bg-muted/50 p-4 rounded-lg border border-border mt-4">
    <h4 className="font-medium mb-2">Why Precautions Matter</h4>
    <p className="text-sm text-muted-foreground">
      Following these precautions can help prevent complications and speed up your recovery process.
    </p>
  </div>
</TabsContent>

                
                <TabsContent value="workout" className="space-y-4">
  <h3 className="text-lg font-medium mb-2">Exercise and Physical Activity</h3>

  {diseaseData?.Workout ? (
    <ul className="list-disc list-inside text-muted-foreground space-y-1">
      {diseaseData.Workout.split(";").map((item, index) => (
        <li key={index}>{item.trim()}</li>
      ))}
    </ul>
  ) : (
    <p className="text-muted-foreground">No workout information available.</p>
  )}

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