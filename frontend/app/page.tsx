"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  ShieldCheck,
  ChevronRight,
  BrainCircuit,
  Pill,
  Microscope,
  Database,
} from "lucide-react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5 -z-10" />
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              className="flex-1 space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4">
                <motion.div
                  className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <span className="font-medium">Powered by Advanced AI</span>
                </motion.div>
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <span className="block">Smarter Care,</span>
                  <span className="block text-gradient">Safer Choices</span>
                </motion.h1>
                <motion.p
                  className="text-lg md:text-xl text-muted-foreground max-w-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Unlock personalized drug recommendations backed by trusted medical expertise, tailored to your unique health profile.
                </motion.p>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Link href="/symptoms">
                  <Button size="lg" className="relative group overflow-hidden rounded-full">
                    <span className="relative z-10">Start My Recommendation</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="rounded-full group">
                    Learn More
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex-1 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 via-secondary/20 to-accent/20 animate-pulse-glow"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 5,
                  }}
                />
                <div className="absolute inset-8 rounded-full border-4 border-dashed border-primary/30 animate-spin-slow" style={{ animationDuration: '30s' }} />
                
                <motion.div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card glass-card rounded-3xl p-6 shadow-lg w-64 h-64 flex flex-col justify-center items-center"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 5,
                  }}
                >
                  <Pill className="h-16 w-16 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-gradient">AI-Powered Recommendations</h3>
                  <p className="text-center text-muted-foreground text-sm mt-2">Personalized for your unique health profile</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Key Benefits</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our cutting-edge system combines medical expertise with advanced technology
              to provide you with safe and effective medication recommendations.
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={item}>
              <Card className="h-full glass-card hover:shadow-lg transition-shadow overflow-hidden group">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="rounded-full bg-primary/10 p-2 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Enhanced Safety</h3>
                  <p className="text-muted-foreground flex-grow">
                    Automatic detection of potential drug interactions and contraindications based on your unique health profile.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full glass-card hover:shadow-lg transition-shadow overflow-hidden group">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="rounded-full bg-secondary/10 p-2 w-fit mb-4 group-hover:bg-secondary/20 transition-colors">
                    <BrainCircuit className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Intelligent Recommendations</h3>
                  <p className="text-muted-foreground flex-grow">
                    AI-powered system that learns from medical databases and clinical guidelines to provide the best suggestions.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full glass-card hover:shadow-lg transition-shadow overflow-hidden group">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="rounded-full bg-accent/10 p-2 w-fit mb-4 group-hover:bg-accent/20 transition-colors">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Personalized Care</h3>
                  <p className="text-muted-foreground flex-grow">
                    Tailored suggestions based on your symptoms, medical history, and current medications for the best possible outcomes.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full glass-card hover:shadow-lg transition-shadow overflow-hidden group">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="rounded-full bg-primary/10 p-2 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Trusted Data Sources</h3>
                  <p className="text-muted-foreground flex-grow">
                    Recommendations based on data from Mayo Clinic, WebMD, Drugs.com, and other respected medical authorities.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full glass-card hover:shadow-lg transition-shadow overflow-hidden group">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="rounded-full bg-secondary/10 p-2 w-fit mb-4 group-hover:bg-secondary/20 transition-colors">
                    <Microscope className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Scientific Accuracy</h3>
                  <p className="text-muted-foreground flex-grow">
                    Recommendations backed by the latest scientific research and regularly updated to reflect current medical consensus.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
        
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to find the right medication for your symptoms?
            </motion.h2>
            
            <motion.p
              className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Get personalized recommendations in minutes. Our AI system analyzes your symptoms and health profile to suggest medications that are right for you.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Link href="/symptoms">
                <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all">
                  Start My Recommendation
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}