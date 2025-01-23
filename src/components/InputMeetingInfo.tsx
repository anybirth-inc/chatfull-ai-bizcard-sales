import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowRight } from 'lucide-react';

export function InputMeetingInfo() {
  const navigate = useNavigate();
  const { setMeetingInfo } = useStore();

  const [formData, setFormData] = useState({
    event: '',
    place: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMeetingInfo(formData);
    navigate('/capture-partner');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">イベント情報の入力</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              イベント名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="event"
              value={formData.event}
              onChange={handleInputChange}
              required
              placeholder="例：AI・DXソリューションEXPO"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              開催場所 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleInputChange}
              required
              placeholder="例：東京ビッグサイト 東展示棟"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            相手の名刺撮影へ
          </button>
        </div>
      </form>
    </div>
  );
} 