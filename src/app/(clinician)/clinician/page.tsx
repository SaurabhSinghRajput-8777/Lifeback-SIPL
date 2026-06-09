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
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Clinician Overview Cards */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 text-white/60">
              <Users className="w-5 h-5 text-brand-secondary" />
              <span className="text-sm font-medium">Total Patients</span>
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-white">
            {overview.totalPatients}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3 text-white/60 mb-2">
            <FileSearch className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium">Pending Review</span>
          </div>
          <div className="text-3xl font-heading font-bold text-white">
            {overview.pendingReview}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3 text-white/60 mb-2">
            <FileCheck className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium">Reviewed</span>
          </div>
          <div className="text-3xl font-heading font-bold text-white">
            {overview.reviewed}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
          <div className="flex items-center gap-3 text-white/60 mb-2 relative z-10">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-red-400">High Risk</span>
          </div>
          <div className="text-3xl font-heading font-bold text-white relative z-10">
            {overview.highRisk}
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* High Risk Queue */}
        <section className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-lg font-heading font-semibold">Action Required</h3>
          </div>
          
          <div className="space-y-3">
            {queue.map((item) => (
              <div key={item.assessmentId} className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-white">Patient ID: {item.userId?.slice(0, 8)}...</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-500 text-white uppercase">
                    {item.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-white/60">
                    {item.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <Link 
                    href={`/clinician/patients/${item.userId}`}
                    className="text-sm text-red-400 hover:text-red-300 font-medium flex items-center gap-1"
                  >
                    Review <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
            
            {queue.length === 0 && (
              <div className="p-6 rounded-xl border border-white/10 bg-[#18181b] text-center">
                <AlertTriangle className="w-8 h-8 text-brand-secondary mx-auto mb-3 opacity-50" />
                <p className="text-sm text-white/60">No high-risk patients currently in queue.</p>
              </div>
            )}
          </div>
        </section>

        {/* Patient Table */}
        <section className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-heading font-semibold text-white">Patient Roster</h3>
          
          <div className="rounded-xl border border-white/10 bg-[#18181b] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-xs font-medium text-white/60 uppercase tracking-wider">
                    <th className="p-4">Patient</th>
                    <th className="p-4">Latest Score</th>
                    <th className="p-4">Severity</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Review Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {patients.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 text-sm font-medium text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-secondary/20 flex items-center justify-center text-brand-secondary font-semibold text-xs">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          {p.name}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-mono text-white">
                        {p.latestScore !== null ? p.latestScore : "-"}
                      </td>
                      <td className="p-4 text-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          p.severity === "Severe" || p.severity === "Moderately Severe" ? "bg-red-500/20 text-red-400" :
                          p.severity === "Moderate" ? "bg-orange-500/20 text-orange-400" :
                          p.severity !== "N/A" ? "bg-brand-secondary/20 text-brand-secondary" :
                          "bg-white/10 text-white/60"
                        }`}>
                          {p.severity}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-white/60">
                        {p.date ? p.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "-"}
                      </td>
                      <td className="p-4 text-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.reviewStatus === "PENDING" ? "bg-blue-500/20 text-blue-400" :
                          p.reviewStatus === "REVIEWED" ? "bg-brand-secondary/20 text-brand-secondary" :
                          p.reviewStatus === "FLAGGED" ? "bg-red-500/20 text-red-400" :
                          "bg-white/10 text-white/60"
                        }`}>
                          {p.reviewStatus}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-right">
                        <Link 
                          href={`/clinician/patients/${p.id}`}
                          className="text-brand-secondary hover:text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {patients.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-sm text-white/40">
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
