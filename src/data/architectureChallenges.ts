import { ArchitectureChallenge } from '../types';

export const ARCHITECTURE_CHALLENGES: ArchitectureChallenge[] = [
  {
    id: 'arch-n-plus-one',
    title: 'The Database Loop Storm (N+1 Query Pattern)',
    titleHe: 'סופת שאילתות בלולאה (דפוס N+1)',
    category: 'scalability',
    difficulty: 'Intermediate',
    scenarioDescription: 'An e-commerce API endpoint retrieves the latest 500 customer orders and enriches each order with customer profile information.',
    scenarioDescriptionHe: 'נקודת קצה (API) בחנות מקוונת שולפת את 500 ההזמנות האחרונות ומעשירה כל הזמנה בפרטי הפרופיל של הלקוח.',
    language: 'typescript',
    expectedQuality: 'bad_crashing',
    antiPatternName: 'N+1 Query Storm & Connection Pool Exhaustion',
    antiPatternNameHe: 'צוואר בקבוק N+1 ומיצוי מאגר חיבורי המסד (Pool Exhaustion)',
    architecturalPrinciple: 'Batch Data Fetching & Eager Loading',
    architecturalPrincipleHe: 'שליפת נתונים מרוכזת (Batching) וטעינה ישירה (Eager Loading)',
    codeSnippet: `// GET /api/admin/recent-orders
export async function getRecentOrders(req: Request, res: Response) {
  // 1. Fetch 500 recent orders (Query #1)
  const orders = await db.query('SELECT id, user_id, total, status FROM orders LIMIT 500');

  const enrichedOrders = [];
  
  // 💥 DANGER: Querying inside a loop! Generates 500 additional database roundtrips!
  for (const order of orders) {
    const user = await db.query(
      'SELECT id, name, email, tier FROM users WHERE id = ?', 
      [order.user_id]
    );
    enrichedOrders.push({
      ...order,
      customer: user[0] || null
    });
  }

  return res.json({ orders: enrichedOrders });
}`,
    diagnosticQuestion: 'Why is this architectural design dangerous for production scale?',
    diagnosticQuestionHe: 'מדוע תכנון ארכיטקטוני זה מסוכן ביותר בסביבת פרודקשן עם משתמשים אמיתיים?',
    diagnosticOptions: [
      {
        id: 'diag-1-correct',
        text: 'It triggers 501 distinct database round-trips for a single HTTP request, exhausting the connection pool and causing massive latency spikes.',
        isCorrect: true,
        explanation: 'Correct! 1 query for orders + 500 individual queries for users = 501 network roundtrips. Under multiple concurrent requests, database connections are instantly exhausted.'
      },
      {
        id: 'diag-1-wrong-1',
        text: 'The orders array should use Array.map instead of a for...of loop for faster asynchronous execution.',
        isCorrect: false,
        explanation: 'Array.map with Promise.all still fires 500 individual queries simultaneously, worsening database connection saturation.'
      },
      {
        id: 'diag-1-wrong-2',
        text: 'The code should use MongoDB instead of SQL to solve loop queries.',
        isCorrect: false,
        explanation: 'The N+1 pattern is an architectural data access anti-pattern that affects SQL and NoSQL equally when queries are executed inside iterative loops.'
      }
    ],
    diagnosticOptionsHe: [
      {
        id: 'diag-1-correct',
        text: 'הקוד מייצר 501 קריאות רשת נפרדות למסד עבור בקשת HTTP בודדת, מה שחונק את מאגר החיבורים (Connection Pool) ומקפיץ את זמני התגובה.',
        isCorrect: true,
        explanation: 'מדויק! שאילתה אחת עבור ההזמנות + 500 שאילתות נפרדות עבור הלקוחות = 501 קריאות רשת. בעומס של משתמשים מרובים, מאגר החיבורים קורס מיד.'
      },
      {
        id: 'diag-1-wrong-1',
        text: 'הבעיה היא שלא השתמשו ב-Array.map במקום לולאת for...of.',
        isCorrect: false,
        explanation: 'שימוש ב-map עם Promise.all עדיין ישגר 500 שאילתות נפרדות במקביל ויציף את מסד הנתונים בעוצמה גבוהה אף יותר.'
      },
      {
        id: 'diag-1-wrong-2',
        text: 'הבעיה נובעת משימוש ב-SQL במקום במסד NoSQL.',
        isCorrect: false,
        explanation: 'תבנית N+1 היא בעיית ארכיטקטורה של גישה לנתונים שפוגעת בכל מסד נתונים כאשר שולפים נתונים בתוך לולאה.'
      }
    ],
    productionImpactQuestion: 'What will happen when 100 concurrent administrators access this endpoint?',
    productionImpactQuestionHe: 'מה יקרה בפרודקשן כאשר 100 מנהלים ייגשו לעמוד זה בו-זמנית?',
    productionImpactOptions: [
      {
        id: 'prod-1-correct',
        text: '50,100 database queries flood the server, crashing the DB connection pool with HTTP 504 Gateway Timeout errors.',
        isCorrect: true,
        explanation: 'Exactly! 100 requests × 501 queries = 50,100 queries. Latency jumps from 15ms to over 5,000ms and the app crashes.'
      },
      {
        id: 'prod-1-wrong-1',
        text: 'The browser client will run out of CSS styles and render raw HTML.',
        isCorrect: false,
        explanation: 'CSS rendering is unrelated to backend database connection exhaustion.'
      },
      {
        id: 'prod-1-wrong-2',
        text: 'Orders will be duplicated in the database.',
        isCorrect: false,
        explanation: 'SELECT queries do not write or duplicate data, but they exhaust server memory and socket descriptors.'
      }
    ],
    productionImpactOptionsHe: [
      {
        id: 'prod-1-correct',
        text: '50,100 שאילתות יציפו את מסד הנתונים, ימצו את מאגר החיבורים ויגרמו לקריסת HTTP 504 Gateway Timeout.',
        isCorrect: true,
        explanation: 'בדיוק! 100 בקשות כפול 501 שאילתות = 50,100 שאילתות. זמני התגובה יזנקו משבריר שנייה ל-5 שניות והשרת ייפול.'
      },
      {
        id: 'prod-1-wrong-1',
        text: 'הדפדפן יאבד את קובצי העיצוב (CSS).',
        isCorrect: false,
        explanation: 'קובצי עיצוב אינם קשורים לקריסת מאגר החיבורים בשרת הנתונים.'
      },
      {
        id: 'prod-1-wrong-2',
        text: 'ההזמנות ישוכפלו במסד הנתונים.',
        isCorrect: false,
        explanation: 'שאילתות SELECT אינן משכפלות נתונים, אך הן תוקעות את המערכת.'
      }
    ],
    simulatedMetrics: {
      loadRps: 100,
      bad: {
        cpuPercent: 96,
        memoryMb: 612,
        latencyMs: 4850,
        errorRatePercent: 68,
        crashReason: 'ConnectionPoolTimeout: 50,000 queries queued. DB connection pool max (20) exceeded.',
        crashReasonHe: 'שגיאת תפוסת מאגר: מעל 50,000 שאילתות בתור. חריגה מקיבולת החיבורים למסד הנתונים.'
      },
      good: {
        cpuPercent: 14,
        memoryMb: 86,
        latencyMs: 18,
        errorRatePercent: 0
      }
    },
    badCodeExplanation: 'The code executes an independent database query inside an iteration block for every single order. This architectural defect is known as the N+1 Query Problem.',
    badCodeExplanationHe: 'הקוד מבצע שאילתה נפרדת למסד הנתונים בתוך לולאה עבור כל הזמנה בודדת. פגם ארכיטקטוני זה מכונה בעיית N+1.',
    goodCodeSnippet: `// GET /api/admin/recent-orders (SCALABLE & EFFICIENT)
export async function getRecentOrders(req: Request, res: Response) {
  // 1. Fetch orders
  const orders = await db.query('SELECT id, user_id, total, status FROM orders LIMIT 500');
  if (orders.length === 0) return res.json({ orders: [] });

  // 2. Collect unique user IDs into an indexed set
  const userIds = [...new Set(orders.map(o => o.user_id))];

  // 3. Single batch query with SQL IN operator (1 round-trip instead of 500!)
  const users = await db.query(
    'SELECT id, name, email, tier FROM users WHERE id IN (?)',
    [userIds]
  );
  
  // 4. O(1) hash map lookup for lightning-fast in-memory stitching
  const userMap = new Map(users.map(u => [u.id, u]));

  const enrichedOrders = orders.map(order => ({
    ...order,
    customer: userMap.get(order.user_id) || null
  }));

  return res.json({ orders: enrichedOrders });
}`,
    goodCodeExplanation: 'By collecting all IDs and performing a single batched query using the SQL IN clause, the network overhead is cut from 501 trips down to 2 trips. Total response time drops from 4,850ms to 18ms.',
    goodCodeExplanationHe: 'על ידי איסוף כל המזהים וביצוע שאילתת Batch אחת מרוכזת עם סעיף IN, מספר קריאות הרשת צונח מ-501 ל-2 בלבד! זמן התגובה יורד מ-4.8 שניות ל-18 מילישניות בלבד.',
    keyTakeaways: [
      'Never execute database queries, HTTP requests, or heavy disk I/O inside iterative loops.',
      'Batch IDs using SQL IN operators or JOIN clauses.',
      'Use fast O(1) in-memory HashMaps to link relations together.'
    ],
    keyTakeawaysHe: [
      'לעולם אל תריץ שאילתות למסד נתונים או קריאות רשת בתוך לולאות.',
      'רכז מזהים ובצע שאילתה יחידה בעזרת IN או JOIN.',
      'השתמש ב-HashMaps בזיכרון (O(1)) לחיבור ישיר ומהיר בין הישויות.'
    ],
    xpReward: 45
  },
  {
    id: 'arch-memory-leak-frontend',
    title: 'The Ghost Listener Memory Leak (Frontend Lifecycle)',
    titleHe: 'דליפת זיכרון ממאזינים נטושים (Lifecycle בפרונטאנד)',
    category: 'frontend',
    difficulty: 'Intermediate',
    scenarioDescription: 'A live crypto tracking component listens to global window scroll/resize events and polls live market tickers.',
    scenarioDescriptionHe: 'רכיב מעקב מחירי קריפטו בזמן אמת מאזין לאירועי גלילה ושינוי גודל חלון ודוגם נתוני מסחר.',
    language: 'typescript',
    expectedQuality: 'bad_crashing',
    antiPatternName: 'Uncleaned Event Listener & Detached DOM Memory Leak',
    antiPatternNameHe: 'דליפת זיכרון של מאזיני אירועים ללא שחרור (Memory Leak)',
    architecturalPrinciple: 'Deterministic Resource Cleanup & Garbage Collection Friendliness',
    architecturalPrincipleHe: 'שחרור משאבים דטרמיניסטי ותאימות ל-Garbage Collector',
    codeSnippet: `// LiveTickerChart.tsx
import React, { useEffect, useState } from 'react';

export const LiveTickerChart: React.FC = () => {
  const [tickerData, setTickerData] = useState([]);

  useEffect(() => {
    // 💥 DANGER: Adding high-frequency listener without cleanup!
    window.addEventListener('resize', () => {
      recalculateChartDimensions();
    });

    // 💥 DANGER: Uncleaned interval continues running even after unmount!
    setInterval(async () => {
      const res = await fetch('/api/live-rates');
      const data = await res.json();
      setTickerData(data); // State update on unmounted component!
    }, 1000);

    // MISSING: return () => { cleanup(); }
  }, []);

  return <div className="chart-container">Chart Live Data</div>;
};`,
    diagnosticQuestion: 'What catastrophic issue occurs as users navigate back and forth between pages in this app?',
    diagnosticQuestionHe: 'מה יקרה כאשר המשתמש ינווט הלוך ושוב בין עמודים באפליקציה זו?',
    diagnosticOptions: [
      {
        id: 'diag-2-correct',
        text: 'Every visit creates orphaned intervals and window listeners that can never be garbage collected, causing runaway RAM growth and browser tab crashes.',
        isCorrect: true,
        explanation: 'Correct! Because the component never detaches its listeners or cancels its timer, old closures remain permanently pinned in browser RAM.'
      },
      {
        id: 'diag-2-wrong-1',
        text: 'React will automatically clean up all window event listeners upon component destruction.',
        isCorrect: false,
        explanation: 'Incorrect! The browser window object is global; React cannot automatically unbind manual window listeners.'
      },
      {
        id: 'diag-2-wrong-2',
        text: 'The chart will display inverted colors.',
        isCorrect: false,
        explanation: 'Memory leaks cause memory exhaustion and browser tab death, not visual color inversion.'
      }
    ],
    diagnosticOptionsHe: [
      {
        id: 'diag-2-correct',
        text: 'כל כניסה לעמוד מייצרת טיימרים ומאזינים יתומים שמונעים שחרור זיכרון, מה שמוביל לגידול בלתי פוסק בצריכת ה-RAM ולקריסת לשונית הדפדפן.',
        isCorrect: true,
        explanation: 'מדויק! מאחר שהרכיב אינו מנקה את המאזין או הטיימר, אובייקט ה-window הגלובלי מחזיק אותם בזיכרון לנצח.'
      },
      {
        id: 'diag-2-wrong-1',
        text: 'ריאקט מנקה באופן אוטומטי את כל המאזינים של window בהריסת הרכיב.',
        isCorrect: false,
        explanation: 'לא נכון! אובייקט window הוא גלובלי לדפדפן; ריאקט לא יכולה לנחש או להסיר מאזינים שהוגדרו ידנית.'
      },
      {
        id: 'diag-2-wrong-2',
        text: 'הגרף יוצג בצבעים הפוכים.',
        isCorrect: false,
        explanation: 'דליפת זיכרון גורמת לאיטיות ולנפילת הלשונית, ולא להשפעה על צבעי הגרף.'
      }
    ],
    productionImpactQuestion: 'How does this bug manifest in user sessions after 15 minutes of app usage?',
    productionImpactQuestionHe: 'כיצד תקלה זו תבוא לידי ביטוי במחשבי המשתמשים לאחר 15 דקות שימוש?',
    productionImpactOptions: [
      {
        id: 'prod-2-correct',
        text: 'The browser tab climbs from 40 MB to over 1.5 GB of RAM, UI lags to single-digit FPS, and the browser crashes with "Aw, Snap! Out of Memory".',
        isCorrect: true,
        explanation: 'Spot on! Hundreds of redundant timers firing every second consume all CPU cores and blow past memory caps.'
      },
      {
        id: 'prod-2-wrong-1',
        text: 'The server shuts down due to database deadlock.',
        isCorrect: false,
        explanation: 'This is a client-side frontend browser lifecycle bug, not a database transaction deadlock.'
      },
      {
        id: 'prod-2-wrong-2',
        text: 'The user will be logged out of their operating system.',
        isCorrect: false,
        explanation: 'Browsers are sandboxed; only the tab or browser process is affected.'
      }
    ],
    productionImpactOptionsHe: [
      {
        id: 'prod-2-correct',
        text: 'צריכת הזיכרון של הלשונית מזנקת מ-40MB למעל 1.5GB, ממשק המשתמש מתחיל לגמגם, ולבסוף הדפדפן קורס עם הודעת Out of Memory.',
        isCorrect: true,
        explanation: 'בול! עשרות טיימרים שממשיכים לרוץ ברקע חונקים את ה-CPU ומציפים את הזיכרון עד לקריסה.'
      },
      {
        id: 'prod-2-wrong-1',
        text: 'השרת המרכזי ייכבה עקב נעילת מסד נתונים.',
        isCorrect: false,
        explanation: 'מדובר בבאג צד-לקוח בדפדפן ולא בנעילת טרנזקציות במסד נתונים.'
      },
      {
        id: 'prod-2-wrong-2',
        text: 'המשתמש ינותק ממערכת ההפעלה שלו.',
        isCorrect: false,
        explanation: 'הדפדפן רץ בארגז חול (Sandbox), לכן רק הלשונית הספציפית תקרוס.'
      }
    ],
    simulatedMetrics: {
      loadRps: 1,
      bad: {
        cpuPercent: 88,
        memoryMb: 1420,
        latencyMs: 950,
        errorRatePercent: 100,
        crashReason: 'Browser OutOfMemory: DOM detached nodes = 4,210. Uncaught (in promise) on unmounted component.',
        crashReasonHe: 'קריסת זיכרון דפדפן (OOM): מעל 4,200 צמתי DOM מנותקים שמורים בזיכרון.'
      },
      good: {
        cpuPercent: 3,
        memoryMb: 38,
        latencyMs: 12,
        errorRatePercent: 0
      }
    },
    badCodeExplanation: 'Missing teardown logic inside useEffect leaves global handlers and timers permanently attached to the window object, retaining all component closures in memory.',
    badCodeExplanationHe: 'היעדר פונקציית ניקוי (cleanup) ב-useEffect משאיר מאזינים וטיימרים מחוברים לנצח לחלון הגלובלי, מה שמונע שחרור זיכרון.',
    goodCodeSnippet: `// LiveTickerChart.tsx (CLEAN, SAFE & LEAK-FREE)
import React, { useEffect, useState } from 'react';

export const LiveTickerChart: React.FC = () => {
  const [tickerData, setTickerData] = useState([]);

  useEffect(() => {
    // 1. AbortController to cancel inflight fetch requests on unmount
    const abortController = new AbortController();

    const handleResize = () => {
      recalculateChartDimensions();
    };

    window.addEventListener('resize', handleResize);

    const intervalId = window.setInterval(async () => {
      try {
        const res = await fetch('/api/live-rates', { signal: abortController.signal });
        const data = await res.json();
        setTickerData(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err);
        }
      }
    }, 1000);

    // ✨ CLEAN ARCHITECTURE: Deterministic teardown on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.clearInterval(intervalId);
      abortController.abort(); // Cancel any pending network stream!
    };
  }, []);

  return <div className="chart-container">Chart Live Data</div>;
};`,
    goodCodeExplanation: 'The return function cleans up listeners and intervals when the component unmounts. An AbortController ensures no state is set on dead components.',
    goodCodeExplanationHe: 'פונקציית ה-cleanup מסירה את המאזין ומנקה את האינטרוול בהריסת הרכיב. בנוסף, AbortController מבטל קריאות רשת תלויות ומגן על תקינות המערכת.',
    keyTakeaways: [
      'Always return a cleanup function from useEffect when subscribing to external resources.',
      'Use AbortController to cancel pending HTTP fetches when components unmount.',
      'Clear window intervals and event listeners to prevent garbage collector leaks.'
    ],
    keyTakeawaysHe: [
      'החזר תמיד פונקציית ניקוי (cleanup) מתוך useEffect בעת הרשמה למשאבים חיצוניים.',
      'השתמש ב-AbortController לביטול קריאות רשת בעת פירוק הרכיב.',
      'בטל טיימרים (clearInterval) ומאזיני אירועים כדי לאפשר פינוי זיכרון תקין.'
    ],
    xpReward: 45
  },
  {
    id: 'arch-swallowed-errors',
    title: 'The Silent Catastrophe (Swallowed Exceptions & Corrupted State)',
    titleHe: 'הקטסטרופה השקטה (בליעת חריגות ומצב פגום)',
    category: 'error_handling',
    difficulty: 'Intermediate',
    scenarioDescription: 'A multi-step financial transaction coordinates credit card billing, database ledger updates, and shipment dispatching.',
    scenarioDescriptionHe: 'עסקת מסחר רב-שלבית המשלבת חיוב כרטיס אשראי, עדכון יתרות במסד נתונים ושילוח חבילות.',
    language: 'typescript',
    expectedQuality: 'bad_crashing',
    antiPatternName: 'Silent Error Swallowing & Inconsistent Distributed State',
    antiPatternNameHe: 'בליעת שגיאות שקטה ומצב נתונים לא עקבי',
    architecturalPrinciple: 'Fail-Fast Principle, Transactional Integrity & Structured Observability',
    architecturalPrincipleHe: 'עקרון הכשל המהיר (Fail-Fast), אמינות טרנזקציונית וניטור שגיאות',
    codeSnippet: `// checkoutService.ts
export async function processOrder(orderData: Order) {
  try {
    // Step 1: Charge the customer via Stripe
    const chargeResult = await paymentGateway.charge({
      amount: orderData.total,
      currency: 'USD'
    });

    // Step 2: Record transaction in SQL ledger
    await db.query('INSERT INTO transactions (order_id, charge_id) VALUES (?, ?)', [
      orderData.id,
      chargeResult.id
    ]);

    // Step 3: Trigger automated warehouse robot shipping
    await warehouseApi.dispatchPackage(orderData.id);

  } catch (error) {
    // 💥 CATASTROPHIC ANTI-PATTERN: Silent swallow! 
    // No error re-thrown, no database rollback, no customer alert, no logs!
    console.log('Something might have happened but ignoring it.');
  }

  // Returns HTTP 200 OK even if payment or shipping completely failed!
  return { status: 'success' };
}`,
    diagnosticQuestion: 'What makes silent error swallowing so destructive to production systems?',
    diagnosticQuestionHe: 'מדוע בליעת שגיאות ללא טיפול היא אחת התקלות החמורות ביותר במערכות תוכנה?',
    diagnosticOptions: [
      {
        id: 'diag-3-correct',
        text: 'It corrupts business state by continuing execution after partial failure, hides bugs from monitoring alerts, and falsely reports success to users.',
        isCorrect: true,
        explanation: 'Exactly right. A failure in step 2 or 3 might ship goods without payment, or take money without recording a transaction, while the system claims success.'
      },
      {
        id: 'diag-3-wrong-1',
        text: 'It makes JavaScript run synchronously instead of asynchronously.',
        isCorrect: false,
        explanation: 'Try/catch does not alter the underlying asynchronous event loop semantics.'
      },
      {
        id: 'diag-3-wrong-2',
        text: 'The try block takes 10x more CPU cycles than an if statement.',
        isCorrect: false,
        explanation: 'Modern V8 engines optimize try blocks with near-zero overhead unless exceptions are thrown.'
      }
    ],
    diagnosticOptionsHe: [
      {
        id: 'diag-3-correct',
        text: 'היא משחיתה את עקביות הנתונים העסקית, מסתירה כשלים מכלי הניטור וההתראות, ומחזירה הודעת הצלחה כוזבת למשתמש.',
        isCorrect: true,
        explanation: 'בדיוק נמרץ! כשל בשלב 2 או 3 עלול להביא למשלוח מוצר ללא תשלום או לחיוב ללא תיעוד, כאשר המערכת מדווחת שהכל תקין.'
      },
      {
        id: 'diag-3-wrong-1',
        text: 'היא הופכת את ג\'אווהסקריפט לשפת הרצה סינכרונית בלבד.',
        isCorrect: false,
        explanation: 'בלוק try/catch אינו משנה את מנגנון ה-Event Loop האסינכרוני.'
      },
      {
        id: 'diag-3-wrong-2',
        text: 'בלוק try צורך פי 10 יותר משאבי מעבד.',
        isCorrect: false,
        explanation: 'מנועי JS מודרניים מייעלים בלוקים של try ללא תקורת מעבד משמעותית.'
      }
    ],
    productionImpactQuestion: 'What real-world disaster does this bug cause in production?',
    productionImpactQuestionHe: 'איזה אסון עסקי יתרחש בפרודקשן כתוצאה מקוד זה?',
    productionImpactOptions: [
      {
        id: 'prod-3-correct',
        text: 'Customers are charged without receiving orders, inventory counts become desynchronized, and engineering has zero trace logs to diagnose the issue.',
        isCorrect: true,
        explanation: 'Yes! Financial discrepancy, angry customers, and un-debuggable ghost errors in production.'
      },
      {
        id: 'prod-3-wrong-1',
        text: 'The server\'s physical hard drive will be demagnetized.',
        isCorrect: false,
        explanation: 'Logical exceptions cannot cause hardware magnetic corruption.'
      }
    ],
    productionImpactOptionsHe: [
      {
        id: 'prod-3-correct',
        text: 'לקוחות יחויבו בכרטיס אשראי מבלי לקבל מוצר, המלאי יתעוות, ולצוות הפיתוח לא יהיה שום לוג או התראה כדי לדעת מה קרה.',
        isCorrect: true,
        explanation: 'בדיוק! נזק כספי חמור, לקוחות זועמים וחוסר יכולת לאתר את מקור התקלה.'
      },
      {
        id: 'prod-3-wrong-1',
        text: 'הכונן הקשיח של השרת יימחק פיזית.',
        isCorrect: false,
        explanation: 'שגיאות תוכנה לוגיות אינן יכולות לגרום לפגיעה פיזית בחומרה.'
      }
    ],
    simulatedMetrics: {
      loadRps: 50,
      bad: {
        cpuPercent: 32,
        memoryMb: 110,
        latencyMs: 140,
        errorRatePercent: 0, // Horrifying: reports 0% error rate despite massive internal corruption!
        crashReason: 'DataIntegrityFailure: 42 customers billed with missing DB records. 18 ghost packages dispatched.',
        crashReasonHe: 'שגיאת שלמות נתונים: 42 לקוחות חויבו ללא תיעוד במאגר. 18 חבילות נשלחו ללא תשלום.'
      },
      good: {
        cpuPercent: 12,
        memoryMb: 92,
        latencyMs: 45,
        errorRatePercent: 2 // Transparent and recorded!
      }
    },
    badCodeExplanation: 'Swallowing errors hides catastrophic failures from metrics, ignores transactional rollbacks, and falsely returns success when the system is in an inconsistent state.',
    badCodeExplanationHe: 'בליעת שגיאות שקטה מעוורת את מערכות הניטור, מדלגת על ביטול טרנזקציות (Rollback) ומחזירה מצג שווא של הצלחה למשתמשים.',
    goodCodeSnippet: `// checkoutService.ts (TRANSACTIONAL & OBSERVABLE)
export async function processOrder(orderData: Order) {
  // Use a transactional database connection
  const tx = await db.beginTransaction();

  try {
    // 1. First lock & verify inventory inside the transaction
    const reserved = await tx.query(
      'UPDATE inventory SET available = available - 1 WHERE id = ? AND available > 0',
      [orderData.productId]
    );
    if (reserved.affectedRows === 0) {
      throw new OutOfStockError(\`Item \${orderData.productId} is sold out\`);
    }

    // 2. Charge customer with idempotency key
    const charge = await paymentGateway.charge({
      amount: orderData.total,
      idempotencyKey: \`order_\${orderData.id}\`
    });

    // 3. Persist record inside transaction
    await tx.query('INSERT INTO transactions (order_id, charge_id) VALUES (?, ?)', [
      orderData.id,
      charge.id
    ]);

    // Commit only if all stages succeeded
    await tx.commit();

    // 4. Asynchronous message queue for warehouse dispatch (decoupled!)
    await queue.enqueue('dispatch_package', { orderId: orderData.id });

    return { status: 'success', orderId: orderData.id };
  } catch (error) {
    // ✨ ROLLBACK: Ensure zero partial database mutations
    await tx.rollback();

    // Structured logging with context and alert metrics
    logger.error('Checkout failed, transaction rolled back safely', {
      orderId: orderData.id,
      error: error instanceof Error ? error.message : error
    });

    // Re-throw typed domain error for the HTTP layer to return proper 4xx/5xx code
    throw error;
  }
}`,
    goodCodeExplanation: 'Transactions ensure atomicity (all succeed or all rollback). Typed error propagation alerts monitoring tools and returns accurate HTTP status codes.',
    goodCodeExplanationHe: 'שימוש בטרנזקציות מבטיח אטומיות (הכל מצליח או הכל מבוטל). שגיאות מנוטרות בלוגים ומחזירות קודי שגיאה מתאימים (HTTP 4xx/5xx).',
    keyTakeaways: [
      'Never catch an error just to log a string and swallow it.',
      'Always roll back database transactions on failure (ACID atomicity).',
      'Use structured logging and alert systems to track production exceptions.'
    ],
    keyTakeawaysHe: [
      'לעולם אל תבלע שגיאות בצורה שקטה מבלי לטפל בהן או להחזירן למעלה.',
      'בצע תמיד ביטול טרנזקציה (Rollback) במקרה של תקלה.',
      'השתמש ברישום לוגים מסודר (Structured Logging) כדי לאפשר ניטור ותחקור.'
    ],
    xpReward: 45
  },
  {
    id: 'arch-event-loop-blocking',
    title: 'The Event Loop Freeze (CPU-Bound Synchronous Work)',
    titleHe: 'קיפאון ה-Event Loop (משימת חישוב כבדה וסינכרונית בשרת)',
    category: 'scalability',
    difficulty: 'Advanced',
    scenarioDescription: 'A web backend generates password hashes or processes high-resolution image thumbnails during user HTTP requests.',
    scenarioDescriptionHe: 'שרת אינטרנט מעבד הצפנת סיסמאות מורכבת או כיווץ תמונות גדולות ישירות בתוך בקשת ה-HTTP של המשתמש.',
    language: 'javascript',
    expectedQuality: 'bad_crashing',
    antiPatternName: 'Event Loop Starvation & Synchronous CPU Block',
    antiPatternNameHe: 'הרעבת ה-Event Loop וחסימת תהליך השרת (CPU Blocking)',
    architecturalPrinciple: 'Non-Blocking I/O & Worker Thread Offloading',
    architecturalPrincipleHe: 'קלט/פלט לא חוסם והעברת משימות כבדות ל-Worker Threads',
    codeSnippet: `// authController.js
const crypto = require('crypto');

// POST /api/register
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  // 💥 DISASTROUS: pbkdf2Sync with 500,000 iterations blocks the single-threaded Event Loop!
  // During these 800ms of synchronous CPU calculation, 
  // Node.js CANNOT accept, process, or respond to ANY other user request!
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 500000, 64, 'sha512').toString('hex');

  db.saveUser({ username, hash, salt });
  return res.json({ success: true });
});`,
    diagnosticQuestion: 'Why does synchronous CPU computation cripple Node.js web applications?',
    diagnosticQuestionHe: 'מדוע פעולת חישוב סינכרונית כבדה משתקת שרת מבוסס Node.js?',
    diagnosticOptions: [
      {
        id: 'diag-4-correct',
        text: 'Node.js is single-threaded for JavaScript execution; a synchronous CPU calculation locks the entire process, freezing all concurrent user requests.',
        isCorrect: true,
        explanation: 'Spot on! The Event Loop can only execute one chunk of JS at a time. While pbkdf2Sync runs, the server is totally unresponsive to all clients.'
      },
      {
        id: 'diag-4-wrong-1',
        text: 'The password salt is too short.',
        isCorrect: false,
        explanation: 'A 16-byte random salt is cryptographically sufficient; the issue is synchronous execution blocking the thread.'
      },
      {
        id: 'diag-4-wrong-2',
        text: 'Node.js does not support hashing algorithms.',
        isCorrect: false,
        explanation: 'Node.js has extensive built-in cryptographic support; the flaw is choosing synchronous API over asynchronous workers.'
      }
    ],
    diagnosticOptionsHe: [
      {
        id: 'diag-4-correct',
        text: 'מנוע Node.js מריץ JavaScript על תהליכון (Thread) יחיד; חישוב סינכרוני נועל את כל ה-Event Loop ומקפיא את כל יתר המשתמשים במערכת.',
        isCorrect: true,
        explanation: 'בדיוק! לולאת האירועים יכולה להריץ רק פעולה אחת בו-זמנית. בזמן שהחישוב הסינכרוני מתבצע, השרת אינו מסוגל לענות לאף פנייה אחרת.'
      },
      {
        id: 'diag-4-wrong-1',
        text: 'אורך ה-salt קצר מדי.',
        isCorrect: false,
        explanation: '16 בייטים הוא אורך תקני ומאובטח. הבעיה היא החסימה הסינכרונית של השרת.'
      },
      {
        id: 'diag-4-wrong-2',
        text: 'שפת Node.js אינה תומכת בפונקציות גיבוב.',
        isCorrect: false,
        explanation: 'Node.js תומכת באלגוריתמי הצפנה מתקדמים, אך יש להשתמש בגרסה אסינכרונית ולא חוסמת.'
      }
    ],
    productionImpactQuestion: 'What will happen when 50 users register at the same time?',
    productionImpactQuestionHe: 'מה יקרה כאשר 50 משתמשים יירשמו בו-זמנית למערכת?',
    productionImpactOptions: [
      {
        id: 'prod-4-correct',
        text: 'All API routes (even simple health checks) freeze. Response times escalate to 40+ seconds, triggering Kubernetes pod restarts and 502 Bad Gateway outages.',
        isCorrect: true,
        explanation: '50 registrations × 800ms = 40 seconds of pure thread lockout! Health check probes will fail and restart the server repeatedly.'
      },
      {
        id: 'prod-4-wrong-1',
        text: 'The client screens will flash green.',
        isCorrect: false,
        explanation: 'Server latency causes network timeouts, not screen color alterations.'
      }
    ],
    productionImpactOptionsHe: [
      {
        id: 'prod-4-correct',
        text: 'כל השרת ייקפא לחלוטין (אפילו בדיקות תקינות פשוטות). זמני התגובה יזנקו לעשרות שניות, מערכות ניהול השרתים יחשבו שהשרת מת ויבצעו לו אתחול כפוי.',
        isCorrect: true,
        explanation: '50 הרשמות כפול 800 מילישניות = 40 שניות של שיתוק מוחלט! בדיקות ה-Health Check של השרת ייכשלו והוא יקרוס שוב ושוב.'
      },
      {
        id: 'prod-4-wrong-1',
        text: 'מסכי המשתמשים יהבהבו בירוק.',
        isCorrect: false,
        explanation: 'הקפאת שרת מובילה ל-Timeout ברשת ולא לשינויים ויזואליים במסך.'
      }
    ],
    simulatedMetrics: {
      loadRps: 50,
      bad: {
        cpuPercent: 100,
        memoryMb: 240,
        latencyMs: 38200,
        errorRatePercent: 84,
        crashReason: 'EventLoopBlocked: Heartbeat ping timed out after 35,000ms. Container restarted by orchestrator.',
        crashReasonHe: 'שיתוק ה-Event Loop: בדיקת החיות של השרת לא קיבלה מענה במשך 35 שניות והוא אותחל.'
      },
      good: {
        cpuPercent: 42,
        memoryMb: 130,
        latencyMs: 65,
        errorRatePercent: 0
      }
    },
    badCodeExplanation: 'Synchronous computation blocks the main single thread of the runtime. No incoming network packets or pending I/O callbacks can be serviced.',
    badCodeExplanationHe: 'פעולה סינכרונית כבדה נועלת את ה-Thread היחיד של השרת, ומונעת כל אפשרות לקבל או לעבד בקשות רשת אחרות במקביל.',
    goodCodeSnippet: `// authController.js (ASYNCHRONOUS & THREAD-POOL DELEGATED)
const crypto = require('crypto');
const util = require('util');

// Convert asynchronous callback pbkdf2 to Promise-based
const pbkdf2Async = util.promisify(crypto.pbkdf2);

// POST /api/register
app.post('/api/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const salt = crypto.randomBytes(16).toString('hex');

    // ✨ SCALABLE ARCHITECTURE: Asynchronous pbkdf2 delegates CPU crunching 
    // to the underlying libuv C++ background thread pool!
    // The main JavaScript Event Loop remains completely free and responsive to other users!
    const derivedKey = await pbkdf2Async(password, salt, 100000, 64, 'sha512');
    const hash = derivedKey.toString('hex');

    await db.saveUser({ username, hash, salt });
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
});`,
    goodCodeExplanation: 'Asynchronous crypto functions offload calculation to background C++ threads in libuv. The JavaScript Event Loop continues serving thousands of concurrent users seamlessly.',
    goodCodeExplanationHe: 'פונקציית ההצפנה האסינכרונית מועברת ברקע למאגר התהליכונים (Thread Pool) של libuv ב-C++. ה-Event Loop נשאר פנוי לחלוטין לקבל אלפי בקשות במקביל.',
    keyTakeaways: [
      'Never call synchronous CPU methods (*Sync) on hot HTTP request paths in Node.js.',
      'Use asynchronous implementations or offload heavy calculations to Worker Threads or job queues.',
      'Keep the Node.js Event Loop cycle time under 10ms to ensure sub-second response times.'
    ],
    keyTakeawaysHe: [
      'לעולם אל תפעיל פונקציות חישוב סינכרוניות (כגון Sync*) בנתיבי שרת עמוסים.',
      'השתמש במימושים אסינכרוניים או העבר משימות כבדות ל-Worker Threads.',
      'שמור תמיד על לולאת האירועים מהירה ומשוחררת כדי להבטיח זמני תגובה מיידיים.'
    ],
    xpReward: 50
  },
  {
    id: 'arch-race-condition-inventory',
    title: 'The Flash Sale Race Condition (Concurrency & Atomic Updates)',
    titleHe: 'מירוץ התהליכים במבצע בזק (Race Condition ופעולות אטומיות)',
    category: 'concurrency',
    difficulty: 'Intermediate',
    scenarioDescription: 'A ticket booking platform sells limited concert seats during high-traffic flash sales.',
    scenarioDescriptionHe: 'פלטפורמת כרטיסים מוכרת מקומות מוגבלים להופעה מבוקשת במבצע בזק עם אלפי קונים בו-זמנית.',
    language: 'typescript',
    expectedQuality: 'bad_crashing',
    antiPatternName: 'Read-Modify-Write Concurrency Race Condition',
    antiPatternNameHe: 'מירוץ תהליכים של קריאה-שינוי-כתיבה (Overselling)',
    architecturalPrinciple: 'Atomic Database Mutation & Optimistic/Pessimistic Concurrency Control',
    architecturalPrincipleHe: 'עדכון אטומי ברמת מסד הנתונים ונעילת תהליכים מקבילים',
    codeSnippet: `// ticketService.ts
export async function purchaseTicket(eventId: string, userId: string) {
  // 1. Read current stock from database
  const event = await db.query('SELECT id, available_tickets FROM events WHERE id = ?', [eventId]);

  // 💥 DANGER: Read-Modify-Write Race Condition!
  // If 50 users check at the same microsecond when available_tickets = 1,
  // ALL 50 users see (available_tickets > 0) as TRUE!
  if (event.available_tickets > 0) {
    // Artificial latency (e.g. payment processing or network delay)
    await delay(150);

    const newStock = event.available_tickets - 1;

    // Overwrites stock based on stale read! Stock becomes negative (-49)!
    await db.query('UPDATE events SET available_tickets = ? WHERE id = ?', [newStock, eventId]);
    await db.query('INSERT INTO bookings (event_id, user_id) VALUES (?, ?)', [eventId, userId]);

    return { success: true };
  }

  return { success: false, reason: 'Sold out' };
}`,
    diagnosticQuestion: 'Why does this code result in severe overselling during high concurrent traffic?',
    diagnosticQuestionHe: 'מדוע קוד זה יוביל למכירת יתר (Overselling) הרסנית בעת עומס קונים בו-זמני?',
    diagnosticOptions: [
      {
        id: 'diag-5-correct',
        text: 'Multiple concurrent requests read the exact same available balance before any of them write the decrement, allowing multiple sales of the same seat.',
        isCorrect: true,
        explanation: 'Spot on! This classic "time-of-check to time-of-use" race condition lets multiple parallel requests proceed based on stale balance data.'
      },
      {
        id: 'diag-5-wrong-1',
        text: 'The SQL query syntax is invalid.',
        isCorrect: false,
        explanation: 'The SQL syntax is valid; the defect is lack of atomic concurrency controls.'
      },
      {
        id: 'diag-5-wrong-2',
        text: 'Node.js cannot talk to SQL databases concurrently.',
        isCorrect: false,
        explanation: 'Databases are designed for concurrency; developers must enforce atomic constraints or locking.'
      }
    ],
    diagnosticOptionsHe: [
      {
        id: 'diag-5-correct',
        text: 'מספר בקשות מקבילות קוראות את אותו מלאי קיים בטרם מי מהן מספיקה להפחית אותו, וכך אותו כרטיס נמכר לעשרות אנשים שונים במקביל.',
        isCorrect: true,
        explanation: 'מדויק לחלוטין! זהו כשל תזמון קלאסי שבו בדיקת התנאי והביצוע מופרדים, וכל הבקשות פועלות על סמך מידע שכבר הפך ללא רלוונטי.'
      },
      {
        id: 'diag-5-wrong-1',
        text: 'תחביר ה-SQL אינו תקין.',
        isCorrect: false,
        explanation: 'תחביר השאילתות תקין לחלוטין; הבעיה היא היעדר בקרת תהליכים מקבילים (Concurrency Control).'
      },
      {
        id: 'diag-5-wrong-2',
        text: 'מסדי נתונים אינם מסוגלים לטפל במספר משתמשים בו-זמנית.',
        isCorrect: false,
        explanation: 'מסדי נתונים תומכים בעבודה מקבילית, אך מחובת המתכנת להגדיר פעולות אטומיות או נעילות.'
      }
    ],
    productionImpactQuestion: 'What is the real-world consequence for this concert venue?',
    productionImpactQuestionHe: 'מה תהיה התוצאה במציאות עבור חברת הכרטיסים והלקוחות?',
    productionImpactOptions: [
      {
        id: 'prod-5-correct',
        text: '200 customers arrive with valid booking confirmations for a 100-seat theater; available_tickets drops to -100 in the database.',
        isCorrect: true,
        explanation: 'Exactly! Financial lawsuits, double bookings, and a ruined brand reputation.'
      },
      {
        id: 'prod-5-wrong-1',
        text: 'The server\'s IP address changes.',
        isCorrect: false,
        explanation: 'Database logical bugs do not alter IP address routing.'
      }
    ],
    productionImpactOptionsHe: [
      {
        id: 'prod-5-correct',
        text: '200 אנשים מגיעים לאולם עם אישור הזמנה בתוקף עבור אולם של 100 מקומות בלבד; המלאי במסד הנתונים הופך לשלילי (100-).',
        isCorrect: true,
        explanation: 'בדיוק! תביעות משפטיות, כאוס באולם ופגיעה קשה במוניטין החברה.'
      },
      {
        id: 'prod-5-wrong-1',
        text: 'כתובת ה-IP של השרת תשתנה.',
        isCorrect: false,
        explanation: 'תקלה לוגית במסד הנתונים אינה משנה את כתובת הרשת של השרת.'
      }
    ],
    simulatedMetrics: {
      loadRps: 250,
      bad: {
        cpuPercent: 55,
        memoryMb: 180,
        latencyMs: 180,
        errorRatePercent: 0,
        crashReason: 'ConcurrencyAnomaly: 100 seats available, 342 tickets booked! Stock = -242. Severe business corruption.',
        crashReasonHe: 'אנומליית תהליכים מקבילים: 100 מקומות נמכרו ל-342 רוכשים! המלאי עומד על 242-.'
      },
      good: {
        cpuPercent: 28,
        memoryMb: 95,
        latencyMs: 22,
        errorRatePercent: 0
      }
    },
    badCodeExplanation: 'Reading data into memory and modifying it in a separate step leaves a gap where other concurrent requests act on obsolete state.',
    badCodeExplanationHe: 'קריאת נתונים לזיכרון והפחתתם בפעולה נפרדת יוצרת פער זמן שבו בקשות מקבילות מקבלות החלטות על בסיס מצב לא מעודכן.',
    goodCodeSnippet: `// ticketService.ts (ATOMIC & CONCURRENCY SAFE)
export async function purchaseTicket(eventId: string, userId: string) {
  // ✨ SCALABLE & ATOMIC: Decrement conditionally in a SINGLE atomic database statement!
  // Database engine locks the row at the storage engine level for microseconds.
  const result = await db.query(
    \`UPDATE events 
     SET available_tickets = available_tickets - 1 
     WHERE id = ? AND available_tickets > 0\`,
    [eventId]
  );

  // If affectedRows === 0, the last ticket was ALREADY taken by another thread!
  if (result.affectedRows === 0) {
    return { success: false, reason: 'Sold out' };
  }

  // Only create booking record if the atomic reservation was guaranteed
  await db.query('INSERT INTO bookings (event_id, user_id) VALUES (?, ?)', [eventId, userId]);

  return { success: true };
}`,
    goodCodeExplanation: 'By using an atomic SQL UPDATE with an inline condition (available_tickets > 0), the database engine guarantees that only exactly the available inventory can ever be decremented, eliminating race conditions entirely.',
    goodCodeExplanationHe: 'באמצעות עדכון אטומי יחיד ב-SQL עם תנאי מובנה (available_tickets > 0), מנוע המסד מבטיח שרק כמות הכרטיסים הקיימת בדיוק תימכר, ללא שום אפשרות למירוץ תהליכים.',
    keyTakeaways: [
      'Never do Read-Modify-Write in application memory when multiple users can mutate the same resource.',
      'Use atomic SQL operations (UPDATE tbl SET count = count - 1 WHERE count > 0).',
      'Use database row-level locking (SELECT ... FOR UPDATE) or optimistic locking versions when managing multi-step state.'
    ],
    keyTakeawaysHe: [
      'לעולם אל תבצע קריאה-שינוי-כתיבה בזיכרון האפליקציה במשאבים משותפים.',
      'השתמש בפעולות אטומיות ישירות ברמת המסד.',
      'השתמש בנעילת שורות (SELECT ... FOR UPDATE) או בנעילה אופטימית (Optimistic Locking) בתהליכים מורכבים.'
    ],
    xpReward: 45
  },
  {
    id: 'arch-solid-god-object',
    title: 'The Monolithic God Object (Single Responsibility Principle)',
    titleHe: 'רכיב העל המונוליתי (הפרת עקרון האחריות היחידה - SRP)',
    category: 'solid_clean',
    difficulty: 'Advanced',
    scenarioDescription: 'A single 2,000-line controller function handles user signups, bcrypt hashing, database queries, raw SMTP socket emails, PDF invoice generation, and Stripe webhooks.',
    scenarioDescriptionHe: 'פונקציית Controller מונוליתית ענקית שמבצעת הרשמה, הצפנה, כתיבה למסד, יצירת קובצי PDF, שליחת מיילים וחיוב באשראי.',
    language: 'typescript',
    expectedQuality: 'bad_crashing',
    antiPatternName: 'The God Object / Spaghetti Code Monolith',
    antiPatternNameHe: 'רכיב-על מונוליתי (God Object) וקוד ספגטי צפוף',
    architecturalPrinciple: 'Single Responsibility Principle (SRP) & Dependency Injection',
    architecturalPrincipleHe: 'עקרון האחריות היחידה (SRP) והזרקת תלויות (Dependency Injection)',
    codeSnippet: `// userRegistrationController.ts
export async function registerUserAndCharge(req: Request, res: Response) {
  // 💥 2,000 lines of mixed concerns:
  // 1. Raw password validation & hashing
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);

  // 2. Direct hardcoded SQL queries with tightly coupled connection
  const user = await rawDatabaseConnection.query(
    'INSERT INTO users (name, email, pass_hash) VALUES (?, ?, ?)',
    [req.body.name, req.body.email, hash]
  );

  // 3. Direct Stripe SDK calls with hardcoded API keys
  const stripe = new Stripe('sk_live_hardcoded_secret_key');
  await stripe.charges.create({ amount: 4900, currency: 'usd', customer: user.id });

  // 4. Low-level TCP socket email dispatching with raw HTML strings
  const socket = net.createConnection(25, 'mail.company.internal');
  socket.write('HELO server\\r\\nMAIL FROM:<welcome@company.com>\\r\\n');

  // 5. Binary PDF generation right inside the HTTP request loop
  const pdfBuffer = await generateHeavyInvoicePdf(user.id);
  fs.writeFileSync(\`/var/invoices/\${user.id}.pdf\`, pdfBuffer);

  return res.json({ registered: true });
}`,
    diagnosticQuestion: 'Which core architectural principle of agile, scalable software is severely violated here?',
    diagnosticQuestionHe: 'איזה עקרון הנדסת תוכנה קריטי מופר באופן בוטה בקוד זה?',
    diagnosticOptions: [
      {
        id: 'diag-6-correct',
        text: 'Single Responsibility Principle (SRP) & Separation of Concerns: The controller mixes authentication, billing, file system IO, low-level networking, and database persistence.',
        isCorrect: true,
        explanation: 'Correct! The controller has dozens of reasons to change. It is impossible to unit test, tightly coupled to concrete implementations, and exposes production secrets.'
      },
      {
        id: 'diag-6-wrong-1',
        text: 'The function returns JSON instead of XML.',
        isCorrect: false,
        explanation: 'JSON is standard modern API formatting; format is not the architectural flaw.'
      },
      {
        id: 'diag-6-wrong-2',
        text: 'Variable names are too short.',
        isCorrect: false,
        explanation: 'Variable names are clear; the fatal defect is mixing 5 completely unrelated infrastructure and domain responsibilities.'
      }
    ],
    diagnosticOptionsHe: [
      {
        id: 'diag-6-correct',
        text: 'עקרון האחריות היחידה (SRP) והפרדת תחומי אחריות (Separation of Concerns): הפונקציה מערבבת אימות, חיוב כספי, מערכת קבצים, תקשורת רשת ושמירה במסד.',
        isCorrect: true,
        explanation: 'מדויק! לרכיב זה יש עשרות סיבות שונות להשתנות. אי אפשר לבדוק אותו בטסטים (Unit Tests), הוא תלוי במימושים קשיחים וחושף סודות אבטחה.'
      },
      {
        id: 'diag-6-wrong-1',
        text: 'הפונקציה מחזירה JSON במקום XML.',
        isCorrect: false,
        explanation: 'JSON הוא הפורמט הסטנדרטי בתעשייה ואינו מהווה בעיה ארכיטקטונית.'
      },
      {
        id: 'diag-6-wrong-2',
        text: 'שמות המשתנים קצרים מדי.',
        isCorrect: false,
        explanation: 'הפגם הקריטי הוא העמסת 5 תחומי אחריות שונים לחלוטין בתוך פונקציית Controller אחת.'
      }
    ],
    productionImpactQuestion: 'What happens to the engineering team attempting to maintain and test this codebase?',
    productionImpactQuestionHe: 'מה יקרה לצוות הפיתוח שינסה לתחזק, להרחיב ולבדוק קוד כזה לאורך זמן?',
    productionImpactOptions: [
      {
        id: 'prod-6-correct',
        text: 'Velocity grinds to a halt. Any minor tweak to email templates risks breaking payment processing or database transactions; unit testing is virtually impossible.',
        isCorrect: true,
        explanation: 'Zero modularity means every change causes unexpected regressions across the entire company application.'
      },
      {
        id: 'prod-6-wrong-1',
        text: 'The TypeScript compiler will refuse to run on Mac computers.',
        isCorrect: false,
        explanation: 'Compilers evaluate syntax and types regardless of operating system.'
      }
    ],
    productionImpactOptionsHe: [
      {
        id: 'prod-6-correct',
        text: 'קצב הפיתוח נבלם כמעט לחלוטין. כל שינוי קטן בתבנית המייל מסכן את מערכת הסליקה או מסד הנתונים, וכתיבת בדיקות אוטומטיות הופכת לבלתי אפשרית.',
        isCorrect: true,
        explanation: 'היעדר מודולריות גורם לכך שכל שינוי קטן שובר חלקים אחרים לחלוטין במערכת (Regressions).'
      },
      {
        id: 'prod-6-wrong-1',
        text: 'המהדר של TypeScript יסרב לרוץ על מחשבי Mac.',
        isCorrect: false,
        explanation: 'המהדר בודק תחביר וטיפוסים ואינו תלוי במערכת ההפעלה.'
      }
    ],
    simulatedMetrics: {
      loadRps: 100,
      bad: {
        cpuPercent: 92,
        memoryMb: 520,
        latencyMs: 3100,
        errorRatePercent: 24,
        crashReason: 'RegressionCascade: SMTP socket hung, blocking payment completion and holding open DB transaction locks.',
        crashReasonHe: 'תגובת שרשרת הרסנית: תקשורת המייל נתקעה וחסמה את השלמת התשלום ואת נעילות מסד הנתונים.'
      },
      good: {
        cpuPercent: 18,
        memoryMb: 90,
        latencyMs: 35,
        errorRatePercent: 0
      }
    },
    badCodeExplanation: 'Tightly coupling business logic, file storage, email transport, and payment providers into a single giant function makes software rigid, fragile, and untestable.',
    badCodeExplanationHe: 'צימוד ישיר של לוגיקה עסקית, כתיבה לקבצים, שליחת מיילים וסליקת אשראי לתוך פונקציה אחת הופך את התוכנה לשבירה, קשיחה ובלתי ניתנת לבדיקה.',
    goodCodeSnippet: `// userRegistrationController.ts (CLEAN & MODULAR ARCHITECTURE)
export class UserRegistrationController {
  constructor(
    private readonly authService: IAuthService,
    private readonly billingService: IBillingService,
    private readonly eventBus: IEventBus
  ) {}

  // Thin controller: delegates domain actions and publishes events!
  async handleRegistration(req: Request, res: Response) {
    const dto = UserRegistrationDto.parse(req.body);

    // 1. Pure domain registration
    const user = await this.authService.register(dto);

    // 2. Billing service (isolated & easily mocked in tests)
    await this.billingService.createSubscription(user.id, dto.paymentMethodId);

    // 3. Decoupled asynchronous event: Emails & PDF generation run in background workers!
    await this.eventBus.publish(new UserRegisteredEvent(user.id, user.email));

    return res.status(201).json({ id: user.id, email: user.email });
  }
}`,
    goodCodeExplanation: 'The controller only coordinates high-level actions through Dependency Injection. Heavy tasks like PDF generation and emails are offloaded to background event handlers.',
    goodCodeExplanationHe: 'ה-Controller משמש רק כרכז פעולות בעזרת הזרקת תלויות (DI). משימות כבדות כמו יצירת קובצי PDF ושליחת מיילים מועברות לתהליכי רקע עצמאיים.',
    keyTakeaways: [
      'Adhere to Single Responsibility: each module should have one reason to change.',
      'Rely on abstractions and interfaces rather than hardcoding concrete classes.',
      'Use asynchronous Domain Events for secondary side-effects (emails, invoice PDFs).'
    ],
    keyTakeawaysHe: [
      'הקפד על עקרון האחריות היחידה: לכל מודול צריכה להיות סיבה אחת בלבד להשתנות.',
      'הסתמך על ממשקים (Interfaces) ולא על מימושים קשיחים (Dependency Inversion).',
      'השתמש באירועי דומיין אסינכרוניים (Domain Events) עבור תופעות לוואי כגון מיילים ודוחות.'
    ],
    xpReward: 50
  }
];
