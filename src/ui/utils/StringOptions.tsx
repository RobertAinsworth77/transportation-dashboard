export const GetFirstLetterOfEachWord = (str: string) => str.split(' ').map((word) => word[0]).join('');

const StringOptions = {
    GetFirstLetterOfEachWord,
};

export default StringOptions;