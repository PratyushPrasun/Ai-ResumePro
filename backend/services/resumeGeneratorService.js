const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Takes structured resume input data and a target job role,
 * uses Gemini AI to optimize all content for ATS compatibility.
 */
const optimizeResume = async (inputData, targetJobRole) => {
    if (!genAI) {
        throw new Error('GEMINI_API_KEY is not set or invalid.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are an expert ATS (Applicant Tracking System) resume engineer and career strategist.

TARGET JOB ROLE: "${targetJobRole}"

CANDIDATE DATA:
${JSON.stringify(inputData, null, 2)}

YOUR TASK:
1. Analyze the target job role to identify the top required skills, keywords, technologies, and project types.
2. Rewrite ALL bullet points using strong action verbs (e.g., "Engineered", "Spearheaded", "Optimized") with quantifiable metrics where possible.
3. Inject ATS-friendly keywords naturally throughout the resume (do NOT keyword-stuff).
4. Generate a compelling 2–3 sentence professional summary tailored to the target role.
5. Optimize the skills list — reorder by relevance to the target role, add any obvious missing skills.
6. If the candidate has fewer than 2 projects relevant to the target role, suggest 2–3 high-impact project ideas they could build.
7. Identify skills the candidate is missing for the target role.
8. Calculate an ATS score (0–100) based on keyword coverage, formatting quality, and role alignment.
9. Calculate keyword match percentage (what % of critical keywords for this role are present).
10. Keep EVERYTHING concise enough to fit on ONE page. Limit experience bullets to 2–3 per role, project bullets to 2 per project.

Return ONLY valid JSON (no markdown fencing) with this exact structure:
{
  "optimizedResume": {
    "fullName": "string",
    "phone": "string",
    "email": "string",
    "linkedIn": "string",
    "github": "string",
    "professionalSummary": "string (2-3 sentences)",
    "skills": ["skill1", "skill2", ...],
    "experience": [
      {
        "role": "string",
        "company": "string",
        "duration": "string",
        "bullets": ["action verb bullet 1", "action verb bullet 2"]
      }
    ],
    "projects": [
      {
        "title": "string",
        "techStack": "string",
        "bullets": ["impact-driven bullet 1", "impact-driven bullet 2"]
      }
    ],
    "education": [
      {
        "degree": "string",
        "institution": "string",
        "year": "string",
        "score": "string"
      }
    ],
    "certifications": ["cert1", "cert2"],
    "achievements": ["achievement1", "achievement2"]
  },
  "atsScore": 85,
  "keywordMatchPercentage": 78,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["missing1", "missing2"],
  "suggestedProjects": [
    {
      "title": "Project Name",
      "description": "Brief description of the project and its impact",
      "techStack": "Tech1, Tech2, Tech3"
    }
  ],
  "suggestedSkills": ["skill1", "skill2"]
}

IMPORTANT: Return ONLY the JSON object. No markdown, no code fences, no explanation.
`;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonString = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonString);
        return parsed;
    } catch (error) {
        console.error('Error in optimizeResume:', error);
        throw new Error('Failed to optimize resume with AI: ' + error.message);
    }
};

/**
 * Extracts structured data from raw resume text using AI,
 * then optimizes it for the target role.
 */
const optimizeFromText = async (resumeText, targetJobRole) => {
    if (!genAI) {
        throw new Error('GEMINI_API_KEY is not set or invalid.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const extractPrompt = `
You are an expert resume parser. Extract structured data from the following resume text.

RESUME TEXT:
${resumeText}

Return ONLY valid JSON (no markdown fencing) with this structure:
{
  "fullName": "string",
  "phone": "string",
  "email": "string",
  "linkedIn": "string or empty",
  "github": "string or empty",
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "role": "string",
      "company": "string",
      "duration": "string",
      "responsibilities": "string",
      "achievements": "string"
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string",
      "score": "string or empty"
    }
  ],
  "projects": [
    {
      "title": "string",
      "techStack": "string",
      "description": "string",
      "impact": "string"
    }
  ],
  "certifications": ["cert1"],
  "achievements": ["achievement1"]
}

IMPORTANT: Return ONLY the JSON object. No markdown, no code fences, no explanation. If a field is not found, use an empty string or empty array.
`;

    try {
        const extractResult = await model.generateContent(extractPrompt);
        const extractText = extractResult.response.text();
        const extractJson = extractText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const inputData = JSON.parse(extractJson);

        // Now optimize with the extracted data
        const optimized = await optimizeResume(inputData, targetJobRole);
        return { inputData, ...optimized };
    } catch (error) {
        console.error('Error in optimizeFromText:', error);
        throw new Error('Failed to process uploaded resume: ' + error.message);
    }
};

module.exports = { optimizeResume, optimizeFromText };
