export const sleeper = (time: number): Promise<void> => new Promise<void>((resolve, reject) => {
    setTimeout(()=>resolve(), time);
});

const testOptions = {
    sleeper,
}
export default  testOptions;