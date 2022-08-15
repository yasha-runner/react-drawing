import React from 'react';
import { connect } from 'react-redux';
import style from './Sidebar.module.css';
import Section from './Sections/Section';
import Shapes from './Sections/Shapes/Shapes';
import { ShapeType } from '../../types';
import { GetStateType } from '../../index';
import { addNewFigure, resetActiveFigure } from '../../redux/actions/actionCreators';
import MiniCanvas from './MiniCanvas';

type Props = {
  activeFigure: null | ShapeType;
  fillColor: string;

  addNewFigure: (name: string) => void;
  resetActiveFigure: () => void;
};

const Sidebar: React.FC<Props> = (props: any) => {
  // добавление фигуры в рабочую область приложения
  const createFigureHandler = (e: React.MouseEvent, name: string) => {
    props.addNewFigure(name);
  };

  // сбросить выделение активной фигуры
  const resetActiveFigure = () => {
    props.resetActiveFigure();
  };

  return (
    <div className={style.sidebar} onClick={resetActiveFigure}>
      <Section title="Shapes">
        <Shapes createFigureHandler={createFigureHandler} />
      </Section>
      <MiniCanvas />
    </div>
  );
};

//Подключаем данные
const mapStateToProps = (state: GetStateType) => {
  return {
    activeFigure: state.figuresState.history[state.figuresState.index].activeFigure,
    fillColor: state.fillColorState.fillColor,
  };
};

//Подключаем методы для создания событий
const mapDispatchToProps = (dispatch: any) => {
  return {
    addNewFigure: (name: string) => dispatch(addNewFigure(name)),
    resetActiveFigure: () => dispatch(resetActiveFigure()),
  };
};
// подключения к redux
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
