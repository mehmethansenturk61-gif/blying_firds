import { createContext, useContext } from 'react';
export const FrameContext = createContext({ w: 360, h: 640 });
export const useFrame = () => useContext(FrameContext);
