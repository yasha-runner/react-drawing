import React, { ReactChild, ReactNode } from 'react';
import style from './Section.module.css';

type Props = {
  children: ReactChild | ReactNode;
  title: string;
};

const Section: React.FC<Props> = (props) => {
  return (
    <section className={style.section}>
      <div className={style.section_content}>{props.children}</div>
    </section>
  );
};

export default Section;
