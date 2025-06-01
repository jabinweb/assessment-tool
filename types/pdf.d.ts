declare module 'jspdf' {
  export default class jsPDF {
    constructor(orientation?: string, unit?: string, format?: string);
    text(text: string | string[], x: number, y: number, options?: any): void;
    setFontSize(size: number): void;
    setTextColor(r: number, g: number, b: number): void;
    addPage(): void;
    save(filename: string): void;
    splitTextToSize(text: string, maxWidth: number): string[];
    internal: {
      pageSize: {
        getWidth(): number;
        getHeight(): number;
      };
      getNumberOfPages(): number;
    };
    setPage(page: number): void;
  }
}

declare module 'html2canvas' {
  interface Html2CanvasOptions {
    height?: number;
    width?: number;
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
  }
  
  function html2canvas(element: HTMLElement, options?: Html2CanvasOptions): Promise<HTMLCanvasElement>;
  export default html2canvas;
}
