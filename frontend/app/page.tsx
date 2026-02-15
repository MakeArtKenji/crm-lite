import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { ProblemSolution } from "@/components/landing/problem-solution";
import { Features } from "@/components/landing/features";
import { Workflow } from "@/components/landing/workflow";
import { SpeedClarity } from "@/components/landing/speed-clarity";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <ProblemSolution />
      <Features />
      <Workflow />
      <SpeedClarity />
      <FinalCta />
      <Footer />
    </main>
  );
}
