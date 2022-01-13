interface Color {
  main: string;
  darken: string;
}

export const Colors = {
  red: 'red',
  blue: 'blue',
  white: 'white',
  black: 'black',
  background: 'background',
};
export type ColorKeys = typeof Colors[keyof typeof Colors];
type Theme = {
  [colorName in ColorKeys]: Color;
};

const defaultTheme: Theme = {
  [Colors.red]: {
    main: '#E94E6C',
    darken: '#A12840',
  },
  [Colors.blue]: {
    main: '#6592FC',
    darken: '#333090',
  },
  [Colors.white]: {
    main: '#fff',
    darken: '#f1cd88',
  },
  [Colors.black]: {
    main: '#250404',
    darken: '#000000',
  },
  [Colors.background]: {
    main: '#eee',
    darken: 'darkgray',
  },
};

export default defaultTheme;
