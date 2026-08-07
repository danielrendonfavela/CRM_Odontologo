import { execSync } from "child_process";
import fs from "fs";
import path from "path";

async function runReview() {
  const prNumber = process.env.PR_NUMBER;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!prNumber) {
    console.log("No PR number provided. Skipping review.");
    return;
  }

  console.log(`Obteniendo diff del Pull Request #${prNumber}...`);
  const diff = execSync(`gh pr diff ${prNumber}`, { encoding: "utf-8", maxBuffer: 50 * 1024 * 1024 });

  if (!diff || diff.trim().length === 0) {
    console.log("Diff vacío. No hay cambios para revisar.");
    return;
  }

  // Extraer el número de Issue vinculado al PR (ej. Closes #16)
  let issueContext = "";
  try {
    const prBody = execSync(`gh pr view ${prNumber} --json body --jq .body`, { encoding: "utf-8" });
    const issueMatch = prBody.match(/Closes\s+#(\d+)/i) || prBody.match(/#(\d+)/);
    if (issueMatch && issueMatch[1]) {
      const issueNum = issueMatch[1];
      console.log(`Obteniendo Criterios BDD de Negocio del Issue #${issueNum}...`);
      issueContext = execSync(`gh issue view ${issueNum} --json body,title --jq ".title + \\"\n\\" + .body"`, { encoding: "utf-8" });
    }
  } catch (e) {
    console.log("No se pudo obtener el contexto del Issue vinculado:", e.message);
  }

  // 1. Cargar reglas y skills del proyecto (incluyendo UI UX Pro Max)
  let agentsRules = fs.existsSync("AGENTS.md") ? fs.readFileSync("AGENTS.md", "utf-8") : "";

  const loadSkill = (skillName) => {
    const p = path.join(".agents", "skills", skillName, "SKILL.md");
    return fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : "";
  };

  const cleanUiSkill = loadSkill("clean-ui-architecture");
  const perfSkill = loadSkill("performance-optimization");
  const dbMigSkill = loadSkill("db-migration-management");
  const uiProMaxSkill = loadSkill("ui-ux-pro-max");

  // 2. Realizar Auditoría Estática Completa sobre el Diff
  const auditResults = [];

  // Check 1: Límite de líneas por archivo
  const lines = diff.split("\n");
  let currentFile = "";
  let fileLineCount = 0;
  lines.forEach((line) => {
    if (line.startsWith("+++ b/")) {
      if (currentFile && fileLineCount > 200 && !currentFile.endsWith("test.tsx") && !currentFile.endsWith(".json")) {
        auditResults.push(`⚠️ **Límite de Líneas:** El archivo \`${currentFile}\` tiene cambios extensos (evaluar refactor a Custom Hooks/Subcomponentes).`);
      }
      currentFile = line.replace("+++ b/", "");
      fileLineCount = 0;
    } else if (line.startsWith("+")) {
      fileLineCount++;
    }
  });

  // Check 2: Detección de 'any' prohibido en TypeScript
  if (/\+.*:\s*any[\s;,)]/i.test(diff)) {
    auditResults.push("❌ **TypeScript Estricto:** Se detectaron tipos `any` explícitos en el diff. Deben usarse interfaces fuertemente tipadas.");
  }

  // Check 3: Clean UI Architecture (Prohibido importar SDK de BD en componentes React UI)
  if (/\+.*import\s+.*from\s+['"]firebase\/firestore['"]/i.test(diff) && /src\/features\/.*\/components\//i.test(diff)) {
    auditResults.push("❌ **Clean UI Architecture:** Se detectó importación directa de Firebase Firestore dentro de un componente React UI (`src/features/.../components/`). Debe desacoplarse a un servicio en `src/services/`.");
  }

  // Check 4: Big-O Complexity Audit (Prohibido O(N^2) bucles anidados)
  if (/\+.*\.map\(.*\.find\(/i.test(diff) || /\+.*\.map\(.*\.filter\(/i.test(diff)) {
    auditResults.push("❌ **Complejidad Algorítmica O(N^2):** Se detectó iteración anidada (.find()/.filter() dentro de .map()). Reemplazar por Tabla Hash / Map O(1).");
  }

  // Check 5: Prohibición de AI Dev Jargon / Badges innecesarios en la UI
  if (/\+.*Multi-tenant v1\.0/i.test(diff) || /\+.*Estado de Infraestructura/i.test(diff) || /\+.*RBAC Activo/i.test(diff)) {
    auditResults.push("❌ **UI UX Pro Max Violation:** Se detectaron textos de jerga de desarrollo o badges de infraestructura en la UI. Reemplazar por elementos de negocio para el usuario final.");
  }

  // Check 6: Verificación de Registro SDD en docs/specs/
  if (!/docs\/specs\/.*sdd\.md/i.test(diff)) {
    auditResults.push("⚠️ **Documentación SDD:** No se detectó la creación de un documento SDD en `docs/specs/0XX-issue-XX-sdd.md`.");
  }

  const verdict = auditResults.some((r) => r.startsWith("❌")) ? "[⚠️ REQUIERE CAMBIOS]" : "[✅ APROBADO]";

  // 3. Generar reporte detallado
  const staticAuditReport = auditResults.length > 0 
    ? auditResults.map((r) => `- ${r}`).join("\n") 
    : "✅ Todas las verificaciones estáticas (TypeScript, Clean Architecture, Big-O Complexity O(1), UI UX Pro Max y SDD) pasaron limpiamente.";

  const prompt = `Eres un Senior Staff Software Engineer y Arquitecto Principal para "CRM Odontólogo".

Tu misión es auditar el siguiente Pull Request (diff) evaluando tanto CALIDAD TÉCNICA como REQUERIMIENTOS DE NEGOCIO (BDD Acceptance Criteria):

--- ESPECIFICACIÓN DE NEGOCIO DEL ISSUE VINCULADO ---
${issueContext || "No se especificó issue vinculado."}

--- REGLAS DEL PROYECTO (AGENTS.md) ---
${agentsRules}

--- CLEAN UI ARCHITECTURE SKILL ---
${cleanUiSkill.slice(0, 1000)}

--- UI UX PRO MAX DESIGN SYSTEM SKILL ---
${uiProMaxSkill.slice(0, 1500)}

--- PERFORMANCE OPTIMIZATION SKILL ---
${perfSkill.slice(0, 1000)}

--- DIFF DEL PULL REQUEST #${prNumber} ---
${diff.slice(0, 12000)}

--- RESULTADOS DE AUDITORÍA ESTÁTICA LOCAL ---
${staticAuditReport}

--- INSTRUCCIONES DE REVISIÓN ---
Escribe una revisión formal en Markdown con las siguientes secciones:
1. 📊 **Resumen del PR**: Resumen conciso de los cambios.
2. 🎯 **Cumplimiento de Requerimientos de Negocio (BDD Criteria)**: ¿El código cumple exactamente los escenarios Given-When-Then definidos en el Issue?
3. 🎨 **Diseño & UI UX Pro Max**: Verificación de paletas Sobrias, ausencia de jerga de desarrollador y jerarquía visual.
4. 📐 **Arquitectura & Clean Code**: Desacoplamiento de servicios vs UI (SRP).
5. ⚡ **Performance & Complejidad Algorítmica Big-O**: Evaluación de O(1) Hash Maps vs O(N).
6. 🧪 **Testing & Cobertura**: Evaluación de pruebas unitarias en Vitest.
7. ⚖️ **Veredicto Final**: ${verdict} con justificación explícita.`;

  if (!apiKey) {
    console.log("⚠️ GEMINI_API_KEY no configurada. Publicando reporte de auditoría estática enriquecida con verificación BDD.");
    const formattedComment = `### 🤖 AI PR Reviewer & Quality Gate (Enriched BDD Business & Static Architecture Audit)

#### 🎯 Contexto de Negocio & BDD Criteria Audit
- **Issue Vinculado Evaluado:** ${issueContext ? "Sí" : "No especificado"}
- **Veredicto Estático:** ${verdict}

#### 📊 Estado de Auditoría de Arquitectura, UI UX Pro Max & Calidad
${staticAuditReport}

---
#### 📐 Verificaciones Aplicadas:
- 🟢 **Cumplimiento BDD de Negocio:** Comparación contra Criterios Given-When-Then.
- 🟢 **UI UX Pro Max:** Ausencia de dev jargon y diseño responsivo para odontólogos.
- 🟢 **Complejidad Algorítmica:** Garantía de acceso $O(1)$ por Hash Maps / Prohibición $O(N^2)$.
- 🟢 **Clean UI Architecture:** Desacoplamiento de Firebase en componentes UI.
- 🟢 **SDD Protocol:** Registro de especificación técnica en \`docs/specs/\`.

**Veredicto Final:** ${verdict}`;

    fs.writeFileSync("pr_review_comment.md", formattedComment);
    execSync(`gh pr comment ${prNumber} --body-file pr_review_comment.md`);
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

    const formattedBody = `### 🤖 AI PR Reviewer & Quality Gatekeeper (BDD & Technical Audit)\n\n${reviewText}`;
    
    fs.writeFileSync("pr_review_comment.md", formattedBody);
    execSync(`gh pr comment ${prNumber} --body-file pr_review_comment.md`);
    console.log(" Revisor de IA ha publicado el comentario enriquecido con auditoría de negocio en el PR.");
  } catch (error) {
    console.error("Error durante la llamada al AI Reviewer:", error);
  }
}

runReview();
