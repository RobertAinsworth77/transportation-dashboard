import { FieldValues, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

interface AutoCompleteComponentProps {
    onSearch: (word:string) => Promise<void>;
    errors: any;
    label: string;
    required?: boolean;
    keyName: string;
    register: UseFormRegister<FieldValues>;
    onChange: UseFormSetValue<FieldValues>;
    watch: UseFormWatch<FieldValues>,
    disabled?: boolean;
    options: {
        label: string;
        id: any;
    }[];
}

export default AutoCompleteComponentProps;
