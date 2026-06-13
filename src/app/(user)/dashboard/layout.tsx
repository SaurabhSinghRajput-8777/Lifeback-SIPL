import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { prisma } from "@/lib/prisma/client";

export default async function UserDashboardLayout({
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
        role: "USER",
      }
    });
  }

  return (
    <DashboardLayout 
      userRole={dbUser.role} 
      userName={clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0]}
    >
      {children}
    </DashboardLayout>
  );
}
