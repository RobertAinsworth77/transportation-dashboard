import UserEntity from "../../../../../domain/entities/UserEntity";

interface UsersModalComponentProps {
    userEditing?: UserEntity | undefined;
    done: ()=>void;
}

export default UsersModalComponentProps;
