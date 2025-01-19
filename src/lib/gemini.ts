import { GoogleGenerativeAI } from '@google/generative-ai';

// APIキーを環境変数から取得
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

export async function extractBusinessCardInfo(imageData: string, isBackSide = false) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `Extract information from this business card image and return it in JSON format.
  
  Fields to extract:
  - companyName: Company name in Japanese
  - email: Email address in lowercase
  - firstName: First name in Japanese
  - lastName: Last name in Japanese
  - firstNameReading: First name reading in alphabet (if present under the name)
  - lastNameReading: Last name reading in alphabet (if present under the name)
  - personalPhone: Personal phone number (format: 090-1234-5678)
  - companyPhone: Company phone number (format: 03-1234-5678)
  - faxNumber: Fax number (format: 03-1234-5678)
  - address: Full address in Japanese
  - position: Job title in Japanese
  - website: Website URL
  - services: Array of business services or products (each item should be a complete phrase)

  Pay special attention to:
  - For company name, find the exact text that includes 株式会社, 有限会社, or 合同会社. Do not modify or add these prefixes.
  - Look for alphabetic text under Japanese names, which is likely the reading (furigana)
  - Include these readings in firstNameReading and lastNameReading fields
  ${isBackSide ? `- For back side, focus on:
    - Business services or products listed (very important)
    - Contact information like phone numbers, fax numbers, and addresses
    - These are commonly found on the back side of business cards` : ''}

  Return ONLY valid JSON with these exact field names. Example:
  {
    "companyName": "株式会社サンプル",
    "firstName": "太郎",
    "lastName": "山田",
    "firstNameReading": "taro",
    "lastNameReading": "yamada",
    "personalPhone": "090-1234-5678",
    "companyPhone": "03-1234-5678",
    "faxNumber": "03-1234-5678",
    "email": "taro.yamada@sample.co.jp",
    "address": "東京都千代田区丸の内1-1-1",
    "position": "営業部長",
    "website": "https://www.sample.co.jp",
    "services": ["ソフトウェア開発", "システムコンサルティング", "クラウドサービス"]
  }`;

  try {
    const generateContent = async () => {
      try {
        const result = await model.generateContent([
          prompt,
          { inlineData: { data: imageData, mimeType: 'image/jpeg' } }
        ]);
        
        if (!result || !result.response) {
          throw new Error('名刺から情報を抽出できませんでした。');
        }
        
        const text = result.response.text();
        
        // 有効なJSONが含まれているか確認
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('名刺から情報を抽出できませんでした。名刺の撮影角度を調整して、再度お試しください。');
        }
        
        try {
          const parsedData = JSON.parse(jsonMatch[0]);
          return parsedData;
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error('名刺の情報を正しく解析できませんでした。名刺全体が写るように撮影してください。');
        }
      } catch (error) {
        console.error('Gemini API error details:', error);
        throw new Error('名刺の画像を処理できませんでした。もう一度撮影してください。');
      }
    };

    const data = await retry(generateContent);
    
    // デフォルト値の設定
    return {
      companyName: data.companyName || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      firstNameReading: data.firstNameReading || '',
      lastNameReading: data.lastNameReading || '',
      personalPhone: data.personalPhone || '',
      companyPhone: data.companyPhone || '',
      faxNumber: data.faxNumber || '',
      email: data.email || '',
      address: data.address || '',
      position: data.position || '',
      website: data.website || '',
      services: Array.isArray(data.services) ? data.services : [],
    };
  } catch (error) {
    console.error('Error in extractBusinessCardInfo:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('名刺の処理中にエラーが発生しました。もう一度お試しください。');
  }
}

export async function generateEmail(partnerInfo: any, myInfo: any) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `以下の情報を元に、ビジネスメールを作成してください：

相手企業情報：
- 会社名：${partnerInfo.companyName}
- 担当者名：${partnerInfo.lastName} ${partnerInfo.firstName}
- 役職：${partnerInfo.position || ''}

自社情報：
- 会社名：${myInfo.companyName}
- 担当者名：${myInfo.lastName} ${myInfo.firstName}
- 役職：${myInfo.position || ''}
- 事業内容：${myInfo.services.join('、')}

メールの要件：
1. 挨拶とお会いしたことのお礼
2. 自社の紹介（事業内容を含む）
3. 打ち合わせのお願い
4. 締めの挨拶

注意点：
- 日本のビジネスメールとして適切な敬語と形式を使用
- 簡潔かつ丁寧な文章
- 具体的な日時は指定せず、先方の都合の良い日時で調整させていただく形
- 署名は含めない

フォーマット：
- 改行を適切に入れる
- 結果は本文のみを返す`;

  try {
    const generateContent = async () => {
      const result = await model.generateContent(prompt);
      return result.response;
    };

    const response = await retry(generateContent);
    return response.text();
  } catch (error) {
    console.error('Error generating email:', error);
    throw new Error('メール文面の生成中にエラーが発生しました。もう一度お試しください。');
  }
}