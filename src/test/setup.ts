import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock window.alert to prevent jsdom errors
global.alert = vi.fn();

// Mock window.matchMedia for components that use responsive design
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
