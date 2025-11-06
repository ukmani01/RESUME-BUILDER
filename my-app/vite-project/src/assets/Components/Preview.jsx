import { useRef } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API || "http://localhost:7000/api";

export default function Preview({ resume = {}, token }) {
  const previewRef = useRef();

  const downloadPDF = async () => {
    try {
      const res = await axios.get(`${API}/resume/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "arraybuffer", // ✅ Important: must use arraybuffer
      });

      // ✅ Convert response to Blob and trigger download
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${resume.personal?.name || "resume"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Error downloading PDF");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 font-sans">
      <div
        ref={previewRef}
        className="w-full shadow-lg bg-white overflow-hidden"
        style={{ minHeight: "500px" }}
      >
        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/3 bg-[#2A3644] text-white p-6">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full border-2 border-white flex items-center justify-center">
                PHOTO
              </div>
            </div>

            <h3 className="font-bold text-lg mb-2 border-b border-white/40 pb-1">CONTACT</h3>
            <p className="text-sm">{resume.personal?.email}</p>
            <p className="text-sm">{resume.personal?.phone}</p>
            <p className="text-sm">{resume.personal?.location}</p>

            {resume.personal?.link?.label && resume.personal?.link?.url && (
              <p className="text-sm mt-2">
                <a
                  href={resume.personal.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {resume.personal.link.label}
                </a>
              </p>
            )}

            {resume.skills?.length > 0 && (
              <>
                <h3 className="font-bold text-lg mt-6 border-b border-white/40 pb-1">SKILLS</h3>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  {resume.skills.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </>
            )}

            {resume.certifications?.length > 0 && (
              <>
                <h3 className="font-bold text-lg mt-6 border-b border-white/40 pb-1">CERTIFICATIONS</h3>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  {resume.certifications.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </>
            )}

            {resume.languages?.length > 0 && (
              <>
                <h3 className="font-bold text-lg mt-6 border-b border-white/40 pb-1">LANGUAGES</h3>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  {resume.languages.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Main Content */}
          <div className="w-2/3 p-8">
            <h1 className="text-4xl font-bold text-[#2A3644]">
              {resume.personal?.name}
            </h1>
            <p className="text-lg mb-6 text-[#1E293B]">
              {resume.personal?.summary}
            </p>

            {resume.education?.length > 0 && (
              <>
                <h2 className="text-xl font-bold text-[#007AFF] border-b-2 border-[#007AFF] pb-1 mb-3">
                  EDUCATION
                </h2>
                {resume.education.map((edu, i) => (
                  <div key={i} className="mb-3">
                    <p className="font-semibold">
                      {edu.degree} — {edu.school}
                    </p>
                    <p className="text-sm text-gray-600">
                      {edu.startYear} - {edu.endYear} | Grade: {edu.grade}
                    </p>
                  </div>
                ))}
              </>
            )}

            {resume.experience?.length > 0 && (
              <>
                <h2 className="text-xl font-bold text-[#007AFF] border-b-2 border-[#007AFF] pb-1 mb-3">
                  EXPERIENCE
                </h2>
                {resume.experience.map((exp, i) => (
                  <div key={i} className="mb-3">
                    <p className="font-semibold">
                      {exp.role} — {exp.company}
                    </p>
                    <p className="text-sm text-gray-600">
                      {exp.start} - {exp.end}
                    </p>
                    <p className="text-sm">{exp.desc}</p>
                  </div>
                ))}
              </>
            )}

            {resume.projects?.length > 0 && (
              <>
                <h2 className="text-xl font-bold text-[#007AFF] border-b-2 border-[#007AFF] pb-1 mb-3">
                  PROJECTS
                </h2>
                {resume.projects.map((proj, i) => (
                  <div key={i} className="mb-3">
                    <p className="font-semibold">{proj.title}</p>
                    <p className="text-sm">{proj.desc}</p>
                    <p className="text-xs text-gray-600">Tech: {proj.tech}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={downloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium shadow-md transition-colors duration-200"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
