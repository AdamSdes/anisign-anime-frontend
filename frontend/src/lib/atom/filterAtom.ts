import { atom } from "jotai";

export const filterStateAtom = atom<{ selectingYears: string[] }>({
    selectingYears: ["1965", new Date().getFullYear().toString()],
});

export const searchQueryAtom = atom<string>("");