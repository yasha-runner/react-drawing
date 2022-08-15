import React from 'react';
import { connect } from 'react-redux';
import { GetStateType } from '../..';
import { ShapeType, GetActiveFigureType } from '../../types';
import Rectangle from '../Shapes/Rectangle';
import Triangle from '../Shapes/Triangle';
import Ellipse from '../Shapes/Ellipse';
import style from './Canvas.module.css';
import {
  getactiveFigure,
  resetActiveFigure,
  onSavePosition,
  onDeleteKeyDownListener,
  onUndo,
  onRedo,
} from '../../redux/actions/actionCreators';

// Вычисление центра "рабочей области" - позиционирование фигуры относительно этого центра
const getMidCoordinates = (el: any) => {
  const { top, bottom, left, right } = el.getBoundingClientRect();

  const midY = (bottom - top) / 2;
  const midX = (right - left) / 2 + left;

  return [midY, midX];
};

// Вычисление границ рабочей области
const getLimitCoordinates = (el: any) => {
  const { top, bottom, left, right } = el.getBoundingClientRect();
  return [parseFloat(right), parseFloat(left), parseFloat(bottom), parseFloat(top)];
};

type Props = {
  activeFigure: null | ShapeType;
  figures: Array<ShapeType>;

  resetActiveFigure: () => void;
  getActiveFigure: (obj: GetActiveFigureType) => void;
  onSavePosition: (index: number, top: string, left: string, height: string, width: string) => void;
  onDeleteKeyDownListener: (eCode: string, index: number) => void;
  onUndo: () => void;
  onRedo: () => void;
};

const Canvas: React.FC<Props> = (props) => {
  let activeId: number = 0;
  if (props.activeFigure !== null) {
    activeId = props.activeFigure.zIndexCSS;
  }
  const contentRef = React.createRef<HTMLDivElement>();

  // События по клику на фигуру в рабочей области
  const onFigureClickHandler = (e: React.MouseEvent, figure: ShapeType, index: number) => {
    e.stopPropagation();
    props.getActiveFigure({ figure, index });
  };

  // Удаление выделенной фигуры по нажатию на кнопку клавиатуры (Delete)
  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    console.log(e.keyCode);
    if (e.keyCode === 46) props.onDeleteKeyDownListener(e.code, index);
  };

  // Позиционирование двигаемой фигуры (для последующей записи в localstorage)
  const onChangePositionHandler = (
    index: number,
    top: string,
    left: string,
    height: string,
    width: string,
  ) => {
    props.onSavePosition(index, top, left, height, width);
  };

  // Обработчик события при нажатии
  const onMouseDown: any = (e: React.MouseEvent, figure: ShapeType, index: number) => {
    onFigureClickHandler(e, figure, index);

    // Центр области Content
    const [midY, midX] = getMidCoordinates(contentRef.current);

    // Грани области Content
    const [maxX, minX, maxY, minY] = getLimitCoordinates(contentRef.current);

    // SVG-фигура для перемещения
    const target: any = e.currentTarget.parentNode;

    // Координаты для сдвига по осям (корректировка клика мыши в определенную область фигуры)
    let shiftY = e.clientY - target.getBoundingClientRect().top;
    let shiftX = e.clientX - target.getBoundingClientRect().left;

    // Проверка каждой грани в смену размера
    let checkResizeBottom =
      e.pageY - (parseFloat(target.style.top) + midY) > target.clientHeight - 30;
    let checkResizeLeft = shiftX < 30;
    let checkResizeRight =
      e.pageX - (parseFloat(target.style.left) + midX) > target.clientWidth - 30;
    let checkResizeTop = shiftY < 30;

    // Начальное положения курсора
    let startPositionX = e.pageX;
    let startPositionY = e.pageY;

    // Начальные размеры фигуры
    let startHeight = target.clientHeight;
    let startWidth = target.clientWidth;

    // Позиционирование фигуры при перемещении
    function moveFigureAt(e: any) {
      if (checkResizeBottom || checkResizeTop || checkResizeLeft || checkResizeRight) {
        if (checkResizeBottom) {
          target.style.height = e.pageY - (parseFloat(target.style.top) + midY);
        }
        if (checkResizeTop) {
          target.style.height = startHeight - (e.pageY - startPositionY);
          target.style.top =
            parseFloat(e.pageY) - parseFloat(midY) + parseFloat(target.style.height);
        }
        if (checkResizeLeft) {
          target.style.width = startWidth - (e.pageX - startPositionX);
          target.style.left = e.pageX - midX;
        }
        if (checkResizeRight) {
          target.style.width = startWidth + e.pageX - startPositionX;
        }
      } else {
        const topPoint = minY + shiftY;
        const bottomPoint = maxY - target.clientHeight + shiftY;

        // Если фигура в рабочей области, выполняем перемещение, иначе прижимаем к границе
        if (e.pageY > topPoint && e.pageY < bottomPoint)
          target.style.top = parseFloat(e.pageY) - parseFloat(midY) - shiftY;
        else {
          if (e.pageY > bottomPoint) target.style.top = midY - target.clientHeight;
          if (e.pageY < topPoint) target.style.top = 0 - midY;
        }

        const leftPoint = minX + shiftX;
        const rightPoint = maxX - target.clientWidth + shiftX;

        if (e.pageX > leftPoint && e.pageX < rightPoint)
          target.style.left = e.pageX - midX - shiftX;
        else {
          if (e.pageX < rightPoint) target.style.left = -midX + minX;
          if (e.pageX > leftPoint) target.style.left = maxX - midX - target.clientWidth;
        }
      }

      const child = target.firstChild;

      // Изменения размеров фигур внутри SVG
      if (child.tagName === 'rect') {
        if (target.style.height) child.setAttribute('height', target.style.height);
        if (target.style.width) child.setAttribute('width', target.style.width);
      } else if (child.tagName === 'ellipse') {
        if (target.style.height) {
          child.setAttribute('cy', parseFloat(target.style.height) / 2);
          child.firstChild.setAttribute('ry', parseFloat(target.style.height) / 2);
        }
        if (target.style.width) {
          child.setAttribute('cx', parseFloat(target.style.width) / 2);
          child.setAttribute('rx', parseFloat(target.style.width) / 2);
        }
      } else if (child.tagName === 'polygon') {
        child.setAttribute(
          'points',
          `0,${target.clientHeight} ${parseFloat(target.clientWidth) / 2}, 0 ${parseFloat(
            target.clientWidth,
          )}, ${parseFloat(target.clientHeight)}`,
        );
      }
    }

    // Отпускаем кнопку и сохраняем состояния
    function onMouseUp(e: any) {
      document.removeEventListener('mousemove', moveFigureAt);
      // Сохранить позицию фигуры
      if ((startPositionX === e.pageX && startPositionY === e.pageY) === false) {
        const top = target.style.top;
        const left = target.style.left;
        const height = target.clientHeight;
        const width = target.clientWidth;
        onChangePositionHandler(index, top, left, height, width);
        target.onmouseup = null;
      }
    }

    document.addEventListener('mousemove', moveFigureAt);
    document.onmouseup = onMouseUp;
  };

  function KeyPress(e: any) {
    var evtobj = e;

    // Нажатия Ctrl + Z
    if (evtobj.keyCode === 90 && evtobj.ctrlKey) {
      props.onUndo();
      props.resetActiveFigure();
    }
    // Нажатия Ctrl + Y
    if (evtobj.keyCode === 89 && evtobj.ctrlKey) {
      props.onRedo();
      props.resetActiveFigure();
    }
  }

  document.onkeydown = (e) => KeyPress(e);

  return (
    <div className={style.canvas} ref={contentRef} onClick={(e) => props.resetActiveFigure()}>
      <div className={style.canvas_mid}>
        {props.figures.map((figure, index) => {
          const classes = [style[figure.type]];

          // Добавление border'a к выделенной фигуре
          if (figure.zIndexCSS === activeId) {
            classes.push(style.active);
          }
          switch (figure.type) {
            case 'triangle':
              return (
                <Triangle
                  key={index}
                  classes={classes}
                  index={index}
                  figure={figure}
                  onMouseDown={onMouseDown}
                  onFigureClickHandler={onFigureClickHandler}
                  onKeyDown={onKeyDown}
                />
              );
            case 'rectangle':
              return (
                <Rectangle
                  key={index}
                  classes={classes}
                  index={index}
                  figure={figure}
                  onMouseDown={onMouseDown}
                  onFigureClickHandler={onFigureClickHandler}
                  onKeyDown={onKeyDown}
                />
              );
            case 'ellipse':
              return (
                <Ellipse
                  key={index}
                  classes={classes}
                  index={index}
                  figure={figure}
                  onMouseDown={onMouseDown}
                  onFigureClickHandler={onFigureClickHandler}
                  onKeyDown={onKeyDown}
                />
              );
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

const mapDispatchToProps = (dispatch: any) => {
  return {
    getActiveFigure: (value: GetActiveFigureType) => dispatch(getactiveFigure(value)),
    resetActiveFigure: () => dispatch(resetActiveFigure()),
    onSavePosition: (index: number, top: string, left: string, height: string, width: string) =>
      dispatch(onSavePosition(index, top, left, height, width)),
    onDeleteKeyDownListener: (eCode: string, index: number) =>
      dispatch(onDeleteKeyDownListener(eCode, index)),
    onRedo: () => dispatch(onRedo()),
    onUndo: () => dispatch(onUndo()),
  };
};

// Подгружаем состояния из Redux
export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
