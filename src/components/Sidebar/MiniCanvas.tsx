import React from 'react';
import { connect } from 'react-redux';
import { GetStateType } from '../..';
import Rectangle from '../Shapes/Rectangle';
import Triangle from '../Shapes/Triangle';
import Ellipse from '../Shapes/Ellipse';
import style from './../Canvas/Canvas.module.css';
import { ShapeType } from '../../types';
import { useContainerDimensions } from './ContainerSizeHook';

type Props = {
  figures: Array<ShapeType>;
};
const MiniCanvas: React.FC<Props> = (props) => {
  let activeId: number = 0;

  const contentRef = React.createRef<HTMLDivElement>();
  const { width } = useContainerDimensions(contentRef);
  // Размер Canvas
  const scaleSize = (window.innerWidth - 300) / width;
  return (
    <div
      className={style.canvas}
      style={{ height: window.innerHeight / scaleSize }}
      ref={contentRef}
    >
      <div className={style.canvas_mid}>
        {props.figures.map((figure, index) => {
          //Уменшаем с сохранениям пропорций
          const newFigure = JSON.parse(JSON.stringify(figure));
          newFigure.size.height = (parseFloat(newFigure.size.height) / scaleSize).toString();
          newFigure.size.width = (parseFloat(newFigure.size.width) / scaleSize).toString();
          newFigure.position.top = (parseFloat(newFigure.position.top) / scaleSize).toString();
          newFigure.position.left = (parseFloat(newFigure.position.left) / scaleSize).toString();
          const classes = [style[figure.type]];
          // добавление border'a к выделенной фигуре
          if (newFigure.zIndexCSS === activeId) {
            classes.push(style.active);
          }
          // Добавления фигур без событий на миникарту
          switch (newFigure.type) {
            case 'triangle':
              return <Triangle key={index} classes={classes} index={index} figure={newFigure} />;
            case 'rectangle':
              return <Rectangle key={index} classes={classes} index={index} figure={newFigure} />;
            case 'ellipse':
              return <Ellipse key={index} classes={classes} index={index} figure={newFigure} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

const mapStateToProps = (state: GetStateType) => {
  return {
    figures: state.figuresState.history[state.figuresState.index].figures,
    activeFigure: state.figuresState.history[state.figuresState.index].activeFigure,
  };
};

export default connect(mapStateToProps)(MiniCanvas);
