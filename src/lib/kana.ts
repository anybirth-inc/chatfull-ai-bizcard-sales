import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒

async function retry<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 1) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay);
  }
}

export async function convertToKana(text: string, lastName?: string): Promise<{ firstName?: string; lastName?: string } | string> {
  if (!text) return lastName ? { firstName: '', lastName: '' } : '';

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const isHiragana = (str: string) => /^[ぁ-んー\s]+$/.test(str);
  
  // すでにひらがなの場合はそのまま返す
  if (lastName) {
    if (isHiragana(text) && isHiragana(lastName)) {
      return { firstName: text, lastName };
    }
  } else if (isHiragana(text)) {
    return text;
  }

  const prompt = lastName
    ? `Convert these names to Japanese hiragana. Return ONLY a JSON object with firstName and lastName keys.
       First Name: ${text}
       Last Name: ${lastName}
       
       Rules:
       - If input is kanji, convert to its hiragana reading
       - If input is English, convert to natural Japanese pronunciation
       - Use only hiragana (no katakana)
       - For example:
         - "山田" → "やまだ"
         - "太郎" → "たろう"
         - "Smith" → "すみす"
         - "John" → "じょん"
       
       Example response format:
       {"firstName": "たろう", "lastName": "やまだ"}`
    : `Convert this text to Japanese hiragana. Return ONLY hiragana text, no explanations.
       Text: ${text}
       
       Rules:
       - If input is kanji, convert to its hiragana reading
       - If input is English, convert to natural Japanese pronunciation
       - Use only hiragana (no katakana)
       - For example:
         - "山田商事" → "やまだしょうじ"
         - "株式会社グローバル" → "かぶしきがいしゃぐろーばる"
         - "Smith Corporation" → "すみすこーぽれーしょん"
       
       Return ONLY the hiragana text.`;

  try {
    const generateContent = async () => {
      const result = await model.generateContent(prompt);
      return result.response;
    };

    const response = await retry(generateContent);
    const text = response.text().trim();

    if (lastName) {
      try {
        const parsed = JSON.parse(text);
        return {
          firstName: parsed.firstName || '',
          lastName: parsed.lastName || '',
        };
      } catch {
        return { firstName: '', lastName: '' };
      }
    } else {
      // 余分な空白や改行、句読点を削除
      return text.replace(/[\n\r\s、。]/g, '');
    }
  } catch (error) {
    console.error('Error converting to kana:', error);
    return lastName ? { firstName: '', lastName: '' } : '';
  }
}