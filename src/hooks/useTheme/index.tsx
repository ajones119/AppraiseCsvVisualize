import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import themes from "./themes";

export type Theme<T extends Record<string, string>> = {
  name: string;
  colors: T;
};

function setRootColors<T extends Record<string, string>>(colorsObject: T) {
  const root = document.documentElement;
  for (const key in colorsObject) {
    if (colorsObject.hasOwnProperty(key)) {
      const value = colorsObject[key];
      root.style.setProperty(`${key}`, value);
    }
  }
}

const useTheme = () => {
  const [themeName, setTheme] = useLocalStorage<string>(
    "AppraiseCSVisualizeTheme",
    "",
  );

  useEffect(() => {
    const foundTheme = themes.find((t) => t.name === themeName) || themes[0];
    const { colors } = foundTheme;
    setRootColors(colors);
  }, [themeName]);

  return {
    themeName,
    setTheme,
    theme: themes.find((t) => t.name === themeName) || themes[0],
  };
};

export default useTheme;
