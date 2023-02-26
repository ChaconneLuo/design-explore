import React, { createContext, useRef } from 'react';

interface CanvasContextProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  recover: () => void;
}

interface IProps {
  children: JSX.Element;
}

export const CanvasContext = createContext<CanvasContextProps>({} as CanvasContextProps);
export const CanvasProvider = ({ children }: IProps): JSX.Element => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const recoverCanvas = () => {
    canvas.current!.width = 0;
    canvas.current!.height = 0;
  };
  return (
    <CanvasContext.Provider
      value={{
        canvasRef: canvas,
        recover: recoverCanvas,
      }}
    >
      <canvas ref={canvas} width={0} height={0} />
      {children}
    </CanvasContext.Provider>
  );
};
