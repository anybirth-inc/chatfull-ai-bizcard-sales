import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Edit } from 'lucide-react';
import { generateEmail } from '../lib/gemini';
import { useStore } from '../store/useStore';

export function ComposeEmail() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  
  const { myCompanyInfo, partnerCompanyInfo } = useStore((state) => ({
    myCompanyInfo: state.myCompanyInfo,
    partnerCompanyInfo: state.partnerCompanyInfo,
  }));

  useEffect(() => {
    if (myCompanyInfo && partnerCompanyInfo) {
      generateEmail(partnerCompanyInfo, myCompanyInfo)
        .then((generatedEmail) => {
          setEmailBody(generatedEmail);
          setSubject(`${partnerCompanyInfo.companyName}様 ご面談のお願い`);
        })
        .catch(console.error)
        .finally(() => setIsGenerating(false));
    }
  }, [myCompanyInfo, partnerCompanyInfo]);

  const handleSend = () => {
    const mailtoLink = `mailto:${partnerCompanyInfo?.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
    navigate('/confirm-email');
  };

  if (!myCompanyInfo || !partnerCompanyInfo) {
    return <div>必要な情報が不足しています。</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">メール作成</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            宛先
          </label>
          <div className="p-2 bg-gray-50 rounded-md">
            {partnerCompanyInfo.email}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            件名
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            本文
          </label>
          <textarea
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            rows={12}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setIsGenerating(true)}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            disabled={isGenerating}
          >
            <Edit className="w-5 h-5 mr-2" />
            再生成
          </button>
          <button
            onClick={handleSend}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            disabled={isGenerating}
          >
            <Send className="w-5 h-5 mr-2" />
            送信
          </button>
        </div>
      </div>
    </div>
  );
}