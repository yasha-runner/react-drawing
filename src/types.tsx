export type Title = 'triangle' | 'rectangle' | 'ellipse';

export type ShapeType = {
  zIndexCSS: number;
  type: Title;
  color: string;
  position: {
    top: string;
    left: string;
  };
  size: {
    height: string;
    width: string;
  };
};

export type GetActiveFigureType = {
  figure: ShapeType;
  index: number;
};

export type ShapePropsType = {
  classes: Array<string>;
  figure: ShapeType;
  index: number;
  onMouseDown?: (e: React.MouseEvent, figure: ShapeType, index: number) => void;
  onFigureClickHandler?: (e: React.MouseEvent, figure: ShapeType, index: number) => void;
  onKeyDown?: (e: React.KeyboardEvent, index: number) => void;
};
