import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CompanyInfo {
  companyName: string;
  companyNameKana: string;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  personalPhone?: string;
  companyPhone?: string;
  faxNumber?: string;
  email: string;
  address?: string;
  position?: string;
  website?: string;
  services: string[];
}

interface State {
  myCompanyInfo: CompanyInfo | null;
  partnerCompanyInfo: CompanyInfo | null;
  isDoubleSided: boolean;
  currentSide: 'front' | 'back';
  setMyCompanyInfo: (info: CompanyInfo) => void;
  setPartnerCompanyInfo: (info: CompanyInfo) => void;
  setIsDoubleSided: (isDouble: boolean) => void;
  setCurrentSide: (side: 'front' | 'back') => void;
  resetCardState: () => void;
}

export const useStore = create<State>()(
  devtools(
    (set) => ({
      myCompanyInfo: null,
      partnerCompanyInfo: null,
      isDoubleSided: false,
      currentSide: 'front',
      setMyCompanyInfo: (info) => set({ myCompanyInfo: info }),
      setPartnerCompanyInfo: (info) => set({ partnerCompanyInfo: info }),
      setIsDoubleSided: (isDouble) => set({ isDoubleSided: isDouble }),
      setCurrentSide: (side) => set({ currentSide: side }),
      resetCardState: () => set({ isDoubleSided: false, currentSide: 'front' }),
    }),
    { name: 'ChatFull-Store' }
  )
);