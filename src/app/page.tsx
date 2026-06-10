import type { ReactElement } from "react";
import Hero from "./components/landing-page/Hero";
import Card from "./components/landing-page/Card";
import Features from "./components/landing-page/Features";
import Level from "./components/landing-page/Level";
import Start from "./components/landing-page/Start";

export default function Home(): ReactElement {
  return (
    <>
      <Hero />
      <Card />
      <Features />
      <Level />
      <Start />
    </>
  );
}
