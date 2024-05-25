import { Theme } from ".";

type AppTheme = {
    "--background-color": string;
    "--text-primary-color": string,
    "--table-background-color": string,
    "--table-background-secondary-color": string,
    "--table-background-title-color": string,
    "--button-color": string,
    "--border-color": string
}

const themes: Theme<AppTheme>[] = [
    {
        name: "Light",
        colors: {
            "--background-color": "white",
            "--text-primary-color": "black",
            "--border-color": "#00000080",
            "--table-background-color": "#00000010",
            "--table-background-secondary-color": "#00000030",
            "--table-background-title-color": "#00000060",
            "--button-color": "#00000030",
        }
    },
    {
        name: "Dark",
        colors: {
            "--background-color": "#212121",
            "--text-primary-color": "white",
            "--table-background-color": "#ffffff80",
            "--table-background-secondary-color": "#ffffff40",
            "--table-background-title-color": "#ffffff20",
            "--button-color": "blue",
            "--border-color": "#ffffff40",
        }
    },
];

export default themes;