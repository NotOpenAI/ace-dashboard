const convertToSentenceCase = (inputString: string) => {
    const words = inputString.split('_').map((word) => word.toLowerCase());

    const capitalizedWords = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );

    return capitalizedWords.join(' ');
};

export default convertToSentenceCase;
