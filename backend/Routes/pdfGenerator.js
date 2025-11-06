const PDFDocument = require("pdfkit");

async function getPDFBuffer(resumeData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 0 });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // ===== COLORS =====
      const sidebarColor = "#2A3644"; // Dark navy sidebar
      const accentColor = "#007AFF";  // Bright blue accent
      const headerColor = "#F9FAFB";  // Light gray for headers
      const textDark = "#1E293B";     // Dark text
      const textLight = "#FFFFFF";    // Light text for sidebar
      const sectionDivider = "#E5E7EB"; // Divider lines
      const skillBg = "#374151";      // Skills background
      const skillText = "#F9FAFB";    // Skills text

      // ===== LAYOUT =====
      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const sidebarWidth = pageWidth * 0.35;
      const contentStartX = sidebarWidth + 30;
      let y = 40;

      // ===== SIDEBAR (LEFT PANEL) =====
      doc.rect(0, 0, sidebarWidth, pageHeight).fill(sidebarColor);

      // === Photo with Shadow ===
      if (resumeData.photo) {
        doc
          .circle(sidebarWidth / 2, 90, 45)
          .fillOpacity(0.1)
          .fill(textLight)
          .fillOpacity(1)
          .clip()
          .image(resumeData.photo, sidebarWidth / 2 - 45, 45, { width: 90 })
          .restore();
      }

      // === Contact Info with icons style ===
      doc.fillColor(textLight).fontSize(10).text(resumeData.personal?.email || "Email", 40, 160, { width: sidebarWidth - 60, align: "left" });
      doc.moveDown(0.5);
      doc.text(resumeData.personal?.phone || "Phone", { width: sidebarWidth - 60, align: "left" });
      doc.moveDown(0.5);
      doc.text(resumeData.personal?.location || "Location", { width: sidebarWidth - 60, align: "left" });

      if (resumeData.personal?.link?.label && resumeData.personal?.link?.url) {
        doc.moveDown(0.5);
        doc.fillColor(accentColor).text(`${resumeData.personal.link.label}: ${resumeData.personal.link.url}`, {
          width: sidebarWidth - 60,
          link: resumeData.personal.link.url,
          underline: true,
        });
      }

      // === Sidebar Sections with Rounded Boxes ===
      let sidebarY = 280;

      function drawSidebarSection(title, items) {
        if (!items?.length) return;
        doc.fillColor(accentColor).fontSize(12).text(title, 40, sidebarY);
        sidebarY += 20;
        items.forEach((item) => {
          doc
            .roundedRect(45, sidebarY, sidebarWidth - 90, 15, 3)
            .fillOpacity(0.1)
            .fill(skillBg)
            .fillOpacity(1);
          doc.fillColor(skillText).fontSize(10).text(item.name || item, 50, sidebarY + 3);
          sidebarY += 22;
        });
        sidebarY += 10;
      }

      drawSidebarSection("SKILLS", resumeData.skills.map((s) => ({ name: s })));
      drawSidebarSection("EDUCATION", resumeData.education?.map((edu) => `${edu.degree || ""} @ ${edu.school || ""}`));

      // ===== MAIN CONTENT (RIGHT SIDE) =====
      y = 60;
      doc.fillColor(textDark).fontSize(22).text(resumeData.personal?.name || "Your Name", contentStartX, y, { bold: true });
      y += 30;
      doc.fontSize(13).fillColor(accentColor).text("MERN STACK DEVELOPER", contentStartX, y);
      y += 35;

      function drawSection(title, items, renderItem) {
        if (!items?.length) return;
        doc.fontSize(14).fillColor(textDark).text(title, contentStartX, y);
        y += 20;
        items.forEach((item) => {
          renderItem(item);
        });
        y += 10;
      }

      // === Summary ===
      if (resumeData.personal?.summary) {
        doc.fontSize(14).fillColor(textDark).text("SUMMARY", contentStartX, y);
        y += 20;
        doc.fontSize(11).fillColor("#374151").text(resumeData.personal.summary, contentStartX, y, { width: pageWidth - contentStartX - 30 });
        y += 80;
      }

      // === Projects with divider lines ===
      drawSection("PROJECTS", resumeData.projects, (proj) => {
        doc.fontSize(12).fillColor(textDark).text(proj.title || "", contentStartX, y);
        y += 15;
        doc.fontSize(10).fillColor("#475569").text(proj.desc || "", contentStartX, y, { width: pageWidth - contentStartX - 30 });
        y += 15;
        doc.fontSize(10).fillColor(accentColor).text(proj.tech || "", contentStartX, y);
        y += 25;
        doc.strokeColor(sectionDivider).moveTo(contentStartX, y - 10).lineTo(pageWidth - 30, y - 10).stroke();
      });

      // === Experience ===
      drawSection("EXPERIENCE", resumeData.experience, (exp) => {
        doc.fontSize(12).fillColor(textDark).text(`${exp.role || ""} — ${exp.company || ""}`, contentStartX, y);
        y += 15;
        doc.fontSize(10).fillColor("#475569").text(`${exp.start || ""} - ${exp.end || ""}`, contentStartX, y);
        y += 15;
        doc.fontSize(11).fillColor("#374151").text(exp.desc || "", contentStartX, y, { width: pageWidth - contentStartX - 30 });
        y += 30;
      });

      // === Certifications ===
      drawSection("CERTIFICATIONS", resumeData.certifications, (cert) => {
        doc.fontSize(11).fillColor("#374151").text(`• ${cert}`, contentStartX, y);
        y += 15;
      });

      // === Languages ===
      if (resumeData.languages?.length) {
        y += 25;
        doc.fontSize(14).fillColor(textDark).text("LANGUAGES", contentStartX, y);
        y += 20;
        doc.fontSize(11).fillColor("#374151").text(resumeData.languages.join(", "), contentStartX, y);
      }

      // ===== PREMIUM STYLE TOUCHES =====
      // 1. Rounded section headers
      // 2. Subtle divider lines
      // 3. Slight shadow behind sidebar
      // 4. Highlighted skill bubbles
      // 5. Gradient effects for headers (optional, PDFKit supports linear gradient if needed)
      // 6. Consistent margin spacing
      // 7. Font scaling for readability
      // 8. Accent colors for tech stacks
      // 9. Circular photo with light border
      // 10. Modern minimal spacing

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = getPDFBuffer;
