import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ClinicianRepository } from "@/modules/clinician/repositories/clinician.repository";
import { RiskAssessmentService } from "@/modules/dashboard/services/risk-assessment.service";
import { prisma } from "@/lib/prisma/client";
import { addClinicalNote } from "@/modules/clinician/actions";
import { Activity, Calendar, Clock, FileText, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default async function PatientReviewPage({
  params
}: {
  params: { id: string }
}) {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!dbUser) redirect("/sign-in");

  const patient = await ClinicianRepository.getPatientDetails(params.id);

  if (!patient) {
    return <div className="text-white">Patient not found</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <Link href="/clinician" className="text-white/60 hover:text-white flex items-center gap-2 text-sm font-medium w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Roster
      </Link>

      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="w-16 h-16 rounded-full bg-brand-secondary/20 flex items-center justify-center text-brand-secondary font-bold text-2xl">
          {patient.email.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">{patient.email}</h1>
          <p className="text-white/60 text-sm mt-1">Patient ID: {patient.id}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Assessment History */}
        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-secondary" /> Assessment History
          </h2>

          <div className="space-y-3">
            {patient.assessments.map(a => {
              let score = null;
              let severity = "N/A";
              if (a.status === "COMPLETED" && (a as any).report) {
                const report = (a as any).report;
                const reportJson = report.reportJson as any;
                score = reportJson.totalScore ?? null;
                severity = report.riskLevel || "N/A";
              }

              return (
                <div key={a.id} className="p-4 rounded-xl border border-white/10 bg-[#18181b] hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{a.status === "COMPLETED" ? "PHQ-9" : "Assessment"}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          a.status === "COMPLETED" ? "bg-brand-secondary/20 text-brand-secondary" : "bg-white/10 text-white/60"
                        }`}>
                          {a.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="text-xs text-white/40 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {a.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </div>
                    {score !== null && (
                      <div className="text-right">
                        <div className="text-lg font-heading font-bold text-white">{score}</div>
                        <div className={`text-xs font-medium ${
                          severity === "Severe" || severity === "Moderately Severe" ? "text-red-400" :
                          severity === "Moderate" ? "text-orange-400" : "text-brand-secondary"
                        }`}>
                          {severity}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {patient.assessments.length === 0 && (
              <div className="p-6 text-center border border-white/10 rounded-xl bg-white/5 text-white/40 text-sm">
                No assessments found for this patient.
              </div>
            )}
          </div>
        </section>

        {/* Clinical Notes */}
        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" /> Clinical Notes
          </h2>

          <div className="p-4 rounded-xl border border-white/10 bg-[#18181b]">
            <form action={addClinicalNote} className="space-y-3">
              <input type="hidden" name="patientId" value={patient.id} />
              <input type="hidden" name="clinicianId" value={dbUser.id} />
              
              <div>
                <input 
                  type="text" 
                  name="title" 
                  placeholder="Note Title (Optional)"
                  className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                />
              </div>
              <div>
                <textarea 
                  name="content"
                  required
                  rows={3}
                  placeholder="Add a clinical observation, follow-up plan, or concern..."
                  className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-brand-secondary resize-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-brand-secondary hover:bg-brand-secondary/90 text-white text-sm font-medium py-2 rounded-md transition-colors"
              >
                <Send className="w-4 h-4" /> Save Note
              </button>
            </form>
          </div>

          <div className="space-y-3 mt-6">
            {patient.patientNotes.map(note => (
              <div key={note.id} className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-2 relative group">
                {note.title && (
                  <h4 className="text-sm font-medium text-white">{note.title}</h4>
                )}
                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
                <div className="flex items-center gap-4 text-xs text-white/40 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {note.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  <div>By: {note.clinician.email.split("@")[0]}</div>
                </div>
              </div>
            ))}

            {patient.patientNotes.length === 0 && (
              <div className="text-center py-6 text-sm text-white/40 border border-dashed border-white/10 rounded-xl">
                No clinical notes recorded yet.
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
