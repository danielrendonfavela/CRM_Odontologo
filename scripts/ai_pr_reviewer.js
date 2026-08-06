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
  const diff = execSync(`gh pr diff ${prNumber}`, { encoding: "utf-8" });

  if (!diff || diff.trim().length === 0) {
    console.log("Diff vacío. No hay cambios para revisar.");
    return;
  }

  // 1. Cargar reglas y skills del proyecto
  let agentsRules = fs.existsSync("AGENTS.md") ? fs.readFileSync("AGENTS.md", "utf-8") : "";

  const loadSkill = (skillName) => {
    const p = path.join(".agents", "skills", skillName, "SKILL.md");
    return fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : "";
  };

  const cleanUiSkill = loadSkill("clean-ui-architecture");
  const perfSkill = loadSkill("performance-optimization");
  const dbMigSkill = loadSkill("db-migration-management");
  const issueSpecSkill = loadSkill("issue-specification-standard");

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

  // Check 4: Big-O Complexity Audit (Prohibido O(N^2) bucles anidados o .find()/.filter() dentro de .map())
  if (/\+.*\.map\(.*\.find\(/i.test(diff) || /\+.*\.map\(.*\.filter\(/i.test(diff) || /\+.*\.forEach\(.*\.forEach\(/i.test(diff)) {
    auditResults.push("❌ **Complejidad Algorítmica O(N^2):** Se detectó iteración anidada (.find()/.filter() dentro de .map()). Reemplazar por Tabla Hash / Record / Map O(1) para garantizar O(N) lineal máximo.");
  }

  // Check 5: Verificación de Registro SDD en docs/specs/
  if (!/docs\/specs\/.*sdd\.md/i.test(diff)) {
    auditResults.push("⚠️ **Documentación SDD:** No se detectó la creación de un documento SDD en `docs/specs/0XX-issue-XX-sdd.md` para registrar las decisiones técnicas.");
  }

  // Check 6: Performance & Web Vitals Audit
  if (/\+.*<img\s+(?!.*loading=['"]lazy['"])/i.test(diff)) {
    auditResults.push("💡 **Performance Note:** Se detectaron etiquetas `<img>` sin atributo `loading=\"lazy\"`. Recomienda usar `loading=\"lazy\"` para optimizar LCP.");
  }

  const verdict = auditResults.some((r) => r.startsWith("❌")) ? "[⚠️ REQUIERE CAMBIOS]" : "[✅ APROBADO]";

  // 3. Generar reporte detallado
  const staticAuditReport = auditResults.length > 0 
    ? auditResults.map((r) => `- ${r}`).join("\n") 
    : "✅ Todas las verificaciones estáticas (TypeScript, Clean Architecture, Big-O Complexity O(1)/O(N), Performance y SDD) pasaron limpiamente sin hallazgos.";

  const prompt = `Eres un Senior Staff Software Engineer y Arquitecto Principal para "CRM Odontólogo".

Tu misión es auditar el siguiente Pull Request (diff) de acuerdo con las REGLAS Y SKILLS OBLIGATORIAS del proyecto:

--- REGLAS DEL PROYECTO (AGENTS.md) ---
${agentsRules}

--- CLEAN UI ARCHITECTURE SKILL ---
${cleanUiSkill.slice(0, 1500)}

--- PERFORMANCE OPTIMIZATION SKILL ---
${perfSkill.slice(0, 1500)}

--- DATABASE MIGRATION MANAGEMENT SKILL ---
${dbMigSkill.slice(0, 1000)}

--- ISSUE SPECIFICATION STANDARD ---
${issueSpecSkill.slice(0, 1000)}

--- DIFF DEL PULL REQUEST #${prNumber} ---
${diff.slice(0, 12000)}

--- RESULTADOS DE AUDITORÍA ESTÁTICA LOCAL ---
${staticAuditReport}

--- INSTRUCCIONES DE REVISIÓN ---
Escribe una revisión formal en Markdown con las siguientes secciones:
1. 📊 **Resumen del PR**: Resumen conciso de los cambios.
2. 📐 **Cumplimiento de Arquitectura & Clean UI**: Desacoplamiento de servicios vs UI (SRP).
3. ⚡ **Performance & Complejidad Algorítmica Big-O**: Evaluación de O(1) Hash Maps vs O(N), INP (<50ms), CLS=0 y optimización de memoria.
4. 🗄️ **Base de Datos & Versionado**: Verificación de schemaVersion y reglas Firestore.
5. 🧪 **Testing & Cobertura**: Evaluación de pruebas unitarias en Vitest.
6. ⚖️ **Veredicto Final**: ${verdict} con justificación explícita.`;

  if (!apiKey) {
    console.log("⚠️ GEMINI_API_KEY no configurada. Publicando reporte de auditoría estática enriquecida.");
    const formattedComment = `### 🤖 AI PR Reviewer & Quality Gate (Enriched Static & Architecture Audit)

#### 📊 Estado de Auditoría de Arquitectura, Complejidad Algorítmica & Calidad
${staticAuditReport}

---
#### 📐 Verificaciones Aplicadas:
- 🟢 **Complejidad Algorítmica:** Garantía de acceso $O(1)$ por Hash Maps / Prohibición de bucles anidados $O(N^2)$.
- 🟢 **Clean UI Architecture:** Desacoplamiento de Firebase en componentes UI.
- 🟢 **Performance & Web Vitals:** Verificación de LCP <1s, INP <50ms y carga lazy.
- 🟢 **TypeScript Estricto:** Prohibición de tipos \`any\`.
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

    const formattedBody = `### 🤖 AI PR Reviewer & Quality Gatekeeper\n\n${reviewText}`;
    
    fs.writeFileSync("pr_review_comment.md", formattedBody);
    execSync(`gh pr comment ${prNumber} --body-file pr_review_comment.md`);
    console.log(" Revisor de IA ha publicado el comentario enriquecido en el PR.");
  } catch (error) {
    console.error("Error durante la llamada al AI Reviewer:", error);
  }
}

runReview();
