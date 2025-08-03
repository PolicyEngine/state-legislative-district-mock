import { useState, useCallback } from 'react';

interface DemoStep {
  target: { x: number; y: number } | (() => { x: number; y: number });
  action: 'move' | 'click' | 'wait';
  duration: number;
  callback?: () => void;
}

interface UseDemoProps {
  isActive: boolean;
  onStepComplete?: (stepIndex: number) => void;
}

export const useDemo = ({ isActive, onStepComplete }: UseDemoProps) => {
  const [cursorPosition, setCursorPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isClicking, setIsClicking] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const getElementCenter = (selector: string): { x: number; y: number } | null => {
    const element = document.querySelector(selector);
    if (!element) return null;
    
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  };

  const simulateClick = (element: Element) => {
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(clickEvent);
  };

  const executeStep = useCallback(async (step: DemoStep) => {
    if (step.action === 'wait') {
      await new Promise(resolve => setTimeout(resolve, step.duration));
      return;
    }

    const targetPos = typeof step.target === 'function' ? step.target() : step.target;
    
    if (step.action === 'move') {
      setCursorPosition(targetPos);
      await new Promise(resolve => setTimeout(resolve, step.duration));
    } else if (step.action === 'click') {
      setCursorPosition(targetPos);
      await new Promise(resolve => setTimeout(resolve, 800)); // Move time
      
      setIsClicking(true);
      
      // Find and click the element at this position
      const elements = document.elementsFromPoint(targetPos.x, targetPos.y);
      const clickableElement = elements.find(el => 
        el.tagName === 'BUTTON' || 
        el.tagName === 'SELECT' || 
        el.tagName === 'OPTION' ||
        (el as HTMLElement).onclick !== null ||
        el.getAttribute('role') === 'button' ||
        (el as HTMLElement).style.cursor === 'pointer'
      );
      
      if (clickableElement) {
        simulateClick(clickableElement);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300)); // Click animation
      setIsClicking(false);
      await new Promise(resolve => setTimeout(resolve, step.duration)); // Post-click wait
    }

    if (step.callback) {
      step.callback();
    }
  }, []);

  const runDemoSequence = useCallback(async (steps: DemoStep[]) => {
    for (let i = 0; i < steps.length; i++) {
      if (!isActive) {
        // Reset cursor position when stopped
        setCursorPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        break;
      }
      
      await executeStep(steps[i]);
      setCurrentStep(i + 1);
      
      if (onStepComplete) {
        onStepComplete(i);
      }
    }
  }, [isActive, executeStep, onStepComplete]);

  return {
    cursorPosition,
    isClicking,
    currentStep,
    runDemoSequence,
    getElementCenter
  };
};