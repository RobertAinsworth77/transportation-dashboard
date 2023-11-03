export default interface UserAccountEntity {
    id: number,
    name: string,
    lastname?: string | undefined,
    phone: string,
    email: string,
    enabled: boolean,
}