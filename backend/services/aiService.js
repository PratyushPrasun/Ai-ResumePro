const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini conditionally, handled gracefully if key is missing
let genAI;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const analyzeResumeWithAI = async (resumeText, jobDescription) => {
    // If no Gemini key, throw error
    if (!genAI) {
        throw new Error('GEMINI_API_KEY is not set or invalid.');
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are an expert ATS (Applicant Tracking System) and senior technical recruiter. 
Analyze the following resume against the provided job description.

Job Description:
${jobDescription || "Not provided, focus on general software engineering metrics"}

Resume:
${resumeText}

Provide a detailed analysis in strictly valid JSON format with the following keys exactly:
- "atsScore": a number out of 100 representing the ATS match score.
- "keywordMatch": an array of strings representing matching keywords/skills.
- "missingSkills": an array of strings representing missing critical skills.
- "improvementSuggestions": an array of strings representing actionable suggestions for improvement.
- "selectionProbability": a string, e.g., "Low", "Medium", "High".
- "jobRecommendations": an array of objects, each containing "role" (string) and "explanation" (string).
- "optimizedSummary": a string representing an ATS-optimized summary based on the resume.

ONLY return the JSON object, with no markdown formatting like \`\`\`json. Valid JSON only.
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonString = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(jsonString);
        return analysis;
    } catch (error) {
        console.error('Error in analyzeResumeWithAI:', error);
        throw error;
    }
};

module.exports = { analyzeResumeWithAI };
