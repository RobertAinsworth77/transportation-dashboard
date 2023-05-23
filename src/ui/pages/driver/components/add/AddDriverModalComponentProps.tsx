import DriverEntity from "../../../../../domain/entities/DriverEntity";

interface DriversModalComponentProps {
    driver?: DriverEntity | undefined;
    done: ()=>void;
}

export default DriversModalComponentProps;
