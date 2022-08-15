import React from 'react';
import { ShapePropsType } from '../../types';

const style: any = {};

const Triangle: React.FC<ShapePropsType> = ({ classes, figure, index, ...props }) => {
  return (
    <svg
      width={figure.size.width}
      height={figure.size.height}
      className={classes.join(' ')}
      id={`${style[figure.type]}_${figure.zIndexCSS}`}
      style={{
        zIndex: figure.zIndexCSS,
        top: figure.position.top,
        left: figure.position.left,
      }}
    >
      <polygon
        points={`0,${figure.size.height} ${parseFloat(figure.size.width) / 2}, 0 ${parseFloat(
          figure.size.width,
        )}, ${parseFloat(figure.size.height)}`}
        fill={figure.color || 'grey'}
        className={`${style[figure.type]}_${figure.zIndexCSS}`}
        style={{
          cursor: 'pointer',
          outline: 'none',
          pointerEvents: 'all',
        }}
        onMouseDown={(e) => {
          if (props.onMouseDown) props.onMouseDown(e, figure, index);
        }}
        onClick={(e) => {
          if (props.onFigureClickHandler) props.onFigureClickHandler(e, figure, index);
        }}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        tabIndex={index}
        onKeyDown={(e) => {
          if (props.onKeyDown) props.onKeyDown(e, index);
        }}
      />
    </svg>
  );
};

export default Triangle;
