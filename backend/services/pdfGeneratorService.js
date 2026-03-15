const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

/**
 * Generates an ATS-friendly, single-page PDF resume from optimized resume data.
 * Uses only standard fonts - no images, tables, or complex formatting.
 */
const generateResumePDF = async (resume) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // US Letter

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const margin = 50;
    const pageWidth = 612 - margin * 2;
    let y = 752;

    const colors = {
        black: rgb(0, 0, 0),
        dark: rgb(0.15, 0.15, 0.15),
        gray: rgb(0.35, 0.35, 0.35),
        light: rgb(0.55, 0.55, 0.55),
        line: rgb(0.75, 0.75, 0.75)
    };

    // ─── Helper functions ───
    const drawText = (text, x, currentY, font, size, color = colors.dark) => {
        if (!text) return currentY;
        page.drawText(String(text), { x, y: currentY, size, font, color });
        return currentY;
    };

    const drawLine = (currentY) => {
        page.drawLine({
            start: { x: margin, y: currentY },
            end: { x: 612 - margin, y: currentY },
            thickness: 0.5,
            color: colors.line
        });
        return currentY - 6;
    };

    const drawSectionHeader = (title, currentY) => {
        currentY -= 10;
        drawText(title.toUpperCase(), margin, currentY, fontBold, 9.5, colors.black);
        currentY -= 3;
        currentY = drawLine(currentY);
        return currentY;
    };

    // Word-wrap text into lines that fit within maxWidth
    const wrapText = (text, font, size, maxWidth) => {
        if (!text) return [];
        const words = text.split(' ');
        const lines = [];
        let line = '';
        for (const word of words) {
            const testLine = line ? `${line} ${word}` : word;
            const width = font.widthOfTextAtSize(testLine, size);
            if (width > maxWidth && line) {
                lines.push(line);
                line = word;
            } else {
                line = testLine;
            }
        }
        if (line) lines.push(line);
        return lines;
    };

    const drawWrappedText = (text, x, currentY, font, size, maxWidth, color = colors.dark) => {
        const lines = wrapText(text, font, size, maxWidth);
        for (const line of lines) {
            if (currentY < 30) return currentY;
            drawText(line, x, currentY, font, size, color);
            currentY -= size + 2;
        }
        return currentY;
    };

    const drawBullet = (text, currentY) => {
        if (currentY < 30) return currentY;
        drawText('•', margin + 8, currentY, fontRegular, 8, colors.dark);
        currentY = drawWrappedText(text, margin + 20, currentY, fontRegular, 8, pageWidth - 20, colors.dark);
        return currentY;
    };

    // ═══════════════════════════════════════════
    // HEADER
    // ═══════════════════════════════════════════
    const name = resume.fullName || 'Your Name';
    const nameWidth = fontBold.widthOfTextAtSize(name, 16);
    drawText(name, (612 - nameWidth) / 2, y, fontBold, 16, colors.black);
    y -= 16;

    // Contact line
    const contactParts = [];
    if (resume.phone) contactParts.push(resume.phone);
    if (resume.email) contactParts.push(resume.email);
    if (resume.linkedIn) contactParts.push(resume.linkedIn);
    if (resume.github) contactParts.push(resume.github);
    const contactLine = contactParts.join('  |  ');
    const contactWidth = fontRegular.widthOfTextAtSize(contactLine, 8);
    drawText(contactLine, (612 - contactWidth) / 2, y, fontRegular, 8, colors.gray);
    y -= 10;
    y = drawLine(y);

    // ═══════════════════════════════════════════
    // PROFESSIONAL SUMMARY
    // ═══════════════════════════════════════════
    if (resume.professionalSummary) {
        y = drawSectionHeader('Professional Summary', y);
        y = drawWrappedText(resume.professionalSummary, margin, y, fontRegular, 8, pageWidth, colors.dark);
        y -= 2;
    }

    // ═══════════════════════════════════════════
    // SKILLS
    // ═══════════════════════════════════════════
    if (resume.skills && resume.skills.length > 0) {
        y = drawSectionHeader('Technical Skills', y);
        const skillsText = resume.skills.join('  |  ');
        y = drawWrappedText(skillsText, margin, y, fontRegular, 8, pageWidth, colors.dark);
        y -= 2;
    }

    // ═══════════════════════════════════════════
    // EXPERIENCE
    // ═══════════════════════════════════════════
    if (resume.experience && resume.experience.length > 0) {
        y = drawSectionHeader('Professional Experience', y);
        for (const exp of resume.experience) {
            if (y < 50) break;
            drawText(exp.role || '', margin, y, fontBold, 9, colors.black);
            const rightText = exp.duration || '';
            const rightWidth = fontItalic.widthOfTextAtSize(rightText, 8);
            drawText(rightText, 612 - margin - rightWidth, y, fontItalic, 8, colors.light);
            y -= 12;
            drawText(exp.company || '', margin, y, fontItalic, 8, colors.gray);
            y -= 12;

            if (exp.bullets) {
                for (const bullet of exp.bullets) {
                    if (y < 40) break;
                    y = drawBullet(bullet, y);
                }
            }
            y -= 4;
        }
    }

    // ═══════════════════════════════════════════
    // PROJECTS
    // ═══════════════════════════════════════════
    if (resume.projects && resume.projects.length > 0) {
        y = drawSectionHeader('Projects', y);
        for (const proj of resume.projects) {
            if (y < 50) break;
            drawText(proj.title || '', margin, y, fontBold, 9, colors.black);
            const techRight = proj.techStack || '';
            const trWidth = fontItalic.widthOfTextAtSize(techRight, 8);
            drawText(techRight, 612 - margin - trWidth, y, fontItalic, 8, colors.light);
            y -= 12;

            if (proj.bullets) {
                for (const bullet of proj.bullets) {
                    if (y < 40) break;
                    y = drawBullet(bullet, y);
                }
            }
            y -= 4;
        }
    }

    // ═══════════════════════════════════════════
    // EDUCATION
    // ═══════════════════════════════════════════
    if (resume.education && resume.education.length > 0) {
        y = drawSectionHeader('Education', y);
        for (const edu of resume.education) {
            if (y < 40) break;
            const degreeText = edu.degree || '';
            drawText(degreeText, margin, y, fontBold, 9, colors.black);
            const yearText = edu.year || '';
            const yrWidth = fontItalic.widthOfTextAtSize(yearText, 8);
            drawText(yearText, 612 - margin - yrWidth, y, fontItalic, 8, colors.light);
            y -= 12;
            const instLine = edu.institution + (edu.score ? `  |  ${edu.score}` : '');
            drawText(instLine, margin, y, fontRegular, 8, colors.gray);
            y -= 14;
        }
    }

    // ═══════════════════════════════════════════
    // CERTIFICATIONS & ACHIEVEMENTS
    // ═══════════════════════════════════════════
    const hasCerts = resume.certifications && resume.certifications.length > 0;
    const hasAchievements = resume.achievements && resume.achievements.length > 0;

    if (hasCerts || hasAchievements) {
        y = drawSectionHeader('Certifications & Achievements', y);
        if (hasCerts) {
            for (const cert of resume.certifications) {
                if (y < 30) break;
                y = drawBullet(cert, y);
            }
        }
        if (hasAchievements) {
            for (const ach of resume.achievements) {
                if (y < 30) break;
                y = drawBullet(ach, y);
            }
        }
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
};

module.exports = { generateResumePDF };
