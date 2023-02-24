import React, { createContext, useRef } from 'react';

interface CanvasContextProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

interface IProps {
  children: JSX.Element;
}

export const CanvasContext = createContext<CanvasContextProps>({} as CanvasContextProps);
export const CanvasProvider = ({ children }: IProps): JSX.Element => {
  const canvas = useRef<HTMLCanvasElement>(null);
  return (
    <CanvasContext.Provider
      value={{
        canvasRef: canvas,
      }}
    >
      <canvas ref={canvas} />
      {children}
    </CanvasContext.Provider>
  );
};
