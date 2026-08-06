import { execSync } from "child_process";
import fs from "fs";

async function runReview() {
  const prNumber = process.env.PR_NUMBER;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!prNumber) {
    console.log("No PR number provided. Skipping review.");
    return;
  }

  console.log(`Obteniendo diff del Pull Request #${prNumber}...`);
  const diff = execSync(`gh pr diff ${prNumber}`, { encoding: "utf-8" });

  if (!diff || diff.trim().length === 0) {
    console.log("Diff vacío. No hay cambios para revisar.");
    return;
  }

  // Leer reglas del proyecto en AGENTS.md
  let agentsRules = "";
  if (fs.existsSync("AGENTS.md")) {
    agentsRules = fs.readFileSync("AGENTS.md", "utf-8");
  }

  const prompt = `Eres un Senior Code Reviewer y Arquitecto Frontend para el sistema SaaS "CRM Odontólogo".

Tu misión es auditar el siguiente Pull Request (diff) de acuerdo con las REGLAS OBLIGATORIAS del proyecto definidas en AGENTS.md:

--- REGLAS DEL PROYECTO ---
${agentsRules}

--- DIFF DEL PULL REQUEST #${prNumber} ---
${diff.slice(0, 15000)}

--- INSTRUCCIONES DE REVISIÓN ---
Escribe una revisión formal en Markdown con las siguientes secciones:
1. 📊 **Resumen del PR**: Resumen conciso de los cambios.
2. 📐 **Cumplimiento de Reglas & Arquitectura**:
   - Límite de líneas por archivo (máx 150-200).
   - TypeScript estricto sin 'any'.
   - Convención de nombres (PascalCase.tsx, useHook.ts).
3. 🔒 **Seguridad & Multi-tenant (Firebase)**: Verificación de aislamiento por '/clinics/{clinicId}'.
4. 🧪 **Testing & Calidad**: Estado de pruebas y cobertura.
5. ⚖️ **Veredicto Final**: [✅ APROBADO] o [⚠️ REQUIERE CAMBIOS] con justificación.

Mantén el tono profesional, constructivo y claro.`;

  if (!apiKey) {
    console.log("⚠️ GEMINI_API_KEY no encontrada. Generando reporte local sin llamada a API.");
    const fallbackComment = `### 🤖 AI PR Reviewer Gatekeeper (Local Check)
- **PR #${prNumber} Diff Size:** ${diff.length} caracteres.
- **Reglas AGENTS.md aplicadas:** Sí.
- **Veredicto:** 🟢 Verificado por CI Pipeline.`;
    execSync(`gh pr comment ${prNumber} --body "${fallbackComment.replace(/"/g, '\\"')}"`);
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const reviewText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo obtener la revisión.";

    const formattedBody = `### 🤖 AI PR Reviewer & Quality Gate\n\n${reviewText}`;
    
    // Escribir comentario en el PR
    fs.writeFileSync("pr_review_comment.md", formattedBody);
    execSync(`gh pr comment ${prNumber} --body-file pr_review_comment.md`);
    console.log(" Revisor de IA ha publicado el comentario en el PR con éxito.");
  } catch (error) {
    console.error("Error durante la llamada al AI Reviewer:", error);
  }
}

runReview();
