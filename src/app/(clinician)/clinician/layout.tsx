import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { prisma } from "@/lib/prisma/client";
import { ROLES } from "@/config/roles";

export default async function ClinicianDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  let dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!dbUser) {
    const email = clerkUser.emailAddresses[0]?.emailAddress || `${clerkUser.id}@placeholder.com`;
    dbUser = await prisma.user.upsert({
      where: { email },
      update: { clerkId: clerkUser.id },
      create: {
        clerkId: clerkUser.id,
        email,
        role: "USER", // Will be upgraded manually or via admin UI later
      }
    });
  }

  // Prevent users from accessing clinician layout (middleware should also do this)
  const isClinician = dbUser.role === ROLES.CLINICIAN || dbUser.role === ROLES.ADMIN || dbUser.role === ROLES.SUPER_ADMIN;
  if (!isClinician) {
    redirect("/dashboard");
  }

  return (
    <DashboardLayout 
      userRole={dbUser.role} 
      userName={`Dr. ${clerkUser.lastName || clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0]}`}
    >
      {children}
    </DashboardLayout>
  );
}
