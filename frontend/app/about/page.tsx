"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BrainCircuit,
  Database,
  FileText,
  ShieldAlert,
  Users,
  HeartPulse,
  Link as LinkIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

export default function AboutPage() {
  return (
    <div className="container max-w-4xl mx-auto py-32 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold mb-2">About MedSage</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Revolutionizing healthcare through personalized, data-driven medication recommendations.
          </p>
        </div>

        <div className="relative w-full aspect-video overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="text-white text-center p-8 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-white/90">
                To create a world where everyone has access to safe, personalized medication recommendations based on their unique health profile and the latest medical research.
              </p>
            </div>
          </div>
          <Image
            src="https://images.pexels.com/photos/3846035/pexels-photo-3846035.jpeg"
            alt="Medical team reviewing patient data"
            fill
            className="object-cover"
          />
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold">How MedSage Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
                  Advanced AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our algorithm analyzes your symptoms, medical history, and current medications to identify potential treatment options. We consider factors like drug interactions, contraindications, and your unique health profile.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-secondary" />
                  Trusted Medical Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our recommendations are based on data from reputable sources including clinical guidelines, peer-reviewed research, and authoritative medical databases. We regularly update our system to reflect the latest medical consensus.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <ShieldAlert className="h-5 w-5 mr-2 text-accent" />
                  Safety First Approach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Patient safety is our top priority. We automatically flag potential drug interactions, side effects, and contraindications based on your personal health information and current medications.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <HeartPulse className="h-5 w-5 mr-2 text-red-500" />
                  Personalized Care
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We consider your age, gender, weight, allergies, and existing conditions to provide truly personalized recommendations—not generic advice. Your unique health profile guides our suggestions.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Our Data Sources</h2>
          
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                name: "Mayo Clinic",
                description: "Comprehensive medical information and clinical expertise",
                url: "https://www.mayoclinic.org/",
              },
              {
                name: "WebMD",
                description: "Trusted health and medication information resource",
                url: "https://www.webmd.com/",
              },
              {
                name: "Drugs.com",
                description: "Detailed medication information and interaction data",
                url: "https://www.drugs.com/",
              },
              {
                name: "NIH MedlinePlus",
                description: "Government-backed health information resource",
                url: "https://medlineplus.gov/",
              },
              {
                name: "FDA Medication Guides",
                description: "Official safety information for medications",
                url: "https://www.fda.gov/drugs/drug-safety-and-availability/medication-guides",
              },
              {
                name: "PubMed",
                description: "Database of peer-reviewed medical research",
                url: "https://pubmed.ncbi.nlm.nih.gov/",
              },
            ].map((source, index) => (
              <motion.div key={source.name} variants={item}>
                <Link
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <Card className="h-full hover:shadow-md transition-shadow border-primary/10 hover:border-primary/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-lg">
                        <LinkIcon className="h-4 w-4 mr-2 text-primary" />
                        {source.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {source.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card h-full">
              <CardHeader className="pb-2">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg"
                    alt="Team Member 1"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardTitle className="text-center">Team Member 1</CardTitle>
                <CardDescription className="text-center">
                  Medical Director
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Board-certified physician with 15+ years of clinical experience, specializing in personalized medicine and treatment optimization.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card h-full">
              <CardHeader className="pb-2">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src="https://images.pexels.com/photos/6234600/pexels-photo-6234600.jpeg"
                    alt="Team Member 2"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardTitle className="text-center">Team Member 2</CardTitle>
                <CardDescription className="text-center">
                  Chief Pharmacist
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Clinical pharmacist with expertise in drug interactions, medication safety, and pharmaceutical outcomes research.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card h-full">
              <CardHeader className="pb-2">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src="https://images.pexels.com/photos/8197558/pexels-photo-8197558.jpeg"
                    alt="Team Member 3"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardTitle className="text-center">Team Member 3</CardTitle>
                <CardDescription className="text-center">
                  AI Research Lead
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Healthcare AI specialist focusing on applying machine learning to clinical decision support systems and personalized medicine.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Disclaimer</h2>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  MedSage is designed to provide general information and recommendation guidance only. It is not intended to replace professional medical advice, diagnosis, or treatment.
                </p>
                <p>
                  Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or treatment. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.
                </p>
                <p>
                  While we strive to provide accurate information, MedSage makes no warranties, express or implied, regarding the completeness, accuracy, reliability, or suitability of the information provided.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </motion.div>
    </div>
  );
}