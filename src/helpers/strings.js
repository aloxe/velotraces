// Ascii language manipulation 
const sansAccent = (str) => {
    if (!str) return null;
    str = str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    str = str.replace("œ", "oe");
    str = str.replace("æ", "ae");
    str = str.replace("Œ", "OE");
    str = str.replace("Æ", "AE");
    str = str.replace("ß", "ss");
    str = str.replace("ẞ", "SS");
    return str;
}

export const toSlug = (str) => {
  return sansAccent(str.trim()).toLowerCase()
    .replace(/[ ._']/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-[-]+/g, "-");
}


