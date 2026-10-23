import * as React from "react";
import type { Metadata } from "next";
import { ProfileEditor } from "@/components/account/profile-editor";

export const metadata: Metadata = {
  title: "Profile | Your account | Keian Luxandor",
  description: "Update the name and phone number on your account.",
};

export default function AccountProfilePage() {
  return (
    <div>
      <ProfileEditor />
    </div>
  );
}
