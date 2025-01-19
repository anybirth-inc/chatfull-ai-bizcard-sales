import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, RotateCw } from 'lucide-react';

export function ConfirmEmail() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      </div>
      <h2 className="text-2xl font-bold mb-4">メールを送信しました</h2>
      <p className="text-gray-600 mb-8">
        メールの送信が完了しました。メーラーで内容を確認してください。
      </p>
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        <RotateCw className="w-5 h-5 mr-2" />
        新規作成
      </button>
    </div>
  );
}