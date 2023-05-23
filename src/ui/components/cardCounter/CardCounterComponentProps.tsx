
interface CardCounterComponentProps {
    title: string;
    counter: number;
    add?: () => void | undefined;
    seeAllUrl?: string | undefined;
}

export default CardCounterComponentProps;