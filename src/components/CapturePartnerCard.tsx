import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Camera, RotateCw, AlertCircle, Info, Loader2 } from 'lucide-react';
import { extractBusinessCardInfo } from '../lib/gemini';
import { useStore } from '../store/useStore';
import { convertToKana } from '../lib/kana';

export function CapturePartnerCard() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();
  
  const {
    partnerCompanyInfo,
    setPartnerCompanyInfo,
    isDoubleSided,
    setIsDoubleSided,
    currentSide,
    setCurrentSide,
    resetCardState
  } = useStore();

  // 初期表示時に状態をリセット
  React.useEffect(() => {
    if (currentSide === 'front') {
      resetCardState();
      setIsDoubleSided(false); // 初期状態では片面に設定
    }
  }, []);

  const handleCapture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setError('カメラから画像を取得できませんでした。');
      return;
    }

    try {
      setError(null);
      setIsProcessing(true);
      const info = await extractBusinessCardInfo(imageSrc.split(',')[1], currentSide === 'back');
      console.log('Extracted info:', info); // デバッグ用

      // 表面の場合
      if (currentSide === 'front') {
        // 名前の読みがある場合はそれを使用し、なければ漢字から変換
        let firstNameKana = '';
        let lastNameKana = '';
        let companyKana = '';

        if (info.firstNameReading && info.lastNameReading) {
          const result = await convertToKana(info.firstNameReading, info.lastNameReading);
          if (typeof result !== 'string' && result.firstName && result.lastName) {
            firstNameKana = result.firstName;
            lastNameKana = result.lastName;
          }
        } else if (info.firstName && info.lastName) {
          const result = await convertToKana(info.firstName, info.lastName);
          if (typeof result !== 'string' && result.firstName && result.lastName) {
            firstNameKana = result.firstName;
            lastNameKana = result.lastName;
          }
        }

        if (info.companyName) {
          const companyNameResult = await convertToKana(info.companyName);
          if (typeof companyNameResult === 'string') {
            companyKana = companyNameResult;
          }
        }

        // 表面の情報を設定
        const newInfo = {
          companyName: info.companyName || '',
          companyNameKana: companyKana,
          firstName: info.firstName || '',
          lastName: info.lastName || '',
          firstNameKana,
          lastNameKana,
          personalPhone: info.personalPhone || '',
          companyPhone: info.companyPhone || '',
          faxNumber: info.faxNumber || '',
          email: info.email || '',
          address: info.address || '',
          position: info.position || '',
          website: info.website || '',
          services: info.services || [],
        };

        console.log('Setting new info:', newInfo); // デバッグ用
        setPartnerCompanyInfo(newInfo);
      } 
      // 裏面の場合
      else {
        if (partnerCompanyInfo) {
          const updatedInfo = {
            ...partnerCompanyInfo,
            // 裏面から取得した情報で、空でない場合のみ更新
            personalPhone: info.personalPhone || partnerCompanyInfo.personalPhone,
            companyPhone: info.companyPhone || partnerCompanyInfo.companyPhone,
            faxNumber: info.faxNumber || partnerCompanyInfo.faxNumber,
            address: info.address || partnerCompanyInfo.address,
            position: info.position || partnerCompanyInfo.position,
            website: info.website || partnerCompanyInfo.website,
            // 事業内容は追加（空の配列の場合は既存の配列を維持）
            services: info.services?.length > 0
              ? [...partnerCompanyInfo.services, ...info.services.filter((service: string) => !partnerCompanyInfo.services.includes(service))]
              : partnerCompanyInfo.services,
          };
          console.log('Setting updated info:', updatedInfo); // デバッグ用
          setPartnerCompanyInfo(updatedInfo);
        }
      }

      // 編集画面へ遷移
      navigate('/edit-partner-info');
    } catch (error) {
      console.error('Capture error:', error);
      setError(error instanceof Error ? error.message : '名刺の処理中にエラーが発生しました。');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {currentSide === 'back' ? '相手企業の名刺裏面撮影' : '相手企業の名刺撮影'}
      </h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="mb-6 p-4 bg-blue-50 rounded-lg flex items-start">
        <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
        <div className="text-blue-700">
          <p className="font-medium mb-2">撮影のコツ</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>名刺全体が枠内に収まるようにしてください</li>
            <li>できるだけ明るい場所で撮影してください</li>
            <li>影やぶれが出ないように固定して撮影してください</li>
            {currentSide === 'back' ? (
              <>
                <li>住所や電話番号が見えるように撮影してください</li>
                <li>事業内容の記載がある場合は、その部分も含めて撮影してください</li>
              </>
            ) : (
              <li>名前の振り仮名が見えるように撮影してください</li>
            )}
          </ul>
        </div>
      </div>

      {currentSide === 'front' && (
        <div className="flex space-x-4 mb-6">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-indigo-600"
              name="cardType"
              value="single"
              checked={!isDoubleSided}
              onChange={() => setIsDoubleSided(false)}
            />
            <span className="ml-2">片面のみ</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-indigo-600"
              name="cardType"
              value="double"
              checked={isDoubleSided}
              onChange={() => setIsDoubleSided(true)}
            />
            <span className="ml-2">両面</span>
          </label>
        </div>
      )}

      {isDoubleSided && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <div className="flex-1 h-1 bg-indigo-200 rounded">
              <div className={`h-1 bg-indigo-600 rounded transition-all duration-300 ${currentSide === 'front' ? 'w-1/2' : 'w-full'}`} />
            </div>
          </div>
          <div className="flex justify-between text-sm text-indigo-600">
            <span className={currentSide === 'front' ? 'font-medium' : ''}>表面</span>
            <span className={currentSide === 'back' ? 'font-medium' : ''}>裏面</span>
          </div>
        </div>
      )}

      <div className="mb-4">
        {!isCapturing ? (
          <button
            onClick={() => setIsCapturing(true)}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center transition-colors"
            disabled={isProcessing}
          >
            <Camera className="w-5 h-5 mr-2" />
            カメラを起動
          </button>
        ) : (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleCapture}
                disabled={isProcessing}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center transition-colors"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    処理中...
                  </>
                ) : (
                  '撮影'
                )}
              </button>
              <button
                onClick={() => {
                  setIsCapturing(false);
                  setError(null);
                }}
                disabled={isProcessing}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center justify-center transition-colors"
              >
                <RotateCw className="w-5 h-5 mr-2" />
                再撮影
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}