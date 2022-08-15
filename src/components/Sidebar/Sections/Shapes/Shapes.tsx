import React from 'react';
import style from './Shapes.module.css';
import { Title } from '../../../../types';

type Props = {
  createFigureHandler: (e: React.MouseEvent, name: Title) => void;
};

const Shapes: React.FC<Props> = (props) => {
  return (
    <>
      <div
        className={style.createButton + ' ' + style.rectangle}
        title="create rectangle"
        onClick={(e) => {
          props.createFigureHandler(e, 'rectangle');
        }}
      ></div>
      <div
        className={style.createButton + ' ' + style.triangle}
        title="create triangle"
        onClick={(e) => {
          props.createFigureHandler(e, 'triangle');
        }}
      ></div>
      <div
        className={style.createButton + ' ' + style.ellipse}
        title="create ellipse"
        onClick={(e) => {
          props.createFigureHandler(e, 'ellipse');
        }}
      ></div>
    </>
  );
};

export default Shapes;
