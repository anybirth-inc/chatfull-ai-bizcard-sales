import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Save, Plus, X, Camera, Info } from 'lucide-react';

export function EditPartnerInfo() {
  const navigate = useNavigate();
  const { partnerCompanyInfo, setPartnerCompanyInfo, isDoubleSided, currentSide, setCurrentSide } = useStore((state) => ({
    partnerCompanyInfo: state.partnerCompanyInfo,
    setPartnerCompanyInfo: state.setPartnerCompanyInfo,
    isDoubleSided: state.isDoubleSided,
    currentSide: state.currentSide,
    setCurrentSide: state.setCurrentSide,
  }));

  const [formData, setFormData] = useState({
    companyName: partnerCompanyInfo?.companyName || '',
    firstName: partnerCompanyInfo?.firstName || '',
    lastName: partnerCompanyInfo?.lastName || '',
    personalPhone: partnerCompanyInfo?.personalPhone || '',
    companyPhone: partnerCompanyInfo?.companyPhone || '',
    faxNumber: partnerCompanyInfo?.faxNumber || '',
    email: partnerCompanyInfo?.email || '',
    address: partnerCompanyInfo?.address || '',
    position: partnerCompanyInfo?.position || '',
    website: partnerCompanyInfo?.website || '',
    services: partnerCompanyInfo?.services || [],
  });

  const [newService, setNewService] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddService = () => {
    if (newService && formData.services.length < 10) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, newService],
      }));
      setNewService('');
    }
  };

  const handleRemoveService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPartnerCompanyInfo({
      ...formData,
      companyNameKana: '',
      firstNameKana: '',
      lastNameKana: '',
    });
    
    if (isDoubleSided && currentSide === 'front') {
      setCurrentSide('back');
      navigate('/capture-partner');
    } else {
      navigate('/compose-email');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {isDoubleSided && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <div className="flex-1 h-1 bg-indigo-200 rounded">
              <div className={`h-1 bg-indigo-600 rounded transition-all duration-300 ${currentSide === 'front' ? 'w-1/2' : 'w-full'}`} />
            </div>
          </div>
          <div className="flex justify-between text-sm text-indigo-600">
            <span className={currentSide === 'front' ? 'font-medium' : ''}>表面の情報</span>
            <span className={currentSide === 'back' ? 'font-medium' : ''}>裏面の情報</span>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">
        相手企業の情報確認・編集
        {isDoubleSided && <span className="text-base font-normal text-gray-600 ml-2">
          ({currentSide === 'front' ? '表面' : '裏面'})
        </span>}
      </h2>

      {isDoubleSided && currentSide === 'front' && (
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-indigo-700">
            <p className="font-medium">表面の情報を確認後、裏面の撮影に進みます</p>
            <p className="text-sm mt-1">裏面には追加の情報が記載されている可能性があります。両面の情報を組み合わせることで、より正確な情報を取得できます。</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              会社名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                姓 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              個人の電話番号
            </label>
            <input
              type="tel"
              name="personalPhone"
              value={formData.personalPhone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              会社の電話番号
            </label>
            <input
              type="tel"
              name="companyPhone"
              value={formData.companyPhone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              FAX番号
            </label>
            <input
              type="tel"
              name="faxNumber"
              value={formData.faxNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              会社住所
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              役職
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ウェブサイト
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              事業内容（最大10個）
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                maxLength={200}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="新しい事業内容を入力"
              />
              <button
                type="button"
                onClick={handleAddService}
                disabled={formData.services.length >= 10}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-200"
                >
                  <span className="text-sm">{service}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {isDoubleSided && currentSide === 'front' ? (
              <>
                <Camera className="w-5 h-5 mr-2" />
                裏面の撮影へ進む
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                保存してメール作成へ
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}