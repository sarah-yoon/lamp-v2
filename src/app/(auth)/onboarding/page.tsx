import type { Metadata } from "next";
import OnboardingForm from "@/components/OnboardingForm";

export const metadata: Metadata = {
  title: "Set Up Profile",
};

export default function OnboardingPage() {
  return <OnboardingForm />;
}
