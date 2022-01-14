interface IColor {
  main: string;
  darken: string;
}

export type ColorKey = 'red' | 'blue' | 'white' | 'black' | 'background';

type Theme = {
  [colorName in ColorKey]: IColor;
} & {
  cellHeight: string;
  cellWidth: string;
};

const defaultTheme: Theme = {
  red: {
    main: '#E94E6C',
    darken: '#A12840',
  },
  blue: {
    main: '#6592FC',
    darken: '#333090',
  },
  white: {
    main: '#ffffff',
    darken: '#f1cd88',
  },
  black: {
    main: '#250404',
    darken: '#000000',
  },
  background: {
    main: '#eee',
    darken: '#a9a9a9',
  },
  cellWidth: '3rem',
  cellHeight: '4rem',
};

export default defaultTheme;
