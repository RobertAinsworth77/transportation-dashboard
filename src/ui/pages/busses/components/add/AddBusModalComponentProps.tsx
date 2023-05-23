import BusEntity from "../../../../../domain/entities/BusEntity";

interface AddBusModalComponentProps {
    bus?: BusEntity | undefined;
    done: ()=>void;
}

export default AddBusModalComponentProps;
