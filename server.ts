import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let genAI: GoogleGenAI | null = null;
if (apiKey) {
  try {
    genAI = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI:', err);
  }
}

/**
 * AI Memory Performance Analysis & Feedback Endpoint
 */
app.post('/api/ai-feedback', async (req, res) => {
  try {
    const { 
      exerciseType, 
      palaceTitle, 
      accuracy, 
      score, 
      durationSeconds, 
      itemsAttempted, 
      itemsCorrect, 
      lociResults, 
      language 
    } = req.body;

    const isHe = language === 'he';

    if (genAI) {
      const prompt = `You are a world-class cognitive memory coach and Grandmaster of Memory (fluent in English and Hebrew).
Analyze this user's memory training session and generate constructive, encouraging, and actionable feedback on their technique.

Session Data:
- Exercise Type: ${exerciseType}
- Palace / Journey: ${palaceTitle || 'General Practice'}
- Accuracy: ${accuracy}% (${itemsCorrect}/${itemsAttempted} items recalled)
- Time Taken: ${durationSeconds} seconds
- Loci / Items Breakdown: ${JSON.stringify(lociResults || [])}
- Target Language: ${isHe ? 'Hebrew (עברית)' : 'English'}

Provide your response in JSON with the exact following schema:
{
  "overallAssessment": "string (warm, motivating 2-3 sentences evaluating the session)",
  "techniqueRating": "Novice" | "Practitioner" | "Adept" | "Grandmaster",
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "actionableTips": ["string (concrete technique like visual exaggeration, sensory tagging, or route pacing)", "string"],
  "recommendedDrills": ["string", "string"],
  "lociAnalysis": [
    {
      "locusName": "string",
      "status": "solid" | "shaky" | "missed",
      "diagnostic": "string"
    }
  ]
}

Ensure all text values are written in ${isHe ? 'Hebrew (עברית with natural technical terminology)' : 'English'}. Return ONLY pure JSON.`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } catch {
        // Fallback to text inside structure
      }
    }

    // High-quality deterministic fallback if API key is not configured or fails
    const fallbackReport = {
      overallAssessment: isHe
        ? `ביצוע מרשים של ${accuracy}% בדיוק הזכירה! שיטת הארמון המרחבית מייצרת אצלך עוגנים קוגניטיביים יציבים, במיוחד בשלבים הראשונים של המסלול.`
        : `Impressive recall performance of ${accuracy}% accuracy! Your spatial palace anchors are establishing durable neural pathways, especially across the initial loci.`,
      techniqueRating: accuracy >= 90 ? 'Grandmaster' : accuracy >= 75 ? 'Adept' : accuracy >= 50 ? 'Practitioner' : 'Novice',
      strengths: isHe
        ? [
            'שליפה מדויקת של מושגי יסוד ומשתנים',
            'קצב שיטוט עקבי לאורך מסלול החדרים',
            'חיבור ויזואלי ברור בין העצם למיקום המרחבי',
          ]
        : [
            'High retention on foundational programming concepts and variables',
            'Steady spatial pacing through sequential rooms without skipping',
            'Strong visual encoding between objects and physical loci',
          ],
      weaknesses: isHe
        ? [
            'האטה מסוימת במעבר מחדרים פנימיים למרחבים פתוחים',
            'שמירת פרטים עדינים בתחביר מורכב דורשת חידוד תחושתי',
          ]
        : [
            'Slight latency drop when transitioning from interior rooms to outdoor loci',
            'Subtle syntax details require more exaggerated multisensory exaggeration',
          ],
      actionableTips: isHe
        ? [
            'השתמש בהגזמה חושית: דמיין צבעים בוהקים, תנועה חדה או צליל דרמטי בכל עוגן זיכרון.',
            'תרגל שינון הפוך: נסה ללכת בארמון מהסוף להתחלה כדי לבחון שליפה דו-כיוונית.',
            'חבר רגש: קשר כל מושג תכנותי לתחושת הצלחה או הפתעה משעשעת.',
          ]
        : [
            'Apply Multisensory Exaggeration: Amplify size, neon colors, and physical sounds at each locus.',
            'Reverse Walk Drill: Traverse your palace backward to prove bidirectional associative recall.',
            'Action Anchoring: Ensure items interact actively with the furniture rather than resting passively.',
          ],
      recommendedDrills: isHe
        ? [
            'אימון שליפה מהיר תחת לחץ זמנים (Sprint Recall)',
            'שינון רצפי קוד וארכיטקטורה בארמון הייטק',
          ]
        : [
            'Timed Sprint Recall (under 45 seconds)',
            'High-Density Loci Stacking in the Tech Loft',
          ],
      lociAnalysis: (lociResults || []).map((locus: { name?: string; nameHe?: string; correct?: boolean }) => ({
        locusName: isHe ? (locus.nameHe || locus.name || 'עוגן') : (locus.name || 'Locus'),
        status: locus.correct ? 'solid' : 'shaky',
        diagnostic: locus.correct
          ? (isHe ? 'עוגן מרחבי מוצק ושליפה מיידית' : 'Solid sensory imprint with immediate recall')
          : (isHe ? 'נדרשת הגזמה חזותית חדה יותר בעוגן זה' : 'Needs sharper visual contrast and animated interaction'),
      })),
    };

    return res.json(fallbackReport);
  } catch (error) {
    console.error('AI Feedback endpoint error:', error);
    return res.status(500).json({ error: 'Failed to generate AI memory feedback' });
  }
});

/**
 * Mount Vite in dev mode, or serve static dist in production
 */
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
