import { currentUser } from "@clerk/nextjs/server";
import { ClinicianService } from "@/modules/clinician/services/clinician.service";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, AlertTriangle, FileCheck, FileSearch, ArrowRight } from "lucide-react";

export default async function ClinicianDashboardPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const overview = await ClinicianService.getClinicianOverview();
  const queue = await ClinicianService.getHighRiskQueue();
  const patients = await ClinicianService.getPatientTable();

  return (
    <div className="space-y-10 animate-in fade-in duration-500">

      {/* Clinician Overview Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="p-4 sm:p-6 lg:p-8 rounded-xl border border-border/80 bg-card shadow-sm hover:border-clinical-interactive/30 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between border-b border-border/40 pb-3 sm:pb-4 mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Total Patients</span>
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            {overview.totalPatients}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 rounded-xl border border-border/80 bg-card shadow-sm hover:border-clinical-interactive/30 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between border-b border-border/40 pb-3 sm:pb-4 mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Pending Review</span>
            <FileSearch className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            {overview.pendingReview}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 rounded-xl border border-border/80 bg-card shadow-sm hover:border-clinical-interactive/30 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between border-b border-border/40 pb-3 sm:pb-4 mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Reviewed</span>
            <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            {overview.reviewed}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 rounded-xl border border-red-500/30 shadow-sm bg-red-500/5 hover:bg-red-500/10 transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" />
          </div>
          <div className="flex items-center justify-between border-b border-red-500/20 pb-3 sm:pb-4 mb-3 sm:mb-4 relative z-10">
            <span className="text-xs sm:text-sm font-medium text-red-500">High Risk</span>
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-foreground relative z-10">
            {overview.highRisk}
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">

        {/* High Risk Queue */}
        <section className="lg:col-span-1 space-y-4 min-w-0">
          <h3 className="text-lg font-heading font-semibold text-foreground">Immediate Attention</h3>

          <div className="space-y-4">
            {queue.map((item) => (
              <div key={item.assessmentId} className="p-5 rounded-xl border border-red-500/30 shadow-sm bg-red-500/10 hover:bg-red-500/20 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">Patient: {item.userId?.slice(0, 8)}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase text-white ${
                    item.severity === "Severe" ? "bg-clinical-navy" : "bg-red-500"
                  }`}>
                    {item.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground">
                    {item.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <Link
                    href={`/clinician/patients/${item.userId}`}
                    className="text-sm text-red-500 hover:text-red-400 font-medium flex items-center gap-1"
                  >
                    Review <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}

            {queue.length === 0 && (
              <div className="p-8 rounded-xl border border-border/80 shadow-sm bg-card text-center">
                <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No high-risk patients currently in queue.</p>
              </div>
            )}
          </div>
        </section>

        {/* Patient Table */}
        <section className="lg:col-span-2 space-y-4 min-w-0">
          <h3 className="text-lg font-heading font-semibold text-foreground">Patient Roster</h3>

          <div className="rounded-xl border border-border/80 shadow-sm bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/40 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <th className="p-4">Patient</th>
                    <th className="p-4">Latest Score</th>
                    <th className="p-4">Severity</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Review Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/80">
                  {patients.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="p-4 text-sm font-medium text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-clinical-soft flex items-center justify-center text-clinical-primary font-semibold text-xs">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          {p.name}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-mono text-foreground">
                        {p.latestScore !== null ? p.latestScore : "-"}
                      </td>
                      <td className="p-4 text-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            p.severity === "Severe" ? "bg-clinical-navy/20 text-clinical-navy dark:text-clinical-soft" :
                            p.severity === "Moderately Severe" ? "bg-red-500/20 text-red-700 dark:text-red-400" :
                            p.severity === "Moderate" ? "bg-amber-500/20 text-amber-700 dark:text-amber-400" :
                            p.severity !== "N/A" ? "bg-green-500/20 text-green-700 dark:text-green-400" :
                            "bg-muted text-muted-foreground"
                          }`}>
                          {p.severity}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {p.date ? p.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "-"}
                      </td>
                      <td className="p-4 text-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.reviewStatus === "PENDING" ? "bg-amber-500/20 text-amber-700 dark:text-amber-400" :
                            p.reviewStatus === "REVIEWED" ? "bg-green-500/20 text-green-700 dark:text-green-400" :
                            p.reviewStatus === "FLAGGED" ? "bg-red-500/20 text-red-700 dark:text-red-400" :
                            "bg-muted text-muted-foreground"
                          }`}>
                          {p.reviewStatus}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-right">
                        <Link
                          href={`/clinician/patients/${p.id}`}
                          className="text-clinical-interactive hover:text-clinical-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {patients.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">
                        No patients assigned.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
