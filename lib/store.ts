import { create } from "zustand";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MapState {
  coordinate: Coordinate;
  contextMenuPosition: { x: number; y: number } | null;
  isContextMenuOpen: boolean;
  centerRequest: Coordinate | null;
  setCoordinate: (coordinate: Coordinate) => void;
  openContextMenu: (x: number, y: number) => void;
  closeContextMenu: () => void;
  centerMapTo: (latitude: number, longitude: number) => void;
  clearCenterRequest: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  coordinate: { latitude: 37.7749, longitude: -122.4194 }, // Default to San Francisco
  contextMenuPosition: null,
  isContextMenuOpen: false,
  centerRequest: null,
  setCoordinate: (coordinate) => set({ coordinate }),
  openContextMenu: (x, y) =>
    set({ contextMenuPosition: { x, y }, isContextMenuOpen: true }),
  closeContextMenu: () =>
    set({ isContextMenuOpen: false, contextMenuPosition: null }),
  centerMapTo: (latitude, longitude) =>
    set({ centerRequest: { latitude, longitude } }),
  clearCenterRequest: () => set({ centerRequest: null }),
}));

interface ChatState {
  coordinateAttachments: Coordinate[];
  addCoordinateAttachment: (coordinate: Coordinate) => void;
  removeCoordinateAttachment: (index: number) => void;
  clearCoordinateAttachments: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  coordinateAttachments: [],
  addCoordinateAttachment: (coordinates) =>
    set((state) => ({
      coordinateAttachments: [...state.coordinateAttachments, coordinates],
      // Don't set promptWithLocation to true when adding an attachment
      // as we're now handling this separately
    })),
  removeCoordinateAttachment: (index) =>
    set((state) => ({
      coordinateAttachments: state.coordinateAttachments.filter(
        (_, i) => i !== index
      ),
    })),
  clearCoordinateAttachments: () => set({ coordinateAttachments: [] }),
}));
