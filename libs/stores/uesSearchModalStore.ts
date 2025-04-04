import {create} from 'zustand';

type State = {
  isVisible: boolean;
};

type Action = {
  openModal: () => void;
  closeModal: () => void;
};

const useSearchModalStore = create<State & Action>((set) => ({
  isVisible: false,
  openModal: () => set({isVisible: true}),
  closeModal: () => set({isVisible: false}),
}));

export default useSearchModalStore;
