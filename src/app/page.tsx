"use client";
import { Calendar } from "@/components/Calendar/Calendar";
import { Box, Container } from "@mantine/core";
import { SettingsForm } from "@/components/SettingsForm";
import { useEffect } from "react";
import { sendAnalytics } from "@/utils/sendAnalytics";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";

export default function Home() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      sendAnalytics("page_view");
    }
  }, []);

  return (
    <Container py={40}>
      <AppHeader />
      <Box component="main">
        <SettingsForm />
        <Calendar />
      </Box>
      <AppFooter />
    </Container>
  );
}
